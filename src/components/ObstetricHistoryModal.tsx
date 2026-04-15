import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ObstetricProfile, ObstetricStatus, ObstetricValidations } from '@/types/obstetric'
import { AlertCircle } from 'lucide-react'

interface ObstetricHistoryModalProps {
  profile: ObstetricProfile | null
  onClose: () => void
  onSave: (profile: ObstetricProfile) => void
}

export function ObstetricHistoryModal({ profile, onClose, onSave }: ObstetricHistoryModalProps) {
  const [formData, setFormData] = useState<ObstetricProfile>(
    profile || {
      id: Date.now().toString(),
      patientId: 'P001', // TODO: Get from patient context
      status: 'Pregnant',
      pregnancyDetails: {
        lmp: '',
        edd: '',
        scanEdd: '',
        ga: 0,
        gaRecordedAt: new Date().toISOString().split('T')[0],
        modeOfConception: 'Natural',
      },
      postPregnancyDetails: {
        dateOfEvent: '',
      },
      gravida: 0,
      para: 0,
      live: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dateWhenUpdated: new Date().toISOString().split('T')[0],
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentGa, setCurrentGa] = useState<number | null>(null)

  // Calculate current GA based on LMP
  useEffect(() => {
    if (
      formData.status === 'Pregnant' &&
      formData.pregnancyDetails?.lmp
    ) {
      const lmpDate = new Date(formData.pregnancyDetails.lmp)
      const today = new Date()
      const weeksElapsed = Math.floor(
        (today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
      setCurrentGa(weeksElapsed)
    } else {
      setCurrentGa(null)
    }
  }, [formData.pregnancyDetails?.lmp, formData.status])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.status === 'Pregnant') {
      // LMP validation
      if (!formData.pregnancyDetails?.lmp) {
        newErrors.lmp = 'LMP is required'
      } else {
        const lmpDate = new Date(formData.pregnancyDetails.lmp)
        const weeksFromLmp = Math.floor(
          (new Date().getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
        )
        if (weeksFromLmp > ObstetricValidations.LMP_MAX_WEEKS) {
          newErrors.lmp = `LMP cannot be more than ${ObstetricValidations.LMP_MAX_WEEKS} weeks ago`
        }
        if (weeksFromLmp < ObstetricValidations.GA_MIN_WEEKS) {
          newErrors.lmp = `Minimum ${ObstetricValidations.GA_MIN_WEEKS} weeks gestation required`
        }
      }

      // EDD validation
      if (formData.pregnancyDetails?.edd && formData.pregnancyDetails?.lmp) {
        const lmpDate = new Date(formData.pregnancyDetails.lmp)
        const eddDate = new Date(formData.pregnancyDetails.edd)
        const expectedEdd = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
        const daysDifference = Math.abs(
          (eddDate.getTime() - expectedEdd.getTime()) / (24 * 60 * 60 * 1000)
        )
        if (daysDifference > 7) {
          newErrors.edd =
            'EDD should be approximately 280 days from LMP. Please confirm with OBGYN.'
        }
      }

      // Scan EDD validation (similar to EDD)
      if (formData.pregnancyDetails?.scanEdd) {
        newErrors.scanEdd =
          'Please confirm Scan EDD with OBGYN for accuracy'
      }

      // GA validation
      if (currentGa !== null) {
        if (currentGa < ObstetricValidations.GA_MIN_WEEKS) {
          newErrors.ga = `GA must be at least ${ObstetricValidations.GA_MIN_WEEKS} weeks`
        }
        if (currentGa > ObstetricValidations.GA_MAX_WEEKS) {
          newErrors.ga = `GA cannot exceed ${ObstetricValidations.GA_MAX_WEEKS} weeks`
        }
      }
    } else if (formData.status === 'Mother') {
      // Delivery validation
      if (!formData.postPregnancyDetails?.dateOfEvent) {
        newErrors.deliveryDate = 'Delivery date is required'
      }
    } else if (formData.status === 'Post-termination') {
      // Termination/Miscarriage validation
      if (!formData.postPregnancyDetails?.dateOfEvent) {
        newErrors.dateOfEvent = 'Date is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStatusChange = (status: ObstetricStatus) => {
    setFormData(prev => ({
      ...prev,
      status,
      pregnancyDetails:
        status === 'Pregnant'
          ? {
              lmp: '',
              edd: '',
              scanEdd: '',
              ga: 0,
              gaRecordedAt: new Date().toISOString().split('T')[0],
              modeOfConception: 'Natural',
            }
          : undefined,
      postPregnancyDetails:
        status !== 'Pregnant'
          ? {
              dateOfEvent: '',
            }
          : undefined,
    }))
    setErrors({})
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ObstetricProfile] as any),
        [field]: value,
      },
    }))
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      const updatedProfile: ObstetricProfile = {
        ...formData,
        updatedAt: new Date().toISOString(),
        dateWhenUpdated: new Date().toISOString().split('T')[0],
      }

      // Update current GA if pregnant
      if (
        formData.status === 'Pregnant' &&
        formData.pregnancyDetails &&
        currentGa !== null
      ) {
        updatedProfile.pregnancyDetails = {
          ...updatedProfile.pregnancyDetails,
          currentGa,
        }
      }

      onSave(updatedProfile)
    }
  }

  const renderWarnings = () => {
    const warnings = []

    if (formData.status === 'Pregnant' && formData.pregnancyDetails?.edd) {
      warnings.push('Please confirm EDD with OBGYN for accuracy')
    }
    if (formData.status === 'Pregnant' && formData.pregnancyDetails?.scanEdd) {
      warnings.push('Please confirm Scan EDD with OBGYN')
    }

    return warnings
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? 'Edit Obstetric Profile' : 'Add New Obstetric Profile'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Status <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['Pregnant', 'Mother', 'Post-termination'] as const).map(
                status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      formData.status === status
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{status}</div>
                  </button>
                )
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select whether the patient is currently pregnant, has delivered, or had a termination/miscarriage.
            </p>
          </div>

          {/* Warnings Section */}
          {renderWarnings().length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              {renderWarnings().map((warning, idx) => (
                <div key={idx} className="flex gap-2 mb-2 last:mb-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-yellow-800">{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Validation Errors Section */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field} className="flex gap-2 mb-2 last:mb-0">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pregnant Status Form */}
          {formData.status === 'Pregnant' && (
            <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-gray-900">Pregnancy Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    LMP (Last Menstrual Period) <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.pregnancyDetails?.lmp || ''}
                    onChange={e =>
                      handleNestedChange('pregnancyDetails', 'lmp', e.target.value)
                    }
                    className={errors.lmp ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Current GA (Weeks)
                  </label>
                  <Input
                    type="number"
                    disabled
                    value={currentGa !== null ? currentGa : ''}
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated based on LMP
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Expected Delivery Date (EDD)
                  </label>
                  <Input
                    type="date"
                    value={formData.pregnancyDetails?.edd || ''}
                    onChange={e =>
                      handleNestedChange('pregnancyDetails', 'edd', e.target.value)
                    }
                    className={errors.edd ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    (~280 days from LMP)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Scan EDD
                  </label>
                  <Input
                    type="date"
                    value={formData.pregnancyDetails?.scanEdd || ''}
                    onChange={e =>
                      handleNestedChange('pregnancyDetails', 'scanEdd', e.target.value)
                    }
                    className={errors.scanEdd ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Mode of Conception
                  </label>
                  <Select
                    value={formData.pregnancyDetails?.modeOfConception || 'Natural'}
                    onChange={e =>
                      handleNestedChange('pregnancyDetails', 'modeOfConception', e.target.value)
                    }
                  >
                    <option value="Natural">Natural</option>
                    <option value="IVF">IVF</option>
                    <option value="IUI">IUI</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Gravida
                  </label>
                  <Input
                    type="number"
                    value={formData.gravida || 0}
                    onChange={e =>
                      handleInputChange('gravida', parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total number of pregnancies
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Para
                  </label>
                  <Input
                    type="number"
                    value={formData.para || 0}
                    onChange={e =>
                      handleInputChange('para', parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of deliveries after 24 weeks
                  </p>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-300 rounded p-3 text-sm text-blue-800">
                <p className="font-medium mb-2">Validation Rules (Confirmed 1st Apr 2026):</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>LMP ≤ 42 weeks</li>
                  <li>GA Range: 4-42 weeks</li>
                  <li>Delivery: 24-42 weeks (24-26 weeks considered as delivery)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Mother Status Form */}
          {formData.status === 'Mother' && (
            <div className="space-y-4 border rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-gray-900">Delivery Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Delivery Date <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.postPregnancyDetails?.dateOfEvent || ''}
                    onChange={e =>
                      handleNestedChange('postPregnancyDetails', 'dateOfEvent', e.target.value)
                    }
                    className={errors.deliveryDate ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Outcome
                  </label>
                  <Select
                    value={formData.outcome || 'Delivery'}
                    onChange={e =>
                      handleInputChange('outcome', e.target.value as any)
                    }
                  >
                    <option value="Delivery">Delivery</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Para
                  </label>
                  <Input
                    type="number"
                    value={formData.para || 0}
                    onChange={e =>
                      handleInputChange('para', parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Live Children
                  </label>
                  <Input
                    type="number"
                    value={formData.live || 0}
                    onChange={e =>
                      handleInputChange('live', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Note: Gravida, LMP, EDD, and Mode of Conception are not mandatory for post-pregnancy records.
              </p>
            </div>
          )}

          {/* Post-termination Status Form */}
          {formData.status === 'Post-termination' && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900">Termination / Miscarriage Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Type of Event <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={formData.outcome || 'Termination'}
                    onChange={e =>
                      handleInputChange('outcome', e.target.value as any)
                    }
                  >
                    <option value="Termination">Termination</option>
                    <option value="Miscarriage">Miscarriage</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Date of Event <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.postPregnancyDetails?.dateOfEvent || ''}
                    onChange={e =>
                      handleNestedChange('postPregnancyDetails', 'dateOfEvent', e.target.value)
                    }
                    className={errors.dateOfEvent ? 'border-red-500' : ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    GA at {formData.outcome} (Weeks)
                  </label>
                  <Input
                    type="number"
                    value={formData.pregnancyDetails?.ga || 0}
                    onChange={e =>
                      handleNestedChange('pregnancyDetails', 'ga', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="bg-orange-100 border border-orange-300 rounded p-3 text-sm text-orange-800">
                <p className="font-medium mb-2">Validation Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Termination / Miscarriage: 4-24 weeks</li>
                  <li>24-26 weeks: Can be classified as delivery</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Note: Gravida, LMP, EDD, and Mode of Conception are not mandatory for post-pregnancy records.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {profile ? 'Update' : 'Add'} Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
