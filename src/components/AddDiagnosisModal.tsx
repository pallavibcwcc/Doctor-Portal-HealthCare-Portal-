import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DiagnosisRecord } from '@/types/diagnosis'
import { X, Plus } from 'lucide-react'

interface AddDiagnosisModalProps {
  diagnosis: DiagnosisRecord | null
  onClose: () => void
  onSave: (diagnosis: any) => void
}

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

export function AddDiagnosisModal({ diagnosis, onClose, onSave }: AddDiagnosisModalProps) {
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
    onSave(formData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Diagnosis</DialogTitle>
          </DialogHeader>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 py-4 max-h-[60vh] overflow-y-auto">
          {/* Diagnosis Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
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
            >
              <option value="">Select...</option>
              {icdCodes.map(icd => (
                <option key={icd.code} value={icd.code}>
                  {icd.name}
                </option>
              ))}
            </Select>
          </div>

          {/* ICD Code */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
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
            >
              <option value="">Select...</option>
              {icdCodes.map(icd => (
                <option key={icd.code} value={icd.code}>
                  {icd.code} - {icd.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Origin */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              Origin <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="origin"
                  value="Clinical"
                  checked={formData.origin === 'Clinical'}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value as 'Clinical' | 'Confirmed' })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Clinical</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="origin"
                  value="Confirmed"
                  checked={formData.origin === 'Confirmed'}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value as 'Clinical' | 'Confirmed' })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Confirmed</span>
              </label>
            </div>
          </div>

          {/* Treatment Plan */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              Treatment Plan <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value as 'Medical' | 'Conservative' | 'Surgical' })}
            >
              <option value="">Select...</option>
              <option value="Medical">Medical</option>
              <option value="Conservative">Conservative</option>
              <option value="Surgical">Surgical</option>
            </Select>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              Clinical Notes
            </label>
            <Textarea
              placeholder="Clinical notes for this diagnosis..."
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
