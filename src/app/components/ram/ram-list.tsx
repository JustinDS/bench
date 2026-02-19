"use client";

import { useState, useEffect } from "react";
import { getRAM, getBrands } from "@/lib/supabase/components";
import type { Brand, RAMWithSpecs } from "@/types/databaseConvenient.types";
import type { RAMFilter } from "@/lib/validations/component.schemas";
import { RAMFormModal } from "./ram-form-modal";

export function RAMList() {
  const [ram, setRam] = useState<RAMWithSpecs[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RAMFilter>({ is_admin_approved: true });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRAM, setSelectedRAM] = useState<RAMWithSpecs | null>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const [ramData, brandData] = await Promise.all([
        getRAM(filter),
        getBrands(),
      ]);
      setRam(ramData as RAMWithSpecs[]);
      setBrands(brandData);
    } catch (error) {
      console.error("Error loading RAM:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(ram: RAMWithSpecs) {
    setSelectedRAM(ram);
    setIsFormOpen(true);
  }

  function handleCreate() {
    setSelectedRAM(null);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setSelectedRAM(null);
    loadData();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1445] via-[#1a0c2e] to-[#1e1034] px-8 py-16 font-mono">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b-2 border-blue-500/30 pb-8">
          <h1 className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent">
            Memory
          </h1>
          <button
            onClick={handleCreate}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-base font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(59,130,246,0.5)]"
          >
            + Add New RAM
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-6 rounded-xl border border-blue-500/20 bg-white/[0.02] p-8 backdrop-blur-md md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Search
            </label>
            <input
              type="text"
              className="rounded-md border border-blue-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              placeholder="Search RAM..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Brand
            </label>
            <select
              className="rounded-md border border-blue-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
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
            <label className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Memory Type
            </label>
            <select
              className="rounded-md border border-blue-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              value={filter.memory_type || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  memory_type: e.target.value || undefined,
                })
              }
            >
              <option value="">All Types</option>
              <option value="DDR4">DDR4</option>
              <option value="DDR5">DDR5</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Min Capacity (GB)
            </label>
            <input
              type="number"
              className="rounded-md border border-blue-500/30 bg-black/30 px-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              placeholder="e.g. 16"
              value={filter.min_capacity || ""}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  min_capacity: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-xl text-blue-500">
            Loading memory modules...
          </div>
        ) : ram.length === 0 ? (
          <div className="py-16 text-center text-lg text-white/50">
            No memory modules found. Add your first one!
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-blue-500/20 bg-white/[0.02] backdrop-blur-md">
            <table className="w-full border-collapse">
              <thead className="bg-blue-500/15">
                <tr>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Product Name
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Brand
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Type
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Capacity
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Speed
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    RGB
                  </th>
                  <th className="border-b-2 border-blue-500/30 px-6 py-5 text-left text-sm font-bold uppercase tracking-widest text-blue-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {ram.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-all hover:bg-blue-500/8"
                  >
                    <td className="border-b border-white/5 px-6 py-5 text-[15px] text-white/90">
                      {item.product_name}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <span className="inline-block rounded bg-cyan-500/20 px-3 py-1.5 text-[13px] font-semibold text-cyan-400">
                        {item.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {item.ram_specs && item.ram_specs.memory_type ? (
                        <span className="inline-block rounded bg-purple-500/20 px-3 py-1.5 text-[13px] font-semibold text-purple-400">
                          {item.ram_specs.memory_type}
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {item.ram_specs && item.ram_specs.capacity ? (
                        <span className="inline-block rounded bg-green-500/20 px-3 py-1.5 text-[13px] font-semibold text-green-400">
                          {item.ram_specs.capacity}GB
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {item.ram_specs && item.ram_specs.speed ? (
                        <span className="inline-block rounded bg-orange-500/20 px-3 py-1.5 text-[13px] font-semibold text-orange-400">
                          {item.ram_specs.speed} MT/s
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      {item.ram_specs && item.ram_specs.rgb ? (
                        <span className="inline-block rounded bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-3 py-1.5 text-[13px] font-semibold text-white">
                          RGB
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="border-b border-white/5 px-6 py-5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded border border-blue-500 bg-transparent px-4 py-2 text-[13px] font-semibold uppercase tracking-wider text-blue-500 transition-all hover:bg-blue-500 hover:text-white"
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
        <RAMFormModal ram={selectedRAM} onClose={handleFormClose} />
      )}
    </div>
  );
}
