"use client";

import { useState, useEffect } from "react";
import {
  getGPUs,
  getChipBrands,
  getBoardManufacturers,
} from "@/lib/supabase/components";
import type { GPUWithSpecs } from "@/types/databaseConvenient.types";
import type { GPUFilter } from "@/lib/validations/component.schemas";
import { GPUFormModal } from "./gpu-form-modal";
import { Plus, Search, Filter } from "lucide-react";
import {
  getBoardManufacturersForComponentType,
  getChipBrandsForComponentType,
} from "@/lib/supabase/component-types";
import { ComponentType } from "@/lib/types/component-types";

export function GPUList() {
  const [gpus, setGpus] = useState<GPUWithSpecs[]>([]);
  const [chipBrands, setChipBrands] = useState<any[]>([]);
  const [boardManufacturers, setBoardManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GPUFilter>({ is_admin_approved: true });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGPU, setSelectedGPU] = useState<GPUWithSpecs | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const [gpuData] = await Promise.all([getGPUs(filter)]);

      const filteredBrands = await getChipBrandsForComponentType(
        ComponentType.GPU,
      );
      const filteredPartners = await getBoardManufacturersForComponentType(
        ComponentType.GPU,
      );

      console.log("gpuData", gpuData);

      setGpus(gpuData as GPUWithSpecs[]);
      setChipBrands(filteredBrands);
      setBoardManufacturers(filteredPartners);
    } catch (error) {
      console.error("Error loading GPUs:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(gpu: GPUWithSpecs) {
    setSelectedGPU(gpu);
    setIsFormOpen(true);
  }

  function handleCreate() {
    setSelectedGPU(null);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setSelectedGPU(null);
    loadData();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Graphics Cards
              </h1>
              <p className="mt-1 text-sm text-gray-500">{gpus.length} GPUs</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add GPU</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search & Filters - Mobile Optimized */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search GPUs..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Filter Toggle - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Filters - Collapsible on Mobile, Always Visible on Desktop */}
          <div
            className={`grid gap-4 sm:grid-cols-3 ${showFilters ? "block" : "hidden sm:grid"}`}
          >
            <select
              value={filter.chip_brand_id || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  chip_brand_id: e.target.value || undefined,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Brands</option>
              {chipBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              value={filter.board_manufacturer_id || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  board_manufacturer_id: e.target.value || undefined,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Manufacturers</option>
              {boardManufacturers.map((boardManufacturer) => (
                <option key={boardManufacturer.id} value={boardManufacturer.id}>
                  {boardManufacturer.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min VRAM (GB)"
              value={filter.min_vram || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  min_vram: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* GPU Cards/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : gpus.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <p className="text-sm text-gray-500">No GPUs found</p>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add your first GPU
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile: Cards, Desktop: Table */}
            <div className="block sm:hidden space-y-3">
              {gpus.map((gpu) => (
                <div
                  key={gpu.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {gpu.product_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{gpu.model}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(gpu)}
                      className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {gpu.chipBrand?.name}
                    </span>
                    {gpu.boardManufacturer && (
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        {gpu.boardManufacturer.name}
                      </span>
                    )}
                    {gpu.gpu_specs && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                        {gpu.gpu_specs.vram_size}GB {gpu.gpu_specs.vram_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      VRAM
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {gpus.map((gpu) => (
                    <tr
                      key={gpu.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {gpu.product_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {gpu.model}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {gpu.chipBrand?.name && (
                          <span className="inline-flex items-center rounded-md bg-blue-200 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                            {gpu.chipBrand?.name}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {(gpu.boardManufacturer?.name && (
                          <span className="inline-flex items-center rounded-md bg-green-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                            {gpu.boardManufacturer?.name}
                          </span>
                        )) ||
                          "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {gpu.gpu_specs ? (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                            {gpu.gpu_specs.vram_size}GB{" "}
                            {gpu.gpu_specs.vram_type}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(gpu)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {isFormOpen && (
        <GPUFormModal gpu={selectedGPU} onClose={handleFormClose} />
      )}
    </div>
  );
}
