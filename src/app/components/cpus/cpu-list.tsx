"use client";

import { useState, useEffect } from "react";
import { getCPUs } from "@/lib/supabase/components";
import type { CPUWithSpecs } from "@/types/databaseConvenient.types";
import type { ComponentFilter } from "@/lib/validations/component.schemas";
import { CPUFormModal } from "./cpu-form-modal";
import { Plus, Search, Filter } from "lucide-react";
import { getChipBrandsForComponentType } from "@/lib/supabase/component-types";
import { ComponentType } from "@/lib/types/component-types";

export function CPUList() {
  const [cpus, setCpus] = useState<CPUWithSpecs[]>([]);
  const [chipBrands, setChipBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ComponentFilter>({
    is_admin_approved: true,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCPU, setSelectedCPU] = useState<CPUWithSpecs | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const [cpuData, filteredBrands] = await Promise.all([
        getCPUs(filter),
        getChipBrandsForComponentType(ComponentType.CPU),
      ]);

      setCpus(cpuData as CPUWithSpecs[]);
      setChipBrands(filteredBrands);
      debugger;
    } catch (error) {
      console.error("Error loading CPUs:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(cpu: CPUWithSpecs) {
    setSelectedCPU(cpu);
    setIsFormOpen(true);
  }

  function handleCreate() {
    setSelectedCPU(null);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setSelectedCPU(null);
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
                Processors
              </h1>
              <p className="mt-1 text-sm text-gray-500">{cpus.length} CPUs</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add CPU</span>
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
              placeholder="Search CPUs..."
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
            className={`grid gap-4 sm:grid-cols-2 ${showFilters ? "block" : "hidden sm:grid"}`}
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
          </div>
        </div>

        {/* CPU Cards/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : cpus.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <p className="text-sm text-gray-500">No CPUs found</p>
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add your first CPU
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile: Cards, Desktop: Table */}
            <div className="block sm:hidden space-y-3">
              {cpus.map((cpu) => (
                <div
                  key={cpu.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {cpu.product_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{cpu.model}</p>
                    </div>
                    <button
                      onClick={() => handleEdit(cpu)}
                      className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {cpu.chipBrand?.name}
                    </span>
                    {cpu.cpu_specs && (
                      <>
                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                          {cpu.cpu_specs.cores}C/{cpu.cpu_specs.threads}T
                        </span>
                        {cpu.cpu_specs.boost_clock && (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            {cpu.cpu_specs.boost_clock} GHz
                          </span>
                        )}
                      </>
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
                      Cores/Threads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      Boost Clock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-white">
                      Socket
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cpus.map((cpu) => (
                    <tr
                      key={cpu.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {cpu.product_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cpu.model}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {cpu.chipBrand?.name && (
                          <span className="inline-flex items-center rounded-md bg-blue-200 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                            {cpu.chipBrand?.name}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {cpu.cpu_specs ? (
                          <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                            {cpu.cpu_specs.cores}C / {cpu.cpu_specs.threads}T
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {cpu.cpu_specs?.boost_clock ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            {cpu.cpu_specs.boost_clock} GHz
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {cpu.cpu_specs?.socket_type || "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(cpu)}
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
        <CPUFormModal cpu={selectedCPU} onClose={handleFormClose} />
      )}
    </div>
  );
}
