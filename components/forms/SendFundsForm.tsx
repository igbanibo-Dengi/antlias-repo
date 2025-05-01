'use client'

import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// station
// amount
// reference

interface SendFundsFormProps {
  onClose: () => void;
}


const sendFormSchema = z.object({
  station: z.string().min(1, {
    message: "Station is required",
  }),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  reference: z.string().min(1, {
    message: "Reference is required",
  }),
})

const SendFundsForm: React.FC<SendFundsFormProps> = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof sendFormSchema>>({
    resolver: zodResolver(sendFormSchema),
    defaultValues: {
      station: "",
      amount: "",
      reference: "",
    },
  })

  function onSubmit(values: z.infer<typeof sendFormSchema>) {
    setSubmitting(true)
    console.log(values)
    toast.success("Funds sent successfully")
    onClose();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="station"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Station</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">station 1</SelectItem>
                    <SelectItem value="m@google.com">station 2</SelectItem>
                    <SelectItem value="m@support.com">station 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type='number' placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input type='text' placeholder="Enter purpose" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className='mt-8 w-full'
          >
            {submitting ? "Sending..." : "Send Funds"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default SendFundsForm