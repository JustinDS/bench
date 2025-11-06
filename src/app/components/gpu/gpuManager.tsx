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
import { Products } from "@/lib/types/database/products";
import { CpuVariants } from "@/lib/types/database/cpuVariants";
import { GpuVariants } from "@/lib/types/database/gpuVariants";
import { ComponentType } from "@/lib/types/database/components";

const gpuVariantSchema = z.object({
  product_id: z.coerce.number<number>().min(1),
  memory_type: z.coerce.string<string>().min(1),
  vram_gb: z.coerce.number<number>().min(1),
  core_clock_mhz: z.coerce.number<number>().min(1),
  boost_clock_mhz: z.coerce.number<number>().min(1),
  power_draw_watts: z.coerce.number<number>().min(1),
});

type GpuVariantFormData = z.infer<typeof gpuVariantSchema>;

export default function GpuManager() {
  const supabase = createClient();
  const [products, setProducts] = useState<Products[]>([]);
  const [gpuVariants, setGpuVariants] = useState<GpuVariants[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<GpuVariantFormData>({
    resolver: zodResolver(gpuVariantSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: gpuVariants } = await supabase
        .from("gpu_variants")
        .select(
          "id, product_id, memory_type, vram_gb, core_clock_mhz, boost_clock_mhz, power_draw_watts, products:products(id, manufacturer_id, model_id, partner_series_id, name, models:models(id, name, series_id, series:series(id, vendor_id, component_id, name, components:components(id, name, type))))"
        )
        .eq("products.models.series.components.type", ComponentType.GPU)
        .not("products.models.series", "is", null)
        .not("products.models", "is", null)
        .not("products", "is", null);
      const { data: products } = await supabase
        .from("products")
        .select(
          "id, manufacturer_id, model_id, partner_series_id, name, models:models(id, name, series_id, series:series(id, vendor_id, component_id, name, components:components(id, name, type)))"
        )
        .eq("models.series.components.type", ComponentType.GPU)
        .not("models.series.components", "is", null)
        .not("models.series", "is", null)
        .not("models", "is", null);

      setGpuVariants((gpuVariants as unknown as GpuVariants[]) ?? []);
      setProducts(products ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: GpuVariantFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("gpu_variants")
      .insert({
        product_id: data.product_id,
        memory_type: data.memory_type,
        vram_gb: data.vram_gb,
        core_clock_mhz: data.core_clock_mhz,
        boost_clock_mhz: data.boost_clock_mhz,
        power_draw_watts: data.power_draw_watts,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting Gpu Variant");
    }

    setGpuVariants((prev) => [...prev, modelData]);

    alert("Gpu Variant added successfully!");
  };

  return (
    <>
      <div>
        GPU Variants:
        <div className="grid grid-cols-4">
          {gpuVariants.map((x, i) => {
            return (
              <div
                className="p-4 border border-solid w-fit mt-5"
                key={`${i}-gpuManager`}
              >
                <div>{x?.products?.name}</div>
                <div>{x.vram_gb} gb vram</div>
                <div>{x.core_clock_mhz}mhz core clock</div>
                <div>{x.boost_clock_mhz}mhz boost clock</div>
                <div>{x.memory_type}</div>
                <div>{x.power_draw_watts}W</div>
              </div>
            );
          })}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg space-y-4 pt-5"
      >
        <div>
          <Label>Products</Label>
          <Select onValueChange={(val) => setValue("product_id", Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {products.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>VRAM</Label>
            <Input type="number" {...register("vram_gb")} />
          </div>
          <div>
            <Label>Memory Type</Label>
            <Input type="string" {...register("memory_type")} />
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
          {isSubmitting ? "Adding..." : "Add GPU Variant"}
        </Button>
      </form>
    </>
  );
}
