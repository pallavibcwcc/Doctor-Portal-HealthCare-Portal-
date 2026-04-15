import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import { GynecologicalVisit } from '@/types/gynecology'
import { GynecologyVisitModal } from '@/components/GynecologyVisitModal'

export function GynecologicalVisitsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [editingVisit, setEditingVisit] = useState<GynecologicalVisit | null>(null)

  // Sample data for gynecological visits
  const [visits, setVisits] = useState<GynecologicalVisit[]>([
    {
      id: '1',
      visitNo: 1,
      visitDate: '06-04-2026',
      visitTime: '02:07 AM',
      seenBy: 'Dr. Pallavi Singh',
      branch: 'Online',
      consultationMode: 'Online',
      visitCategory: 'Normal',
      presentingComplaints: 'Regular checkup',
      doctorPrivateNotes: 'Patient is in good health',
      cervicalCancerScreening: {
        screeningDone: true,
        type: 'HPV',
        lastTestDate: '2025-12-01',
        result: 'Negative',
      },
      menstrualDetails: {
        menstrualStatus: 'Reproductive',
        lmp: '2026-03-15',
        para: '2',
        contraception: 'None',
        menstrualPattern: 'Regular',
        mancheAge: '13',
        flow: 'Moderate',
        cycleLength: '28',
        bleedingDuration: '5',
        painWithPeriods: false,
        durationOfPain: '',
        interMenstrualSpotting: false,
        postCoitalBleeding: false,
      },
      otherDetails: {
        micturition: 'Normal',
        micturitionComments: 'No issues',
        bowels: 'Regular',
        bowelsComments: 'No complaints',
        recentWeightChange: 'Stable',
        weightChangeComments: '',
      },
      investigations: {
        labTests: 'CBC, Thyroid Profile',
        scansImaging: 'Abdominal Ultrasound',
        remarks: 'All normal',
      },
      prescriptions: [
        {
          medicineName: 'Paracetamol',
          dose: '500mg',
          timing: 'After meals',
          frequency: '1-0-1',
          duration: '5',
          durationUnit: 'Days',
          instructions: 'Take with warm water',
        },
      ],
      diagnosis: {
        currentDiagnosis: 'Normal gynaecological examination',
        origin: 'Clinical',
        treatment: 'Routine care and monitoring',
        advice: 'Maintain healthy lifestyle, regular check-ups yearly',
      },
      review: {
        overallAssessment: 'Patient is in good health with no acute concerns',
        improvementNotes: 'Patient very cooperative and compliant to treatment',
        recommendations: 'Continue routine monitoring and follow-up after 6 months',
        action: 'Active',
      },
      history: [],
      followUp: {
        followUpOption: 'days',
        numberOfDays: '7',
        followUpDate: '2026-04-13',
        nextFollowUpMode: 'online',
        instructionsForNextVisit: 'Continue medication as prescribed',
      },
      createdAt: '2026-04-06T02:07:00Z',
    },
  ])

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleAddVisit = () => {
    setEditingVisit(null)
    setShowModal(true)
  }

  const handleEditVisit = (visit: GynecologicalVisit) => {
    setEditingVisit(visit)
    setShowModal(true)
  }

  const handleDeleteVisit = (id: string) => {
    setVisits(visits.filter(v => v.id !== id))
  }

  const handleSaveVisit = (visit: GynecologicalVisit) => {
    if (editingVisit) {
      // Update existing visit
      setVisits(visits.map(v => v.id === visit.id ? visit : v))
    } else {
      // Add new visit
      const newVisit = {
        ...visit,
        id: Date.now().toString(),
        visitNo: visits.length + 1,
      }
      setVisits([...visits, newVisit])
    }
    setShowModal(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Gynaecological Visits</h1>
              <Button onClick={handleAddVisit} className="gap-2">
                + Add Visit
              </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12"></th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">V No.</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">V Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">V Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Presenting Complaints</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lab Test/s</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Scans/Imaging</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">FU Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Seen By</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit) => (
                      <VisitRow
                        key={visit.id}
                        visit={visit}
                        isExpanded={expandedRows.has(visit.id)}
                        onToggleExpand={() => toggleRowExpand(visit.id)}
                        onEdit={() => handleEditVisit(visit)}
                        onDelete={() => handleDeleteVisit(visit.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {visits.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No visits recorded yet
                </div>
              )}
            </div>

            {/* Pagination */}
            {visits.length > 0 && (
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div>
                  <select defaultValue="10" className="border border-gray-300 rounded px-3 py-2">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div>
                  Record 1 of {visits.length}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Visit Modal */}
      {showModal && (
        <GynecologyVisitModal
          visit={editingVisit}
          onClose={() => setShowModal(false)}
          onSave={handleSaveVisit}
        />
      )}
    </div>
  )
}

interface VisitRowProps {
  visit: GynecologicalVisit
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
}

function VisitRow({ visit, isExpanded, onToggleExpand, onEdit, onDelete }: VisitRowProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      {/* Main Row */}
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="px-6 py-4">
          <button
            onClick={onToggleExpand}
            className="p-1 hover:bg-gray-200 rounded"
            title="Expand/Collapse"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{visit.visitNo}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{visit.visitDate}</td>
        <td className="px-6 py-4 text-sm text-gray-900">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium">
            {visit.visitCategory} | {visit.consultationMode}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
          {visit.presentingComplaints || '-'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {visit.investigations.labTests ? '✓' : '-'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {visit.investigations.scansImaging ? '✓' : '-'}
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{visit.followUp.followUpDate || '-'}</td>
        <td className="px-6 py-4 text-sm text-gray-900">{visit.seenBy}</td>
        <td className="px-6 py-4">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <button
                  onClick={() => {
                    onEdit()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    window.print()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => {
                    // Handle follow-up
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                >
                  📅 Follow-up
                </button>
                <button
                  onClick={() => {
                    // Handle triage
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                >
                  ⚠️ Triage
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Row */}
      {isExpanded && (
        <tr className="bg-blue-50 border-b border-gray-200">
          <td colSpan={10} className="px-6 py-6">
            <VisitDetailedView visit={visit} />
          </td>
        </tr>
      )}
    </>
  )
}

interface VisitDetailedViewProps {
  visit: GynecologicalVisit
}

function VisitDetailedView({ visit }: VisitDetailedViewProps) {
  return (
    <div className="space-y-6">
      {/* Visit Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Visit Date</p>
          <p className="text-sm text-gray-900 font-medium">{visit.visitDate} {visit.visitTime}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Seen By</p>
          <p className="text-sm text-gray-900 font-medium">{visit.seenBy}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Branch</p>
          <p className="text-sm text-gray-900 font-medium">{visit.branch}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Consultation Mode</p>
          <p className="text-sm text-gray-900 font-medium">{visit.consultationMode}</p>
        </div>
      </div>

      {/* Presenting Complaints */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Presenting Complaints</p>
        <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
          {visit.presentingComplaints || 'No complaints recorded'}
        </p>
      </div>

      {/* Doctor Notes */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Doctor Private Notes</p>
        <p className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
          {visit.doctorPrivateNotes || 'No notes'}
        </p>
      </div>

      {/* Cervical Cancer Screening */}
      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Cervical Cancer Screening</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600">Screening Done</p>
            <p className="text-sm font-medium text-gray-900">{visit.cervicalCancerScreening.screeningDone ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Type</p>
            <p className="text-sm font-medium text-gray-900">{visit.cervicalCancerScreening.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Last Test Date</p>
            <p className="text-sm font-medium text-gray-900">{visit.cervicalCancerScreening.lastTestDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Result</p>
            <p className="text-sm font-medium text-green-600">{visit.cervicalCancerScreening.result}</p>
          </div>
        </div>
      </div>

      {/* Menstrual Details */}
      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Menstrual Details</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-600">Status</p>
            <p className="text-sm font-medium text-gray-900">{visit.menstrualDetails.menstrualStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">LMP</p>
            <p className="text-sm font-medium text-gray-900">{visit.menstrualDetails.lmp}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Para</p>
            <p className="text-sm font-medium text-gray-900">{visit.menstrualDetails.para}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Cycle Length</p>
            <p className="text-sm font-medium text-gray-900">{visit.menstrualDetails.cycleLength} days</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Flow</p>
            <p className="text-sm font-medium text-gray-900">{visit.menstrualDetails.flow}</p>
          </div>
        </div>
      </div>

      {/* Investigations */}
      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Investigations</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600">Lab Tests</p>
            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
              {visit.investigations.labTests || 'None'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Scans/Imaging</p>
            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
              {visit.investigations.scansImaging || 'None'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Remarks</p>
            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
              {visit.investigations.remarks || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Prescriptions */}
      {visit.prescriptions.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Prescriptions</p>
          <div className="space-y-2">
            {visit.prescriptions.map((rx, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm bg-white p-3 rounded border border-gray-200">
                <span className="font-medium text-gray-900">{rx.medicineName}</span>
                <span className="text-gray-600">-</span>
                <span className="text-gray-600">{rx.dose} × {rx.frequency}</span>
                <span className="text-gray-600">for {rx.duration} {rx.durationUnit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up */}
      <div className="border-t pt-4 bg-white p-3 rounded border border-gray-200">
        <p className="text-sm font-semibold text-gray-900 mb-2">Follow-up</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-600">Type</p>
            <p className="font-medium text-gray-900">{visit.followUp.followUpOption}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Date</p>
            <p className="font-medium text-gray-900">{visit.followUp.followUpDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Mode</p>
            <p className="font-medium text-gray-900">{visit.followUp.nextFollowUpMode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Instructions</p>
            <p className="font-medium text-gray-900">{visit.followUp.instructionsForNextVisit || '-'}</p>
          </div>
        </div>
      </div>

      {/* Diagnosis & Review */}
      <div className="border-t pt-4">
        <p className="text-sm font-semibold text-gray-900 mb-4">Diagnosis & Review</p>
        
        {/* Diagnosis Section */}
        <div className="mb-6 pb-6 border-b">
          <p className="text-sm font-semibold text-gray-800 mb-3">Diagnosis</p>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-gray-600">Current Diagnosis</p>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {visit.diagnosis?.currentDiagnosis || 'No diagnosis recorded'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600">Origin</p>
                <p className="text-sm text-gray-900 font-medium bg-white p-2 rounded border border-gray-200">
                  {visit.diagnosis?.origin || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Treatment Plan</p>
                <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                  {visit.diagnosis?.treatment || 'None'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600">Advice</p>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {visit.diagnosis?.advice || 'No advice recorded'}
              </p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mb-6 pb-6 border-b">
          <p className="text-sm font-semibold text-gray-800 mb-3">Review</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600">Overall Assessment</p>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {visit.review?.overallAssessment || 'No assessment recorded'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Improvement Notes</p>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {visit.review?.improvementNotes || 'No notes recorded'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Recommendations</p>
              <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                {visit.review?.recommendations || 'No recommendations recorded'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Action Status</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium px-3 py-1 rounded ${
                  visit.review?.action === 'Resolved' ? 'bg-green-100 text-green-700' :
                  visit.review?.action === 'Ruled Out' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {visit.review?.action || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        {visit.history && visit.history.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">History</p>
            <div className="space-y-2">
              {visit.history.map((record, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{record.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Visit Type</p>
                      <p className="font-medium text-gray-900">{record.visitType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Doctor</p>
                      <p className="font-medium text-gray-900">{record.doctorName}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p><strong>Notes:</strong> {record.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {(!visit.history || visit.history.length === 0) && (
          <p className="text-sm text-gray-600 text-center py-4">No history records yet</p>
        )}
      </div>
    </div>
  )
}
