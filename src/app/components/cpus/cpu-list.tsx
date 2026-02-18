'use client'

import { useState, useEffect } from 'react'
import { getCPUs, getBrands } from '@/lib/supabase/components'
import type { CPUWithSpecs } from '@/types/database.types'
import type { ComponentFilter } from '@/lib/validations/component.schemas'
import { CPUFormModal } from './cpu-form-modal'

export function CPUList() {
  const [cpus, setCpus] = useState<CPUWithSpecs[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ComponentFilter>({ is_admin_approved: true })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCPU, setSelectedCPU] = useState<CPUWithSpecs | null>(null)

  useEffect(() => {
    loadData()
  }, [filter])

  async function loadData() {
    try {
      setLoading(true)
      const [cpuData, brandData] = await Promise.all([
        getCPUs(filter),
        getBrands(),
      ])
      setCpus(cpuData as CPUWithSpecs[])
      setBrands(brandData)
    } catch (error) {
      console.error('Error loading CPUs:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(cpu: CPUWithSpecs) {
    setSelectedCPU(cpu)
    setIsFormOpen(true)
  }

  function handleCreate() {
    setSelectedCPU(null)
    setIsFormOpen(true)
  }

  function handleFormClose() {
    setIsFormOpen(false)
    setSelectedCPU(null)
    loadData()
  }

  return (
    <div className="cpu-list">
      <style jsx>{`
        .cpu-list {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a0a2e 0%, #0f0519 50%, #2d1b3d 100%);
          padding: 4rem 2rem;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
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
          border-bottom: 2px solid rgba(147, 51, 234, 0.3);
        }

        .title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .add-btn {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
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
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5);
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(147, 51, 234, 0.2);
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
          color: #a855f7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .filter-input,
        .filter-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }

        .table-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(147, 51, 234, 0.2);
          border-radius: 12px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table thead {
          background: rgba(147, 51, 234, 0.15);
        }

        .table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.875rem;
          font-weight: 700;
          color: #a855f7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 2px solid rgba(147, 51, 234, 0.3);
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
          background: rgba(147, 51, 234, 0.08);
        }

        .brand-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(236, 72, 153, 0.2);
          color: #ec4899;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .socket-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .cores-badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .edit-btn {
          background: transparent;
          border: 1px solid #a855f7;
          color: #a855f7;
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
          background: #a855f7;
          color: #fff;
        }

        .loading {
          text-align: center;
          padding: 4rem;
          color: #a855f7;
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
          <h1 className="title">Processors</h1>
          <button className="add-btn" onClick={handleCreate}>
            + Add New CPU
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search CPUs..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Brand</label>
            <select
              className="filter-select"
              value={filter.brand_id || ''}
              onChange={(e) => setFilter({ ...filter, brand_id: e.target.value || undefined })}
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

        {loading ? (
          <div className="loading">Loading processors...</div>
        ) : cpus.length === 0 ? (
          <div className="empty">No processors found. Add your first one!</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Socket</th>
                  <th>Cores/Threads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cpus.map((cpu) => (
                  <tr key={cpu.id}>
                    <td>{cpu.product_name}</td>
                    <td>
                      <span className="brand-badge">{cpu.brand?.name || 'N/A'}</span>
                    </td>
                    <td>{cpu.model}</td>
                    <td>
                      {cpu.cpu_specs && cpu.cpu_specs.length > 0 && cpu.cpu_specs[0].socket_type ? (
                        <span className="socket-badge">{cpu.cpu_specs[0].socket_type}</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                      )}
                    </td>
                    <td>
                      {cpu.cpu_specs && cpu.cpu_specs.length > 0 ? (
                        <span className="cores-badge">
                          {cpu.cpu_specs[0].cores}C/{cpu.cpu_specs[0].threads}T
                        </span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(cpu)}>
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
        <CPUFormModal
          cpu={selectedCPU}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
