import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { GynecologicalVisit, Prescription } from '@/types/gynecology'

interface GynecologyVisitModalProps {
  visit: GynecologicalVisit | null
  onClose: () => void
  onSave: (visit: GynecologicalVisit) => void
}

export function GynecologyVisitModal({ visit, onClose, onSave }: GynecologyVisitModalProps) {
  const [activeTab, setActiveTab] = useState<'visit' | 'screening' | 'menstrual' | 'investigations' | 'diagnosis-review' | 'follow-up'>('visit')
  const [formData, setFormData] = useState<GynecologicalVisit>(
    visit || {
      id: Date.now().toString(),
      visitNo: 0,
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      seenBy: '',
      branch: 'Online',
      consultationMode: 'Online',
      visitCategory: 'Normal',
      presentingComplaints: '',
      doctorPrivateNotes: '',
      cervicalCancerScreening: {
        screeningDone: false,
        type: 'HPV',
        lastTestDate: '',
        result: '',
      },
      menstrualDetails: {
        menstrualStatus: 'Reproductive',
        lmp: '',
        para: '0',
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
        micturition: '',
        micturitionComments: '',
        bowels: '',
        bowelsComments: '',
        recentWeightChange: '',
        weightChangeComments: '',
      },
      investigations: {
        labTests: '',
        scansImaging: '',
        remarks: '',
      },
      prescriptions: [],
      diagnosis: {
        currentDiagnosis: '',
        origin: 'Clinical',
        treatment: '',
        advice: '',
      },
      review: {
        overallAssessment: '',
        improvementNotes: '',
        recommendations: '',
        action: 'Active',
      },
      history: [],
      followUp: {
        followUpOption: 'none',
        numberOfDays: '',
        followUpDate: '',
        nextFollowUpMode: 'online',
        instructionsForNextVisit: '',
      },
      createdAt: new Date().toISOString(),
    }
  )

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [editingPrescriptionIndex, setEditingPrescriptionIndex] = useState<number | null>(null)
  const [currentPrescription, setCurrentPrescription] = useState<Prescription>({
    medicineName: '',
    dose: '',
    timing: 'After meals',
    frequency: '1-0-1',
    duration: '',
    durationUnit: 'Days',
    instructions: '',
  })

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedChange = (section: string, field: string, value: any) => {
    const nestedObj = formData[section as keyof GynecologicalVisit] as any
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...nestedObj,
        [field]: value
      }
    }))
  }

  const handleAddPrescription = () => {
    if (currentPrescription.medicineName && currentPrescription.dose && currentPrescription.duration) {
      if (editingPrescriptionIndex !== null) {
        const newPrescriptions = [...formData.prescriptions]
        newPrescriptions[editingPrescriptionIndex] = currentPrescription
        setFormData(prev => ({
          ...prev,
          prescriptions: newPrescriptions
        }))
        setEditingPrescriptionIndex(null)
      } else {
        setFormData(prev => ({
          ...prev,
          prescriptions: [...prev.prescriptions, currentPrescription]
        }))
      }
      setCurrentPrescription({
        medicineName: '',
        dose: '',
        timing: 'After meals',
        frequency: '1-0-1',
        duration: '',
        durationUnit: 'Days',
        instructions: '',
      })
      setShowPrescriptionModal(false)
    }
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {visit ? `Edit Visit #${visit.visitNo}` : 'Add New Visit'}
          </DialogTitle>
          <div className="flex gap-2 mt-4 border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('visit')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'visit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Visit Details
            </button>
            <button
              onClick={() => setActiveTab('screening')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'screening' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Screening
            </button>
            <button
              onClick={() => setActiveTab('menstrual')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'menstrual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Menstrual
            </button>
            <button
              onClick={() => setActiveTab('investigations')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'investigations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Investigations
            </button>
            <button
              onClick={() => setActiveTab('diagnosis-review')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'diagnosis-review' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Diagnosis & Review
            </button>
            <button
              onClick={() => setActiveTab('follow-up')}
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'follow-up' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Follow-up
            </button>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Visit Details Tab */}
          {activeTab === 'visit' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Visit Date</label>
                  <Input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => handleFormChange('visitDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Visit Time</label>
                  <Input
                    type="time"
                    value={formData.visitTime}
                    onChange={(e) => handleFormChange('visitTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Seen By</label>
                  <Input
                    placeholder="Doctor name"
                    value={formData.seenBy}
                    onChange={(e) => handleFormChange('seenBy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Branch</label>
                  <Select value={formData.branch} onChange={(e) => handleFormChange('branch', e.target.value)}>
                    <option>Online</option>
                    <option>Offline</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Consultation Mode</label>
                  <Select value={formData.consultationMode} onChange={(e) => handleFormChange('consultationMode', e.target.value)}>
                    <option>Online</option>
                    <option>In-person</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Visit Category</label>
                  <Select value={formData.visitCategory} onChange={(e) => handleFormChange('visitCategory', e.target.value)}>
                    <option>Normal</option>
                    <option>Follow-up</option>
                    <option>Emergency</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Presenting Complaints</label>
                <Textarea
                  placeholder="Enter presenting complaints"
                  value={formData.presentingComplaints}
                  onChange={(e) => handleFormChange('presentingComplaints', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Doctor Private Notes</label>
                <Textarea
                  placeholder="Enter private notes (not visible to patient)"
                  value={formData.doctorPrivateNotes}
                  onChange={(e) => handleFormChange('doctorPrivateNotes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Cervical Cancer Screening Tab */}
          {activeTab === 'screening' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Screening Done</label>
                  <Select
                    value={formData.cervicalCancerScreening.screeningDone ? 'yes' : 'no'}
                    onChange={(e) => handleNestedChange('cervicalCancerScreening', 'screeningDone', e.target.value === 'yes')}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <Select
                    value={formData.cervicalCancerScreening.type}
                    onChange={(e) => handleNestedChange('cervicalCancerScreening', 'type', e.target.value)}
                  >
                    <option>HPV</option>
                    <option>Pap Smear</option>
                    <option>Liquid Based Cytology</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Test Date</label>
                  <Input
                    type="date"
                    value={formData.cervicalCancerScreening.lastTestDate}
                    onChange={(e) => handleNestedChange('cervicalCancerScreening', 'lastTestDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Result</label>
                  <Select
                    value={formData.cervicalCancerScreening.result}
                    onChange={(e) => handleNestedChange('cervicalCancerScreening', 'result', e.target.value)}
                  >
                    <option>Select result...</option>
                    <option>Negative</option>
                    <option>Positive</option>
                    <option>Inconclusive</option>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Menstrual Details Tab */}
          {activeTab === 'menstrual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Menstrual Status</label>
                  <Select
                    value={formData.menstrualDetails.menstrualStatus}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'menstrualStatus', e.target.value)}
                  >
                    <option>Reproductive</option>
                    <option>Premenopausal</option>
                    <option>Menopausal</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">LMP (Last Menstrual Period)</label>
                  <Input
                    type="date"
                    value={formData.menstrualDetails.lmp}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'lmp', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Para</label>
                  <Input
                    type="number"
                    value={formData.menstrualDetails.para}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'para', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cycle Length (days)</label>
                  <Input
                    type="number"
                    value={formData.menstrualDetails.cycleLength}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'cycleLength', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Bleeding Duration (days)</label>
                  <Input
                    type="number"
                    value={formData.menstrualDetails.bleedingDuration}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'bleedingDuration', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Menstrual Pattern</label>
                  <Select
                    value={formData.menstrualDetails.menstrualPattern}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'menstrualPattern', e.target.value)}
                  >
                    <option>Regular</option>
                    <option>Irregular</option>
                    <option>Heavy</option>
                    <option>Light</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Flow</label>
                  <Select
                    value={formData.menstrualDetails.flow}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'flow', e.target.value)}
                  >
                    <option>Light</option>
                    <option>Moderate</option>
                    <option>Heavy</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.menstrualDetails.painWithPeriods}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'painWithPeriods', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Pain With Periods</span>
                </label>
                {formData.menstrualDetails.painWithPeriods && (
                  <Input
                    placeholder="Duration of pain"
                    value={formData.menstrualDetails.durationOfPain}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'durationOfPain', e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.menstrualDetails.interMenstrualSpotting}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'interMenstrualSpotting', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Inter-menstrual Spotting</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.menstrualDetails.postCoitalBleeding}
                    onChange={(e) => handleNestedChange('menstrualDetails', 'postCoitalBleeding', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Post Coital Bleeding</span>
                </label>
              </div>
            </div>
          )}

          {/* Investigations Tab */}
          {activeTab === 'investigations' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Lab Test/s</label>
                <Textarea
                  placeholder="Enter lab tests (e.g., CBC, Thyroid Profile)"
                  value={formData.investigations.labTests}
                  onChange={(e) => handleNestedChange('investigations', 'labTests', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Scans/Imaging</label>
                <Textarea
                  placeholder="Enter scans/imaging (e.g., Abdominal Ultrasound)"
                  value={formData.investigations.scansImaging}
                  onChange={(e) => handleNestedChange('investigations', 'scansImaging', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Remarks</label>
                <Textarea
                  placeholder="Enter remarks"
                  value={formData.investigations.remarks}
                  onChange={(e) => handleNestedChange('investigations', 'remarks', e.target.value)}
                  rows={2}
                />
              </div>

              {/* Prescriptions */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Prescriptions</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPrescriptionIndex(null)
                      setCurrentPrescription({
                        medicineName: '',
                        dose: '',
                        timing: 'After meals',
                        frequency: '1-0-1',
                        duration: '',
                        durationUnit: 'Days',
                        instructions: '',
                      })
                      setShowPrescriptionModal(true)
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Medicine
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.prescriptions.map((rx, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{rx.medicineName}</p>
                        <p className="text-gray-600">{rx.dose} × {rx.frequency}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentPrescription(rx)
                            setEditingPrescriptionIndex(idx)
                            setShowPrescriptionModal(true)
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              prescriptions: prev.prescriptions.filter((_, i) => i !== idx)
                            }))
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Tab */}
          {activeTab === 'follow-up' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Follow-up Option</label>
                <div className="flex gap-4 mt-2">
                  {['none', 'days', 'weeks', 'specific'].map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="followup"
                        value={option}
                        checked={formData.followUp.followUpOption === option}
                        onChange={(e) => handleNestedChange('followUp', 'followUpOption', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{option === 'none' ? 'No Follow-up' : option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.followUp.followUpOption === 'days' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Number of Days</label>
                  <Input
                    type="number"
                    placeholder="Enter days"
                    value={formData.followUp.numberOfDays}
                    onChange={(e) => handleNestedChange('followUp', 'numberOfDays', e.target.value)}
                  />
                </div>
              )}

              {formData.followUp.followUpOption === 'specific' && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Specific Date</label>
                  <Input
                    type="date"
                    value={formData.followUp.followUpDate}
                    onChange={(e) => handleNestedChange('followUp', 'followUpDate', e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Next Follow-up Mode</label>
                <Select
                  value={formData.followUp.nextFollowUpMode}
                  onChange={(e) => handleNestedChange('followUp', 'nextFollowUpMode', e.target.value)}
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Instructions for Next Visit</label>
                <Textarea
                  placeholder="Enter instructions"
                  value={formData.followUp.instructionsForNextVisit}
                  onChange={(e) => handleNestedChange('followUp', 'instructionsForNextVisit', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Diagnosis & Review Tab */}
          {activeTab === 'diagnosis-review' && (
            <div className="space-y-6">
              {/* Diagnosis Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Diagnosis</label>
                    <Textarea
                      placeholder="Enter current diagnosis"
                      value={formData.diagnosis.currentDiagnosis}
                      onChange={(e) => handleNestedChange('diagnosis', 'currentDiagnosis', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Origin</label>
                    <Select
                      value={formData.diagnosis.origin}
                      onChange={(e) => handleNestedChange('diagnosis', 'origin', e.target.value as 'Clinical' | 'Confirmed')}
                    >
                      <option>Clinical</option>
                      <option>Confirmed</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Treatment Plan</label>
                    <Textarea
                      placeholder="Enter treatment plan"
                      value={formData.diagnosis.treatment}
                      onChange={(e) => handleNestedChange('diagnosis', 'treatment', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Advice</label>
                    <Textarea
                      placeholder="Enter advice for patient"
                      value={formData.diagnosis.advice}
                      onChange={(e) => handleNestedChange('diagnosis', 'advice', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Review Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Overall Assessment</label>
                    <Textarea
                      placeholder="Enter overall assessment of patient's condition"
                      value={formData.review.overallAssessment}
                      onChange={(e) => handleNestedChange('review', 'overallAssessment', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Improvement Notes</label>
                    <Textarea
                      placeholder="Enter notes on patient's improvement or progress"
                      value={formData.review.improvementNotes}
                      onChange={(e) => handleNestedChange('review', 'improvementNotes', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Recommendations</label>
                    <Textarea
                      placeholder="Enter recommendations for continued care"
                      value={formData.review.recommendations}
                      onChange={(e) => handleNestedChange('review', 'recommendations', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Action</label>
                    <Select
                      value={formData.review.action}
                      onChange={(e) => {
                        handleNestedChange('review', 'action', e.target.value as 'Active' | 'Resolved' | 'Ruled Out')
                        // Auto-add to history when Resolved or Ruled Out is selected
                        if ((e.target.value === 'Resolved' || e.target.value === 'Ruled Out') && formData.visitDate) {
                          setFormData(prev => ({
                            ...prev,
                            history: [
                              ...prev.history,
                              {
                                date: formData.visitDate,
                                visitType: formData.visitCategory,
                                doctorName: formData.seenBy,
                                notes: `${e.target.value}: ${formData.diagnosis.currentDiagnosis}`,
                              }
                            ]
                          }))
                        }
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Ruled Out">Ruled Out</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">History</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (formData.history && formData.visitDate) {
                        const newHistory = [
                          ...formData.history,
                          {
                            date: formData.visitDate,
                            visitType: formData.visitCategory,
                            doctorName: formData.seenBy,
                            notes: formData.presentingComplaints,
                          }
                        ]
                        setFormData(prev => ({
                          ...prev,
                          history: newHistory
                        }))
                      }
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add to History
                  </Button>
                </div>

                {formData.history && formData.history.length > 0 ? (
                  <div className="space-y-2">
                    {formData.history.map((record, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Date</p>
                            <p className="text-gray-900">{record.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Visit Type</p>
                            <p className="text-gray-900">{record.visitType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Doctor</p>
                            <p className="text-gray-900">{record.doctorName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Notes</p>
                            <p className="text-gray-900">{record.notes}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              history: prev.history.filter((_, i) => i !== idx)
                            }))
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No history records yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {visit ? 'Update Visit' : 'Save Visit'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <PrescriptionModal
          prescription={currentPrescription}
          onClose={() => setShowPrescriptionModal(false)}
          onSave={(rx) => {
            setCurrentPrescription(rx)
            handleAddPrescription()
          }}
          onChange={setCurrentPrescription}
        />
      )}
    </Dialog>
  )
}

interface PrescriptionModalProps {
  prescription: Prescription
  onClose: () => void
  onSave: (prescription: Prescription) => void
  onChange: (prescription: Prescription) => void
}

function PrescriptionModal({ prescription, onClose, onSave, onChange }: PrescriptionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Medicine Name *</label>
            <Input
              placeholder="e.g. Paracetamol"
              value={prescription.medicineName}
              onChange={(e) => onChange({ ...prescription, medicineName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Dose</label>
              <Input
                placeholder="e.g. 500mg or 2 tbsp"
                value={prescription.dose}
                onChange={(e) => onChange({ ...prescription, dose: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Timing</label>
              <Select
                value={prescription.timing}
                onChange={(e) => onChange({ ...prescription, timing: e.target.value })}
              >
                <option>Select timing</option>
                <option>Before meals</option>
                <option>After meals</option>
                <option>With meals</option>
                <option>Bedtime</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Frequency</label>
              <Input
                placeholder="e.g. 1-0-1 or 1-0-0"
                value={prescription.frequency}
                onChange={(e) => onChange({ ...prescription, frequency: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={prescription.duration}
                  onChange={(e) => onChange({ ...prescription, duration: e.target.value })}
                  className="flex-1"
                />
                <Select
                  value={prescription.durationUnit}
                  onChange={(e) => onChange({ ...prescription, durationUnit: e.target.value })}
                  className="w-24"
                >
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Instructions</label>
            <Textarea
              placeholder="e.g. Take with warm water..."
              value={prescription.instructions}
              onChange={(e) => onChange({ ...prescription, instructions: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(prescription)} className="bg-blue-600">
            Save Medicine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
