export interface DiagnosisRecord {
  id: string
  diagnosisName: string
  icdCode: string
  status: 'Active' | 'Resolved' | 'On Hold'
  origin: 'Clinical' | 'Confirmed'
  plan: 'Medical' | 'Conservative' | 'Surgical'
  firstDiagnosed: string
  clinicalNotes: string
  visitCount: number
  history: DiagnosisHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface DiagnosisHistoryEntry {
  id: string
  date: string
  doctor: string
  status: 'Active' | 'Resolved' | 'On Hold'
  origin: 'Clinical' | 'Confirmed'
  treatmentPlan: 'Medical' | 'Conservative' | 'Surgical'
  notes: string
}

export interface DiagnosisFormData {
  diagnosisName: string
  icdCode: string
  origin: 'Clinical' | 'Confirmed'
  plan: 'Medical' | 'Conservative' | 'Surgical'
  clinicalNotes: string
}
