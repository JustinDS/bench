"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cpuFormSchema,
  type CPUFormData,
} from "@/lib/validations/component.schemas";
import {
  createCPU,
  updateComponent,
  updateCPUSpecs,
  getCategories,
  getBrands,
  getSeriesByBrand,
} from "@/lib/supabase/components";
import type {
  Brand,
  ComponentCategory,
  CPUWithSpecs,
  ProductSeries,
} from "@/types/databaseConvenient.types";

interface CPUFormModalProps {
  cpu?: CPUWithSpecs | null;
  onClose: () => void;
}

export function CPUFormModal({ cpu, onClose }: CPUFormModalProps) {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const isEditing = !!cpu;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CPUFormData>({
    resolver: zodResolver(cpuFormSchema),
    defaultValues: cpu
      ? {
          component: {
            category_id: cpu.category_id,
            brand_id: cpu.brand_id,
            partner_id: cpu.partner_id,
            series_id: cpu.series_id,
            model: cpu.model,
            product_name: cpu.product_name,
            is_admin_approved: cpu.is_admin_approved,
          },
          specs: cpu.cpu_specs ? cpu.cpu_specs : {},
        }
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
  }, [brandId, selectedBrand]);

  async function loadLookupData() {
    try {
      const [catData, brandData] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);
      setCategories(catData);
      setBrands(brandData);

      if (cpu?.brand_id) {
        const seriesData = await getSeriesByBrand(cpu.brand_id);
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

  async function onSubmit(data: CPUFormData) {
    try {
      setLoading(true);

      if (isEditing && cpu) {
        await updateComponent(cpu.id, data.component);
        await updateCPUSpecs(cpu.id, data.specs);
      } else {
        const cpuCategory = categories.find((c) => c.name === "CPU");
        if (!cpuCategory) throw new Error("CPU category not found");

        await createCPU(
          { ...data.component, category_id: cpuCategory.id },
          data.specs,
        );
      }

      onClose();
    } catch (error) {
      console.error("Error saving CPU:", error);
      alert("Failed to save CPU. Please try again.");
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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-purple-500/40 bg-gradient-to-br from-[#1a0b2e] to-[#2d1b3d] font-mono shadow-[0_25px_50px_rgba(147,51,234,0.3)] animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-purple-500/30 p-8">
          <h2 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-3xl font-black uppercase tracking-wide text-transparent">
            {isEditing ? "Edit CPU" : "Add New CPU"}
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
              <h3 className="mb-6 border-b border-purple-500/30 pb-2 text-xl font-bold uppercase tracking-widest text-purple-500">
                Component Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Brand *
                  </label>
                  <select
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
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
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all disabled:opacity-50 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
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
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 9800X3D"
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
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. AMD Ryzen 7 9800X3D"
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
                    className="h-5 w-5 cursor-pointer accent-purple-500"
                    {...register("component.is_admin_approved")}
                  />
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Admin Approved
                  </label>
                </div>
              </div>
            </div>

            {/* CPU Specifications */}
            <div className="mb-10">
              <h3 className="mb-6 border-b border-purple-500/30 pb-2 text-xl font-bold uppercase tracking-widest text-purple-500">
                CPU Specifications
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Chip Series
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. Ryzen 7"
                    {...register("specs.chip_series")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Chip Model
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. Ryzen 9000"
                    {...register("specs.chip_model")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Socket Type
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. AM5"
                    {...register("specs.socket_type")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Cores
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 8"
                    {...register("specs.cores")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Threads
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 16"
                    {...register("specs.threads")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Base Clock (GHz)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 3.5"
                    {...register("specs.base_clock")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Boost Clock (GHz)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 5.2"
                    {...register("specs.boost_clock")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    TDP (Watts)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                    placeholder="e.g. 120"
                    {...register("specs.tdp")}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 cursor-pointer accent-purple-500"
                    {...register("specs.integrated_graphics")}
                  />
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Integrated Graphics
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t-2 border-purple-500/30 p-8">
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
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3.5 text-[15px] font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(168,85,247,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update CPU" : "Create CPU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
