"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  startTime?: string;
  onStartTimeChange?: (time: string) => void;
  endTime?: string;
  onEndTimeChange?: (time: string) => void;
  className?: string;
}

export function Calendar24({ 
  date, 
  onDateChange, 
  startTime, 
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  className 
}: Calendar24Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                onDateChange?.(selectedDate)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="start-time-picker" className="px-1">
          Heure de début
        </Label>
        <Input
          type="time"
          id="start-time-picker"
          step="1"
          value={startTime || "10:30:00"}
          onChange={(e) => onStartTimeChange?.(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="end-time-picker" className="px-1">
          Heure de fin
        </Label>
        <Input
          type="time"
          id="end-time-picker"
          step="1"
          value={endTime || "11:30:00"}
          onChange={(e) => onEndTimeChange?.(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
