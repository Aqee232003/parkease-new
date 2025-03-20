"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange: (value: string) => void
  debounceMs?: number
  clearable?: boolean
  icon?: React.ReactNode
  containerClassName?: string
}

export function DebouncedInput({
  onValueChange,
  debounceMs = 300,
  clearable = true,
  icon = <Search className="h-4 w-4" />,
  containerClassName,
  className,
  value: initialValue = "",
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState<string>(initialValue as string)
  const [isFocused, setIsFocused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Update internal value when prop value changes
  useEffect(() => {
    setValue(initialValue as string)
  }, [initialValue])

  // Handle debounced value change
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      onValueChange(value)
    }, debounceMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, debounceMs, onValueChange])

  const handleClear = () => {
    setValue("")
    onValueChange("")
  }

  return (
    <div className={cn("relative flex items-center", containerClassName)}>
      <div className="absolute left-3 text-muted-foreground">{icon}</div>

      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn("pl-10", clearable && value && "pr-10", className)}
      />

      {clearable && value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7"
          onClick={handleClear}
          aria-label="Clear input"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

