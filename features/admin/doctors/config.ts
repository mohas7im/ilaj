import type { Doctor } from "./types"

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with API call: GET /api/admin/doctors

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Khan",
    designation: "BDS",
    specialization: "General Dentistry",
    bio: "Over 10 years of experience in general and cosmetic dentistry.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    createdAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "d2",
    name: "Dr. Raza",
    designation: "BDS, MDS (Orthodontics)",
    specialization: "Orthodontics",
    bio: "Specialist in braces and clear aligners with 8 years of practice.",
    image: "https://images.unsplash.com/photo-1594824813571-638f02638523?w=200&auto=format&fit=crop&q=80",
    createdAt: "2023-03-10T09:00:00Z",
  },
  {
    id: "d3",
    name: "Dr. Noor",
    designation: "MDS (Endodontics)",
    specialization: "Endodontics",
    bio: "Expert in root canal therapy and endodontic microsurgery.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
    createdAt: "2023-06-20T09:00:00Z",
  },
  {
    id: "d4",
    name: "Dr. Anwar",
    designation: "BDS, MDS (Periodontics)",
    specialization: "Periodontics",
    bio: "Specialized in gum health, periodontal plastic surgery and dental implants.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80",
    createdAt: "2022-11-01T09:00:00Z",
  },
]
