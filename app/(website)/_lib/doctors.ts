import { getDoctors } from "@/server/services/doctor.service";

// Website view of a doctor from the admin Doctor table.
export type WebsiteDoctor = {
  id: string;
  name: string;
  qualification: string;
  /** Empty until uploaded in admin */
  image: string;
  imageAlt: string;
};

/** Active doctors in admin display order. */
export async function getWebsiteDoctors(): Promise<WebsiteDoctor[]> {
  const doctors = await getDoctors({ activeOnly: true });

  return doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
    // "BDS, MDS" + "Orthodontics" → "BDS, MDS (Orthodontics)"
    qualification: doctor.specialization
      ? `${doctor.designation} (${doctor.specialization})`
      : doctor.designation,
    image: doctor.image ?? "",
    imageAlt: doctor.imageAlt || doctor.name,
  }));
}
