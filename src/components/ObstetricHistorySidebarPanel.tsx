import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ObstetricProfile, ObstetricStatus, ObstetricValidations, calculateObsSummaryTotal } from '@/types/obstetric'
import { AlertCircle, X } from 'lucide-react'

interface ObstetricHistorySidebarPanelProps {
  profile: ObstetricProfile | null
  isOpen: boolean
  onClose: () => void
  onSave: (profile: ObstetricProfile) => void
}

export function ObstetricHistorySidebarPanel({
  profile,
  isOpen,
  onClose,
  onSave,
}: ObstetricHistorySidebarPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'pregnancy' | 'postpregnancy' | 'obsSummary' | 'notes'>('basic')
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
        numberOfFoetus: 1,
      },
      postPregnancyDetails: {
        dateOfEvent: '',
      },
      obsSummary: {
        gravida: 0,
        para: 0,
        ectopic: 0,
        miscarriage: 0,
        abortions: 0,
        livingChildren: 0,
        numberOfFoetus: 1,
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

  useEffect(() => {
    if (profile) {
      setFormData(profile)
      setActiveTab('basic')
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
          numberOfFoetus: 1,
        },
        postPregnancyDetails: {
          dateOfEvent: '',
        },
        obsSummary: {
          gravida: 0,
          para: 0,
          ectopic: 0,
          miscarriage: 0,
          abortions: 0,
          livingChildren: 0,
          numberOfFoetus: 1,
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

      if (formData.pregnancyDetails?.edd && formData.pregnancyDetails?.lmp) {
        const lmpDate = new Date(formData.pregnancyDetails.lmp)
        const eddDate = new Date(formData.pregnancyDetails.edd)
        const expectedEdd = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000)
        const daysDifference = Math.abs(
          (eddDate.getTime() - expectedEdd.getTime()) / (24 * 60 * 60 * 1000)
        )
        if (daysDifference > 7) {
          newErrors.edd = 'EDD should be approximately 280 days from LMP. Please confirm with OBGYN.'
        }
      }

      if (formData.pregnancyDetails?.scanEdd) {
        newErrors.scanEdd = 'Please confirm Scan EDD with OBGYN for accuracy'
      }

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

    // Obs Summary Validations
    if (formData.obsSummary) {
      const total = calculateObsSummaryTotal(formData.obsSummary)
      
      // Do NOT allow save if > 20
      if (total > ObstetricValidations.GRAVIDA_MAX_THRESHOLD) {
        newErrors.gravida = `Gravida total (${total}) exceeds maximum of ${ObstetricValidations.GRAVIDA_MAX_THRESHOLD}. Please verify the data.`
      }

      // Baby birth weight risk flag
      if (formData.obsSummary.babyBirthWeight) {
        if (
          formData.obsSummary.babyBirthWeight >= ObstetricValidations.BABY_WEIGHT_HIGH ||
          formData.obsSummary.babyBirthWeight < ObstetricValidations.BABY_WEIGHT_LOW
        ) {
          formData.obsSummary.birthWeightRiskFlag = true
        }
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
      {/* Sidebar Panel */}
      <aside
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden z-50 w-[600px] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile ? `Edit Profile #${profile.id}` : 'Add New Profile'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-1"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 overflow-x-auto">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Info
            </button>
            {formData.status === 'Pregnant' && (
              <button
                onClick={() => setActiveTab('pregnancy')}
                className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'pregnancy'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Pregnancy
              </button>
            )}
            {formData.status !== 'Pregnant' && (
              <button
                onClick={() => setActiveTab('postpregnancy')}
                className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'postpregnancy'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Details
              </button>
            )}
            <button
              onClick={() => setActiveTab('obsSummary')}
              className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'obsSummary'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Obs Summary
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Notes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Warnings */}
          {renderWarnings().length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
              {renderWarnings().map((warning, idx) => (
                <div key={idx} className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-yellow-800">{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field} className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              ))}
            </div>
          )}

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Current Status <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Pregnant', 'Mother', 'Post-termination'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        formData.status === status
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">{status}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Patient ID
                </label>
                <Input
                  type="text"
                  value={formData.patientId}
                  onChange={e => handleInputChange('patientId', e.target.value)}
                />
              </div> */}
            </div>
          )}

          {/* Pregnancy Tab */}
          {activeTab === 'pregnancy' && formData.status === 'Pregnant' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  LMP (Last Menstrual Period) <span className="text-red-600">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.lmp || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'lmp', e.target.value)}
                  className={errors.lmp ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Current GA (Weeks)
                </label>
                <Input
                  type="number"
                  disabled
                  value={currentGa !== null ? currentGa : ''}
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated based on LMP</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Expected Delivery Date (EDD)
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.edd || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'edd', e.target.value)}
                  className={errors.edd ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Scan EDD
                </label>
                <Input
                  type="date"
                  value={formData.pregnancyDetails?.scanEdd || ''}
                  onChange={e => handleNestedChange('pregnancyDetails', 'scanEdd', e.target.value)}
                  className={errors.scanEdd ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Gravida</label>
                  <Input
                    type="number"
                    value={formData.gravida || 0}
                    onChange={e => handleInputChange('gravida', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Para</label>
                  <Input
                    type="number"
                    value={formData.para || 0}
                    onChange={e => handleInputChange('para', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-300 rounded p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">Validation Rules (1st Apr 2026):</p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>LMP ≤ 42 weeks</li>
                  <li>GA Range: 4-42 weeks</li>
                  <li>Delivery: 24-42 weeks (24-26 weeks considered as delivery)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Post-Pregnancy Tab */}
          {activeTab === 'postpregnancy' && formData.status !== 'Pregnant' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Event Type <span className="text-red-600">*</span>
                </label>
                <Select
                  value={formData.outcome || 'Delivery'}
                  onChange={e => handleInputChange('outcome', e.target.value as any)}
                >
                  {formData.status === 'Mother' && (
                    <option value="Delivery">Delivery</option>
                  )}
                  {formData.status === 'Post-termination' && (
                    <>
                      <option value="Termination">Termination</option>
                      <option value="Miscarriage">Miscarriage</option>
                    </>
                  )}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Para</label>
                  <Input
                    type="number"
                    value={formData.para || 0}
                    onChange={e => handleInputChange('para', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Live Children
                  </label>
                  <Input
                    type="number"
                    value={formData.live || 0}
                    onChange={e => handleInputChange('live', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Obs Summary Tab */}
          {activeTab === 'obsSummary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {formData.status === 'Pregnant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Gravida <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.obsSummary?.gravida || 0}
                      onChange={e =>
                        handleNestedChange('obsSummary', 'gravida', parseInt(e.target.value) || 0)
                      }
                      className={errors.gravida ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500 mt-1">Only if currently pregnant</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Para
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.obsSummary?.para || 0}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'para', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Ectopic
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.obsSummary?.ectopic || 0}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'ectopic', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Miscarriage
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.obsSummary?.miscarriage || 0}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'miscarriage', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Abortions
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.obsSummary?.abortions || 0}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'abortions', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Living Children
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.obsSummary?.livingChildren || 0}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'livingChildren', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Number of Foetus
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.obsSummary?.numberOfFoetus || 1}
                  onChange={e =>
                    handleNestedChange('obsSummary', 'numberOfFoetus', parseInt(e.target.value) || 1)
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Default = 1</p>
              </div>

              {formData.outcome === 'Termination' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Termination Mode <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={formData.obsSummary?.deliveryTerminationMode || 'Medical Termination'}
                    onChange={e =>
                      handleNestedChange('obsSummary', 'deliveryTerminationMode', e.target.value)
                    }
                  >
                    <option value="Medical Termination">Medical Termination</option>
                    <option value="Surgical Termination">Surgical Termination</option>
                  </Select>
                </div>
              )}

              {formData.outcome === 'Delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Delivery Mode
                    </label>
                    <Select
                      value={formData.obsSummary?.deliveryTerminationMode || 'Delivery Mode'}
                      onChange={e =>
                        handleNestedChange('obsSummary', 'deliveryTerminationMode', e.target.value)
                      }
                    >
                      <option value="Delivery Mode">Normal Vaginal Delivery</option>
                      <option value="Caesarean Section">Caesarean Section</option>
                      <option value="Instrumental Delivery">Instrumental Delivery</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tear Details
                    </label>
                    <div className="space-y-2">
                      {['3A', '3B', '3C', '4th'].map(tear => (
                        <label key={tear} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.obsSummary?.tearDetails?.includes(tear as any) || false}
                            onChange={e => {
                              const current = formData.obsSummary?.tearDetails || []
                              if (e.target.checked) {
                                handleNestedChange('obsSummary', 'tearDetails', [...current, tear])
                              } else {
                                handleNestedChange(
                                  'obsSummary',
                                  'tearDetails',
                                  current.filter(t => t !== tear)
                                )
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{tear} Degree Tear</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Baby Birth Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.obsSummary?.babyBirthWeight || ''}
                      onChange={e =>
                        handleNestedChange('obsSummary', 'babyBirthWeight', parseFloat(e.target.value) || 0)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">Risk flag if ≥3.8 kg or &lt;2.5 kg</p>
                  </div>
                </>
              )}

              <div className="bg-blue-50 border border-blue-300 rounded p-4 text-xs space-y-2">
                <p className="font-semibold text-blue-900">Validations:</p>
                <ul className="text-blue-800 space-y-1 list-disc list-inside">
                  <li>Alert if total Gravida &gt; 9 (allow save)</li>
                  <li>Do NOT allow save if total Gravida &gt; 20</li>
                  <li>Gravida only if currently pregnant</li>
                </ul>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Notes
                </label>
                <Textarea
                  placeholder="Add any additional notes or observations..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-600 space-y-2">
                <div>
                  <span className="font-medium">Created:</span> {new Date(formData.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(formData.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
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
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
    </>
  )
}
