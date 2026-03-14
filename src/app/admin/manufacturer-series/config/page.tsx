'use client'

import { useState, useEffect } from 'react'
import { 
  getAllManufacturerSeries, 
  getAllBoardManufacturers,
  getManufacturerSeriesComponentTypes, 
  addManufacturerSeriesComponentType, 
  removeManufacturerSeriesComponentType 
} from '@/lib/supabase/component-types'
import { ComponentType, getComponentTypeLabel, getAllComponentTypes } from '@/lib/types/component-types'

export default function ManufacturerSeriesAdminPage() {
  const [series, setSeries] = useState<any[]>([])
  const [manufacturers, setManufacturers] = useState<any[]>([])
  const [selectedSeries, setSelectedSeries] = useState<any>(null)
  const [seriesTypes, setSeriesTypes] = useState<ComponentType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filterManufacturer, setFilterManufacturer] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [seriesData, manufacturerData] = await Promise.all([
        getAllManufacturerSeries(),
        getAllBoardManufacturers(),
      ])
      setSeries(seriesData)
      setManufacturers(manufacturerData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSeriesSelect(seriesItem: any) {
    try {
      setSelectedSeries(seriesItem)
      const types = await getManufacturerSeriesComponentTypes(seriesItem.id)
      setSeriesTypes(types)
    } catch (error) {
      console.error('Error loading series types:', error)
    }
  }

  async function handleToggleType(componentType: ComponentType) {
    if (!selectedSeries) return

    try {
      setSaving(true)
      
      if (seriesTypes.includes(componentType)) {
        // Remove
        await removeManufacturerSeriesComponentType(selectedSeries.id, componentType)
        setSeriesTypes(seriesTypes.filter(t => t !== componentType))
      } else {
        // Add
        await addManufacturerSeriesComponentType(selectedSeries.id, componentType)
        setSeriesTypes([...seriesTypes, componentType])
      }
    } catch (error) {
      console.error('Error toggling component type:', error)
      alert('Failed to update. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const allComponentTypes = getAllComponentTypes()
  
  // Filter series by manufacturer if selected
  const filteredSeries = filterManufacturer
    ? series.filter(s => s.board_manufacturer_id === filterManufacturer)
    : series

  // Get manufacturer name helper
  const getManufacturerName = (manufacturerId: string) => {
    return manufacturers.find(m => m.id === manufacturerId)?.name || 'Unknown'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Manufacturer Series Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure which component types each product series supports
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Examples: ROG STRIX (ASUS - GPUs/Motherboards), NITRO+ (Sapphire - GPUs only)
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Series List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="mb-3 text-sm font-semibold text-gray-900">Product Series</h2>
                
                {/* Manufacturer Filter */}
                <select
                  value={filterManufacturer}
                  onChange={(e) => setFilterManufacturer(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">All Manufacturers</option>
                  {manufacturers.map((manufacturer) => (
                    <option key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  {filteredSeries.length} series {filterManufacturer ? 'in manufacturer' : 'total'}
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading series...</div>
                ) : filteredSeries.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">No series found</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredSeries.map((seriesItem) => (
                      <button
                        key={seriesItem.id}
                        onClick={() => handleSeriesSelect(seriesItem)}
                        className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          selectedSeries?.id === seriesItem.id ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className={`text-sm font-medium ${
                          selectedSeries?.id === seriesItem.id ? 'text-green-700' : 'text-gray-900'
                        }`}>
                          {seriesItem.name}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {getManufacturerName(seriesItem.board_manufacturer_id)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Component Types Configuration */}
          <div className="lg:col-span-2">
            {selectedSeries ? (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedSeries.name}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">{getManufacturerName(selectedSeries.board_manufacturer_id)}</p>
                  <p className="mt-2 text-sm text-gray-500">Select which component types this series applies to</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allComponentTypes.map((componentType) => {
                      const isSelected = seriesTypes.includes(componentType)
                      return (
                        <button
                          key={componentType}
                          onClick={() => handleToggleType(componentType)}
                          disabled={saving}
                          className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                isSelected
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                              {getComponentTypeLabel(componentType)}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                            {componentType}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Selected: {seriesTypes.length} component type{seriesTypes.length !== 1 ? 's' : ''}
                    </p>
                    {seriesTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {seriesTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                          >
                            {getComponentTypeLabel(type)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warning if no types selected */}
                  {seriesTypes.length === 0 && (
                    <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">No component types selected</h3>
                          <p className="mt-1 text-xs text-yellow-700">
                            This series won't appear in any form dropdowns until you assign at least one component type.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No series selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a series from the list to configure its component types</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
