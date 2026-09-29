import { getDoctors } from "@/server/services/doctor.service";

// Website view of a doctor from the admin Doctor table.
export type WebsiteDoctor = {
  id: string;
  name: string;
  qualification: string;
  image: string;
  imageAlt: string;
};

// Shown until a doctor has a photo uploaded in admin.
const FALLBACK_IMAGES = [
  "/images/doctors/dr-arya.jpg",
  "/images/doctors/dr-meera-thomas.jpg",
  "/images/doctors/dr-aisha-rahman.jpg",
  "/images/doctors/dr-sona-menon.jpg",
];

/** Active doctors in admin display order. */
export async function getWebsiteDoctors(): Promise<WebsiteDoctor[]> {
  const doctors = await getDoctors({ activeOnly: true });

  return doctors.map((doctor, index) => ({
    id: doctor.id,
    name: doctor.name,
    // "BDS, MDS" + "Orthodontics" → "BDS, MDS (Orthodontics)"
    qualification: doctor.specialization
      ? `${doctor.designation} (${doctor.specialization})`
      : doctor.designation,
    image: doctor.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    imageAlt: doctor.imageAlt || doctor.name,
  }));
}
