import type { ClinicPhoto } from "../_types/clinic-photo.types"

export let INITIAL_CLINIC_PHOTOS: ClinicPhoto[] = [
  {
    id: "1",
    heading: "Treatment Suite & Dental Unit",
    description: "Modern, ergonomic dental chair with digital monitoring and panoramic window view.",
    image: "/admin/clinic-gallery-room.jpg",
    alt: "Modern ergonomic dental chair and treatment equipment in clinic suite",
    createdAt: "2024-08-10T10:00:00Z",
  },
  {
    id: "2",
    heading: "Reception & Architectural Lounge",
    description: "Spacious, comfortable patient waiting lounge with natural slate and glass architecture.",
    image: "/admin/login-showcase.jpg",
    alt: "Spacious clinic reception and patient waiting lounge",
    createdAt: "2024-08-05T14:30:00Z",
  },
  {
    id: "3",
    heading: "Consultation & Smile Design Studio",
    description: "Dedicated digital imaging and treatment planning consultation area.",
    image: "/admin/clinic-gallery-room.jpg",
    alt: "Digital smile design and patient consultation studio",
    createdAt: "2024-07-28T11:20:00Z",
  },
]

export async function getClinicPhotos(): Promise<ClinicPhoto[]> {
  return [...INITIAL_CLINIC_PHOTOS]
}

export async function getClinicPhotoById(id: string): Promise<ClinicPhoto | undefined> {
  return INITIAL_CLINIC_PHOTOS.find((p) => p.id === id)
}

export async function createClinicPhoto(data: Omit<ClinicPhoto, "id" | "createdAt">): Promise<ClinicPhoto> {
  const newPhoto: ClinicPhoto = {
    ...data,
    id: `cp_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  INITIAL_CLINIC_PHOTOS = [newPhoto, ...INITIAL_CLINIC_PHOTOS]
  return newPhoto
}

export async function updateClinicPhoto(
  id: string,
  data: Partial<Omit<ClinicPhoto, "id">>
): Promise<ClinicPhoto | null> {
  const index = INITIAL_CLINIC_PHOTOS.findIndex((p) => p.id === id)
  if (index === -1) return null
  INITIAL_CLINIC_PHOTOS[index] = { ...INITIAL_CLINIC_PHOTOS[index], ...data }
  return INITIAL_CLINIC_PHOTOS[index]
}

export async function deleteClinicPhoto(id: string): Promise<boolean> {
  const initialLen = INITIAL_CLINIC_PHOTOS.length
  INITIAL_CLINIC_PHOTOS = INITIAL_CLINIC_PHOTOS.filter((p) => p.id !== id)
  return INITIAL_CLINIC_PHOTOS.length < initialLen
}
