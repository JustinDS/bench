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
import { Series } from "@/lib/types/database/series";

const productsSchema = z.object({
  model_id: z.coerce.number<number>().min(1),
  manufacturer_id: z.coerce.number<number>().min(1),
  partner_series_id: z.coerce.number<number>().optional().nullable(),
  name: z.string().min(1),
});

type productsFormData = z.infer<typeof productsSchema>;

interface ProductsManagerProps {
  componentId: number;
}

export default function ProductsManager({ componentId }: ProductsManagerProps) {
  const supabase = createClient();
  const [models, setModels] = useState<Models[]>([]);
  const [manufacturer, setManufacturer] = useState<Manufacturers[]>([]);
  const [partnerSeries, setPartnerSeries] = useState<PartnerSeries[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<number>();

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
        .select(
          "id, manufacturer_id, model_id, partner_series_id, name, models:models(id, name, series_id, series:series(id, vendor_id, component_id, name))"
        )
        .eq("models.series.component_id", componentId)
        .not("models.series", "is", null)
        .not("models", "is", null);
      const { data: series } = await supabase
        .from("series")
        .select("id, vendor_id, component_id, name")
        .eq("component_id", componentId);

      setModels(models ?? []);
      setManufacturer(manufacturer ?? []);
      setPartnerSeries(partnerSeries ?? []);
      setProducts(products ?? []);
      setSeries(series ?? []);
    };
    loadData();
  }, []);

  console.log("products", products);
  const onSubmit = async (data: productsFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("products")
      .insert({
        model_id: data.model_id,
        manufacturer_id: data.manufacturer_id,
        partner_series_id: data.partner_series_id || null,
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

  const filteredmodels = models.filter((s) => s.series_id === selectedSeries);

  const filteredPartnerSeries = partnerSeries.filter(
    (s) => s.manufacturer_id === Number(selectedManufacturer)
  );

  const displayPartnerSeries = partnerSeries.find(
    (x) => x.id === selectedPartnerSeries
  )?.name
    ? ` ${partnerSeries.find((x) => x.id === selectedPartnerSeries)?.name}`
    : "";

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
          <Label>Series</Label>
          <Select onValueChange={(val) => setSelectedSeries(Number(val))}>
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

        {filteredmodels && (
          <div>
            <Label>Model</Label>
            <Select onValueChange={(val) => setValue("model_id", Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredmodels.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedManufacturer && selectedModel && (
          <div>
            <Label>Product Name</Label>
            <Input
              {...register("name")}
              placeholder="ASUS TUF Gaming RTX 4070"
              value={`${
                componentId === 1
                  ? series.find((x) => x.id === selectedSeries)?.name
                  : manufacturer.find((x) => x.id === selectedManufacturer)
                      ?.name
              }${displayPartnerSeries} ${
                models.find((x) => x.id === selectedModel)?.name
              }`}
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </>
  );
}
