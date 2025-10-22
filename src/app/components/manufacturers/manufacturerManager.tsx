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

const manufacturerSchema = z.object({
  name: z.string().min(1),
});

type ManufacturerFormData = z.infer<typeof manufacturerSchema>;

export default function ManufacturerManager() {
  const supabase = createClient();
  const [manufacturers, setManufacturers] = useState<Manufacturers[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ManufacturerFormData>({
    resolver: zodResolver(manufacturerSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: manufacturers } = await supabase
        .from("manufacturers")
        .select("id, name");

      setManufacturers(manufacturers ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: ManufacturerFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("manufacturers")
      .insert({
        name: data.name,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting CPU variant");
    }

    setManufacturers((prev) => [...prev, modelData]);

    alert("manufacturer added successfully!");
  };

  return (
    <>
      <div>
        Manufacturers:
        {manufacturers.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Manufacturers Name</Label>
          <Input {...register("name")} placeholder="ASUS, MSI, Gigabyte" />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Manufacturer"}
        </Button>
      </form>
    </>
  );
}
