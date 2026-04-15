import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { ObstetricProfile, ObstetricValidations, calculateObsSummaryTotal } from '@/types/obstetric'

interface ObsSummaryManagerProps {
  profiles: ObstetricProfile[]
}

export function ObsSummaryManager({ profiles }: ObsSummaryManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'alert' | 'ok'>('all')

  const getValidationStatus = (total: number) => {
    if (total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD) {
      return 'critical'
    }
    if (total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD) {
      return 'alert'
    }
    return 'ok'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          border: 'border-red-300',
          icon: AlertTriangle,
          text: 'text-red-800',
          label: 'Critical',
        }
      case 'alert':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-300',
          icon: AlertCircle,
          text: 'text-yellow-800',
          label: 'Alert',
        }
      default:
        return {
          bg: 'bg-green-100',
          border: 'border-green-300',
          icon: CheckCircle,
          text: 'text-green-800',
          label: 'OK',
        }
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch =
      profile.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.status.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === 'all') return matchesSearch

    const total = calculateObsSummaryTotal(profile.obsSummary)
    const status = getValidationStatus(total)
    return matchesSearch && status === filterStatus
  })

  const stats = {
    total: profiles.length,
    withSummary: profiles.filter(p => p.obsSummary).length,
    critical: profiles.filter(p => getValidationStatus(calculateObsSummaryTotal(p.obsSummary)) === 'critical').length,
    alert: profiles.filter(p => getValidationStatus(calculateObsSummaryTotal(p.obsSummary)) === 'alert').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Obstetric Summary Manager</h2>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Summary
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-600">
          <p className="text-gray-600 text-sm font-medium">Total Profiles</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm font-medium">With Summary</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.withSummary}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm font-medium">Alert</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.alert}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600">
          <p className="text-gray-600 text-sm font-medium">Critical</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.critical}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
            <Input
              placeholder="Search by Patient ID or Status..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by validation status"
            >
              <option value="all">All Statuses</option>
              <option value="ok">OK</option>
              <option value="alert">Alert</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* List View */}
      <div className="space-y-3">
        {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No summaries found</p>
          </div>
        ) : (
          filteredProfiles.map(profile => {
            const summary = profile.obsSummary
            const total = calculateObsSummaryTotal(summary)
            const status = getValidationStatus(total)
            const statusBadge = getStatusBadge(status)
            const StatusIcon = statusBadge.icon

            return (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  onClick={() =>
                    setExpandedId(expandedId === profile.id ? null : profile.id)
                  }
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button className="text-gray-600 hover:text-gray-900">
                      {expandedId === profile.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.patientId}
                        </h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                          {profile.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          <strong>G:</strong> {summary?.gravida || '-'}
                        </span>
                        <span>
                          <strong>P:</strong> {summary?.para || '-'}
                        </span>
                        <span>
                          <strong>E:</strong> {summary?.ectopic || '-'}
                        </span>
                        <span>
                          <strong>M:</strong> {summary?.miscarriage || '-'}
                        </span>
                        <span>
                          <strong>A:</strong> {summary?.abortions || '-'}
                        </span>
                        <span>
                          <strong>LC:</strong> {summary?.livingChildren || '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${statusBadge.bg} ${statusBadge.border}`}
                  >
                    <StatusIcon className={`w-5 h-5 ${statusBadge.text}`} />
                    <span className={`text-sm font-medium ${statusBadge.text}`}>
                      {statusBadge.label}
                      {status !== 'ok' && ` (${total})`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === profile.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Basic Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Number of Foetus</p>
                            <p className="text-gray-900 font-medium">
                              {summary?.numberOfFoetus || 1}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery/Termination Mode</p>
                            <p className="text-gray-900 font-medium">
                              {summary?.deliveryTerminationMode || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Summary Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Total Gravida</p>
                            <p className={`text-lg font-bold ${total > 20 ? 'text-red-600' : total > 9 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {total}
                            </p>
                          </div>
                          {summary?.babyBirthWeight && (
                            <div>
                              <p className="text-gray-600">Baby Birth Weight</p>
                              <p className={`font-medium ${summary.birthWeightRiskFlag ? 'text-orange-600' : 'text-gray-900'}`}>
                                {summary.babyBirthWeight} kg
                                {summary.birthWeightRiskFlag && ' ⚠️'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Tear Details
                        </h4>
                        {summary?.tearDetails && summary.tearDetails.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {summary.tearDetails.map(tear => (
                              <span
                                key={tear}
                                className="px-2 py-1 bg-blue-200 text-blue-900 text-xs font-medium rounded"
                              >
                                {tear} Degree
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No tear details recorded</p>
                        )}
                      </div>
                    </div>

                    {/* Risk Flags Alert */}
                    {(total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD ||
                      (summary?.birthWeightRiskFlag && summary?.babyBirthWeight)) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-2">
                          {total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD && (
                            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-yellow-900">High Gravida Count</p>
                                <p className="text-sm text-yellow-800">
                                  Total gravida is {total} (threshold: {ObstetricValidations.GRAVIDA_ALERT_THRESHOLD}). 
                                  {total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD 
                                    ? ' Critical - cannot save.' 
                                    : ' Please confirm with OBGYN.'}
                                </p>
                              </div>
                            </div>
                          )}
                          {summary?.birthWeightRiskFlag && summary?.babyBirthWeight && (
                            <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-300 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-orange-900">Abnormal Birth Weight</p>
                                <p className="text-sm text-orange-800">
                                  Baby weight {summary.babyBirthWeight}kg is outside normal range (2.5-3.8kg).
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
