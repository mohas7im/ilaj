import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import type { SearchQuery } from "../_types/analytics.types"

type SearchQueriesCardProps = {
  queries: SearchQuery[] | null
}

export function SearchQueriesCard({ queries }: SearchQueriesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Google search keywords</CardTitle>
        <CardDescription>What people searched on Google before visiting the website</CardDescription>
      </CardHeader>
      <CardContent>
        {queries === null ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Google Search Console is not connected
          </p>
        ) : queries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No data yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Shown in Google</TableHead>
                <TableHead className="text-right">Click rate</TableHead>
                <TableHead className="text-right">Avg. position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.map((q) => (
                <TableRow key={q.query}>
                  <TableCell className="max-w-64 truncate font-medium">{q.query}</TableCell>
                  <TableCell className="text-right tabular-nums">{q.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {q.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{(q.ctr * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right tabular-nums">{q.position.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
