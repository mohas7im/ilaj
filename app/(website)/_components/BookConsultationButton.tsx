"use client";

import Button from "@/components/website/ui/Button";
import { openAppointmentModal } from "@/components/website/layout/Navbar";

// Opens the navbar's appointment modal from a server-rendered section.
export default function BookConsultationButton({ className }: { className?: string }) {
  return (
    <Button variant="primary" className={className} onClick={openAppointmentModal}>
      Book a Consultation
    </Button>
  );
}
