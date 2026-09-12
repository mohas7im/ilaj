import type { Service, ServiceStatus } from "../_types/service.types"

export const SERVICE_STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active:   { label: "Active",   variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
}

export let MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "General Checkup",
    description: "Comprehensive dental examination including digital X-rays and oral health assessment.",
    status: "active",
    displayOrder: 1,
    showInHomePage: true,
    image: "/admin/clinic-gallery-room.jpg",
    imageAlt: "Modern dental checkup consultation room and diagnostic unit",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s2",
    name: "Teeth Cleaning & Polishing",
    description: "Professional scaling and polishing to remove plaque and tartar buildup.",
    status: "active",
    displayOrder: 2,
    showInHomePage: true,
    image: "/admin/login-showcase.jpg",
    imageAlt: "Dental cleaning and teeth scaling procedure equipment",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s3",
    name: "Root Canal Treatment",
    description: "Endodontic therapy to eliminate infection inside tooth pulp while saving the natural tooth.",
    status: "active",
    displayOrder: 3,
    showInHomePage: true,
    image: "/admin/clinic-gallery-room.jpg",
    imageAlt: "Endodontic therapy equipment and treatment chair",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s4",
    name: "Dental Implants",
    description: "Permanent titanium fixture and lifelike porcelain crown restoration for missing teeth.",
    status: "active",
    displayOrder: 4,
    showInHomePage: true,
    image: "/admin/login-showcase.jpg",
    imageAlt: "Titanium dental implant and restorative porcelain crown",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s5",
    name: "Invisalign & Clear Aligners",
    description: "Orthodontic smile alignment treatment using custom clear removable aligners.",
    status: "active",
    displayOrder: 5,
    showInHomePage: false,
    image: "/admin/clinic-gallery-room.jpg",
    imageAlt: "Custom transparent aligners for orthodontic smile alignment",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s6",
    name: "Laser Teeth Whitening",
    description: "Professional in-office whitening treatment for instant radiant smile results.",
    status: "inactive",
    displayOrder: 6,
    showInHomePage: false,
    image: "/admin/login-showcase.jpg",
    imageAlt: "Cosmetic laser teeth whitening treatment system",
    createdAt: "2023-02-01T00:00:00Z",
  },
]

export async function getServices(): Promise<Service[]> {
  return [...MOCK_SERVICES]
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  return MOCK_SERVICES.find((s) => s.id === id)
}

export async function createService(data: Omit<Service, "id">): Promise<Service> {
  const newService: Service = {
    ...data,
    id: `s_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  MOCK_SERVICES = [newService, ...MOCK_SERVICES]
  return newService
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  const index = MOCK_SERVICES.findIndex((s) => s.id === id)
  if (index === -1) return null
  MOCK_SERVICES[index] = { ...MOCK_SERVICES[index], ...data, updatedAt: new Date().toISOString() }
  return MOCK_SERVICES[index]
}

export async function deleteService(id: string): Promise<boolean> {
  const initialLen = MOCK_SERVICES.length
  MOCK_SERVICES = MOCK_SERVICES.filter((s) => s.id !== id)
  return MOCK_SERVICES.length < initialLen
}
