import { cn } from "@/lib/utils";
import CardTitle from "./CardTitle";
import CardText from "./CardText";

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
    <div className={cn("grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-3", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">

          <CardTitle size="sm">{stat.label}</CardTitle>

          <div className="mt-4 border-t border-zinc-200 pt-6 font-heading text-5xl font-medium leading-none tracking-tight text-zinc-950 sm:text-6xl">
            {stat.value}
          </div>

          <CardText className="mt-2.5">{stat.description}</CardText>

        </div>
      ))}
    </div>
  );
}

export default StatsList;
