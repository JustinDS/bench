"use client";

import { Component, useEffect, useState } from "react";
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
import { Manufacturers } from "@/lib/types/database/manufacturers";
import { Components } from "@/lib/types/database/components";

const seriesSchema = z.object({
  vendor_id: z.coerce.number<number>().min(1),
  component_id: z.coerce.number<number>().min(1),
  name: z.string().min(1),
});

type SeriesFormData = z.infer<typeof seriesSchema>;

export default function SeriesManager() {
  const supabase = createClient();
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [components, setComponents] = useState<Components[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SeriesFormData>({
    resolver: zodResolver(seriesSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, name");
      const { data: components } = await supabase
        .from("components")
        .select("id, name");
      const { data: series } = await supabase
        .from("series")
        .select("id, component_id, vendor_id, name");

      setSeries(series ?? []);
      setComponents(components ?? []);
      setVendors(vendors ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: SeriesFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("series")
      .insert({
        component_id: data.component_id,
        vendor_id: data.vendor_id,
        name: data.name,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting CPU variant");
    }

    setSeries((prev) => [...prev, modelData]);

    alert("Series added successfully!");
  };

  return (
    <>
      <div>
        Series:
        {series.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Vendor</Label>
          <Select onValueChange={(val) => setValue("vendor_id", Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {vendors.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Component</Label>
          <Select
            onValueChange={(val) => setValue("component_id", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Component" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {components.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Series Name</Label>
          <Input
            {...register("name")}
            placeholder="GeForce, Radeon, Ryzen 9, Core i9, etc."
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Series"}
        </Button>
      </form>
    </>
  );
}
