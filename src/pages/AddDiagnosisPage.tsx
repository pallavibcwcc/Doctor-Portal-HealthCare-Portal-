import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DiagnosisRecord } from '@/types/diagnosis'
import { ChevronLeft } from 'lucide-react'

// Sample ICD codes for diagnosis selection
const icdCodes = [
  { code: 'E28.2', name: 'Polycystic ovary syndrome' },
  { code: 'D25.9', name: 'Leiomyoma of uterus, unspecified' },
  { code: 'N80.9', name: 'Endometriosis, unspecified' },
  { code: 'N92.0', name: 'Heavy menstrual bleeding' },
  { code: 'N91.2', name: 'Amenorrhea, unspecified' },
  { code: 'N95.3', name: 'States associated with artificial menopause' },
  { code: 'N89.8', name: 'Other specified noninflammatory disorders of vulva and perineum' },
  { code: 'N29', name: 'Other disorders of kidney and ureter in diseases classified elsewhere' }
]

export function AddDiagnosisPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const diagnosis = location.state?.diagnosis as DiagnosisRecord | null
  const isEditing = diagnosis !== null

  const [formData, setFormData] = useState({
    diagnosisName: diagnosis?.diagnosisName || '',
    icdCode: diagnosis?.icdCode || '',
    origin: diagnosis?.origin || 'Clinical' as 'Clinical' | 'Confirmed',
    plan: diagnosis?.plan || 'Medical' as 'Medical' | 'Conservative' | 'Surgical',
    clinicalNotes: diagnosis?.clinicalNotes || ''
  })

  const handleSave = () => {
    if (!formData.diagnosisName || !formData.icdCode) {
      alert('Please fill in all required fields')
      return
    }
    // Handle save logic here
    navigate('/diagnosis-management')
  }

  const handleCancel = () => {
    navigate('/diagnosis-management')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Diagnosis Management
            </button>

            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isEditing ? 'Edit Diagnosis' : 'New Diagnosis'}
              </h1>
              <p className="text-gray-600 text-lg">
                {isEditing ? 'Update diagnosis information' : 'Add a new diagnosis record'}
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg border border-gray-200 p-12 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-10">
                
                {/* Diagnosis Selection */}
                <div>
                  <label className="text-lg font-semibold text-gray-900 block mb-4">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.icdCode}
                    onChange={(e) => {
                      const selected = icdCodes.find(icd => icd.code === e.target.value)
                      setFormData({
                        ...formData,
                        icdCode: e.target.value,
                        diagnosisName: selected?.name || ''
                      })
                    }}
                    className="text-base"
                  >
                    <option value="">Select a diagnosis...</option>
                    {icdCodes.map(icd => (
                      <option key={icd.code} value={icd.code}>
                        {icd.name}
                      </option>
                    ))}
                  </Select>
                  {formData.icdCode && (
                    <p className="text-sm text-gray-600 mt-3">
                      <span className="font-medium">Selected:</span> {formData.diagnosisName}
                    </p>
                  )}
                </div>

                {/* ICD Code */}
                <div>
                  <label className="text-lg font-semibold text-gray-900 block mb-4">
                    ICD Code <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.icdCode}
                    onChange={(e) => {
                      const selected = icdCodes.find(icd => icd.code === e.target.value)
                      setFormData({
                        ...formData,
                        icdCode: e.target.value,
                        diagnosisName: selected?.name || formData.diagnosisName
                      })
                    }}
                    className="text-base"
                  >
                    <option value="">Select code...</option>
                    {icdCodes.map(icd => (
                      <option key={icd.code} value={icd.code}>
                        {icd.code} - {icd.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Origin */}
                <div>
                  <label className="text-lg font-semibold text-gray-900 block mb-6">
                    Origin <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-12">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="origin"
                        value="Clinical"
                        checked={formData.origin === 'Clinical'}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value as 'Clinical' | 'Confirmed' })}
                        className="w-5 h-5"
                      />
                      <span className="text-base font-medium text-gray-700">Clinical</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="origin"
                        value="Confirmed"
                        checked={formData.origin === 'Confirmed'}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value as 'Clinical' | 'Confirmed' })}
                        className="w-5 h-5"
                      />
                      <span className="text-base font-medium text-gray-700">Confirmed</span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-10"></div>

                {/* Treatment Plan */}
                <div>
                  <label className="text-lg font-semibold text-gray-900 block mb-4">
                    Treatment Plan <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value as 'Medical' | 'Conservative' | 'Surgical' })}
                    className="text-base"
                  >
                    <option value="">Select plan...</option>
                    <option value="Medical">Medical</option>
                    <option value="Conservative">Conservative</option>
                    <option value="Surgical">Surgical</option>
                  </Select>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="text-lg font-semibold text-gray-900 block mb-4">
                    Clinical Notes
                  </label>
                  <Textarea
                    placeholder="Enter clinical notes for this diagnosis..."
                    value={formData.clinicalNotes}
                    onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                    rows={8}
                    className="text-base"
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Provide detailed clinical observations and notes related to this diagnosis
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-10"></div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="px-8 py-3 text-base font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditing ? 'Update Diagnosis' : 'Save Diagnosis'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-12 p-8 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• All required fields must be completed before saving</li>
                <li>• Clinical notes should be detailed and specific to the patient's condition</li>
                <li>• Changes made will be recorded with timestamp and doctor name</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
