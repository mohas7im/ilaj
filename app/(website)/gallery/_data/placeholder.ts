import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";
import type { PatientCase } from "@/domain/patient-case/patient-case.types";

// PLACEHOLDER gallery items, shown only while the admin Clinic Photos /
// Patient Cases lists are empty. They reuse existing site photos.

export const PLACEHOLDER_CLINIC_PHOTOS: ClinicPhoto[] = [
  { id: "p1", heading: "Treatment Room", image: "/images/about/about-main.jpg", alt: "Treatment room" },
  { id: "p2", heading: "Consultation", image: "/images/about/about-small-1.jpg", alt: "Consultation area" },
  { id: "p3", heading: "Hygiene Care", image: "/images/about/about-small-2.jpg", alt: "Dental hygiene area" },
  { id: "p4", heading: "Our Clinic", image: "/images/story/our-story.jpg", alt: "Dentist at work" },
  { id: "p5", heading: "Patient Care", image: "/images/why-ilaj.jpg", alt: "Smiling patient" },
  { id: "p6", heading: "Modern Equipment", image: "/images/about-dental.jpg", alt: "Dental equipment" },
  { id: "p7", heading: "Reception", image: "/images/contact-dental.jpg", alt: "Clinic reception" },
  { id: "p8", heading: "Specialist Team", image: "/images/doctors/dr-arya.jpg", alt: "Specialist at the clinic" },
];

export const PLACEHOLDER_PATIENT_CASES: PatientCase[] = [1, 2, 3, 1, 2, 3].map((n, index) => ({
  id: `c${index}`,
  heading: ["Teeth Whitening", "Orthodontic Braces", "Cosmetic Veneers", "Dental Implants", "Crowns & Bridges", "Teeth Cleaning"][index],
  beforeImage: `/images/gallery/smile-before-${n}.jpg`,
  afterImage: `/images/gallery/smile-after-${n}.jpg`,
  beforeAlt: "Smile before treatment",
  afterAlt: "Smile after treatment",
}));
