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
import { Products } from "@/lib/types/database/products";
import { CpuVariants } from "@/lib/types/database/cpuVariants";

const cpuVariantSchema = z.object({
  product_id: z.coerce.number<number>().min(1),
  cores: z.coerce.number<number>().min(1),
  threads: z.coerce.number<number>().min(1),
  base_clock_ghz: z.coerce.number<number>().min(1),
  boost_clock_ghz: z.coerce.number<number>().min(1),
  tdp_watts: z.coerce.number<number>().min(1),
  socket_type: z.coerce.string<string>().min(1),
});

type CpuVariantFormData = z.infer<typeof cpuVariantSchema>;

export default function CpuManager() {
  const supabase = createClient();
  const [products, setProducts] = useState<Products[]>([]);
  const [cpuVariants, setCpuVariants] = useState<CpuVariants[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<CpuVariantFormData>({
    resolver: zodResolver(cpuVariantSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: cpuVariants } = await supabase
        .from("cpu_variants")
        .select(
          "id, product_id, cores, threads, base_clock_ghz, base_clock_ghz, boost_clock_ghz, tdp_watts, socket_type,products:products(id, manufacturer_id, model_id, partner_series_id, name, models:models(id, name, series_id, series:series(id, vendor_id, component_id, name)))"
        )
        .eq("products.models.series.component_id", 1)
        .not("products.models.series", "is", null)
        .not("products.models", "is", null)
        .not("products", "is", null);
      const { data: products } = await supabase
        .from("products")
        .select(
          "id, manufacturer_id, model_id, partner_series_id, name, models:models(id, name, series_id, series:series(id, vendor_id, component_id, name))"
        )
        .eq("models.series.component_id", 1)
        .not("models.series", "is", null)
        .not("models", "is", null);

      setCpuVariants((cpuVariants as unknown as CpuVariants[]) ?? []);
      setProducts(products ?? []);
    };
    loadData();
  }, []);

  const onSubmit = async (data: CpuVariantFormData) => {
    const { data: modelData, error: modelError } = await supabase
      .from("cpu_variants")
      .insert({
        product_id: data.product_id,
        cores: data.cores,
        threads: data.threads,
        base_clock_ghz: data.base_clock_ghz,
        boost_clock_ghz: data.boost_clock_ghz,
        tdp_watts: data.tdp_watts,
        socket_type: data.socket_type,
      })
      .select()
      .single();

    if (modelError) {
      console.error(modelError);
      return alert("Error inserting Cpu Variant");
    }

    setCpuVariants((prev) => [...prev, modelData]);
    alert("Gpu Variant added successfully!");
  };

  console.log("cpuVariants", cpuVariants);

  return (
    <>
      <div>
        CPU Variants:
        {cpuVariants.map((x, i) => {
          return (
            <>
              <div
                className="flex flex-col p-4 border border-solid w-fit"
                key={`${i}-cpuManager`}
              >
                <div>{x?.products?.name}</div>
                <div>{x.cores} cores</div>
                <div>{x.threads} threads</div>
                <div>{x.base_clock_ghz}ghz base clock </div>
                <div>{x.boost_clock_ghz}ghz boost clock </div>
                <div>{x.socket_type} socket</div>
              </div>
            </>
          );
        })}
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
            <Label>Cores</Label>
            <Input type="number" {...register("cores")} />
          </div>
          <div>
            <Label>Threads</Label>
            <Input type="string" {...register("threads")} />
          </div>
          <div>
            <Label>Base Clock (ghz)</Label>
            <Input type="number" step="0.1" {...register("base_clock_ghz")} />
          </div>
          <div>
            <Label>Boost Clock (ghz)</Label>
            <Input type="number" step="0.1" {...register("boost_clock_ghz")} />
          </div>
          <div>
            <Label>Power Draw (Watts)</Label>
            <Input type="number" {...register("tdp_watts")} />
          </div>
          <div>
            <Label>Socket</Label>
            <Input type="string" {...register("socket_type")} />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add CPU Variant"}
        </Button>
      </form>
    </>
  );
}
