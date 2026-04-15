// Types for Obstetric History and Current Obstetric Profile

export type ObstetricStatus = 'Pregnant' | 'Mother' | 'Post-termination'
export type TearDegree = '3A' | '3B' | '3C' | '4th'
export type TerminationMode = 'Medical Termination' | 'Surgical Termination'

export interface PregnancyDetails {
  lmp?: string // Last Menstrual Period
  edd?: string // Expected Delivery Date
  scanEdd?: string // Scan-based EDD
  ga?: number // Gestational Age in weeks
  gaRecordedAt?: string // Date when GA was recorded/updated
  currentGa?: number // Calculated current GA based on today's date
  modeOfConception?: string // Natural or ART
  numberOfFoetus?: number // Default = 1
}

export interface PostPregnancyDetails {
  deliveryDate?: string
  terminationDate?: string
  miscarriageDate?: string
  dateOfEvent?: string // Generic date field for the event
}

export interface ObsSummary {
  gravida?: number // Only if currently pregnant
  para?: number
  ectopic?: number
  miscarriage?: number
  abortions?: number
  livingChildren?: number
  numberOfFoetus?: number // Default = 1
  deliveryTerminationMode?: 'Delivery Mode' | TerminationMode // Delivery/Termination Mode
  tearDetails?: TearDegree[] // 3rd degree (3A, 3B, 3C), 4th degree
  babyBirthWeight?: number // in kg - Risk flag if >= 3.8 or < 2.5
  birthWeightRiskFlag?: boolean // Calculated based on weight
}

export interface ObstetricProfile {
  id: string
  patientId: string
  status: ObstetricStatus // Pregnant, Mother, Post-termination
  pregnancyDetails?: PregnancyDetails
  postPregnancyDetails?: PostPregnancyDetails
  obsSummary?: ObsSummary // New Obs Summary
  
  // Legacy/Current Obs Profile fields
  gravida?: number // Not applicable for PNC/Termination/Miscarriage
  para?: number
  live?: number
  abortion?: number
  miscarriage?: number
  
  // Outcome information
  outcome?: 'Delivery' | 'Termination' | 'Miscarriage' | null
  
  createdAt: string
  updatedAt: string
  dateWhenUpdated?: string // For tracking when GA was updated
}

export interface ObstetricHistory {
  id: string
  patientId: string
  profileId: string
  visitDate: string
  status: ObstetricStatus
  pregnancyDetails?: PregnancyDetails
  postPregnancyDetails?: PostPregnancyDetails
  obsSummary?: ObsSummary
  outcome?: 'Delivery' | 'Termination' | 'Miscarriage' | null
  gravida?: number
  para?: number
  notes?: string
  createdAt: string
  recordedBy?: string
}

// Validation constraints
export const ObstetricValidations = {
  LMP_MAX_WEEKS: 42,
  TERMINATION_MIN_WEEKS: 4,
  TERMINATION_MAX_WEEKS: 24,
  DELIVERY_MIN_WEEKS: 24,
  DELIVERY_MAX_WEEKS: 42,
  GA_MIN_WEEKS: 4,
  GA_MAX_WEEKS: 42,
  
  // Obs Summary validations
  GRAVIDA_ALERT_THRESHOLD: 9, // Show alert but allow save
  GRAVIDA_MAX_THRESHOLD: 20, // Do NOT allow save
  BABY_WEIGHT_HIGH: 3.8, // kg - Risk flag
  BABY_WEIGHT_LOW: 2.5, // kg - Risk flag
}

// Utility function to calculate obs summary values
export function calculateObsSummaryTotal(summary?: ObsSummary): number {
  if (!summary) return 0
  return (
    (summary.ectopic || 0) +
    (summary.miscarriage || 0) +
    (summary.abortions || 0) +
    (summary.para || 0)
  )
}
