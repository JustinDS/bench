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

const cpuSchema = z.object({
  vendor_id: z.coerce.number<number>().min(1),
  series_id: z.coerce.number<number>().min(1),
  model_name: z.string().min(1),
  cores: z.coerce.number<number>().min(1),
  threads: z.coerce.number<number>().min(1),
  base_clock_ghz: z.coerce.number<number>().min(0),
  boost_clock_ghz: z.coerce.number<number>().optional(),
  tdp_watts: z.coerce.number<number>().optional(),
  socket: z.string().min(1),
});

type CpuFormData = z.infer<typeof cpuSchema>;

export default function CPU() {
  const supabase = createClient();
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CpuFormData>({
    resolver: zodResolver(cpuSchema),
  });

  console.log(errors);

  useEffect(() => {
    const loadData = async () => {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, created_at, name");
      const { data: series } = await supabase
        .from("series")
        .select("id, name, vendor_id");
      setVendors(vendors ?? []);
      setSeries(series ?? []);
    };
    loadData();
  }, []);

  const selectedVendor = watch("vendor_id");

  const filteredSeries = series.filter(
    (s) => s.vendor_id === Number(selectedVendor)
  );

  const onSubmit = async (data: CpuFormData) => {
    debugger;
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .insert({
        component_id: 1,
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

    const { error } = await supabase.from("cpu_variants").insert({
      model_id: modelData.id,
      cores: data.cores,
      threads: data.threads,
      base_clock_ghz: data.base_clock_ghz,
      boost_clock_ghz: data.boost_clock_ghz,
      tdp_watts: data.tdp_watts,
      socket_type: data.socket,
    });

    if (error) {
      console.error(error);
      return alert("Error inserting CPU variant");
    }

    alert("CPU added successfully!");
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
        <Input {...register("model_name")} placeholder="Ryzen 9 7950X" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cores</Label>
          <Input type="number" {...register("cores")} />
        </div>
        <div>
          <Label>Threads</Label>
          <Input type="number" {...register("threads")} />
        </div>
        <div>
          <Label>Base Clock (GHz)</Label>
          <Input type="number" step="0.1" {...register("base_clock_ghz")} />
        </div>
        <div>
          <Label>Boost Clock (GHz)</Label>
          <Input type="number" step="0.1" {...register("boost_clock_ghz")} />
        </div>
        <div>
          <Label>TDP (Watts)</Label>
          <Input type="number" {...register("tdp_watts")} />
        </div>
        <div>
          <Label>Socket</Label>
          <Input {...register("socket")} placeholder="AM5" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add CPU"}
      </Button>
    </form>
  );
}
