import { cn } from "@/lib/utils";
import CardTitle from "./CardTitle";
import CardText from "./CardText";
import CountUp from "./CountUp";

export type Stat = {
  label: string;
  value: string;
  description: string;
};

export interface StatsListProps {
  stats: Stat[];
  /** Layout only (width / margin) */
  className?: string;
}

// "Years of Experience / 10+ / Clinical excellence." columns — shared by the
// home About section and the About page so both always look the same.
export function StatsList({ stats, className }: StatsListProps) {
  return (
    <div className={cn("grid grid-cols-1 divide-y divide-zinc-200 sm:grid-cols-3 sm:gap-3 sm:divide-y-0", className)}>
      {stats.map((stat, index) => (
        <div key={stat.label} className="reveal py-6 text-center first:pt-0 last:pb-0 sm:py-0" style={{ "--i": index } as React.CSSProperties}>

          <CardTitle size="sm">{stat.label}</CardTitle>

          <div className="mt-4 font-heading text-5xl font-medium leading-none tracking-tight text-zinc-950 sm:border-t sm:border-zinc-200 sm:pt-6 sm:text-6xl">
            <CountUp value={stat.value} />
          </div>

          <CardText className="mt-2.5">{stat.description}</CardText>

        </div>
      ))}
    </div>
  );
}

export default StatsList;
