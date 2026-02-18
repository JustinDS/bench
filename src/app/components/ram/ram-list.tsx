"use client";

import { useState, useEffect } from "react";
import { getRAM, getBrands } from "@/lib/supabase/components";
import type { RAMWithSpecs } from "@/types/databaseConvenient.types";
import type { RAMFilter } from "@/lib/validations/component.schemas";
import { RAMFormModal } from "./ram-form-modal";

export function RAMList() {
  const [ram, setRam] = useState<RAMWithSpecs[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
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
    <div className="ram-list">
      <style jsx>{`
        .ram-list {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0c1445 0%,
            #1a0c2e 50%,
            #1e1034 100%
          );
          padding: 4rem 2rem;
          font-family: "IBM Plex Mono", monospace;
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
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
        }

        .title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .add-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          color: #fff;
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
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(59, 130, 246, 0.2);
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
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .filter-input,
        .filter-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .table-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table thead {
          background: rgba(59, 130, 246, 0.15);
        }

        .table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 700;
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
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
          background: rgba(59, 130, 246, 0.08);
        }

        .brand-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(6, 182, 212, 0.2);
          color: #06b6d4;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .type-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .capacity-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .speed-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .rgb-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: linear-gradient(
            135deg,
            #ec4899 0%,
            #8b5cf6 50%,
            #3b82f6 100%
          );
          color: #fff;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .edit-btn {
          background: transparent;
          border: 1px solid #3b82f6;
          color: #3b82f6;
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
          background: #3b82f6;
          color: #fff;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: #3b82f6;
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
          <h1 className="title">Memory</h1>
          <button className="add-btn" onClick={handleCreate}>
            + Add New RAM
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search RAM..."
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
            <label className="filter-label">Memory Type</label>
            <select
              className="filter-select"
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

          <div className="filter-group">
            <label className="filter-label">Min Capacity (GB)</label>
            <input
              type="number"
              className="filter-input"
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

        {loading ? (
          <div className="loading">Loading memory modules...</div>
        ) : ram.length === 0 ? (
          <div className="empty">
            No memory modules found. Add your first one!
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Speed</th>
                  <th>RGB</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ram.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>
                      <span className="brand-badge">
                        {item.brand?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      {item.ram_specs && item.ram_specs.memory_type ? (
                        <span className="type-badge">
                          {item.ram_specs.memory_type}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {item.ram_specs && item.ram_specs.capacity ? (
                        <span className="capacity-badge">
                          {item.ram_specs.capacity}GB
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {item.ram_specs && item.ram_specs.speed ? (
                        <span className="speed-badge">
                          {item.ram_specs.speed} MT/s
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      {item.ram_specs && item.ram_specs.rgb ? (
                        <span className="rgb-badge">RGB</span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(item)}
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
