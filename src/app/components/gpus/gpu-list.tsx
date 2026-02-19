"use client";

import { useState, useEffect } from "react";
import { getGPUs, getBrands, getPartners } from "@/lib/supabase/components";
import type {
  Brand,
  GPUWithSpecs,
  Partner,
} from "@/types/databaseConvenient.types";
import type { GPUFilter } from "@/lib/validations/component.schemas";
import { GPUFormModal } from "./gpu-form-modal";

export function GPUList() {
  const [gpus, setGpus] = useState<GPUWithSpecs[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GPUFilter>({ is_admin_approved: true });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGPU, setSelectedGPU] = useState<GPUWithSpecs | null>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const [gpuData, brandData, partnerData] = await Promise.all([
        getGPUs(filter),
        getBrands(),
        getPartners(),
      ]);
      setGpus(gpuData as GPUWithSpecs[]);
      setBrands(brandData);
      setPartners(partnerData);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a0b2e] to-[#16001e] px-8 py-16 font-mono">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b-2 border-emerald-400/20 pb-8">
          <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent">
            Graphics Cards
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 text-base font-bold uppercase tracking-wider text-[#0a0e27] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,255,157,0.4)]"
          >
            + Add New GPU
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-6 rounded-xl border border-emerald-400/10 bg-white/[0.02] p-8 backdrop-blur-md md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Search
            </label>
            <input
              type="text"
              className="rounded-md border border-emerald-400/20 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
              placeholder="Search GPUs..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Brand
            </label>
            <select
              className="rounded-md border border-emerald-400/20 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Partner
            </label>
            <select
              className="rounded-md border border-emerald-400/20 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
              value={filter.partner_id || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  partner_id: e.target.value || undefined,
                })
              }
            >
              <option value="">All Partners</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Min VRAM (GB)
            </label>
            <input
              type="number"
              className="rounded-md border border-emerald-400/20 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
              placeholder="e.g. 8"
              value={filter.min_vram || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  min_vram: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-xl text-emerald-400">
            Loading graphics cards...
          </div>
        ) : gpus.length === 0 ? (
          <div className="py-16 text-center text-lg text-white/50">
            No graphics cards found. Add your first one!
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-emerald-400/10 bg-white/[0.02] backdrop-blur-md">
            <table className="w-full border-collapse">
              <thead className="bg-emerald-400/10">
                <tr>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Product Name
                  </th>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Brand
                  </th>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Partner
                  </th>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Model
                  </th>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    VRAM
                  </th>
                  <th className="border-b-2 border-emerald-400/20 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {gpus.map((gpu) => (
                  <tr
                    key={gpu.id}
                    className="transition-all hover:bg-emerald-400/5"
                  >
                    <td className="border-b border-white/5 px-6 py-5 text-[15px] text-white/90">
                      {gpu.product_name}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <span className="inline-block rounded bg-cyan-400/20 px-3 py-1.5 text-[13px] font-semibold text-cyan-400">
                        {gpu.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {gpu.partner ? (
                        <span className="inline-block rounded bg-orange-500/20 px-3 py-1.5 text-[13px] font-semibold text-orange-500">
                          {gpu.partner.name}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5 text-[15px] text-white/90">
                      {gpu.model}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {gpu.gpu_specs ? (
                        <span className="inline-block rounded bg-purple-500/20 px-3 py-1.5 text-[13px] font-semibold text-purple-400">
                          {gpu.gpu_specs.vram_size}GB {gpu.gpu_specs.vram_type}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <button
                        onClick={() => handleEdit(gpu)}
                        className="rounded border border-emerald-400 bg-transparent px-4 py-2 text-[13px] font-semibold uppercase tracking-wider text-emerald-400 transition-all hover:bg-emerald-400 hover:text-[#0a0e27]"
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
        <GPUFormModal gpu={selectedGPU} onClose={handleFormClose} />
      )}
    </div>
  );
}
