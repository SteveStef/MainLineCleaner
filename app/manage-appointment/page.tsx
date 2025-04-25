"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
} from "lucide-react"
import { format, addDays, isToday, isSameDay, addMonths, startOfMonth, getDay, isSameMonth, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "../Header";
import Footer from "../Footer";

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"

interface AppointmentData {
  bookingId: string
  appointmentDate: string
  time: string
  service: string
  address: string
  chargedAmount: string
}

interface TimeSlot {
  time: string
  available: boolean
  morning: boolean
  afternoon: boolean
  night: boolean
  expirationDate: Date
  date: string
}

interface ApiError {
  message: string
  status?: number
}

type ActionType = "reschedule" | "cancel" | null

export default function AppointmentManagerPage() {
  const { toast } = useToast()
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false)
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [timeSlotPicked, setTimeSlotPicked] = useState("");
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [errors, setErrors] = useState<{
    bookingId?: string
    email?: string
    date?: string
    time?: string
    reason?: string
    api?: string
  }>({})
  const [formData, setFormData] = useState({
    bookingId: "",
    email: "",
    reason: "",
  })
  const { language } = useContext(LanguageContext)
  const t = translations[language as Language]

  const isDateInPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date <= today
  }
  function isTwoOrMoreDaysAway(dateInput) {
    const target = new Date(dateInput);
    const today = new Date();

    // Normalize both to midnight to compare whole days
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const msInDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((target - today) / msInDay);

    return daysDiff >= 2;
  }
  // Mock available dates (in a real app, this would come from an API)
  useEffect(() => {
    if (step === 2 && selectedAction === "reschedule") {
      // Fetch available dates from the API
      const fetchAvailableDates = async () => {
        setIsLoadingAvailability(true)
        try {
          const response = await fetch(`http://localhost:9080/availability`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            throw new Error("Failed to fetch availability")
          }

          const json = await response.json()
          setAvailableTimeSlots(json);
          const tmp = []
          for (let i = 0; i < json.length; i++) {
            const [year, month, day] = json[i].date.split("-").map(Number)
              const currDate = new Date(year, month - 1, day)
              if (!isDateInPast(currDate)) tmp.push(currDate)
          }
          setAvailableDates(tmp)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load available dates. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoadingAvailability(false)
        }
      }

      fetchAvailableDates()
    }
  }, [step, selectedAction, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateFindForm = (): boolean => {
    const newErrors: { bookingId?: string; email?: string } = {}

    if (!formData.bookingId.trim()) {
      newErrors.bookingId = "Booking ID is required"
    } else if (!/^BK-[A-Za-z0-9]{4}-[A-Za-z0-9]{3}$/i.test(formData.bookingId)) {
      newErrors.bookingId = "Invalid booking ID format. Should be like BK-1234-567"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRescheduleForm = (): boolean => {
    const newErrors: { date?: string; time?: string } = {}

    if (!selectedDate) {
      newErrors.date = "Please select a date for your appointment"
    }

    if (!selectedTimeSlot) {
      newErrors.time = "Please select a time slot for your appointment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCancellationForm = (): boolean => {
    const newErrors: { reason?: string } = {}

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for cancellation"
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = "Please provide a more detailed reason (at least 10 characters)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFindAppointment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateFindForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/find-appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: formData.bookingId,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const status = response.status;
        throw {
          message: status === 400 ? "Failed to find appointment" : "Something went wrong, try again later",
          status: response.status,
        }
      }

      const data = await response.json()
      setAppointmentData(data)
      setStep(2)
    } catch (error) {
      const apiError = error as ApiError

      if (apiError.status === 400) {
        setErrors({ api: "Appointment not found. Please check your booking ID and email." })
      } else {
        setErrors({ api: apiError.message || "An error occurred while finding your appointment. Please try again." })
        toast({
          title: "Error",
          description: "Failed to find appointment. Please try again later.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  function areDatesOnSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    for(let i = 0; i < availableTimeSlots.length; i++) {
      if(areDatesOnSameDay(date, new Date(availableTimeSlots[i].expirationDate))) {
        setSelectedTimeSlot(availableTimeSlots[i]);
      }
    }
  }

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedAction === "reschedule" && !validateRescheduleForm()) {
      return
    }

    if (selectedAction === "cancel" && !validateCancellationForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (selectedAction === "cancel") {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-cancel-appointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: formData.bookingId,
            email: formData.email,
            reason: formData.reason,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw {
            message: errorData.message || "Failed to cancel appointment",
            status: response.status,
          }
        }
      } else if (selectedAction === "reschedule" && selectedDate && selectedTimeSlot) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-reschedule-appointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: formData.bookingId,
            email: formData.email,
            newDate: format(selectedDate, "yyyy-MM-dd"),
            newTimeSlot: selectedTimeSlot.id,
            action: "reschedule",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw {
            message: errorData.message || "Failed to reschedule appointment",
            status: response.status,
          }
        }
      }

      // Success - move to confirmation step
      setStep(3)
    } catch (error) {
      const apiError = error as ApiError

      setErrors({
        api:
          apiError.message ||
          `An error occurred while ${
            selectedAction === "reschedule" ? "rescheduling" : "cancelling"
          } your appointment. Please try again.`,
      })
      toast({
        title: "Error",
        description: `Failed to ${
          selectedAction === "reschedule" ? "reschedule" : "cancel"
        } appointment. Please try again later.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDateAvailable = (date: Date): boolean => {
    // Check if the date is in the availableDates array
    return availableDates.some((availableDate) => isSameDay(availableDate, date))
  }

  const getFormattedDate = (date: Date | null): string => {
    if (!date) return ""
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Calculate refund amount (75% of price)
  const calculateRefundAmount = (): string => {
    if (!appointmentData) return "$0.00"

    const priceValue = Number.parseFloat(appointmentData.chargedAmount.replace(/[^0-9.]/g, ""))
    return `$${(priceValue * 0.75).toFixed(2)}`
  }

  const handleSelectAction = (action: ActionType) => {
    setSelectedAction(action)
    if (action === "reschedule") {
      setSelectedDate(null)
      setSelectedTimeSlot(null)
    } else if (action === "cancel") {
      setFormData((prev) => ({ ...prev, reason: "" }))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <section className="w-full py-4 md:py-8 lg:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Manage Your Cleaning Appointment
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  Need to reschedule or cancel your cleaning appointment? We've got you covered. Follow the steps below
                  to manage your booking.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step === i
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                            : step > i
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step > i ? <CheckCircle className="h-5 w-5" /> : i}
                      </div>
                      <span className={`text-sm ${step >= i ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                        {i === 1 ? "Find Appointment" : i === 2 ? "Edit Appointment" : "Complete"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 rounded">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded transition-all duration-300"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {step === 1 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Search className="h-6 w-6 text-blue-600" />
                      Find Your Appointment
                    </CardTitle>
                    <CardDescription className="text-base">
                      Enter your booking ID and email to locate your appointment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleFindAppointment} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="bookingId" className="text-lg">
                          Booking ID
                        </Label>
                        <Input
                          id="bookingId"
                          name="bookingId"
                          value={formData.bookingId}
                          onChange={handleInputChange}
                          placeholder="e.g., BK-1234-567"
                          className={`h-12 ${errors.bookingId ? "border-red-500" : ""}`}
                          disabled={isLoading}
                          required
                        />
                        {errors.bookingId && <p className="text-sm text-red-500 mt-1">{errors.bookingId}</p>}
                        <p className="text-sm text-muted-foreground">
                          Your booking ID was sent to you in your confirmation email
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                          disabled={isLoading}
                          required
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                      </div>

                      {errors.api && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errors.api}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finding Appointment...
                          </>
                        ) : (
                          "Find Appointment"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === 2 && appointmentData && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      Manage Your Appointment
                    </CardTitle>
                    <CardDescription className="text-base">
                      Choose to reschedule or cancel your cleaning appointment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-lg mb-3">Current Appointment</h3>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Booking ID:</span>
                          <span className="font-medium">{appointmentData.bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{t[appointmentData.time]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium">{t[appointmentData.service]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium">{appointmentData.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">${appointmentData && appointmentData.chargedAmount.split(" ")[0]}</span>
                        </div>
                      </div>
                    </div>

                    {!selectedAction ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-center">What would you like to do?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => handleSelectAction("reschedule")}
                            className="h-20 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                          >
                            <CalendarDays className="mr-2 h-5 w-5" />
                            Reschedule Appointment
                          </Button>
                          <Button
                            onClick={() => handleSelectAction("cancel")}
                            variant="outline"
                            className="h-20 text-lg border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="mr-2 h-5 w-5" />
                            Cancel Appointment
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitAction} className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                          <h3 className="text-lg font-medium">
                            {selectedAction === "reschedule" ? "Reschedule Appointment" : "Cancel Appointment"}
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAction(null)}
                            className="text-muted-foreground"
                          >
                            Change Action
                          </Button>
                        </div>

                        <Tabs defaultValue={selectedAction} className="w-full">
                          <TabsList className="hidden">
                            <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
                            <TabsTrigger value="cancel">Cancel</TabsTrigger>
                          </TabsList>

                          <TabsContent value="reschedule" className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">1. Select a New Date</h3>

                              {errors.date && (
                                <Alert variant="destructive" className="mb-4">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Error</AlertTitle>
                                  <AlertDescription>{errors.date}</AlertDescription>
                                </Alert>
                              )}

                              <div className="p-1 max-w-xl mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                                    className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                                  >
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Previous Month</span>
                                  </Button>
                                  <div className="text-2xl font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                    <span className="sr-only">Next Month</span>
                                  </Button>
                                </div>

                                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-3">
                                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                                    <div key={idx} className="text-blue-700 py-2 text-base">
                                      {day}
                                    </div>
                                  ))}
                                </div>

                                <div className="grid grid-cols-7 gap-2">
                                  {Array.from({ length: 42 }).map((_, index) => {
                                    const firstDayOfMonth = startOfMonth(currentMonth)
                                    const offset = getDay(firstDayOfMonth)
                                    const date = addDays(firstDayOfMonth, index - offset)
                                    const dayNumber = date.getDate()
                                    const isCurrentMonth = isSameMonth(date, currentMonth)

                                    if (!isCurrentMonth) {
                                      return <div key={`empty-${index}`} className="h-12 w-full"></div>
                                    }

                                    const isAvailable = isDateAvailable(date)
                                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                                    const isPast = isAfter(new Date(), date)

                                    return (
                                      <button
                                        key={date.toString()}
                                        type="button"
                                        onClick={() => isAvailable && !isPast && handleDateSelect(date)}
                                        className={cn(
                                          "flex h-12 w-full items-center justify-center rounded-md transition-all text-lg",
                                          isToday(date) && "font-bold",
                                          isPast
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : isAvailable
                                              ? "bg-green-100 hover:bg-green-200 text-green-800 hover:scale-105 shadow-sm"
                                              : "bg-gray-100 text-gray-400 cursor-not-allowed",
                                          isSelected && "ring-2 ring-blue-500 bg-blue-100 text-blue-800",
                                        )}
                                        disabled={!isAvailable || isPast}
                                      >
                                        {dayNumber}
                                      </button>
                                    )
                                  })}
                                </div>

                                <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                                    <span>Available</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                                    <span>Unavailable</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {selectedDate && (
                              <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-medium">2. Select a New Time Slot</h3>

                                {errors.time && (
                                  <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{errors.time}</AlertDescription>
                                  </Alert>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <p className="font-medium text-blue-800">
                                    Selected Date: <span className="font-bold">{getFormattedDate(selectedDate)}</span>
                                  </p>
                                </div>
                                {
                                  selectedTimeSlot &&
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if(selectedTimeSlot.morning) setTimeSlotPicked("MORNING");
                                        }}
                                        className={cn(
                                          "p-4 rounded-lg border transition-all",
                                          selectedTimeSlot.morning
                                            ? "hover:border-blue-500 hover:bg-blue-50"
                                            : "bg-gray-50 cursor-not-allowed opacity-60",
                                          "MORNING" === timeSlotPicked
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-gray-200",
                                        )}
                                        disabled={!selectedTimeSlot.morning}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Morning, 8:00AM - 11:00AM</span>
                                          {selectedTimeSlot.morning ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                              Available
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-gray-100">
                                              Booked
                                            </Badge>
                                          )}
                                        </div>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => selectedTimeSlot.afternoon && setTimeSlotPicked("AFTERNOON")}
                                        className={cn(
                                          "p-4 rounded-lg border transition-all",
                                          selectedTimeSlot.afternoon
                                            ? "hover:border-blue-500 hover:bg-blue-50"
                                            : "bg-gray-50 cursor-not-allowed opacity-60",
                                          "AFTERNOON" === timeSlotPicked
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-gray-200",
                                        )}
                                        disabled={!selectedTimeSlot.afternoon}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Afternoon, 12:00PM - 5:00PM</span>
                                          {selectedTimeSlot.afternoon ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                              Available
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-gray-100">
                                              Booked
                                            </Badge>
                                          )}
                                        </div>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => selectedTimeSlot.afternoon && setTimeSlotPicked("NIGHT")}
                                        className={cn(
                                          "p-4 rounded-lg border transition-all",
                                          selectedTimeSlot.night
                                            ? "hover:border-blue-500 hover:bg-blue-50"
                                            : "bg-gray-50 cursor-not-allowed opacity-60",
                                          "NIGHT" === timeSlotPicked
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : "border-gray-200",
                                        )}
                                        disabled={!selectedTimeSlot.night}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Night, 6:00PM - 9:00PM</span>
                                          {selectedTimeSlot.night ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                              Available
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-gray-100">
                                              Booked
                                            </Badge>
                                          )}
                                        </div>
                                      </button>

                                    {availableTimeSlots.length === 0 && !isLoadingAvailability && (
                                      <div className="col-span-2 p-8 text-center border rounded-lg bg-gray-50">
                                        <p className="text-muted-foreground">
                                          No time slots available for this date. Please select another date.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                }


                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="cancel" className="space-y-6">
                            <div className="space-y-4">
                              <Alert className="mb-6">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Cancellation Policy</AlertTitle>
                                <AlertDescription>
                                  Cancellations made at least 24 hours before the scheduled appointment are eligible for
                                  a 75% refund. Cancellations made less than 24 hours in advance will not receive any
                                  refund.
                                </AlertDescription>
                              </Alert>

                              <div className="space-y-2">
                                <Label htmlFor="reason" className="text-lg">
                                  Reason for Cancellation
                                </Label>
                                <Textarea
                                  id="reason"
                                  name="reason"
                                  value={formData.reason}
                                  onChange={handleInputChange}
                                  placeholder="Please let us know why you're canceling"
                                  className={`min-h-[100px] ${errors.reason ? "border-red-500" : ""}`}
                                  disabled={isSubmitting}
                                  required
                                />
                                {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
                              </div>

                              <Alert className="mb-6 bg-amber-50 border-amber-200">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertTitle>Refund Policy</AlertTitle>
                                <AlertDescription>
                                  When you cancel an appointment, you will receive a 75% refund of the original payment
                                  amount. The refund will be processed to your original payment method within 3-5
                                  business days. 
                                </AlertDescription>
                              </Alert>

                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-lg mb-3">Refund Details</h3>
                                <div className="grid gap-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Price Paid:</span>
                                    <span className="font-medium">${appointmentData && appointmentData.chargedAmount.split(" ")[0]}</span>
                                  </div>
                                  {
                                    isTwoOrMoreDaysAway(appointmentData.appointmentDate) ?  
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Refund Amount (75%):</span>
                                    <span className="font-medium">{calculateRefundAmount()}</span>
                                  </div> : 
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Refund Amount: </span>
                                    <span className="font-medium">$0.00</span>
                                  </div> 
                                  }
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        {errors.api && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errors.api}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-12"
                            onClick={() => setStep(1)}
                            disabled={isSubmitting}
                          >
                            Back
                          </Button>
                          <Button
                            type="submit"
                            className={`flex-1 h-12 ${
                              selectedAction === "cancel"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                            }`}
                            disabled={
                              isSubmitting ||
                              (selectedAction === "reschedule" && (!selectedDate || !selectedTimeSlot)) ||
                              (selectedAction === "cancel" && !formData.reason)
                            }
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : selectedAction === "reschedule" ? (
                              "Confirm Reschedule"
                            ) : (
                              "Confirm Cancellation"
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}

              {step === 3 && appointmentData && (
                <Card className="text-center border-0 shadow-lg">
                  <CardHeader
                    className={`${
                      selectedAction === "reschedule"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50"
                        : "bg-gradient-to-r from-blue-50 to-cyan-50"
                    } rounded-t-lg border-b`}
                  >
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl mt-4">
                      {selectedAction === "reschedule" ? "Appointment Rescheduled" : "Appointment Cancelled"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                      Your cleaning appointment has been successfully{" "}
                      {selectedAction === "reschedule" ? "rescheduled" : "cancelled"}. A confirmation email has been
                      sent to your email address.
                    </p>

                    {selectedAction === "reschedule" && selectedDate && selectedTimeSlot ? (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-left mb-6">
                        <h3 className="font-medium text-lg mb-3">Rescheduled Appointment Details</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Booking ID:</span>
                              <span className="font-medium">{appointmentData.bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Service:</span>
                          <span className="font-medium">{t[appointmentData.service]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Address:</span>
                              <span className="font-medium">{appointmentData.address}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">New Appointment Time</h4>
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{getFormattedDate(selectedDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">{selectedTimeSlot.time}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <h4 className="font-medium text-amber-800 mb-2">Previous Appointment Time</h4>
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">{t[appointmentData.time]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-left mb-6">
                        <h3 className="font-medium text-lg mb-3">Appointment Deta</h3>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Booking ID:</span>
                            <span className="font-medium">{appointmentData.bookingId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount Paid:</span>
                            <span className="font-medium">${appointmentData?.chargedAmount?.split(" ")[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Refund Amount (75%):</span>
                            <span className="font-medium">{calculateRefundAmount()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
                    <Button onClick={() => setSelectedAction(null)} asChild variant="outline" size="lg">
                      <div>Cancel another Appointment</div>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <Link href="/">
                        Return to Home
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                Appointment Policies
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3 self-start">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Free Rescheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Reschedule your appointment at any time with no additional fees. We understand plans change.
                  </p>
                </div>
                <div className="flex flex-col p-4 bg-amber-50 rounded-lg">
                  <div className="rounded-full bg-amber-100 p-3 mb-3 self-start">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium mb-2">24-Hour Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    Cancellations made at least 24 hours before the scheduled appointment are eligible for a 75% refund.
                    Last-minute cancellations receive no refund.
                  </p>
                </div>
                <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                  <div className="rounded-full bg-green-100 p-3 mb-3 self-start">
                    <Info className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Customer Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Need help with your appointment? Our customer service team is available 7 days a week to assist you
                    with any questions or concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
