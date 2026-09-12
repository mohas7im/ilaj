"use client"

import { useState, type ReactNode } from "react"
import { ChevronUp, ChevronDown, Search, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
  /** Unique key — must match a key of T or be a custom string */
  key: string
  header: ReactNode
  /** Custom cell renderer. Falls back to `row[key]` stringified */
  cell?: (row: T) => ReactNode
  /** Allow sorting on this column */
  sortable?: boolean
  /** Optional additional className for the cell */
  className?: string
}

type DataTableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T>[]
  /** Row key extractor */
  rowKey: (row: T) => string
  /** Enable client-side search */
  searchable?: boolean
  /** Placeholder shown in the search input */
  searchPlaceholder?: string
  /** Columns to search across (defaults to all keys) */
  searchKeys?: (keyof T)[]
  /** Empty state config */
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
  tableClassName?: string
}

type SortState = { key: string; dir: "asc" | "desc" } | null

// ─── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  data,
  columns,
  rowKey,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or add a new record.",
  emptyAction,
  className,
  tableClassName,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortState>(null)

  // ── Filter ────────────────────────────────────────────────────────────────
  const keys = searchKeys ?? (Object.keys(data[0] ?? {}) as (keyof T)[])
  const filtered = searchable && query
    ? data.filter((row) =>
        keys.some((k) =>
          String((row as Record<string, any>)[k as string] ?? "").toLowerCase().includes(query.toLowerCase())
        )
      )
    : data

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, any>)[sort.key] ?? "")
        const bv = String((b as Record<string, any>)[sort.key] ?? "")
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    : filtered

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search bar */}
      {searchable && (
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 pr-8 h-9"
            aria-label="Search records"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className={cn("overflow-x-auto rounded-md border bg-card", tableClassName)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.className}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "flex items-center gap-1 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        col.className?.includes("text-right") && "ml-auto"
                      )}
                      aria-label={`Sort by ${typeof col.header === "string" ? col.header : col.key}`}
                    >
                      {col.header}
                      {sort?.key === col.key ? (
                        sort.dir === "asc" ? (
                          <ChevronUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ChevronUp className="h-3 w-3 opacity-30" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                    className="border-0 rounded-none bg-transparent"
                  />
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell ? col.cell(row) : String((row as Record<string, any>)[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Result count */}
      {searchable && query && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {sorted.length} result{sorted.length !== 1 ? "s" : ""} found
        </p>
      )}
    </div>
  )
}
