"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
} from "lucide-react"
import { format, addDays, isToday, isSameDay, addMonths, startOfMonth, getDay, isSameMonth, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {baseRequest, cn, formatDateToSpanish} from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "../Header"

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
  const [timeSlotPicked, setTimeSlotPicked] = useState("")
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
    const target = new Date(dateInput)
    const today = new Date()

    // Normalize both to midnight to compare whole days
    target.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const msInDay = 24 * 60 * 60 * 1000
    const daysDiff = Math.floor((target - today) / msInDay)

    return daysDiff >= 2
  }
  // Mock available dates (in a real app, this would come from an API)
  useEffect(() => {
    if (step === 2 && selectedAction === "reschedule") {
      // Fetch available dates from the API
      const fetchAvailableDates = async () => {
        setIsLoadingAvailability(true)
        try {
          const response = await baseRequest("GET", "/availability");
          if (!response?.ok) {
            throw new Error("Failed to fetch availability")
          }

          const json = await response?.json()
          setAvailableTimeSlots(json)
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
    } else if (!/^BK-[A-Za-z0-9]{4}-[A-Za-z0-9]{3}$/i.test(formData.bookingId.trim())) {
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

  const validateCancellationForm = (): boolean => {}

  const handleFindAppointment = async () => {
    if (!validateFindForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const body = {
        bookingId: formData.bookingId,
        email: formData.email,
      }
      const response = await baseRequest("POST", "/find-appointment", body);
      if (!response?.ok) {
        const status = response?.status
        throw {
          message: status === 400 || status === 403 ? "Failed to find appointment" : "Something went wrong, try again later",
          status: response?.status,
        }
      }

      const data = await response?.json()
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
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    for (let i = 0; i < availableTimeSlots.length; i++) {
      if (areDatesOnSameDay(date, new Date(availableTimeSlots[i].expirationDate))) {
        setSelectedTimeSlot(availableTimeSlots[i])
      }
    }
  }

  useEffect(() => {
    if (step === 3) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    }
  }, [step])

  const handleSubmitAction = async () => {
    if (selectedAction === "reschedule" && !validateRescheduleForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (selectedAction === "cancel") {
        const body = {
          bookingId: formData.bookingId,
          email: formData.email,
          reason: formData.reason,
        };
        const response = await baseRequest("POST", "/customer-cancel-appointment", body);
        if (!response?.ok) {
          const errorData = await response?.json()
          throw {
            message: errorData.message || "Failed to cancel appointment",
            status: response?.status,
          }
        }
      } else if (selectedAction === "reschedule" && selectedDate && selectedTimeSlot) {
        const body = {
          bookingId: formData.bookingId,
          email: formData.email,
          newAppointmentDate: selectedDate,
          newTime: timeSlotPicked,
        };
        const response = await baseRequest("POST", "/reschedule", body);
        if (!response?.ok) {
          const errorData = await response?.json()
          throw {
            message: errorData.message || "Failed to reschedule appointment",
            status: response?.status,
          }
        }
      }
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
    }
    setIsSubmitting(false)
  }

  const isDateAvailable = (date: Date): boolean => {
    // Check if the date is in the availableDates array
    return availableDates.some((availableDate) => isSameDay(availableDate, date))
  }

  const getFormattedDate = (date: Date | null): string => {
    if (!date) return ""
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Calculate refund amount based on new base cancellation fee policy
  const calculateRefundAmount = (amount: string): string => {
    if (!appointmentData) return "$0.00"

    const percent = parseFloat(amount) / 100.0; // this will make the 95 to 0.95
    if (!percent) return "$0.00";

    const chargedAmount = Number.parseFloat(appointmentData.chargedAmount)
    const applicationFee = appointmentData.applicationFee;
    
    const paypalFee = appointmentData.paypalFee;
    const baseCancellationFee = paypalFee + applicationFee;
    
    // Calculate refundable amount (total - non-refundable fees)
    const refundableAmount = chargedAmount - baseCancellationFee;
    
    // Apply percentage to refundable portion only
    const refundAmount = refundableAmount * percent;
    
    return `$${Math.max(0, refundAmount).toFixed(2)}`
  }

  // Calculate base cancellation fee for display
  const calculateBaseCancellationFee = (): string => {
    if (!appointmentData) return "$0.00"

    const applicationFee = appointmentData.applicationFee;
    const paypalFee = appointmentData.paypalFee;
    const baseCancellationFee = paypalFee + applicationFee;
    
    return `$${baseCancellationFee.toFixed(2)}`
  }

  // Calculate refundable amount for display
  const calculateRefundableAmount = (): string => {
    if (!appointmentData) return "$0.00"

    const chargedAmount = Number.parseFloat(appointmentData.chargedAmount)
    const applicationFee = appointmentData.applicationFee;
    const paypalFee = appointmentData.paypalFee;
    const baseCancellationFee = paypalFee + applicationFee;
    const refundableAmount = chargedAmount - baseCancellationFee;
    
    return `$${Math.max(0, refundableAmount).toFixed(2)}`
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
                  {t["appointment.manage.title"]}
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">{t["appointment.manage.description"]}</p>
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
                        {i === 1
                          ? t["appointment.step.find"]
                          : i === 2
                            ? t["appointment.step.edit"]
                            : t["appointment.step.complete"]}
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
                      {t["appointment.find.title"]}
                    </CardTitle>
                    <CardDescription className="text-base">{t["appointment.find.description"]}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="bookingId" className="text-lg">
                          {t["appointment.bookingId"]}
                        </Label>
                        <Input
                          id="bookingId"
                          name="bookingId"
                          value={formData.bookingId}
                          onChange={handleInputChange}
                          placeholder={t["appointment.bookingId.placeholder"]}
                          className={`h-12 ${errors.bookingId ? "border-red-500" : ""}`}
                          disabled={isLoading}
                          required
                        />
                        {errors.bookingId && <p className="text-sm text-red-500 mt-1">{errors.bookingId}</p>}
                        <p className="text-sm text-muted-foreground">{t["appointment.bookingId.help"]}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-lg">
                          {t["appointment.email"]}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t["appointment.email.placeholder"]}
                          className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                          disabled={isLoading}
                          required
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                      </div>

                      {errors.api && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{t["error.title"]}</AlertTitle>
                          <AlertDescription>{errors.api}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        onClick={handleFindAppointment}
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t["appointment.find.loading"]}
                          </>
                        ) : (
                          t["appointment.find.button"]
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && appointmentData && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      {t["appointment.manage.title"]}
                    </CardTitle>
                    <CardDescription className="text-base">{t["appointment.manage.subtitle"]}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-lg mb-3">{t["appointment.current.title"]}</h3>
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.bookingId.label"]}</span>
                          <span className="font-medium">{appointmentData.bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.date.label"]}</span>
                          <span className="font-medium">

                            {
                              language === "es" ?
                                    formatDateToSpanish(format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")):
                              format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.time.label"]}</span>
                          <span className="font-medium">{t[appointmentData.time]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.service.label"]}</span>
                          <span className="font-medium">{t[appointmentData.service]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.address.label"]}</span>
                          <span className="font-medium">{appointmentData.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t["appointment.price.label"]}</span>
                          <span className="font-medium">
                            ${appointmentData && appointmentData.chargedAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!selectedAction ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-center">{t["appointment.action.question"]}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => handleSelectAction("reschedule")}
                            className="h-20 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                          >
                            <CalendarDays className="mr-2 h-5 w-5" />
                            {t["appointment.action.reschedule"]}
                          </Button>
                          <Button
                            onClick={() => handleSelectAction("cancel")}
                            variant="outline"
                            className="h-20 text-lg border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="mr-2 h-5 w-5" />
                            {t["appointment.action.cancel"]}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                          <h3 className="text-lg font-medium">
                            {selectedAction === "reschedule"
                              ? t["appointment.action.reschedule"]
                              : t["appointment.action.cancel"]}
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAction(null)}
                            className="text-muted-foreground"
                          >
                            {t["appointment.action.change"]}
                          </Button>
                        </div>

                        <Tabs defaultValue={selectedAction} className="w-full">
                          <TabsList className="hidden">
                            <TabsTrigger value="reschedule">Reschedule</TabsTrigger>
                            <TabsTrigger value="cancel">Cancel</TabsTrigger>
                          </TabsList>

                          <TabsContent value="reschedule" className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">{t["appointment.reschedule.selectDate"]}</h3>

                              {errors.date && (
                                <Alert variant="destructive" className="mb-4">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>{t["error.title"]}</AlertTitle>
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
                                    <span className="sr-only">{t["calendar.previousMonth"]}</span>
                                  </Button>
                                  <div className="text-2xl font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                    className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                                  >
                                    <ChevronRight className="h-5 w-5" />
                                    <span className="sr-only">{t["calendar.nextMonth"]}</span>
                                  </Button>
                                </div>

                                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-3">
                                  {[
                                    t["calendar.day.sun"],
                                    t["calendar.day.mon"],
                                    t["calendar.day.tue"],
                                    t["calendar.day.wed"],
                                    t["calendar.day.thu"],
                                    t["calendar.day.fri"],
                                    t["calendar.day.sat"],
                                  ].map((day, idx) => (
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
                                    <span>{t["calendar.available"]}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                                    <span>{t["calendar.unavailable"]}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {selectedDate && (
                              <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-lg font-medium">{t["appointment.reschedule.selectTime"]}</h3>

                                {errors.time && (
                                  <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t["error.title"]}</AlertTitle>
                                    <AlertDescription>{errors.time}</AlertDescription>
                                  </Alert>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <p className="font-medium text-blue-800">
                                    {t["appointment.selectedDate"]}{" "}
                                    <span className="font-bold">{

                                    language === "es" ? 
                                    formatDateToSpanish(format(selectedDate, "EEEE, MMMM d yyyy")):
                                      getFormattedDate(selectedDate)}</span>
                                  </p>
                                </div>
                                {selectedTimeSlot && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (selectedTimeSlot.morning) setTimeSlotPicked("MORNING")
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
                                        <span className="font-medium">{t["timeSlot.morning"]}</span>
                                        {selectedTimeSlot.morning ? (
                                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                            {t["calendar.available"]}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-gray-100">
                                            {t["timeSlot.booked"]}
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
                                        <span className="font-medium">{t["timeSlot.afternoon"]}</span>
                                        {selectedTimeSlot.afternoon ? (
                                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                            {t["calendar.available"]}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-gray-100">
                                            {t["timeSlot.booked"]}
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
                                        <span className="font-medium">{t["timeSlot.night"]}</span>
                                        {selectedTimeSlot.night ? (
                                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                            {t["calendar.available"]}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-gray-100">
                                            {t["timeSlot.booked"]}
                                          </Badge>
                                        )}
                                      </div>
                                    </button>

                                    {availableTimeSlots.length === 0 && !isLoadingAvailability && (
                                      <div className="col-span-2 p-8 text-center border rounded-lg bg-gray-50">
                                        <p className="text-muted-foreground">{t["timeSlot.none"]}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="cancel" className="space-y-6">
                            <div className="space-y-4">
                              <Alert className="mb-6">
                                <Info className="h-4 w-4" />
                                <AlertTitle>{t["cancellation.policy.title"]}</AlertTitle>
                                <AlertDescription>{t["cancellation.policy.description"]}</AlertDescription>
                              </Alert>

                              <div className="space-y-2">
                                <Label htmlFor="reason" className="text-lg">
                                  {t["cancellation.reason.label"]}
                                </Label>
                                <Input
                                  id="reason"
                                  name="reason"
                                  value={formData.reason}
                                  onChange={handleInputChange}
                                  placeholder={t["cancellation.reason.placeholder"]}
                                  className={`h-12 ${errors.reason ? "border-red-500" : ""}`}
                                  disabled={isSubmitting}
                                  required
                                />
                                {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
                              </div>

                              <Alert className="mb-6 bg-amber-50 border-amber-200">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertTitle>{t["refund.policy.title"]}</AlertTitle>
                                <AlertDescription>{t["refund.policy.description"]}</AlertDescription>
                              </Alert>

                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-medium text-lg mb-3">{t["refund.details.title"]}</h3>
                                <div className="grid gap-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t["refund.totalPaid"]}</span>
                                    <span className="font-medium">
                                      ${appointmentData && appointmentData.chargedAmount}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t pt-2">
                                    <span className="text-muted-foreground text-sm">Base cancellation fee (non-refundable)</span>
                                    <span className="text-sm text-red-600">-{calculateBaseCancellationFee()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Refundable amount</span>
                                    <span className="font-medium">{calculateRefundableAmount()}</span>
                                  </div>
                                  {isTwoOrMoreDaysAway(appointmentData.appointmentDate) ? (
                                    <div className="flex justify-between border-t pt-2">
                                      <span className="text-muted-foreground">{t["refund.amount.label"]} ({process.env.NEXT_PUBLIC_FULL_REFUND}% of refundable)</span>
                                      <span className="font-medium text-green-600">{calculateRefundAmount(process.env.NEXT_PUBLIC_FULL_REFUND)}</span>
                                    </div>
                                  ) : (
                                    <div className="flex justify-between border-t pt-2">
                                      <span className="text-muted-foreground">{t["refund.amount.label"]} ({process.env.NEXT_PUBLIC_PARTIAL_REFUND}% of refundable)</span>
                                      <span className="font-medium text-green-600">{calculateRefundAmount(process.env.NEXT_PUBLIC_PARTIAL_REFUND)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        {errors.api && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t["error.title"]}</AlertTitle>
                            <AlertDescription>{errors.api}</AlertDescription>
                          </Alert>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-12"
                            onClick={() => {
                              setStep(1)
                              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                            }}
                            disabled={isSubmitting}
                          >
                            {t["navigation.back"]}
                          </Button>
                          <Button
                            onClick={handleSubmitAction}
                            className={`flex-1 h-12 ${
                              selectedAction === "cancel"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                            }`}
                            disabled={
                              isSubmitting || (selectedAction === "reschedule" && (!selectedDate || !selectedTimeSlot))
                            }
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t["processing"]}
                              </>
                            ) : selectedAction === "reschedule" ? (
                              t["appointment.reschedule.confirm"]
                            ) : (
                              t["appointment.cancel.confirm"]
                            )}
                          </Button>
                        </div>
                      </div>
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
                      {selectedAction === "reschedule" ? t["appointment.rescheduled"] : t["appointment.cancelled"]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                      {t["appointment.success.prefix"]}
                      {selectedAction === "reschedule"
                        ? t["appointment.success.rescheduled"]
                        : t["appointment.success.cancelled"]}
                      {t["appointment.success.email"]}
                    </p>

                    {selectedAction === "reschedule" && selectedDate && selectedTimeSlot ? (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-left mb-6">
                        <h3 className="font-medium text-lg mb-3">{t["appointment.rescheduled.details"]}</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{t["appointment.bookingId.label"]}</span>
                              <span className="font-medium">{appointmentData.bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{t["appointment.service.label"]}</span>
                              <span className="font-medium">{t[appointmentData.service]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{t["appointment.address.label"]}</span>
                              <span className="font-medium">{appointmentData.address}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">{t["appointment.new.time"]}</h4>
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t["appointment.date.label"]}</span>
                                <span className="font-medium">{
                                    language === "es" ? 
                                    formatDateToSpanish(format(selectedDate, "EEEE, MMMM d yyyy")):
                                  getFormattedDate(selectedDate)
                                  }</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t["appointment.time.label"]}</span>
                                <span className="font-medium">{t[timeSlotPicked]}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <h4 className="font-medium text-amber-800 mb-2">{t["appointment.previous.time"]}</h4>
                            <div className="grid gap-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t["appointment.date.label"]}</span>
                                <span className="font-medium">
                                  {
                                    language === "es" ? 
                                    formatDateToSpanish(format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")):
                                    format(appointmentData.appointmentDate, "EEEE, MMMM d yyyy")
                                    }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t["appointment.time.label"]}</span>
                                <span className="font-medium">{t[appointmentData.time]}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-left mb-6">
                        <h3 className="font-medium text-lg mb-3">{t["appointment.details"]}</h3>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t["appointment.bookingId.label"]}</span>
                            <span className="font-medium">{appointmentData.bookingId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t["payment.amount"]}</span>
                            <span className="font-medium">${appointmentData?.chargedAmount}</span>
                          </div>

                          <div className="flex justify-between border-t pt-2">
                            <span className="text-muted-foreground text-sm">Base cancellation fee (non-refundable)</span>
                            <span className="text-sm text-red-600">-{calculateBaseCancellationFee()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Refundable amount</span>
                            <span className="font-medium">{calculateRefundableAmount()}</span>
                          </div>
                          {isTwoOrMoreDaysAway(appointmentData.appointmentDate) ? (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">{t["refund.amount.label"]} ({process.env.NEXT_PUBLIC_FULL_REFUND}% of refundable)</span>
                                <span className="font-medium text-green-600">{calculateRefundAmount(process.env.NEXT_PUBLIC_FULL_REFUND)}</span>
                              </div>
                          ) : (
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground">{t["refund.amount.label"]} ({process.env.NEXT_PUBLIC_PARTIAL_REFUND}% of refundable)</span>
                                <span className="font-medium text-green-600">{calculateRefundAmount(process.env.NEXT_PUBLIC_PARTIAL_REFUND)}</span>
                              </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
                    <Button onClick={() => setStep(1)} variant="outline" size="lg">
                      {t["navigation.back"]}
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <a href="/">{t["navigation.home"]}</a>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                {t["policies.title"]}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3 self-start">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["policies.reschedule.title"]}</h3>
                  <p className="text-sm text-muted-foreground">{t["policies.reschedule.description"]}</p>
                </div>
                <div className="flex flex-col p-4 bg-amber-50 rounded-lg">
                  <div className="rounded-full bg-amber-100 p-3 mb-3 self-start">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["policies.notice.title"]}</h3>
                  <p className="text-sm text-muted-foreground">{t["policies.notice.description"]}</p>
                </div>
                <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                  <div className="rounded-full bg-green-100 p-3 mb-3 self-start">
                    <Info className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["policies.support.title"]}</h3>
                  <p className="text-sm text-muted-foreground">{t["policies.support.description"]}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
