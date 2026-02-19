"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ramFormSchema,
  type RAMFormData,
} from "@/lib/validations/component.schemas";
import {
  createRAM,
  updateComponent,
  updateRAMSpecs,
  getCategories,
  getBrands,
  getSeriesByBrand,
} from "@/lib/supabase/components";
import type {
  Brand,
  ComponentCategory,
  ProductSeries,
  RAMWithSpecs,
} from "@/types/databaseConvenient.types";

interface RAMFormModalProps {
  ram?: RAMWithSpecs | null;
  onClose: () => void;
}

export function RAMFormModal({ ram, onClose }: RAMFormModalProps) {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const isEditing = !!ram;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RAMFormData>({
    resolver: zodResolver(ramFormSchema),
    defaultValues: ram
      ? ({
          component: {
            category_id: ram.category_id,
            brand_id: ram.brand_id,
            partner_id: ram.partner_id,
            series_id: ram.series_id,
            model: ram.model,
            product_name: ram.product_name,
            is_admin_approved: ram.is_admin_approved,
          },
          specs: ram.ram_specs ? ram.ram_specs : {},
        } as RAMFormData)
      : undefined,
  });

  const brandId = watch("component.brand_id");

  useEffect(() => {
    loadLookupData();
  }, []);

  useEffect(() => {
    if (brandId && brandId !== selectedBrand) {
      setSelectedBrand(brandId);
      loadSeries(brandId);
    }
  }, [brandId]);

  async function loadLookupData() {
    try {
      const [catData, brandData] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);
      setCategories(catData);
      setBrands(brandData);

      if (ram?.brand_id) {
        const seriesData = await getSeriesByBrand(ram.brand_id);
        setSeries(seriesData);
      }
    } catch (error) {
      console.error("Error loading lookup data:", error);
    }
  }

  async function loadSeries(brandId: string) {
    try {
      const seriesData = await getSeriesByBrand(brandId);
      setSeries(seriesData);
    } catch (error) {
      console.error("Error loading series:", error);
    }
  }

  async function onSubmit(data: RAMFormData) {
    try {
      setLoading(true);

      if (isEditing && ram) {
        await updateComponent(ram.id, data.component);
        await updateRAMSpecs(ram.id, data.specs);
      } else {
        const ramCategory = categories.find((c) => c.name === "RAM");
        if (!ramCategory) throw new Error("RAM category not found");

        await createRAM(
          { ...data.component, category_id: ramCategory.id },
          data.specs,
        );
      }

      onClose();
    } catch (error) {
      console.error("Error saving RAM:", error);
      alert("Failed to save RAM. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-8 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-blue-500/40 bg-gradient-to-br from-[#0c1445] to-[#1e1034] font-mono shadow-[0_25px_50px_rgba(59,130,246,0.3)] animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-500/30 p-8">
          <h2 className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-3xl font-black uppercase tracking-wide text-transparent">
            {isEditing ? "Edit RAM" : "Add New RAM"}
          </h2>
          <button
            onClick={onClose}
            className="text-4xl leading-none text-white/60 transition-colors hover:text-red-400"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="p-8">
            {/* Component Information */}
            <div className="mb-10">
              <h3 className="mb-6 border-b border-blue-500/30 pb-2 text-xl font-bold uppercase tracking-widest text-blue-500">
                Component Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Brand *
                  </label>
                  <select
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    {...register("component.brand_id")}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.component?.brand_id && (
                    <span className="mt-1 text-[13px] text-red-400">
                      {errors.component.brand_id.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Series (Optional)
                  </label>
                  <select
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all disabled:opacity-50 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    {...register("component.series_id")}
                    disabled={!brandId}
                  >
                    <option value="">Select Series</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Model *
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. 32GB 6000"
                    {...register("component.model")}
                  />
                  {errors.component?.model && (
                    <span className="mt-1 text-[13px] text-red-400">
                      {errors.component.model.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. Corsair Vengeance RGB 32GB 6000"
                    {...register("component.product_name")}
                  />
                  {errors.component?.product_name && (
                    <span className="mt-1 text-[13px] text-red-400">
                      {errors.component.product_name.message}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer accent-blue-500"
                    {...register("component.is_admin_approved")}
                  />
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Admin Approved
                  </label>
                </div>
              </div>
            </div>

            {/* RAM Specifications */}
            <div className="mb-10">
              <h3 className="mb-6 border-b border-blue-500/30 pb-2 text-xl font-bold uppercase tracking-widest text-blue-500">
                RAM Specifications
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Memory Type
                  </label>
                  <select
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    {...register("specs.memory_type")}
                  >
                    <option value="">Select Type</option>
                    <option value="DDR4">DDR4</option>
                    <option value="DDR5">DDR5</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Capacity (GB)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. 32"
                    {...register("specs.capacity")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Speed (MT/s)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. 6000"
                    {...register("specs.speed")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Kit Configuration
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. 2x16GB"
                    {...register("specs.kit_configuration")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    CAS Latency
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. CL30"
                    {...register("specs.cas_latency")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Voltage (V)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="rounded-lg border border-blue-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    placeholder="e.g. 1.35"
                    {...register("specs.voltage")}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer accent-blue-500"
                    {...register("specs.rgb")}
                  />
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    RGB Lighting
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t-2 border-blue-500/30 p-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-3.5 text-[15px] font-bold uppercase tracking-wider text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3.5 text-[15px] font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(59,130,246,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update RAM" : "Create RAM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
