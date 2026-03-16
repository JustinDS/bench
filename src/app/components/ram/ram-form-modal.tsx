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
} from "@/lib/supabase/components";
import type { RAMWithSpecs } from "@/types/databaseConvenient.types";
import z from "zod";
import { getChipBrandsForComponentType } from "@/lib/supabase/component-types";
import { ComponentType } from "@/lib/types/component-types";

interface RAMFormModalProps {
  ram?: RAMWithSpecs | null;
  onClose: () => void;
}

export function RAMFormModal({ ram, onClose }: RAMFormModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [chipBrands, setChipBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChipBrand, setSelectedChipBrand] = useState<string>("");

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
            chip_brand_id: ram.chip_brand_id,
            board_manufacturer_id: ram.board_manufacturer_id ?? null,
            manufacturer_series_id: ram.manufacturer_series_id ?? null,
            model: ram.model,
            product_name: ram.product_name,
            is_admin_approved: ram.is_admin_approved ?? false,
          },
          specs: ram.ram_specs ? ram.ram_specs : {},
        } as z.infer<typeof ramFormSchema>)
      : {
          component: {
            is_admin_approved: false,
          },
          specs: {
            rgb: false,
          },
        },
  });

  const chipBrandId = watch("component.chip_brand_id");

  useEffect(() => {
    if (chipBrandId && chipBrandId !== selectedChipBrand) {
      setSelectedChipBrand(chipBrandId);
    }
  }, [chipBrandId]);

  useEffect(() => {
    loadLookupData();
  }, []);

  async function loadLookupData() {
    try {
      const [catData, brandChipData] = await Promise.all([
        getCategories(),
        getChipBrandsForComponentType(ComponentType.RAM),
      ]);

      setCategories(catData);
      setChipBrands(brandChipData);
    } catch (error) {
      console.error("Error loading lookup data:", error);
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
          { ...data.specs, component_id: data.specs.component_id! },
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
              {isEditing ? "Edit Memory (RAM)" : "Add Memory (RAM)"}
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
                        htmlFor="model"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="model"
                        {...register("component.model")}
                        placeholder="e.g. 32GB 6000MHz"
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
                      placeholder="e.g. Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz"
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

              {/* RAM Specifications */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-900">
                  Specifications
                </h4>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="memory_type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Memory Type
                      </label>
                      <select
                        id="memory_type"
                        {...register("specs.memory_type")}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="DDR4">DDR4</option>
                        <option value="DDR5">DDR5</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Capacity (GB)
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        {...register("specs.capacity")}
                        placeholder="e.g. 32"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="speed"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Speed (MHz)
                      </label>
                      <input
                        type="number"
                        id="speed"
                        {...register("specs.speed")}
                        placeholder="e.g. 6000"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="kit_configuration"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Kit Configuration
                      </label>
                      <input
                        type="text"
                        id="kit_configuration"
                        {...register("specs.kit_configuration")}
                        placeholder="e.g. 2x16GB"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cas_latency"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CAS Latency
                      </label>
                      <input
                        type="text"
                        id="cas_latency"
                        {...register("specs.cas_latency")}
                        placeholder="e.g. CL30"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="voltage"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Voltage (V)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="voltage"
                        {...register("specs.voltage")}
                        placeholder="e.g. 1.35"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rgb"
                      {...register("specs.rgb")}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="rgb"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Has RGB Lighting
                    </label>
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
                    ? "Update RAM"
                    : "Create RAM"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
