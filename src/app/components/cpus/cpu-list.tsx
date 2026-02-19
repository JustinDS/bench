"use client";

import { useState, useEffect } from "react";
import { getCPUs, getBrands } from "@/lib/supabase/components";
import type { Brand, CPUWithSpecs } from "@/types/databaseConvenient.types";
import type { ComponentFilter } from "@/lib/validations/component.schemas";
import { CPUFormModal } from "./cpu-form-modal";

export function CPUList() {
  const [cpus, setCpus] = useState<CPUWithSpecs[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ComponentFilter>({
    is_admin_approved: true,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCPU, setSelectedCPU] = useState<CPUWithSpecs | null>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const [cpuData, brandData] = await Promise.all([
        getCPUs(filter),
        getBrands(),
      ]);
      setCpus(cpuData as CPUWithSpecs[]);
      setBrands(brandData);
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] via-[#0f0519] to-[#2d1b3d] px-8 py-16 font-mono">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b-2 border-purple-500/30 pb-8">
          <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent">
            Processors
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-base font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(168,85,247,0.5)]"
          >
            + Add New CPU
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-6 rounded-xl border border-purple-500/20 bg-white/[0.02] p-8 backdrop-blur-md md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-purple-500">
              Search
            </label>
            <input
              type="text"
              className="rounded-md border border-purple-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
              placeholder="Search CPUs..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-purple-500">
              Brand
            </label>
            <select
              className="rounded-md border border-purple-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
              value={filter.brand_id || ""}
              onChange={(e) =>
                setFilter({ ...filter, brand_id: e.target.value || undefined })
              }
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-xl text-purple-500">
            Loading processors...
          </div>
        ) : cpus.length === 0 ? (
          <div className="py-16 text-center text-lg text-white/50">
            No processors found. Add your first one!
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-purple-500/20 bg-white/[0.02] backdrop-blur-md">
            <table className="w-full border-collapse">
              <thead className="bg-purple-500/15">
                <tr>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Product Name
                  </th>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Brand
                  </th>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Model
                  </th>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Socket
                  </th>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Cores/Threads
                  </th>
                  <th className="border-b-2 border-purple-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-purple-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cpus.map((cpu) => (
                  <tr
                    key={cpu.id}
                    className="transition-all hover:bg-purple-500/8"
                  >
                    <td className="border-b border-white/5 px-6 py-5 text-[15px] text-white/90">
                      {cpu.product_name}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <span className="inline-block rounded bg-pink-500/20 px-3 py-1.5 text-[13px] font-semibold text-pink-500">
                        {cpu.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td className="border-b border-white/5 px-6 py-5 text-[15px] text-white/90">
                      {cpu.model}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {cpu.cpu_specs && cpu.cpu_specs.socket_type ? (
                        <span className="inline-block rounded bg-blue-500/20 px-3 py-1.5 text-[13px] font-semibold text-blue-400">
                          {cpu.cpu_specs.socket_type}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {cpu.cpu_specs ? (
                        <span className="inline-block rounded bg-green-500/20 px-3 py-1.5 text-[13px] font-semibold text-green-400">
                          {cpu.cpu_specs.cores}C/{cpu.cpu_specs.threads}T
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <button
                        onClick={() => handleEdit(cpu)}
                        className="rounded border border-purple-500 bg-transparent px-4 py-2 text-[13px] font-semibold uppercase tracking-wider text-purple-500 transition-all hover:bg-purple-500 hover:text-white"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CPUFormModal cpu={selectedCPU} onClose={handleFormClose} />
      )}
    </div>
  );
}
