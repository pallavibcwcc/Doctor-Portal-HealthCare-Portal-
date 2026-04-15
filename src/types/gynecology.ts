// Types for Gynaecological Visits
export interface CervicalCancerScreening {
  screeningDone: boolean
  type: string
  lastTestDate: string
  result: string
}

export interface MenstrualDetails {
  menstrualStatus: string
  lmp: string
  para: string
  contraception: string
  menstrualPattern: string
  mancheAge: string
  flow: string
  cycleLength: string
  bleedingDuration: string
  painWithPeriods: boolean
  durationOfPain: string
  interMenstrualSpotting: boolean
  postCoitalBleeding: boolean
}

export interface OtherDetails {
  micturition: string
  micturitionComments: string
  bowels: string
  bowelsComments: string
  recentWeightChange: string
  weightChangeComments: string
}

export interface Investigation {
  labTests: string
  scansImaging: string
  remarks: string
}

export interface Prescription {
  medicineName: string
  dose: string
  timing: string
  frequency: string
  duration: string
  durationUnit: string
  instructions: string
}

export interface FollowUp {
  followUpOption: 'none' | 'days' | 'weeks' | 'specific'
  numberOfDays: string
  followUpDate: string
  nextFollowUpMode: 'in-person' | 'online'
  instructionsForNextVisit: string
}

export interface Diagnosis {
  currentDiagnosis: string
  origin: 'Clinical' | 'Confirmed'
  treatment: string
  advice: string
}

export interface Review {
  overallAssessment: string
  improvementNotes: string
  recommendations: string
  action: 'Active' | 'Resolved' | 'Ruled Out'
}

export interface HistoryRecord {
  date: string
  visitType: string
  doctorName: string
  notes: string
}

export interface GynecologicalVisit {
  id: string
  visitNo: number
  visitDate: string
  visitTime: string
  seenBy: string
  branch: string
  consultationMode: 'Online' | 'In-person'
  visitCategory: string
  presentingComplaints: string
  doctorPrivateNotes: string
  cervicalCancerScreening: CervicalCancerScreening
  menstrualDetails: MenstrualDetails
  otherDetails: OtherDetails
  investigations: Investigation
  prescriptions: Prescription[]
  diagnosis: Diagnosis
  review: Review
  history: HistoryRecord[]
  followUp: FollowUp
  createdAt: string
}
