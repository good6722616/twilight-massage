"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { staffService } from "@/services/staffService"

interface StaffSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  showInactive?: boolean
  className?: string
}

export function StaffSelector({
  value,
  onValueChange,
  placeholder = "选择员工",
  showInactive = false,
  className,
}: StaffSelectorProps) {
  const { getToken } = useAuth()

  const { data: staffList, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" })
      if (!token) throw new Error("No authentication token")
      return showInactive
        ? staffService.getAllStaff(token)
        : staffService.getActiveStaff(token)
    },
  })

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="加载中..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select onValueChange={onValueChange} value={value}>
      <FormControl>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {staffList?.map((staff) => (
          <SelectItem key={staff.id} value={staff.name}>
            {staff.name}
            {!staff.is_active && " (离职)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// 用于表单的包装组件
interface FormStaffSelectorProps {
  control: any
  name: string
  label?: string
  placeholder?: string
  showInactive?: boolean
  className?: string
}

interface FieldProps {
  field: {
    value: string
    onChange: (value: string) => void
  }
}

export function FormStaffSelector({
  control,
  name,
  label = "员工",
  placeholder = "选择员工",
  showInactive = false,
  className,
}: FormStaffSelectorProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: FieldProps) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <StaffSelector
            value={field.value}
            onValueChange={field.onChange}
            placeholder={placeholder}
            showInactive={showInactive}
            className={className}
          />
          <FormMessage className="absolute -bottom-5 left-0 text-xs" />
        </FormItem>
      )}
    />
  )
}
