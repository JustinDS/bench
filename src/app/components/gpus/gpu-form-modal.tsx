'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { gpuFormSchema, type GPUFormData } from '@/lib/validations/component.schemas'
import { createGPU, updateComponent, updateGPUSpecs, getCategories, getBrands, getPartners, getSeriesByBrand } from '@/lib/supabase/components'
import type { GPUWithSpecs } from '@/types/database.types'

interface GPUFormModalProps {
  gpu?: GPUWithSpecs | null
  onClose: () => void
}

export function GPUFormModal({ gpu, onClose }: GPUFormModalProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const isEditing = !!gpu

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GPUFormData>({
    resolver: zodResolver(gpuFormSchema),
    defaultValues: gpu
      ? {
          component: {
            category_id: gpu.category_id,
            brand_id: gpu.brand_id,
            partner_id: gpu.partner_id,
            series_id: gpu.series_id,
            model: gpu.model,
            product_name: gpu.product_name,
            is_admin_approved: gpu.is_admin_approved,
          },
          specs: gpu.gpu_specs && gpu.gpu_specs.length > 0 ? gpu.gpu_specs[0] : {},
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
      const [catData, brandData, partnerData] = await Promise.all([
        getCategories(),
        getBrands(),
        getPartners(),
      ])
      setCategories(catData)
      setBrands(brandData)
      setPartners(partnerData)

      // Load series if editing
      if (gpu?.brand_id) {
        const seriesData = await getSeriesByBrand(gpu.brand_id)
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

  async function onSubmit(data: GPUFormData) {
    try {
      setLoading(true)

      if (isEditing && gpu) {
        // Update existing GPU
        await updateComponent(gpu.id, data.component)
        await updateGPUSpecs(gpu.id, data.specs)
      } else {
        // Create new GPU
        // Find GPU category ID
        const gpuCategory = categories.find((c) => c.name === 'GPU')
        if (!gpuCategory) throw new Error('GPU category not found')

        await createGPU(
          { ...data.component, category_id: gpuCategory.id },
          data.specs
        )
      }

      onClose()
    } catch (error) {
      console.error('Error saving GPU:', error)
      alert('Failed to save GPU. Please try again.')
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal {
          background: linear-gradient(135deg, #1a0b2e 0%, #16001e 100%);
          border: 2px solid rgba(0, 255, 157, 0.3);
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 255, 157, 0.2);
          animation: slideUp 0.3s ease;
          font-family: 'Space Mono', 'Courier New', monospace;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 2px solid rgba(0, 255, 157, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
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
          color: #00ff9d;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(0, 255, 157, 0.2);
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
          border: 1px solid rgba(0, 255, 157, 0.2);
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
          border-color: #00ff9d;
          box-shadow: 0 0 0 3px rgba(0, 255, 157, 0.1);
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
          accent-color: #00ff9d;
          cursor: pointer;
        }

        .modal-footer {
          padding: 2rem;
          border-top: 2px solid rgba(0, 255, 157, 0.2);
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
          background: linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%);
          color: #0a0e27;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 255, 157, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{isEditing ? 'Edit GPU' : 'Add New GPU'}</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
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
                    <label className="form-label">Partner (Optional)</label>
                    <select className="form-select" {...register('component.partner_id')}>
                      <option value="">Select Partner</option>
                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.name}
                        </option>
                      ))}
                    </select>
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
                      placeholder="e.g. RTX 5080"
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
                      placeholder="e.g. ASUS ROG STRIX RTX 5080"
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

              {/* GPU Specifications */}
              <div className="form-section">
                <h3 className="section-title">GPU Specifications</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Chip Series</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. RTX 5000"
                      {...register('specs.chip_series')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chip Model</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. RTX 5080"
                      {...register('specs.chip_model')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">VRAM Size (GB)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 16"
                      {...register('specs.vram_size')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">VRAM Type</label>
                    <select className="form-select" {...register('specs.vram_type')}>
                      <option value="">Select Type</option>
                      <option value="GDDR6">GDDR6</option>
                      <option value="GDDR6X">GDDR6X</option>
                      <option value="GDDR7">GDDR7</option>
                      <option value="HBM2">HBM2</option>
                      <option value="HBM3">HBM3</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Clock (MHz)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 2200"
                      {...register('specs.base_clock')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Boost Clock (MHz)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 2600"
                      {...register('specs.boost_clock')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">TDP (Watts)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 320"
                      {...register('specs.tdp')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PCIe Version</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 4.0 or 5.0"
                      {...register('specs.pcie_version')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update GPU' : 'Create GPU'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
