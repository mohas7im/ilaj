import { getClinicPhotos } from "@/server/services/clinic-photo.service";
import { getPatientCases } from "@/server/services/patient-case.service";
import { PLACEHOLDER_CLINIC_PHOTOS, PLACEHOLDER_PATIENT_CASES } from "../gallery/_data/placeholder";

// Admin gallery lists, falling back to placeholder items while they are empty.

export async function getWebsiteClinicPhotos() {
  const photos = await getClinicPhotos();
  return photos.length > 0 ? photos : PLACEHOLDER_CLINIC_PHOTOS;
}

export async function getWebsitePatientCases() {
  const cases = await getPatientCases();
  return cases.length > 0 ? cases : PLACEHOLDER_PATIENT_CASES;
}
