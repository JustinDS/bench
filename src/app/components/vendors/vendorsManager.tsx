"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Vendors } from "@/lib/types/database/vendors";

const vendorSchema = z.object({
  name: z.string().min(1),
});

type VendorFormData = z.infer<typeof vendorSchema>;

export default function VendorsManager() {
  const supabase = createClient();
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: vendors } = await supabase
        .from("vendors")
        .select("id, name");

      setVendors(vendors ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: VendorFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("vendors")
      .insert({
        name: data.name,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting Vendor");
    }

    setVendors((prev) => [...prev, modelData]);

    alert("Vendor added successfully!");
  };

  return (
    <>
      <div>
        Vendors:
        {vendors.map((x, i) => {
          return <div key={i}>{x.name}</div>;
        })}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Vendor Name</Label>
          <Input {...register("name")} placeholder="NVIDIA, AMD, Intel" />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Vendor"}
        </Button>
      </form>
    </>
  );
}
