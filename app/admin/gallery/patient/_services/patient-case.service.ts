import type { PatientCase } from "../_types/patient-case.types"

export let INITIAL_PATIENT_CASES: PatientCase[] = [
  {
    id: "1",
    heading: "Teeth Alignment & Whitening",
    description: "Full smile transformation with invisible aligners and in-office dental whitening.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
    beforeAlt: "Patient smile before teeth alignment and whitening showing crooked teeth",
    afterAlt: "Patient radiant smile after aligners and professional dental whitening",
    createdAt: "2024-08-12T10:00:00Z",
  },
  {
    id: "2",
    heading: "Dental Implants & Ceramic Crown",
    description: "Replaced missing front tooth with a permanent titanium implant and natural-looking ceramic crown.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
    beforeAlt: "Patient smile before implant showing missing upper front tooth",
    afterAlt: "Patient natural smile restored with ceramic crown on titanium dental implant",
    createdAt: "2024-08-04T14:30:00Z",
  },
  {
    id: "3",
    heading: "Porcelain Veneers Transformation",
    description: "Corrected front teeth spacing, minor discoloration, and uneven edges for a harmonious smile.",
    beforeImage: "/admin/patient-before-after.jpg",
    afterImage: "/admin/patient-before-after.jpg",
    beforeAlt: "Patient smile before veneers showing tooth discoloration and gap",
    afterAlt: "Patient harmonious smile with custom handcrafted porcelain veneers",
    createdAt: "2024-07-29T11:20:00Z",
  },
]

export async function getPatientCases(): Promise<PatientCase[]> {
  return [...INITIAL_PATIENT_CASES]
}

export async function getPatientCaseById(id: string): Promise<PatientCase | undefined> {
  return INITIAL_PATIENT_CASES.find((c) => c.id === id)
}

export async function createPatientCase(
  data: Omit<PatientCase, "id" | "createdAt">
): Promise<PatientCase> {
  const newCase: PatientCase = {
    ...data,
    id: `pc_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  INITIAL_PATIENT_CASES = [newCase, ...INITIAL_PATIENT_CASES]
  return newCase
}

export async function updatePatientCase(
  id: string,
  data: Partial<Omit<PatientCase, "id">>
): Promise<PatientCase | null> {
  const index = INITIAL_PATIENT_CASES.findIndex((c) => c.id === id)
  if (index === -1) return null
  INITIAL_PATIENT_CASES[index] = { ...INITIAL_PATIENT_CASES[index], ...data }
  return INITIAL_PATIENT_CASES[index]
}

export async function deletePatientCase(id: string): Promise<boolean> {
  const initialLen = INITIAL_PATIENT_CASES.length
  INITIAL_PATIENT_CASES = INITIAL_PATIENT_CASES.filter((c) => c.id !== id)
  return INITIAL_PATIENT_CASES.length < initialLen
}
