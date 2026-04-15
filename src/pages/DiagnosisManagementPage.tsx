import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, ChevronDown, ChevronUp, Edit2 } from 'lucide-react'
import { DiagnosisRecord } from '@/types/diagnosis'

export function DiagnosisManagementPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All Status' | 'Active' | 'Resolved' | 'On Hold'>('All Status')
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<Set<string>>(new Set())

  // Sample data for diagnoses
  const [diagnoses] = useState<DiagnosisRecord[]>([
    {
      id: '1',
      diagnosisName: 'Polycystic Ovary Syndrome (PCOS)',
      icdCode: 'E28.2',
      status: 'Active',
      origin: 'Confirmed',
      plan: 'Medical',
      firstDiagnosed: '8/15/2023',
      clinicalNotes: 'Polycystic ovarian syndrome with anovulation',
      visitCount: 3,
      history: [
        {
          id: '1',
          date: '8/15/2023',
          doctor: 'Dr. Emily Carter',
          status: 'Active',
          origin: 'Clinical',
          treatmentPlan: 'Medical',
          notes: 'Started on Metformin 500mg. Lifestyle modifications recommended.'
        },
        {
          id: '2',
          date: '11/20/2023',
          doctor: 'Dr. Emily Carter',
          status: 'Active',
          origin: 'Confirmed',
          treatmentPlan: 'Medical',
          notes: 'Lab results confirm PCOS. Continue current medication.'
        },
        {
          id: '3',
          date: '1/15/2024',
          doctor: 'Dr. Emily Carter',
          status: 'Active',
          origin: 'Confirmed',
          treatmentPlan: 'Medical',
          notes: 'Patient showing significant improvement in symptoms.'
        }
      ],
      createdAt: '2023-08-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z'
    },
    {
      id: '2',
      diagnosisName: 'Uterine Fibroids',
      icdCode: 'D25.9',
      status: 'Active',
      origin: 'Confirmed',
      plan: 'Conservative',
      firstDiagnosed: '10/5/2023',
      clinicalNotes: 'Leiomyoma of uterus, unspecified',
      visitCount: 2,
      history: [
        {
          id: '1',
          date: '10/5/2023',
          doctor: 'Dr. Sarah Wong',
          status: 'Active',
          origin: 'Clinical',
          treatmentPlan: 'Conservative',
          notes: 'Imaging shows multiple small fibroids. Monitoring with ultrasound'
        },
        {
          id: '2',
          date: '2/10/2024',
          doctor: 'Dr. Sarah Wong',
          status: 'Active',
          origin: 'Confirmed',
          treatmentPlan: 'Conservative',
          notes: 'No significant changes. Continue monitoring approach'
        }
      ],
      createdAt: '2023-10-05T09:15:00Z',
      updatedAt: '2024-02-10T11:20:00Z'
    },
    {
      id: '3',
      diagnosisName: 'Endometriosis',
      icdCode: 'N80.9',
      status: 'Active',
      origin: 'Clinical',
      plan: 'Medical',
      firstDiagnosed: '1/10/2024',
      clinicalNotes: 'Endometriosis, unspecified',
      visitCount: 1,
      history: [
        {
          id: '1',
          date: '1/10/2024',
          doctor: 'Dr. Pallavi Singh',
          status: 'Active',
          origin: 'Clinical',
          treatmentPlan: 'Medical',
          notes: 'Clinical diagnosis based on symptoms and examination'
        }
      ],
      createdAt: '2024-01-10T13:45:00Z',
      updatedAt: '2024-01-10T13:45:00Z'
    }
  ])

  const toggleExpandDiagnosis = (id: string) => {
    const newExpanded = new Set(expandedDiagnosis)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedDiagnosis(newExpanded)
  }

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSearch = diagnosis.diagnosisName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diagnosis.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All Status' || diagnosis.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Diagnosis Management</h1>
                <p className="text-gray-600 text-sm mt-1">Sarah Johnson • PT-2024-001</p>
              </div>
              <Button
                onClick={() => navigate('/add-diagnosis')}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Plus className="w-4 h-4" /> Save All
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-300">
              <button
                onClick={() => setActiveTab('current')}
                className={`pb-3 font-medium ${
                  activeTab === 'current'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Current Encounter <span className="ml-1 font-bold">{diagnoses.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                History
              </button>
            </div>

            {/* Current Tab */}
            {activeTab === 'current' && (
              <div className="space-y-4">
                {/* Add New Diagnosis Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => navigate('/add-diagnosis')}
                >
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Add New Diagnosis</p>
                </div>

                {/* Diagnosis Cards */}
                <div className="space-y-3">
                  {filteredDiagnoses.map(diagnosis => (
                    <div key={diagnosis.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{diagnosis.diagnosisName}</h3>
                          <p className="text-sm text-blue-600 font-semibold mt-1">{diagnosis.icdCode}</p>
                        </div>
                        <Button
                          onClick={() => navigate('/add-diagnosis', { state: { diagnosis } })}
                          className="bg-blue-600 hover:bg-blue-700 gap-2 ml-4 flex-shrink-0"
                        >
                          <Edit2 className="w-4 h-4" /> Update
                        </Button>
                      </div>

                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          diagnosis.status === 'Active' ? 'bg-green-100 text-green-700' :
                          diagnosis.status === 'Resolved' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          ✓ {diagnosis.status}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {diagnosis.origin}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">Plan:</span> <span>{diagnosis.plan}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Since:</span> <span>{diagnosis.firstDiagnosed}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-blue-600">{diagnosis.visitCount} visits</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <Input
                        placeholder="Search by diagnosis or ICD code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-gray-300 rounded px-4 py-2 bg-white font-medium text-gray-700"
                  >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Resolved</option>
                    <option>On Hold</option>
                  </select>
                </div>

                {/* History Items */}
                <div className="space-y-3">
                  {filteredDiagnoses.map(diagnosis => (
                    <div key={diagnosis.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleExpandDiagnosis(diagnosis.id)}
                      >
                        <button className="flex items-center gap-3 font-semibold text-gray-900 flex-1 text-left">
                          {expandedDiagnosis.has(diagnosis.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          )}
                          <span>{diagnosis.diagnosisName}</span>
                        </button>
                        <span className="text-sm text-blue-600 font-semibold ml-4 flex-shrink-0">{diagnosis.icdCode}</span>
                      </div>

                      {/* Expanded Content */}
                      {expandedDiagnosis.has(diagnosis.id) && (
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">VISIT HISTORY</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-300 bg-gray-50">
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Date</th>
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Doctor</th>
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Status</th>
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Origin</th>
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Treatment Plan</th>
                                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Clinical Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {diagnosis.history.map((entry) => (
                                  <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-900">{entry.date}</td>
                                    <td className="px-4 py-3 text-gray-900">{entry.doctor}</td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                        entry.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        entry.status === 'Resolved' ? 'bg-gray-100 text-gray-700' :
                                        'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {entry.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                        {entry.origin}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900">{entry.treatmentPlan}</td>
                                    <td className="px-4 py-3 text-gray-700 max-w-md">{entry.notes}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
