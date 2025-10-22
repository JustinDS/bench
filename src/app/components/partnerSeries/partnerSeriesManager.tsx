"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Manufacturers } from "@/lib/types/database/manufacturers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PartnerSeries } from "@/lib/types/database/PartnerSeries";

const partnerSeriesSchema = z.object({
  name: z.string().min(1),
  manufacturer_id: z.coerce.number<number>().min(1),
});

type PartnerSeriesFormData = z.infer<typeof partnerSeriesSchema>;

export default function PartnerSeriesManager() {
  const supabase = createClient();
  const [manufacturers, setManufacturers] = useState<Manufacturers[]>([]);
  const [partnerSeries, setPartnerSeries] = useState<PartnerSeries[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<PartnerSeriesFormData>({
    resolver: zodResolver(partnerSeriesSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: manufacturers } = await supabase
        .from("manufacturers")
        .select("id, name");
      const { data: partnerSeries } = await supabase
        .from("partner_series")
        .select("id, name, manufacturer_id");

      setPartnerSeries(partnerSeries ?? []);
      setManufacturers(manufacturers ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: PartnerSeriesFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("partner_series")
      .insert({
        name: data.name,
        manufacturer_id: data.manufacturer_id,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting Partner Series");
    }

    setPartnerSeries((prev) => [...prev, modelData]);

    alert("Partner Series added successfully!");
  };

  return (
    <>
      <div>
        Partner Series:
        {partnerSeries.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Manufacturer</Label>
          <Select
            onValueChange={(val) => setValue("manufacturer_id", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Manufacturer" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {manufacturers.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Partner Series Name</Label>
          <Input
            {...register("name")}
            placeholder="ROG Strix, TUF Gaming, Gaming X Trio"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Partner Series"}
        </Button>
      </form>
    </>
  );
}
