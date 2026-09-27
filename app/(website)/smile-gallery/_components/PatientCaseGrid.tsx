import CardTitle from "@/components/website/common/CardTitle";
import CardText from "@/components/website/common/CardText";
import type { PatientCase } from "@/domain/patient-case/patient-case.types";
import BeforeAfterCard from "../../_components/BeforeAfterCard";

/** Grid of drag-to-compare before/after cards with the treatment name under each. */
export default function PatientCaseGrid({ cases }: { cases: PatientCase[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((item, index) => (
        <div key={item.id} className="reveal" style={{ "--i": index % 3 } as React.CSSProperties}>
          <BeforeAfterCard before={item.beforeImage} after={item.afterImage} alt={item.heading} />
          <CardTitle as="h2" size="sm" className="mt-4">{item.heading}</CardTitle>
          {item.description && <CardText className="mt-1">{item.description}</CardText>}
        </div>
      ))}
    </div>
  );
}
