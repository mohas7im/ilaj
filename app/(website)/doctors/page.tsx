import DoctorsSection from "../_components/DoctorsSection";

// Doctors come from the admin database; refresh at most every 5 minutes.
export const revalidate = 300;

export default function DoctorsPage() {
  return (
    <main className="pt-20">
      <DoctorsSection />
    </main>
  );
}
