import { Skeleton } from "@/components/ui/skeleton"
import { TableRow, TableCell } from "@/components/ui/table"

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 8 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              {colIndex === 0 ? (
                <Skeleton className="h-4 w-16" />
              ) : colIndex === 1 || colIndex === 2 ? (
                <Skeleton className="h-4 w-24" />
              ) : colIndex === 3 ? (
                <Skeleton className="h-4 w-32" />
              ) : colIndex === 4 ? (
                <Skeleton className="h-4 w-20" />
              ) : colIndex === 5 ? (
                <Skeleton className="h-4 w-24" />
              ) : colIndex === 6 ? (
                <Skeleton className="h-6 w-16 rounded-full" />
              ) : (
                <Skeleton className="h-8 w-8 rounded" />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
