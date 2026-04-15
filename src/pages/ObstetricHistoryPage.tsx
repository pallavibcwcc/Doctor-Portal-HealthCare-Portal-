import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { ObstetricProfile } from '@/types/obstetric'
import { ObstetricHistorySidebarPanel } from '@/components/ObstetricHistorySidebarPanel'
import { ObsSummaryTable } from '@/components/ObsSummaryTable'
import { ObsSummaryManager } from '@/components/ObsSummaryManager'

export function ObstetricHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showFormPanel, setShowFormPanel] = useState(false)
  const [editingProfile, setEditingProfile] = useState<ObstetricProfile | null>(null)

  // Sample data for obstetric profiles
  const [profiles, setProfiles] = useState<ObstetricProfile[]>([
    {
      id: '1',
      patientId: 'P001',
      status: 'Pregnant',
      pregnancyDetails: {
        lmp: '2025-12-15',
        edd: '2026-09-20',
        scanEdd: '2026-09-22',
        ga: 16,
        gaRecordedAt: '2026-04-07',
        currentGa: 17,
        modeOfConception: 'Natural',
      },
      gravida: 2,
      para: 1,
      live: 1,
      outcome: null,
      createdAt: '2026-01-15',
      updatedAt: '2026-04-07',
      dateWhenUpdated: '2026-04-07',
    },
  ])

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleAddNew = () => {
    setEditingProfile(null)
    setShowFormPanel(true)
  }

  const handleEdit = (profile: ObstetricProfile) => {
    setEditingProfile(profile)
    setShowFormPanel(true)
  }

  const handleSave = (profile: ObstetricProfile) => {
    if (editingProfile) {
      setProfiles(prev =>
        prev.map(p => (p.id === profile.id ? profile : p))
      )
    } else {
      setProfiles(prev => [...prev, profile])
    }
    setShowFormPanel(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      setProfiles(prev => prev.filter(p => p.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pregnant':
        return 'bg-blue-100 text-blue-800'
      case 'Mother':
        return 'bg-green-100 text-green-800'
      case 'Post-termination':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Current Obs His</h1>
              <Button
                onClick={handleAddNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </div>

            {profiles.length === 0 ? (
              <div className="bg-white rounded-lg shadow">
                <div className="p-12 text-center">
                  <p className="text-gray-600 mb-4">No obstetric profiles recorded yet.</p>
                  <Button
                    onClick={handleAddNew}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Create First Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[25%]">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[20%]">
                        GA / Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        Updated
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[25%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {profiles.map(profile => (
                      <>
                        <tr key={`row-${profile.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(profile.status)}`}>
                              {profile.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {profile.status === 'Pregnant' && profile.pregnancyDetails ? (
                              <span className="text-sm text-gray-900 font-medium">
                                Gravida: {profile.gravida}, Para: {profile.para}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-600">Post-pregnancy record</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {profile.status === 'Pregnant' && profile.pregnancyDetails ? (
                              <span>GA: {profile.pregnancyDetails.currentGa || profile.pregnancyDetails.ga} weeks</span>
                            ) : (
                              <span>{profile.postPregnancyDetails?.dateOfEvent || 'N/A'}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(profile.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleRowExpansion(profile.id)}
                                className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                                title="Expand details"
                              >
                                {expandedRows.has(profile.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEdit(profile)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(profile.id)}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedRows.has(profile.id) && (
                          <tr key={`expand-${profile.id}`} className="bg-gray-50 hover:bg-gray-50">
                            <td colSpan={5} className="px-6 py-4">
                              <div className="space-y-4">
                                {profile.status === 'Pregnant' && profile.pregnancyDetails && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Pregnancy Details</h4>
                                    <div className="grid grid-cols-4 gap-4">
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">LMP</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{profile.pregnancyDetails.lmp || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">EDD</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{profile.pregnancyDetails.edd || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Scan EDD</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{profile.pregnancyDetails.scanEdd || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Mode of Conception</p>
                                        <p className="text-sm font-medium text-gray-900 mt-1">{profile.pregnancyDetails.modeOfConception || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {(profile.status === 'Mother' || profile.status === 'Post-termination') &&
                                  profile.postPregnancyDetails && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Details</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500 uppercase font-semibold">Outcome</p>
                                          <p className="text-sm font-medium text-gray-900 mt-1">{profile.outcome || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 uppercase font-semibold">Event Date</p>
                                          <p className="text-sm font-medium text-gray-900 mt-1">{profile.postPregnancyDetails.dateOfEvent || 'N/A'}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Obs Summary Section */}
            {profiles.length > 0 && (
              <div className="mt-12 space-y-8">
                {/* Obs Summary Manager - Enhanced Add/List UI */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <ObsSummaryManager 
                    profiles={profiles}
                  />
                </div>

                {/* Obs Summary Table - Compact View */}
                <div>
                  <ObsSummaryTable profiles={profiles} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <ObstetricHistorySidebarPanel
        profile={editingProfile}
        isOpen={showFormPanel}
        onClose={() => {
          setShowFormPanel(false)
          setEditingProfile(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
