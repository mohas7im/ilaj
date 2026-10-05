"use client";

import { useState } from "react";
import Button from "@/components/website/ui/Button";
import AppointmentModal from "@/components/website/appointment/AppointmentModal";

// Opens the shared modal in inquiry mode, with this treatment filled in.
export default function TreatmentInquiryButton({
  treatment,
  clinicPhone,
  className,
}: {
  treatment: string;
  clinicPhone?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" className={className} onClick={() => setOpen(true)}>
        Ask About This Treatment
      </Button>
      <AppointmentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        clinicPhone={clinicPhone}
        mode="inquiry"
        treatment={treatment}
      />
    </>
  );
}
