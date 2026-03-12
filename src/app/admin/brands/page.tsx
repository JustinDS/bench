'use client'

import { useState, useEffect } from 'react'
import { 
  getAllBrands, 
  getBrandComponentTypes, 
  addBrandComponentType, 
  removeBrandComponentType 
} from '@/lib/supabase/component-types'
import { ComponentType, getComponentTypeLabel, getAllComponentTypes } from '@/lib/types/component-types'

export default function BrandsAdminPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const [brandTypes, setBrandTypes] = useState<ComponentType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBrands()
  }, [])

  async function loadBrands() {
    try {
      setLoading(true)
      const data = await getAllBrands()
      setBrands(data)
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleBrandSelect(brand: any) {
    try {
      setSelectedBrand(brand)
      const types = await getBrandComponentTypes(brand.id)
      setBrandTypes(types)
    } catch (error) {
      console.error('Error loading brand types:', error)
    }
  }

  async function handleToggleType(componentType: ComponentType) {
    if (!selectedBrand) return

    try {
      setSaving(true)
      
      if (brandTypes.includes(componentType)) {
        // Remove
        await removeBrandComponentType(selectedBrand.id, componentType)
        setBrandTypes(brandTypes.filter(t => t !== componentType))
      } else {
        // Add
        await addBrandComponentType(selectedBrand.id, componentType)
        setBrandTypes([...brandTypes, componentType])
      }
    } catch (error) {
      console.error('Error toggling component type:', error)
      alert('Failed to update. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const allComponentTypes = getAllComponentTypes()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure which component types each brand supports
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Brand List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">Brands</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading brands...</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(brand)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                          selectedBrand?.id === brand.id ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Component Types Configuration */}
          <div className="lg:col-span-2">
            {selectedBrand ? (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedBrand.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">Select which component types this brand supports</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allComponentTypes.map((componentType) => {
                      const isSelected = brandTypes.includes(componentType)
                      return (
                        <button
                          key={componentType}
                          onClick={() => handleToggleType(componentType)}
                          disabled={saving}
                          className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                              {getComponentTypeLabel(componentType)}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                            {componentType}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Selected: {brandTypes.length} component type{brandTypes.length !== 1 ? 's' : ''}
                    </p>
                    {brandTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {brandTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                          >
                            {getComponentTypeLabel(type)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No brand selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a brand from the list to configure its component types</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
