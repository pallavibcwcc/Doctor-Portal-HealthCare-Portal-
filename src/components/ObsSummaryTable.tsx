import { ObstetricProfile, calculateObsSummaryTotal, ObstetricValidations } from '@/types/obstetric'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface ObsSummaryTableProps {
  profiles: ObstetricProfile[]
}

export function ObsSummaryTable({ profiles }: ObsSummaryTableProps) {
  const getValidationColor = (total: number) => {
    if (total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD) {
      return 'bg-red-100 border-red-300'
    }
    if (total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD) {
      return 'bg-yellow-100 border-yellow-300'
    }
    return 'bg-green-100 border-green-300'
  }

  const getRiskIcon = (total: number) => {
    if (total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD) {
      return <AlertCircle className="w-5 h-5 text-red-600" />
    }
    if (total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD) {
      return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
    return <CheckCircle className="w-5 h-5 text-green-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Obstetric Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  G
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  P
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  E
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  M
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  A
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  LC
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  FOE
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profiles.map(profile => {
                const summary = profile.obsSummary
                const total = calculateObsSummaryTotal(summary)

                return (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {profile.patientId}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {profile.status}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.gravida || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.para || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.ectopic || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.miscarriage || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.abortions || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.livingChildren || '-'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {summary?.numberOfFoetus || 1}
                    </td>
                    <td className="px-6 py-3">
                      <div
                        className={`px-3 py-2 rounded-lg border flex items-center gap-2 justify-center ${getValidationColor(
                          total
                        )}`}
                      >
                        {getRiskIcon(total)}
                        <span className="text-xs font-medium">
                          {total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD
                            ? 'Critical'
                            : total > ObstetricValidations.GRAVIDA_ALERT_THRESHOLD
                              ? 'Alert'
                              : 'OK'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-medium">Legend:</p>
            <p>G = Gravida</p>
          </div>
          <div>
            <p>P = Para</p>
            <p>E = Ectopic</p>
          </div>
          <div>
            <p>M = Miscarriage</p>
            <p>A = Abortions</p>
          </div>
          <div>
            <p>LC = Living Children</p>
            <p>FOE = Foetus</p>
          </div>
        </div>
      </div>

      {/* Birth Weight Risk Flags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Flags - Baby Birth Weight</h3>
        {profiles.some(p => p.obsSummary?.birthWeightRiskFlag) ? (
          <div className="space-y-2">
            {profiles
              .filter(p => p.obsSummary?.birthWeightRiskFlag)
              .map(profile => (
                <div
                  key={profile.id}
                  className="bg-orange-50 border border-orange-300 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-900">
                      {profile.patientId} - Birth Weight: {profile.obsSummary?.babyBirthWeight}kg
                    </p>
                    <p className="text-xs text-orange-800 mt-1">
                      Outside normal range (2.5-3.8 kg). Please review with OBGYN.
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">No birth weight risk flags</p>
            </div>
          </div>
        )}
      </div>

      {/* Tear Details - For Delivery Cases */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Perineal Tear Details</h3>
        {profiles.some(p => p.obsSummary?.tearDetails && p.obsSummary.tearDetails.length > 0) ? (
          <div className="space-y-2">
            {profiles
              .filter(p => p.obsSummary?.tearDetails && p.obsSummary.tearDetails.length > 0)
              .map(profile => (
                <div
                  key={profile.id}
                  className="bg-blue-50 border border-blue-300 rounded-lg p-4 flex items-start gap-3"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {profile.patientId} - Tear Degree
                    </p>
                    <div className="flex gap-2 mt-2">
                      {profile.obsSummary?.tearDetails?.map(tear => (
                        <span
                          key={tear}
                          className="px-2 py-1 bg-blue-200 text-blue-900 text-xs font-medium rounded"
                        >
                          {tear}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-600">No perineal tear details recorded</p>
          </div>
        )}
      </div>
    </div>
  )
}
