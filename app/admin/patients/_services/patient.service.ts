import type { Patient } from "../_types/patient.types"

export let MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Ali Hassan",
    email: "ali.hassan@email.com",
    phone: "+92 300 1234567",
    dateOfBirth: "1990-05-15",
    gender: "male",
    address: "Clifton Block 4, Karachi",
    medicalHistory: "No prior conditions",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "p2",
    name: "Fatima Noor",
    email: "fatima.noor@email.com",
    phone: "+92 321 9876543",
    dateOfBirth: "1994-08-22",
    gender: "female",
    address: "DHA Phase 6, Karachi",
    medicalHistory: "Allergic to penicillin",
    createdAt: "2024-02-18T14:30:00Z",
  },
  {
    id: "p3",
    name: "Usman Tariq",
    email: "usman.t@email.com",
    phone: "+92 333 4567890",
    dateOfBirth: "1988-12-01",
    gender: "male",
    address: "Gulshan-e-Iqbal, Karachi",
    medicalHistory: "Mild hypertension",
    createdAt: "2024-03-05T11:15:00Z",
  },
  {
    id: "p4",
    name: "Zainab Bibi",
    email: "zainab.b@email.com",
    phone: "+92 345 5678901",
    dateOfBirth: "2001-03-19",
    gender: "female",
    address: "PECHS Block 2, Karachi",
    medicalHistory: "None",
    createdAt: "2024-04-12T09:00:00Z",
  },
]

export async function getPatients(): Promise<Patient[]> {
  return [...MOCK_PATIENTS]
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  return MOCK_PATIENTS.find((p) => p.id === id)
}

export async function createPatient(data: Omit<Patient, "id" | "createdAt">): Promise<Patient> {
  const newPatient: Patient = {
    ...data,
    id: `p_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  MOCK_PATIENTS = [newPatient, ...MOCK_PATIENTS]
  return newPatient
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient | null> {
  const index = MOCK_PATIENTS.findIndex((p) => p.id === id)
  if (index === -1) return null
  MOCK_PATIENTS[index] = { ...MOCK_PATIENTS[index], ...data, updatedAt: new Date().toISOString() }
  return MOCK_PATIENTS[index]
}

export async function deletePatient(id: string): Promise<boolean> {
  const initialLen = MOCK_PATIENTS.length
  MOCK_PATIENTS = MOCK_PATIENTS.filter((p) => p.id !== id)
  return MOCK_PATIENTS.length < initialLen
}
