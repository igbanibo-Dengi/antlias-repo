"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { deleteEmployeeAction } from "@/lib/actions/employee/employee"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface DeleteEmployeeButtonProps {
  employeeId: string
  employeeName: string
}

export function DeleteEmployeeButton({ employeeId, employeeName }: DeleteEmployeeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteEmployeeAction({ employeeId })

      if (result.success) {
        toast.success(result.message || "Employee deleted successfully")

        setIsOpen(false)

        startTransition(() => {
          router.refresh()


          const currentPath = window.location.pathname
          router.push(currentPath)
        })
      } else {
        toast.error(result.error || "Failed to delete employee")
      }

      if (result.warning) {
        toast.warning(result.warning)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="w-full text-left justify-start">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {employeeName}? This action will permanently remove the employee and their
            user account. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting || isPending}
          >
            {isDeleting || isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isDeleting ? "Deleting..." : "Refreshing..."}
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
