'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cpuFormSchema, type CPUFormData } from '@/lib/validations/component.schemas'
import { createCPU, updateComponent, updateCPUSpecs, getCategories, getBrands, getSeriesByBrand } from '@/lib/supabase/components'
import type { CPUWithSpecs } from '@/types/database.types'

interface CPUFormModalProps {
  cpu?: CPUWithSpecs | null
  onClose: () => void
}

export function CPUFormModal({ cpu, onClose }: CPUFormModalProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const isEditing = !!cpu

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CPUFormData>({
    resolver: zodResolver(cpuFormSchema),
    defaultValues: cpu
      ? {
          component: {
            category_id: cpu.category_id,
            brand_id: cpu.brand_id,
            partner_id: cpu.partner_id,
            series_id: cpu.series_id,
            model: cpu.model,
            product_name: cpu.product_name,
            is_admin_approved: cpu.is_admin_approved,
          },
          specs: cpu.cpu_specs && cpu.cpu_specs.length > 0 ? cpu.cpu_specs[0] : {},
        }
      : undefined,
  })

  const brandId = watch('component.brand_id')

  useEffect(() => {
    loadLookupData()
  }, [])

  useEffect(() => {
    if (brandId && brandId !== selectedBrand) {
      setSelectedBrand(brandId)
      loadSeries(brandId)
    }
  }, [brandId])

  async function loadLookupData() {
    try {
      const [catData, brandData] = await Promise.all([
        getCategories(),
        getBrands(),
      ])
      setCategories(catData)
      setBrands(brandData)

      if (cpu?.brand_id) {
        const seriesData = await getSeriesByBrand(cpu.brand_id)
        setSeries(seriesData)
      }
    } catch (error) {
      console.error('Error loading lookup data:', error)
    }
  }

  async function loadSeries(brandId: string) {
    try {
      const seriesData = await getSeriesByBrand(brandId)
      setSeries(seriesData)
    } catch (error) {
      console.error('Error loading series:', error)
    }
  }

  async function onSubmit(data: CPUFormData) {
    try {
      setLoading(true)

      if (isEditing && cpu) {
        await updateComponent(cpu.id, data.component)
        await updateCPUSpecs(cpu.id, data.specs)
      } else {
        const cpuCategory = categories.find((c) => c.name === 'CPU')
        if (!cpuCategory) throw new Error('CPU category not found')

        await createCPU(
          { ...data.component, category_id: cpuCategory.id },
          data.specs
        )
      }

      onClose()
    } catch (error) {
      console.error('Error saving CPU:', error)
      alert('Failed to save CPU. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: linear-gradient(135deg, #1a0b2e 0%, #2d1b3d 100%);
          border: 2px solid rgba(147, 51, 234, 0.4);
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(147, 51, 234, 0.3);
          animation: slideUp 0.3s ease;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 2px solid rgba(147, 51, 234, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
          line-height: 1;
        }

        .close-btn:hover {
          color: #ff6b6b;
        }

        .modal-body {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #a855f7;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(147, 51, 234, 0.3);
          padding-bottom: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input,
        .form-select {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(147, 51, 234, 0.3);
          color: #fff;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.8125rem;
          margin-top: 0.25rem;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          accent-color: #a855f7;
          cursor: pointer;
        }

        .modal-footer {
          padding: 2rem;
          border-top: 2px solid rgba(147, 51, 234, 0.3);
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn {
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .btn-submit {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          color: #fff;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{isEditing ? 'Edit CPU' : 'Add New CPU'}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Component Information */}
              <div className="form-section">
                <h3 className="section-title">Component Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <select className="form-select" {...register('component.brand_id')}>
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {errors.component?.brand_id && (
                      <span className="error-message">{errors.component.brand_id.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Series (Optional)</label>
                    <select className="form-select" {...register('component.series_id')} disabled={!brandId}>
                      <option value="">Select Series</option>
                      {series.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 9800X3D"
                      {...register('component.model')}
                    />
                    {errors.component?.model && (
                      <span className="error-message">{errors.component.model.message}</span>
                    )}
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AMD Ryzen 7 9800X3D"
                      {...register('component.product_name')}
                    />
                    {errors.component?.product_name && (
                      <span className="error-message">{errors.component.product_name.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input type="checkbox" className="checkbox" {...register('component.is_admin_approved')} />
                      <label className="form-label" style={{ marginBottom: 0 }}>
                        Admin Approved
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* CPU Specifications */}
              <div className="form-section">
                <h3 className="section-title">CPU Specifications</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Chip Series</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ryzen 7"
                      {...register('specs.chip_series')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chip Model</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ryzen 9000"
                      {...register('specs.chip_model')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Socket Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AM5"
                      {...register('specs.socket_type')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cores</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 8"
                      {...register('specs.cores')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Threads</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 16"
                      {...register('specs.threads')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Clock (GHz)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="e.g. 3.5"
                      {...register('specs.base_clock')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Boost Clock (GHz)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="e.g. 5.2"
                      {...register('specs.boost_clock')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">TDP (Watts)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 120"
                      {...register('specs.tdp')}
                    />
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <input type="checkbox" className="checkbox" {...register('specs.integrated_graphics')} />
                      <label className="form-label" style={{ marginBottom: 0 }}>
                        Integrated Graphics
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update CPU' : 'Create CPU'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
