import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ObstetricProfile, ObstetricStatus, ObstetricValidations } from '@/types/obstetric'
import { AlertCircle, X } from 'lucide-react'

interface ObstetricHistorySidebarProps {
  profile: ObstetricProfile | null
  isOpen: boolean
  onClose: () => void
  onSave: (profile: ObstetricProfile) => void
}

export function ObstetricHistorySidebar({
  profile,
  isOpen,
  onClose,
  onSave,
}: ObstetricHistorySidebarProps) {
  const [formData, setFormData] = useState<ObstetricProfile>(
    profile || {
      id: Date.now().toString(),
      patientId: 'P001',
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

  // Update formData when profile changes
  useEffect(() => {
    if (profile) {
      setFormData(profile)
    } else {
      setFormData({
        id: Date.now().toString(),
        patientId: 'P001',
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
      })
    }
    setErrors({})
  }, [profile, isOpen])

  // Calculate current GA based on LMP
  useEffect(() => {
    if (formData.status === 'Pregnant' && formData.pregnancyDetails?.lmp) {
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

      // Scan EDD validation
      if (formData.pregnancyDetails?.scanEdd) {
        newErrors.scanEdd = 'Please confirm Scan EDD with OBGYN for accuracy'
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
      if (!formData.postPregnancyDetails?.dateOfEvent) {
        newErrors.deliveryDate = 'Delivery date is required'
      }
    } else if (formData.status === 'Post-termination') {
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

      if (formData.status === 'Pregnant' && formData.pregnancyDetails && currentGa !== null) {
        updatedProfile.pregnancyDetails = {
          ...updatedProfile.pregnancyDetails,
          currentGa,
        }
      }

      onSave(updatedProfile)
      onClose()
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
    <>
      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {profile ? 'Edit Profile' : 'New Profile'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-1"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Status <span className="text-red-600">*</span>
            </label>
            <div className="space-y-2">
              {(['Pregnant', 'Mother', 'Post-termination'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full p-2 rounded-lg border-2 transition-all text-left ${
                    formData.status === status
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{status}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {renderWarnings().length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
              {renderWarnings().map((warning, idx) => (
                <div key={idx} className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-yellow-800">{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field} className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-red-800">{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pregnant Form */}
          {formData.status === 'Pregnant' && (
            <div className="space-y-3 border rounded-lg p-3 bg-blue-50">
              <h3 className="text-sm font-semibold text-gray-900">Pregnancy Details</h3>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  LMP <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.lmp || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'lmp', e.target.value)}
                  className={`text-sm ${errors.lmp ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Current GA (Weeks)
                </label>
                <Input
                  type="number"
                  disabled
                  value={currentGa !== null ? currentGa : ''}
                  className="bg-gray-100 text-sm"
                />
                <p className="text-xs text-gray-500 mt-0.5">Auto-calculated</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Expected Delivery Date (EDD)
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.edd || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'edd', e.target.value)}
                  className={`text-sm ${errors.edd ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Scan EDD
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.scanEdd || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'scanEdd', e.target.value)}
                  className={`text-sm ${errors.scanEdd ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Mode of Conception
                </label>
                <Select
                  value={formData.pregnancyDetails?.modeOfConception || 'Natural'}
                  onChange={e =>
                    handleNestedChange('pregnancyDetails', 'modeOfConception', e.target.value)
                  }
                  className="text-sm"
                >
                  <option value="Natural">Natural</option>
                  <option value="IVF">IVF</option>
                  <option value="IUI">IUI</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Gravida
                </label>
                <Input
                  type="number"
                  value={formData.gravida || 0}
                  onChange={e => handleInputChange('gravida', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Para
                </label>
                <Input
                  type="number"
                  value={formData.para || 0}
                  onChange={e => handleInputChange('para', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* Mother Form */}
          {formData.status === 'Mother' && (
            <div className="space-y-3 border rounded-lg p-3 bg-green-50">
              <h3 className="text-sm font-semibold text-gray-900">Delivery Details</h3>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Delivery Date <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.postPregnancyDetails?.dateOfEvent || ''}
                  onChange={e =>
                    handleNestedChange('postPregnancyDetails', 'dateOfEvent', e.target.value)
                  }
                  className={`text-sm ${errors.deliveryDate ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Para
                </label>
                <Input
                  type="number"
                  value={formData.para || 0}
                  onChange={e => handleInputChange('para', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Live Children
                </label>
                <Input
                  type="number"
                  value={formData.live || 0}
                  onChange={e => handleInputChange('live', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* Post-termination Form */}
          {formData.status === 'Post-termination' && (
            <div className="space-y-3 border rounded-lg p-3 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Termination / Miscarriage</h3>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Type of Event <span className="text-red-600">*</span>
                </label>
                <Select
                  value={formData.outcome || 'Termination'}
                  onChange={e => handleInputChange('outcome', e.target.value as any)}
                  className="text-sm"
                >
                  <option value="Termination">Termination</option>
                  <option value="Miscarriage">Miscarriage</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  Date of Event <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.postPregnancyDetails?.dateOfEvent || ''}
                  onChange={e =>
                    handleNestedChange('postPregnancyDetails', 'dateOfEvent', e.target.value)
                  }
                  className={`text-sm ${errors.dateOfEvent ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">
                  GA at {formData.outcome} (Weeks)
                </label>
                <Input
                  type="number"
                  value={formData.pregnancyDetails?.ga || 0}
                  onChange={e =>
                    handleNestedChange('pregnancyDetails', 'ga', parseInt(e.target.value) || 0)
                  }
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {profile ? 'Update' : 'Add'} Profile
          </Button>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
    </>
  )
}
