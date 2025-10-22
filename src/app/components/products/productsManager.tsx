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
import { Manufacturers } from "@/lib/types/database/manufacturers";
import { Models } from "@/lib/types/database/models";
import { PartnerSeries } from "@/lib/types/database/PartnerSeries";
import { Products } from "@/lib/types/database/products";

const productsSchema = z.object({
  model_id: z.coerce.number<number>().min(1),
  manufacturer_id: z.coerce.number<number>().min(1),
  partner_series_id: z.coerce.number<number>().min(1),
  name: z.string().min(1),
});

type productsFormData = z.infer<typeof productsSchema>;

export default function ProductsManager() {
  const supabase = createClient();
  const [models, setModels] = useState<Models[]>([]);
  const [manufacturer, setManufacturer] = useState<Manufacturers[]>([]);
  const [partnerSeries, setPartnerSeries] = useState<PartnerSeries[]>([]);
  const [products, setProducts] = useState<Products[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<productsFormData>({
    resolver: zodResolver(productsSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: models } = await supabase
        .from("models")
        .select("id, name, series_id");
      const { data: manufacturer } = await supabase
        .from("manufacturers")
        .select("id, name");
      const { data: partnerSeries } = await supabase
        .from("partner_series")
        .select("id, manufacturer_id, name");
      const { data: products } = await supabase
        .from("products")
        .select("id, manufacturer_id, model_id, partner_series_id, name");

      setModels(models ?? []);
      setManufacturer(manufacturer ?? []);
      setPartnerSeries(partnerSeries ?? []);
      setProducts(products ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: productsFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("products")
      .insert({
        model_id: data.model_id,
        manufacturer_id: data.manufacturer_id,
        partner_series_id: data.partner_series_id,
        name: data.name,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting Product");
    }

    setProducts((prev) => [...prev, modelData]);

    alert("Product added successfully!");
  };

  const selectedManufacturer = watch("manufacturer_id");
  const selectedPartnerSeries = watch("partner_series_id");
  const selectedModel = watch("model_id");

  const filteredPartnerSeries = partnerSeries.filter(
    (s) => s.manufacturer_id === Number(selectedManufacturer)
  );

  return (
    <>
      <div>
        Products:
        {products.map((x, i) => {
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
              {manufacturer.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedManufacturer && (
          <div>
            <Label>Partner Series</Label>
            <Select
              onValueChange={(val) =>
                setValue("partner_series_id", Number(val))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Partner Series" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredPartnerSeries.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedPartnerSeries && (
          <div>
            <Label>Model</Label>
            <Select onValueChange={(val) => setValue("model_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {models.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedManufacturer && selectedPartnerSeries && selectedModel && (
          <div>
            <Label>Product Name</Label>
            <Input
              {...register("name")}
              placeholder="GeForce, Radeon, Ryzen 9, Core i9, etc."
              value={`${
                manufacturer.find((x) => x.id === selectedManufacturer)?.name
              } ${
                partnerSeries.find((x) => x.id === selectedPartnerSeries)?.name
              } ${models.find((x) => x.id === selectedModel)?.name}`}
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Series"}
        </Button>
      </form>
    </>
  );
}
