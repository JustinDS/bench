"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  gpuFormSchema,
  type GPUFormData,
} from "@/lib/validations/component.schemas";
import {
  createGPU,
  updateComponent,
  updateGPUSpecs,
  getCategories,
  getBrands,
  getPartners,
  getSeriesByBrand,
} from "@/lib/supabase/components";
import type {
  Brand,
  ComponentCategory,
  GPUWithSpecs,
  Partner,
  ProductSeries,
} from "@/types/databaseConvenient.types";

interface GPUFormModalProps {
  gpu?: GPUWithSpecs | null;
  onClose: () => void;
}

export function GPUFormModal({ gpu, onClose }: GPUFormModalProps) {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const isEditing = !!gpu;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GPUFormData>({
    resolver: zodResolver(gpuFormSchema),
    defaultValues: gpu
      ? ({
          component: {
            category_id: gpu.category_id,
            brand_id: gpu.brand_id,
            partner_id: gpu.partner_id,
            series_id: gpu.series_id,
            model: gpu.model,
            product_name: gpu.product_name,
            is_admin_approved: gpu.is_admin_approved,
          },
          specs: gpu.gpu_specs ? gpu.gpu_specs : {},
        } as GPUFormData)
      : undefined,
  });

  const brandId = watch("component.brand_id");

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ Validation errors:", errors);
    }
  }, [errors]);

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
      const [catData, brandData, partnerData] = await Promise.all([
        getCategories(),
        getBrands(),
        getPartners(),
      ]);
      setCategories(catData);
      setBrands(brandData);
      setPartners(partnerData);

      if (gpu?.brand_id) {
        const seriesData = await getSeriesByBrand(gpu.brand_id);
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

  async function onSubmit(data: GPUFormData) {
    console.log("📤 Submitting:", data);
    try {
      setLoading(true);
      debugger;

      if (isEditing && gpu) {
        await updateComponent(gpu.id, data.component);
        await updateGPUSpecs(gpu.id, data.specs);
      } else {
        const gpuCategory = categories.find((c) => c.name === "GPU");
        if (!gpuCategory) throw new Error("GPU category not found");

        await createGPU(
          { ...data.component, category_id: gpuCategory.id },
          data.specs,
        );
      }
      console.log("✅ Success!");

      onClose();
    } catch (error) {
      console.error("Error saving GPU:", error);
      alert("Failed to save GPU. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  console.log("Brand ID:", watch("component.brand_id"));
  console.log("Model:", watch("component.model"));
  console.log("Categories loaded:", categories.length);
  console.log("category_id", watch("component.category_id"));
  console.log("partner_id", watch("component.partner_id"));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-8 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-emerald-400/30 bg-gradient-to-br from-[#1a0b2e] to-[#16001e] font-mono shadow-[0_25px_50px_rgba(0,255,157,0.2)] animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-emerald-400/20 p-8">
          <h2 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-black uppercase tracking-wide text-transparent">
            {isEditing ? "Edit GPU" : "Add New GPU"}
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
              <h3 className="mb-6 border-b border-emerald-400/20 pb-2 text-xl font-bold uppercase tracking-widest text-emerald-400">
                Component Information
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Brand *
                  </label>
                  <select
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
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
                    Partner (Optional)
                  </label>
                  <select
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    {...register("component.partner_id")}
                  >
                    <option value="">Select Partner</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Series (Optional)
                  </label>
                  <select
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all disabled:opacity-50 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
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
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. RTX 5080"
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
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. ASUS ROG STRIX RTX 5080"
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
                    className="h-5 w-5 cursor-pointer accent-emerald-400"
                    {...register("component.is_admin_approved")}
                  />
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Admin Approved
                  </label>
                </div>
              </div>
            </div>

            {/* GPU Specifications */}
            <div className="mb-10">
              <h3 className="mb-6 border-b border-emerald-400/20 pb-2 text-xl font-bold uppercase tracking-widest text-emerald-400">
                GPU Specifications
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Chip Series
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. RTX 5000"
                    {...register("specs.chip_series")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Chip Model
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. RTX 5080"
                    {...register("specs.chip_model")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    VRAM Size (GB)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. 16"
                    {...register("specs.vram_size")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    VRAM Type
                  </label>
                  <select
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    {...register("specs.vram_type")}
                  >
                    <option value="">Select Type</option>
                    <option value="GDDR6">GDDR6</option>
                    <option value="GDDR6X">GDDR6X</option>
                    <option value="GDDR7">GDDR7</option>
                    <option value="HBM2">HBM2</option>
                    <option value="HBM3">HBM3</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Base Clock (MHz)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. 2200"
                    {...register("specs.base_clock")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    Boost Clock (MHz)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. 2600"
                    {...register("specs.boost_clock")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    TDP (Watts)
                  </label>
                  <input
                    type="number"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. 320"
                    {...register("specs.tdp")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-white/80">
                    PCIe Version
                  </label>
                  <input
                    type="text"
                    className="rounded-lg border border-emerald-400/20 bg-black/40 px-4 py-3.5 text-[15px] text-white placeholder-white/30 transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="e.g. 4.0 or 5.0"
                    {...register("specs.pcie_version")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t-2 border-emerald-400/20 p-8">
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
              className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-3.5 text-[15px] font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,255,157,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update GPU" : "Create GPU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
