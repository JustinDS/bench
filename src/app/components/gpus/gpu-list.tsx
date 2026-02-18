"use client";

import { useState, useEffect } from "react";
import { getGPUs, getBrands, getPartners } from "@/lib/supabase/components";
import type { GPUWithSpecs } from "@/types/databaseConvenient.types";
import type { GPUFilter } from "@/lib/validations/component.schemas";
import { GPUFormModal } from "./gpu-form-modal";

export function GPUList() {
  const [gpus, setGpus] = useState<GPUWithSpecs[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
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
    loadData(); // Refresh list
  }

  return (
    <div className="gpu-list">
      <style jsx>{`
        .gpu-list {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0a0e27 0%,
            #1a0b2e 50%,
            #16001e 100%
          );
          padding: 4rem 2rem;
          font-family: "Space Mono", "Courier New", monospace;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(0, 255, 157, 0.2);
        }

        .title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .add-btn {
          background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
          color: #0a0e27;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 157, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.875rem;
          color: #00ff9d;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .filter-input,
        .filter-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 157, 0.2);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #00ff9d;
          box-shadow: 0 0 0 3px rgba(0, 255, 157, 0.1);
        }

        .table-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 157, 0.1);
          border-radius: 12px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table thead {
          background: rgba(0, 255, 157, 0.1);
        }

        .table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 700;
          color: #00ff9d;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 2px solid rgba(0, 255, 157, 0.2);
        }

        .table td {
          padding: 1.25rem 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.9375rem;
        }

        .table tbody tr {
          transition: all 0.3s ease;
        }

        .table tbody tr:hover {
          background: rgba(0, 255, 157, 0.05);
        }

        .brand-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(0, 184, 255, 0.2);
          color: #00b8ff;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .partner-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(255, 107, 0, 0.2);
          color: #ff6b00;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .vram-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .edit-btn {
          background: transparent;
          border: 1px solid #00ff9d;
          color: #00ff9d;
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .edit-btn:hover {
          background: #00ff9d;
          color: #0a0e27;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: #00ff9d;
          font-size: 1.25rem;
        }

        .empty {
          text-align: center;
          padding: 4rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.125rem;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1 className="title">Graphics Cards</h1>
          <button className="add-btn" onClick={handleCreate}>
            + Add New GPU
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search GPUs..."
              value={filter.search || ""}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Brand</label>
            <select
              className="filter-select"
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

          <div className="filter-group">
            <label className="filter-label">Partner</label>
            <select
              className="filter-select"
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

          <div className="filter-group">
            <label className="filter-label">Min VRAM (GB)</label>
            <input
              type="number"
              className="filter-input"
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

        {loading ? (
          <div className="loading">Loading graphics cards...</div>
        ) : gpus.length === 0 ? (
          <div className="empty">
            No graphics cards found. Add your first one!
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Partner</th>
                  <th>Model</th>
                  <th>VRAM</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gpus.map((gpu) => (
                  <tr key={gpu.id}>
                    <td>{gpu.product_name}</td>
                    <td>
                      <span className="brand-badge">
                        {gpu.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      {gpu.partner ? (
                        <span className="partner-badge">
                          {gpu.partner.name}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>{gpu.model}</td>
                    <td>
                      {gpu.gpu_specs ? (
                        <span className="vram-badge">
                          {gpu.gpu_specs.vram_size}GB {gpu.gpu_specs.vram_type}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(gpu)}
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
