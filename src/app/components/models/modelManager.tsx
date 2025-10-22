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
import { Series } from "@/lib/types/database/series";
import { Models } from "@/lib/types/database/models";

const modelSchema = z.object({
  series_id: z.coerce.number<number>().min(1),
  name: z.string().min(1),
});

type ModelFormData = z.infer<typeof modelSchema>;

export default function SeriesManager() {
  const supabase = createClient();
  const [models, setModels] = useState<Models[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: models } = await supabase
        .from("models")
        .select("id, name, series_id");
      const { data: series } = await supabase
        .from("series")
        .select("id, component_id, vendor_id, name");

      setSeries(series ?? []);
      setModels(models ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: ModelFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("models")
      .insert({
        series_id: data.series_id,
        name: data.name,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting model");
    }

    setModels((prev) => [...prev, modelData]);

    alert("Model added successfully!");
  };

  return (
    <>
      <div>
        Models:
        {models.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Series</Label>
          <Select onValueChange={(val) => setValue("series_id", Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Series" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {series.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Model Name</Label>
          <Input {...register("name")} placeholder="RTX 4070, RX 7900XT" />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Model"}
        </Button>
      </form>
    </>
  );
}
