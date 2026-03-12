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
} from "@/lib/supabase/components";
import type { GPUWithSpecs } from "@/types/databaseConvenient.types";
import z from "zod";
import {
  getChipBrandsForComponentType,
  getBoardManufacturersForComponentType,
  getManufacturerSeriesForComponentType,
  getSeriesByManufacturerAndComponentType,
} from "@/lib/supabase/component-types";
import { ComponentType } from "@/lib/types/component-types";

interface GPUFormModalProps {
  gpu?: GPUWithSpecs | null;
  onClose: () => void;
}

export function GPUFormModal({ gpu, onClose }: GPUFormModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [chipBrands, setChipBrands] = useState<any[]>([]);
  const [boardManufacturers, setBoardManufacturers] = useState<any[]>([]);
  const [manufacturerSeries, setManufacturerSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChipBrand, setSelectedChipBrand] = useState<string>("");
  const [selectedBoardManufacturer, setSelectedBoardManufacturer] =
    useState<string>("");
  const [selectedManufacturerSeries, setSelectedManufacturerSeries] =
    useState<string>("");

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
            chip_brand_id: gpu.chip_brand_id,
            board_manufacturer_id: gpu.board_manufacturer_id ?? null,
            manufacturer_series_id: gpu.manufacturer_series_id ?? null,
            model: gpu.model,
            product_name: gpu.product_name,
            is_admin_approved: gpu.is_admin_approved ?? false,
          },
          specs: gpu.gpu_specs ? gpu.gpu_specs : {},
        } as z.infer<typeof gpuFormSchema>)
      : {
          component: {
            is_admin_approved: false,
          },
        },
  });

  const chipBrandId = watch("component.chip_brand_id");
  const manufacturerId = watch("component.board_manufacturer_id");
  const manufacturerSeriesId = watch("component.manufacturer_series_id");

  useEffect(() => {
    loadLookupData();
  }, []);

  useEffect(() => {
    if (
      manufacturerSeriesId &&
      manufacturerSeriesId !== selectedManufacturerSeries
    ) {
      setSelectedManufacturerSeries(manufacturerSeriesId);
    }
  }, [manufacturerSeriesId]);

  useEffect(() => {
    if (manufacturerId && manufacturerId !== selectedBoardManufacturer) {
      setSelectedBoardManufacturer(manufacturerId);
      loadManufacturerSeries(manufacturerId);
    }
  }, [manufacturerId]);

  useEffect(() => {
    if (chipBrandId && chipBrandId !== selectedChipBrand) {
      setSelectedChipBrand(chipBrandId);
    }
  }, [chipBrandId]);

  async function loadLookupData() {
    try {
      // Get categories (unfiltered)
      const catData = await getCategories();
      setCategories(catData);

      // Get ONLY brands and partners valid for GPUs from database
      const [brandChipData, boardManufacturerData] = await Promise.all([
        getChipBrandsForComponentType(ComponentType.GPU),
        getBoardManufacturersForComponentType(ComponentType.GPU),
      ]);

      setChipBrands(brandChipData);
      setBoardManufacturers(boardManufacturerData);

      if (gpu?.board_manufacturer_id) {
        const manufacturerSeriesData =
          await getSeriesByManufacturerAndComponentType(
            gpu.board_manufacturer_id,
            ComponentType.GPU,
          );

        setManufacturerSeries(manufacturerSeriesData);
      }
    } catch (error) {
      console.error("Error loading lookup data:", error);
    }
  }

  async function loadManufacturerSeries(boardManufacturerId: string) {
    try {
      const seriesData = await getSeriesByManufacturerAndComponentType(
        boardManufacturerId,
        ComponentType.GPU,
      );
      setManufacturerSeries(seriesData);
    } catch (error) {
      console.error("Error loading series:", error);
    }
  }

  async function onSubmit(data: GPUFormData) {
    try {
      setLoading(true);

      if (isEditing && gpu) {
        await updateComponent(gpu.id, data.component);
        await updateGPUSpecs(gpu.id, data.specs);
      } else {
        const gpuCategory = categories.find((c) => c.name === "GPU");
        if (!gpuCategory) throw new Error("GPU category not found");

        await createGPU(
          { ...data.component, category_id: gpuCategory.id },
          { ...data.specs, component_id: data.specs.component_id! },
        );
      }

      onClose();
    } catch (error) {
      console.error("Error saving GPU:", error);
      alert("Failed to save GPU. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Graphics Card" : "Add Graphics Card"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Body - Scrollable */}
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-4">
              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Please fix the following errors:
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc space-y-1 pl-5">
                          {errors.component?.chip_brand_id && (
                            <li>{errors.component.chip_brand_id.message}</li>
                          )}
                          {errors.component?.model && (
                            <li>{errors.component.model.message}</li>
                          )}
                          {errors.component?.product_name && (
                            <li>{errors.component.product_name.message}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Component Information */}
              <div className="mb-6">
                <h4 className="mb-4 text-sm font-semibold text-gray-900">
                  Component Information
                </h4>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="brand"
                        {...register("component.chip_brand_id")}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedChipBrand}
                      >
                        <option value="">Select Brand</option>
                        {chipBrands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="partner"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Manufacturer
                      </label>
                      <select
                        id="partner"
                        {...register("component.board_manufacturer_id")}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedBoardManufacturer}
                      >
                        <option value="">Select Manufacturer</option>
                        {boardManufacturers.map((boardManufacturer) => (
                          <option
                            key={boardManufacturer.id}
                            value={boardManufacturer.id}
                          >
                            {boardManufacturer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="series"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Series
                      </label>
                      <select
                        id="series"
                        {...register("component.manufacturer_series_id")}
                        disabled={!manufacturerId}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={selectedManufacturerSeries}
                      >
                        <option value="">Select Manufacturer Series</option>
                        {manufacturerSeries.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="model"
                        {...register("component.model")}
                        placeholder="e.g. RTX 5080"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="product_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="product_name"
                      {...register("component.product_name")}
                      placeholder="e.g. ASUS ROG STRIX RTX 5080"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_admin_approved"
                      {...register("component.is_admin_approved")}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="is_admin_approved"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Admin Approved
                    </label>
                  </div>
                </div>
              </div>

              {/* GPU Specifications */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-900">
                  Specifications
                </h4>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="chip_series"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Chip Series
                      </label>
                      <input
                        type="text"
                        id="chip_series"
                        {...register("specs.chip_series")}
                        placeholder="e.g. RTX 5000"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="chip_model"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Chip Model
                      </label>
                      <input
                        type="text"
                        id="chip_model"
                        {...register("specs.chip_model")}
                        placeholder="e.g. RTX 5080"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="vram_size"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        VRAM Size (GB)
                      </label>
                      <input
                        type="number"
                        id="vram_size"
                        {...register("specs.vram_size")}
                        placeholder="e.g. 16"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="vram_type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        VRAM Type
                      </label>
                      <select
                        id="vram_type"
                        {...register("specs.vram_type")}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="GDDR6">GDDR6</option>
                        <option value="GDDR6X">GDDR6X</option>
                        <option value="GDDR7">GDDR7</option>
                        <option value="HBM2">HBM2</option>
                        <option value="HBM3">HBM3</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="base_clock"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Base Clock (MHz)
                      </label>
                      <input
                        type="number"
                        id="base_clock"
                        {...register("specs.base_clock")}
                        placeholder="e.g. 2200"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="boost_clock"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Boost Clock (MHz)
                      </label>
                      <input
                        type="number"
                        id="boost_clock"
                        {...register("specs.boost_clock")}
                        placeholder="e.g. 2600"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tdp"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        TDP (Watts)
                      </label>
                      <input
                        type="number"
                        id="tdp"
                        {...register("specs.tdp")}
                        placeholder="e.g. 320"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pcie_version"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      PCIe Version
                    </label>
                    <input
                      type="text"
                      id="pcie_version"
                      {...register("specs.pcie_version")}
                      placeholder="e.g. 4.0 or 5.0"
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update GPU"
                    : "Create GPU"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
