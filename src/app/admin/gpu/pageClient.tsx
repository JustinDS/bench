"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Vendors } from "@/lib/types/database/vendors";
import { Series } from "@/lib/types/database/series";

const gpuSchema = z.object({
  vendor_id: z.coerce.number<number>().min(1),
  series_id: z.coerce.number<number>().min(1),
  model_name: z.string(),
  vram_gb: z.coerce.number<number>().min(1),
  memory_type: z.coerce.string<string>(),
  core_clock_mhz: z.coerce.number<number>().min(0),
  boost_clock_mhz: z.coerce.number<number>().optional(),
  power_draw_watts: z.coerce.number<number>().optional(),
});

type GpuFormData = z.infer<typeof gpuSchema>;

export default function GPU() {
  const supabase = createClient();
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<GpuFormData>({
    resolver: zodResolver(gpuSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, created_at, name");
      const { data: series } = await supabase
        .from("series")
        .select("id, name, vendor_id, component_id");
      setVendors(vendors ?? []);
      setSeries(series ?? []);
    };
    loadData();
  }, []);

  const selectedVendor = watch("vendor_id");

  const filteredSeries = series.filter(
    (s) => s.vendor_id === Number(selectedVendor)
  );

  const onSubmit = async (data: GpuFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .insert({
        component_id: 6,
        vendor_id: data.vendor_id,
        series_id: data.series_id,
        name: data.model_name,
      })
      .select()
      .single();

    if (modelError || !modelData) {
      console.error(modelError);
      return alert("Error creating model");
    }

    const { error } = await supabase.from("gpu_variants").insert({
      model_id: modelData.id,
      vram_gb: data.vram_gb,
      memory_type: data.memory_type,
      core_clock_mhz: data.core_clock_mhz,
      boost_clock_mhz: data.boost_clock_mhz,
      power_draw_watts: data.power_draw_watts,
    });

    if (error) {
      console.error(error);
      return alert("Error inserting GPU variant");
    }

    alert("GPU added successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
      <div>
        <Label>Vendor</Label>
        <Select onValueChange={(val) => setValue("vendor_id", Number(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select Vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((v) => (
              <SelectItem key={v.id} value={String(v.id)}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVendor && (
        <div>
          <Label>Series</Label>
          <Select onValueChange={(val) => setValue("series_id", Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Series" />
            </SelectTrigger>
            <SelectContent>
              {filteredSeries.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Model Name</Label>
        <Input {...register("model_name")} placeholder="RTX 3060" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>VRAM</Label>
          <Input type="number" {...register("vram_gb")} />
        </div>
        <div>
          <Label>Memory Type</Label>
          <Input type="number" {...register("memory_type")} />
        </div>
        <div>
          <Label>Core Clock (mhz)</Label>
          <Input type="number" step="0.1" {...register("core_clock_mhz")} />
        </div>
        <div>
          <Label>Boost Clock (mhz)</Label>
          <Input type="number" step="0.1" {...register("boost_clock_mhz")} />
        </div>
        <div>
          <Label>Power Draw (Watts)</Label>
          <Input type="number" {...register("power_draw_watts")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add CPU"}
      </Button>
    </form>
  );
}
