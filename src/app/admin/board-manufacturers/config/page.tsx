'use client'

import { useState, useEffect } from 'react'
import { 
  getAllBoardManufacturers, 
  getBoardManufacturerComponentTypes, 
  addBoardManufacturerComponentType, 
  removeBoardManufacturerComponentType 
} from '@/lib/supabase/component-types'
import { ComponentType, getComponentTypeLabel, getAllComponentTypes } from '@/lib/types/component-types'

export default function BoardManufacturersAdminPage() {
  const [boardManufacturers, setBoardManufacturers] = useState<any[]>([])
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null)
  const [manufacturerTypes, setManufacturerTypes] = useState<ComponentType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBoardManufacturers()
  }, [])

  async function loadBoardManufacturers() {
    try {
      setLoading(true)
      const data = await getAllBoardManufacturers()
      setBoardManufacturers(data)
    } catch (error) {
      console.error('Error loading board manufacturers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleManufacturerSelect(manufacturer: any) {
    try {
      setSelectedManufacturer(manufacturer)
      const types = await getBoardManufacturerComponentTypes(manufacturer.id)
      setManufacturerTypes(types)
    } catch (error) {
      console.error('Error loading board manufacturer types:', error)
    }
  }

  async function handleToggleType(componentType: ComponentType) {
    if (!selectedManufacturer) return

    try {
      setSaving(true)
      
      if (manufacturerTypes.includes(componentType)) {
        // Remove
        await removeBoardManufacturerComponentType(selectedManufacturer.id, componentType)
        setManufacturerTypes(manufacturerTypes.filter(t => t !== componentType))
      } else {
        // Add
        await addBoardManufacturerComponentType(selectedManufacturer.id, componentType)
        setManufacturerTypes([...manufacturerTypes, componentType])
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
          <h1 className="text-3xl font-bold text-gray-900">Board Manufacturer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure which component types each board manufacturer produces
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Examples: ASUS (GPUs/Motherboards), MSI (GPUs/Motherboards), Sapphire (GPUs only)
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Board Manufacturer List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">Board Manufacturers</h2>
                <p className="mt-1 text-xs text-gray-500">{boardManufacturers.length} total</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading manufacturers...</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {boardManufacturers.map((manufacturer) => (
                      <button
                        key={manufacturer.id}
                        onClick={() => handleManufacturerSelect(manufacturer)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                          selectedManufacturer?.id === manufacturer.id ? 'bg-purple-50 font-medium text-purple-700' : 'text-gray-900'
                        }`}
                      >
                        {manufacturer.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Component Types Configuration */}
          <div className="lg:col-span-2">
            {selectedManufacturer ? (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedManufacturer.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">Select which component types this manufacturer produces</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allComponentTypes.map((componentType) => {
                      const isSelected = manufacturerTypes.includes(componentType)
                      return (
                        <button
                          key={componentType}
                          onClick={() => handleToggleType(componentType)}
                          disabled={saving}
                          className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                              {getComponentTypeLabel(componentType)}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                            {componentType}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Selected: {manufacturerTypes.length} component type{manufacturerTypes.length !== 1 ? 's' : ''}
                    </p>
                    {manufacturerTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {manufacturerTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No manufacturer selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a manufacturer from the list to configure its component types</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
