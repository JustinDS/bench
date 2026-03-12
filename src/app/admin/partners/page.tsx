'use client'

import { useState, useEffect } from 'react'
import { 
  getAllPartners, 
  getPartnerComponentTypes, 
  addPartnerComponentType, 
  removePartnerComponentType 
} from '@/lib/supabase/component-types'
import { ComponentType, getComponentTypeLabel, getAllComponentTypes } from '@/lib/types/component-types'

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [selectedPartner, setSelectedPartner] = useState<any>(null)
  const [partnerTypes, setPartnerTypes] = useState<ComponentType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPartners()
  }, [])

  async function loadPartners() {
    try {
      setLoading(true)
      const data = await getAllPartners()
      setPartners(data)
    } catch (error) {
      console.error('Error loading partners:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePartnerSelect(partner: any) {
    try {
      setSelectedPartner(partner)
      const types = await getPartnerComponentTypes(partner.id)
      setPartnerTypes(types)
    } catch (error) {
      console.error('Error loading partner types:', error)
    }
  }

  async function handleToggleType(componentType: ComponentType) {
    if (!selectedPartner) return

    try {
      setSaving(true)
      
      if (partnerTypes.includes(componentType)) {
        // Remove
        await removePartnerComponentType(selectedPartner.id, componentType)
        setPartnerTypes(partnerTypes.filter(t => t !== componentType))
      } else {
        // Add
        await addPartnerComponentType(selectedPartner.id, componentType)
        setPartnerTypes([...partnerTypes, componentType])
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
          <h1 className="text-3xl font-bold text-gray-900">Partner/Manufacturer Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure which component types each partner/manufacturer supports
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Partner List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">Partners</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-sm text-gray-500">Loading partners...</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {partners.map((partner) => (
                      <button
                        key={partner.id}
                        onClick={() => handlePartnerSelect(partner)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                          selectedPartner?.id === partner.id ? 'bg-purple-50 font-medium text-purple-700' : 'text-gray-900'
                        }`}
                      >
                        {partner.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Component Types Configuration */}
          <div className="lg:col-span-2">
            {selectedPartner ? (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedPartner.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">Select which component types this partner manufactures</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {allComponentTypes.map((componentType) => {
                      const isSelected = partnerTypes.includes(componentType)
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
                      Selected: {partnerTypes.length} component type{partnerTypes.length !== 1 ? 's' : ''}
                    </p>
                    {partnerTypes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {partnerTypes.map((type) => (
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
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No partner selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a partner from the list to configure its component types</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
