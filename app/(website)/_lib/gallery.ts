import { getClinicPhotos } from "@/server/services/clinic-photo.service";
import { getPatientCases } from "@/server/services/patient-case.service";

// Admin gallery lists; sections that use them hide while they are empty.

export async function getWebsiteClinicPhotos() {
  return getClinicPhotos();
}

export async function getWebsitePatientCases() {
  return getPatientCases();
}
