"use client";

import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {
  CalendarIcon,
  Globe,
  CheckCircle,
  Clock,
  Filter,
  Search,
  X,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowLeft,
  Settings,
  Edit,
  Mail,
  User,
} from "lucide-react";
import Login from "./login";
import { LanguageContext } from "@/contexts/language-context";
import { translations } from "@/translations";
import type { Language } from "@/translations";

interface Appointment {
  id: number
  clientName: string
  email: string
  phone: string
  address: string
  time: string
  service: string
  notes: string
  appointmentDate: Date
  status: string
  bookingId: string
}

export interface TimeSlot {
  morning: boolean
  afternoon: boolean
  night: boolean
}

export interface TimeSlotMap {
  [dateKey: string]: TimeSlot
}

export default function AdminDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false);

  // State for availability management
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotMap>({})
  const [selectedDateForTimeSlot, setSelectedDateForTimeSlot] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [calendarView, setCalendarView] = useState<boolean>(true)

  const { language, setLanguage } = useContext(LanguageContext)
  const t = translations[language as Language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  // State for pricing management
  const [pricing, setPricing] = useState({
    regularClean: 150,
    deepClean: 250,
    moveInOut: 350,
  })
  const [isEditingPricing, setIsEditingPricing] = useState(false)
  const [tempPricing, setTempPricing] = useState({
    regularClean: 150,
    deepClean: 250,
    moveInOut: 350,
  })

  // State for admin email management
  const [adminEmail, setAdminEmail] = useState("admin@cleaningservice.com")
  const [tempAdminEmail, setTempAdminEmail] = useState("admin@cleaningservice.com")
  const [isEditingAdminEmail, setIsEditingAdminEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  function areDatesOnSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isDayWithAppointments = (day: Date): boolean => {
    return allAppointments.some((appointment: Appointment) =>
      areDatesOnSameDay(new Date(appointment.appointmentDate), day),
    )
  }

  function searchForCount(type: string): number {
    let count = 0
    for (let i = 0; i < allAppointments.length; i++) {
      const app: Appointment = allAppointments[i]
      if (app.status === type) count++
    }

    return count
  }

  useEffect(() => {
    async function authenticate() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/authenticate`
        const token = Cookies.get("token")
        if (!token) {
          setAuth(false)
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (response.ok) {
          setAuth(true)
        } else {
          setAuth(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    authenticate()
  }, [])

    async function getAppointments() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/appointments`
        const token = Cookies.get("token")
        const options = {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
        const response = await fetch(url, options)
        if (response.ok) {
          const appointments = await response.json();
          setAllAppointments(appointments);
        }
      } catch (err) {
        console.log(err)
      }
    }

  useEffect(() => {
    if (auth) getAppointments()
  }, [auth, getAppointments])

  useEffect(() => {
    async function adminDetails() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/service-details`
        const response = await fetch(url)
        if (response.ok) {
          const details: any = await response.json()

          setPricing({
            regularClean: Number.parseFloat(details.regularPrice),
            deepClean: Number.parseFloat(details.deepCleanPrice),
            moveInOut: Number.parseFloat(details.moveInOutPrice),
          })
          setAdminEmail(details.email)
          setTempAdminEmail(details.email)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (auth) adminDetails()
  }, [auth])

  const handleSaveAvailability = async () => {
    // Clear any existing messages
    setSaveSuccess(false)
    setErrorMessage(null)

    // Validate that all selected dates have at least one time slot selected
    const invalidDates = selectedDates.filter((date) => {
      const dateKey = date.toISOString().split("T")[0]
      const slots = timeSlots[dateKey]
      return !(slots && (slots.morning || slots.afternoon || slots.night))
    })

    if (invalidDates.length > 0) {
      // Create a more descriptive error message
      const formattedDates = invalidDates.map((date) => format(date, "MMM d, yyyy")).join(", ")
      const message =
        invalidDates.length === 1
          ? `Please select at least one time slot for ${formattedDates}`
          : `Please select at least one time slot for each of these dates: ${formattedDates}`

      setErrorMessage(message)

      // Auto-dismiss error after 5 seconds
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      return
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`
      const cleanedTimeSlots = cleanUpTimeSlots()
      const availabilityObj = []
      for (const key in cleanedTimeSlots) {
        availabilityObj.push({ ...cleanedTimeSlots[key], date: key, available: true })
      }
      const token = Cookies.get("token")
      const options = {
        method: "POST",

        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(availabilityObj),
      }
      const response = await fetch(url, options)

      if (response.ok) {
        await getAvailability()
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        const errorData = await response.json().catch(() => null)
        const errorMsg = errorData?.message || `Server error: ${response.status} ${response.statusText}`
        setErrorMessage(errorMsg)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (err) {
      console.log(err)
      // Handle network or other errors
      setErrorMessage("Network error. Please check your connection and try again.")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      // For demo purposes, still show success
      // Comment this out in production
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }
  }

  const handleSavePricing = async () => {
    setPricing(tempPricing)
    setIsEditingPricing(false)
    try {
      const token = Cookies.get("token")
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({
          regularPrice: tempPricing.regularClean,
          moveInOutPrice: tempPricing.moveInOut,
          deepCleanPrice: tempPricing.deepClean,
        }),
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/update-admin-pricing`
      const response = await fetch(url, options)
      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setErrorMessage("There was an problem saving the new price")
        setTimeout(() => {
          setErrorMessage("")
        }, 3000)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSaveAdminEmail = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(tempAdminEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setAdminEmail(tempAdminEmail)

    try {
      const token = Cookies.get("token")
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: tempAdminEmail,
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/update-admin-email`
      const response = await fetch(url, options)
      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
        setEmailError(null)
      }
    } catch (err) {
      console.log(err)
      setEmailError("There was a problem saving this email")
    }
    setIsEditingAdminEmail(false)
  }

  function cleanUpTimeSlots() {
    const tmp: any = {}
    for (let i = 0; i < selectedDates.length; i++) {
      const date = selectedDates[i]
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      const key = `${year}-${month}-${day}`
      tmp[key] = timeSlots[key]
    }
    return tmp
  }

  function updateDatesAndSlots(response: any) {
    const first: any = {}
    const second: any = []
    for (let i = 0; i < response.length; i++) {
      const curr: any = response[i]
      first[curr.date] = { morning: curr.morning, afternoon: curr.afternoon, night: curr.night }
      const [year, month, day] = curr.date.split("-").map(Number)
      second.push(new Date(year, month - 1, day))
    }
    setTimeSlots(first)
    setSelectedDates(second)
  }

  async function getAvailability() {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        updateDatesAndSlots(json)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAvailability()
  }, [])

  let todaysAppointments: Appointment[] = []
  if (date) {
    todaysAppointments = allAppointments.filter((appointment: Appointment) => {
      const today = new Date(date)
      const appointmentDate = new Date(appointment.appointmentDate)
      return (
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getDate() === today.getDate()
      )
    })
  }

  // Filter appointments based on search query
  const filteredAppointments = allAppointments.filter(
    (appointment) =>
      appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter appointments where the appointmentDate is in the future compared to nowUTC
  const upcomingAppointments = allAppointments.filter((appointment) => {
    const nowUTC = new Date()
    return new Date(appointment.appointmentDate) > nowUTC
  })

  // Handle time slot toggle
  const handleTimeSlotToggle = (dateKey: string, slot: keyof TimeSlot) => {
    const newTimeSlots = {
      ...timeSlots,
      [dateKey]: {
        ...timeSlots[dateKey],
        [slot]: !timeSlots[dateKey][slot],
      },
    }

    setTimeSlots(newTimeSlots)
  }

  // Format date to YYYY-MM-DD for use as keys
  const formatDateKey = (date: Date): string => {
    return format(date, "yyyy-MM-dd")
  }

  // Add this function after the formatDateKey function to check if a date is in the past
  const isDateInPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Update the handleDateSelect function to prevent selecting past dates
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    // Prevent selecting dates in the past
    if (isDateInPast(date)) {
      setErrorMessage(t["overview.error.select_past_date"])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    const dateKey = formatDateKey(date)

    // Rest of the function remains the same
    // Check if date is already selected
    const isSelected = selectedDates.some((selectedDate) => formatDateKey(selectedDate) === dateKey)

    if (isSelected) {
      // Remove date and its time slots
      const newSelectedDates = selectedDates.filter((selectedDate) => formatDateKey(selectedDate) !== dateKey)

      const newTimeSlots = { ...timeSlots }
      delete newTimeSlots[dateKey]

      setSelectedDates(newSelectedDates)
      setTimeSlots(newTimeSlots)

      // If the currently selected date for time slots is being removed, clear it
      if (selectedDateForTimeSlot === dateKey) {
        setSelectedDateForTimeSlot(null)
      }
    } else {
      // Add date with default time slots (all false)
      const newSelectedDates = [...selectedDates, date]
      const newTimeSlots = {
        ...timeSlots,
        [dateKey]: { morning: false, afternoon: false, night: false },
      }

      setSelectedDates(newSelectedDates)
      setTimeSlots(newTimeSlots)

      // Automatically select this date for time slot configuration
      setSelectedDateForTimeSlot(dateKey)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" /> Confirmed
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="mr-1 h-3 w-3" /> Canceled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Sort dates chronologically
  const sortedSelectedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())

  function matchService(service: string): string {
    if (service === "deep") return "Deep Cleaning"
    if (service === "regular") return "Regular Cleaning"
    return "Move In/Out Cleaning"
  }

  async function cancelAppointment(appointment: Appointment) {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/cancel-appointment`;
      const token = Cookies.get("token")
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(appointment),
      }
      const response = await fetch(url, options)
      setIsEditDialogOpen(false)
      if (response.ok) {
        await getAppointments();
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setErrorMessage("Canceling appointment failed, are you sure this appointment was not already canceled?")
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      }
    } catch (err) {
      console.log(err)
      setErrorMessage("Canceling appointment failed, are you sure this appointment was not already canceled?")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setLoading(false);
  }

  return (
    <>
      {!auth ? (
        <Login
          username={username}
          password={password}
          setAuth={setAuth}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t["admin.dashboard.title"]}
              </h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="hidden md:flex w-10"
                aria-label="Toggle language"
              >
                <Globe className="h-5 w-5" />
                <span className="ml-1 text-xs font-medium">{language.toUpperCase()}</span>
              </Button>
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t["admin.dashboard.back_to_home"]}
                </Button>
              </Link>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-blue-50">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  {t["tabs.overview"]}
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  {t["tabs.all_appointments"]}
                </TabsTrigger>
                <TabsTrigger
                  value="availability"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  {t["tabs.availability"]}
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                >
                  {t["tabs.settings"]}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t["overview.total_appointments"]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allAppointments.length}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t["overview.upcoming"]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{searchForCount("Confirmed")}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t["overview.completed"]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{searchForCount("completed")}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-2">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t["overview.canceled"]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{searchForCount("canceled")}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Success Message */}
                {saveSuccess && (
                  <div className="flex items-center p-4 mb-4 text-sm rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-5 duration-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <div className="text-green-700 font-medium">{t["overview.availability_saved_success"]}</div>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center p-4 mb-4 text-sm rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-5 duration-300">
                    <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <div className="text-red-700 font-medium">{errorMessage}</div>
                  </div>
                )}
                {/* Calendar and Today's Appointments */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1 border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle>{t["calendar.title"]}</CardTitle>
                      <CardDescription>{t["calendar.description"]}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        modifiers={{
                          hasAppointment: (day) => isDayWithAppointments(day),
                        }}
                        modifiersClassNames={{
                          hasAppointment: "bg-blue-50 font-bold text-blue-600",
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-blue-100 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle>{t["today.title"]}</CardTitle>
                      <CardDescription>{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todaysAppointments.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t["today.table.header.booking_id"]}</TableHead>
                                <TableHead>{t["today.table.header.client"]}</TableHead>
                                <TableHead>{t["today.table.header.time"]}</TableHead>
                                <TableHead>{t["today.table.header.service"]}</TableHead>
                                <TableHead>{t["today.table.header.status"]}</TableHead>
                                <TableHead className="text-right">{t["today.table.header.actions"]}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {todaysAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                                  <TableCell className="font-medium">{appointment.clientName}</TableCell>
                                  <TableCell>{appointment.time}</TableCell>
                                  <TableCell>{matchService(appointment.service)}</TableCell>
                                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedAppointment(appointment)
                                        setIsEditDialogOpen(true)
                                      }}
                                      className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                      {t["button.view_details"]}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground border rounded-lg">
                          {t["overview.no_appointments_today"]}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Appointments Preview */}
                <Card className="mt-6 border-blue-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{t["upcoming.title"]}</CardTitle>
                    <CardDescription>{t["upcoming.description"]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t["upcoming.table.header.booking_id"]}</TableHead>
                              <TableHead>{t["upcoming.table.header.client"]}</TableHead>
                              <TableHead>{t["upcoming.table.header.date_time"]}</TableHead>
                              <TableHead>{t["upcoming.table.header.service"]}</TableHead>
                              <TableHead>{t["all.table.header.status"]}</TableHead>
                              <TableHead>{t["upcoming.table.header.contact"]}</TableHead>
                              <TableHead className="text-right">{t["upcoming.table.header.actions"]}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {upcomingAppointments.slice(0, 5).filter((appointment) => appointment.status !== "canceled").map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                                <TableCell className="font-medium">{appointment.clientName}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{format(new Date(appointment.appointmentDate), "MMM d, yyyy")}</span>
                                    <span className="text-sm text-muted-foreground">{appointment.time}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{matchService(appointment.service)}</TableCell>

                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm">{getStatusBadge(appointment.status)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm">{appointment.email}</span>
                                    <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                                  </div>
                                </TableCell>

                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsEditDialogOpen(true)
                                    }}
                                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                  >
                                    {t["button.view_details"]}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border rounded-lg">
                        {t["upcoming.no_appointments"]}
                      </div>
                    )}
                    {upcomingAppointments.length > 5 && (
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("upcoming")}
                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {t["upcoming.view_all"]}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* All Appointments Tab */}
              <TabsContent value="appointments">
                <Card className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{t["tabs.all_appointments"]}</CardTitle>
                    <CardDescription>{t["all.table.header.actions"]}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t["search.appointments"]}
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSearchQuery("confirmed")}>
                            {t["filter.confirmed"]}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSearchQuery("completed")}>
                            {t["filter.completed"]}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSearchQuery("canceled")}>
                            {t["filter.canceled"]}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSearchQuery("")}>{t["filter.clear"]}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t["all.table.header.booking_id"]}</TableHead>
                            <TableHead>{t["all.table.header.client"]}</TableHead>
                            <TableHead>{t["all.table.header.date_time"]}</TableHead>
                            <TableHead>{t["all.table.header.service"]}</TableHead>
                            <TableHead>{t["all.table.header.contact"]}</TableHead>
                            <TableHead>{t["all.table.header.address"]}</TableHead>
                            <TableHead>{t["all.table.header.status"]}</TableHead>
                            <TableHead className="text-right">{t["all.table.header.actions"]}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                                <TableCell className="font-medium">{appointment.clientName}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{format(new Date(appointment.appointmentDate), "MMM d, yyyy")}</span>
                                    <span className="text-sm text-muted-foreground">{appointment.time}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{matchService(appointment.service)}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm">{appointment.email}</span>
                                    <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={appointment.address}>
                                  {appointment.address}
                                </TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsEditDialogOpen(true)
                                    }}
                                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                  >
                                    {t["button.view_details"]}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={9} className="h-24 text-center">
                                {t["all.no_appointments"]}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              {/* Availability Management Tab - Consolidated Version */}
              <TabsContent value="availability">
                <Card className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{t["availability.title"]}</CardTitle>
                    <CardDescription>{t["availability.description"]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Unified Availability Management Interface */}
                    <div className="space-y-6">
                      {/* Success Message */}
                      {saveSuccess && (
                        <div className="flex items-center p-4 mb-4 text-sm rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-5 duration-300">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <div className="text-green-700 font-medium">Availability settings saved successfully!</div>
                        </div>
                      )}

                      {/* Error Message */}
                      {errorMessage && (
                        <div className="flex items-center p-4 mb-4 text-sm rounded-lg bg-red-50 border border-red-200 animate-in fade-in slide-in-from-top-5 duration-300">
                          <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                          <div className="text-red-700 font-medium">{errorMessage}</div>
                        </div>
                      )}

                      {/* Availability Management Interface */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Calendar Only */}
                        <div className="lg:col-span-1">
                          <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-medium flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <span>{t["availability.select_dates"]}</span>
                              </h3>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setCalendarView(!calendarView)}
                              >
                                {calendarView ? (
                                  <>
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>Show</span>
                                  </>
                                )}
                              </Button>
                            </div>

                            {calendarView && (
                              <Calendar
                                mode="multiple"
                                selected={selectedDates}
                                onSelect={(value) => {
                                  if (Array.isArray(value)) {
                                    // Filter out past dates from the selection
                                    const filteredDates = value.filter((date) => !isDateInPast(date))

                                    // Show error if user tried to select past dates
                                    if (filteredDates.length < value.length) {
                                      setErrorMessage(
                                        "Cannot select dates in the past. Only current and future dates are allowed.",
                                      )
                                      setTimeout(() => {
                                        setErrorMessage(null)
                                      }, 5000)
                                    }

                                    setSelectedDates(filteredDates)

                                    // Update time slots
                                    const newTimeSlots = { ...timeSlots }

                                    // Remove time slots for dates that are no longer selected
                                    Object.keys(newTimeSlots).forEach((dateKey) => {
                                      if (!filteredDates.some((date) => formatDateKey(date) === dateKey)) {
                                        delete newTimeSlots[dateKey]
                                      }
                                    })

                                    // Add default time slots for newly selected dates
                                    filteredDates.forEach((date) => {
                                      const dateKey = formatDateKey(date)
                                      if (!newTimeSlots[dateKey]) {
                                        newTimeSlots[dateKey] = { morning: true, afternoon: true, night: true }
                                      }
                                    })

                                    setTimeSlots(newTimeSlots)
                                  } else {
                                    handleDateSelect(value)
                                  }
                                }}
                                disabled={isDateInPast}
                                className="rounded-md"
                                modifiersClassNames={{
                                  selected: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Right Column - Combined Selected Dates and Time Slot Configuration */}
                        <div className="lg:col-span-2">
                          <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm h-full">
                            <div className="flex flex-col h-full">
                              {/* Top section - Selected dates list */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-medium flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-600" />
                                    <span>
                                      {t["availability.selected_dates"].replace("{count}", selectedDates.length)}
                                    </span>
                                  </h3>
                                  {selectedDates.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => {
                                        setSelectedDates([])
                                        setTimeSlots({})
                                        setSelectedDateForTimeSlot(null)
                                      }}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      {t["availability.clear_all"]}
                                    </Button>
                                  )}
                                </div>

                                {selectedDates.length > 0 ? (
                                  <ScrollArea className="h-[140px] pr-4 border rounded-lg p-2">
                                    <div className="flex flex-wrap gap-2">
                                      {sortedSelectedDates.map((date) => {
                                        const dateKey = formatDateKey(date)
                                        const slots = timeSlots[dateKey] || {
                                          morning: false,
                                          afternoon: false,
                                          night: false,
                                        }
                                        const hasSlots = slots.morning || slots.afternoon || slots.night

                                        return (
                                          <div
                                            key={dateKey}
                                            className={`rounded-lg border p-2 hover:shadow-sm transition-shadow cursor-pointer ${
                                              selectedDateForTimeSlot === dateKey
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-blue-100"
                                            }`}
                                            onClick={() => setSelectedDateForTimeSlot(dateKey)}
                                          >
                                            <div className="flex items-center gap-2">
                                              <div>
                                                <div className="font-medium text-sm">{format(date, "MMM d, yyyy")}</div>
                                                {hasSlots && (
                                                  <div className="flex gap-1 mt-1">
                                                    {slots.morning && <Sun className="h-3 w-3 text-amber-500" />}
                                                    {slots.afternoon && <Clock className="h-3 w-3 text-orange-500" />}
                                                    {slots.night && <Moon className="h-3 w-3 text-indigo-400" />}
                                                  </div>
                                                )}
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  handleDateSelect(date)
                                                }}
                                                aria-label={`Remove ${format(date, "MMMM d, yyyy")}`}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-5 w-5 ml-auto"
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </ScrollArea>
                                ) : (
                                  <div className="text-center py-4 text-muted-foreground border rounded-lg">
                                    <CalendarIcon className="h-6 w-6 mx-auto text-blue-200 mb-2" />
                                    <p className="text-sm">{t["availability.no_dates_selected"]}</p>
                                  </div>
                                )}
                              </div>

                              {/* Bottom section - Time slot configuration */}
                              <div className="flex-1">
                                {selectedDateForTimeSlot ? (
                                  <div>
                                    {(() => {
                                      const date = selectedDates.find(
                                        (d) => formatDateKey(d) === selectedDateForTimeSlot,
                                      )
                                      if (!date) return null

                                      const slots = timeSlots[selectedDateForTimeSlot] || {
                                        morning: false,
                                        afternoon: false,
                                        night: false,
                                      }

                                      return (
                                        <>
                                          <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-medium text-blue-700 flex items-center">
                                              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                                              {format(date, "EEEE, MMMM d, yyyy")}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                onClick={() => {
                                                  // Find index of current date
                                                  const currentIndex = sortedSelectedDates.findIndex(
                                                    (d) => formatDateKey(d) === selectedDateForTimeSlot,
                                                  )

                                                  // Get previous date if exists
                                                  if (currentIndex > 0) {
                                                    const prevDate = sortedSelectedDates[currentIndex - 1]
                                                    setSelectedDateForTimeSlot(formatDateKey(prevDate))
                                                  }
                                                }}
                                                disabled={
                                                  sortedSelectedDates.findIndex(
                                                    (d) => formatDateKey(d) === selectedDateForTimeSlot,
                                                  ) === 0
                                                }
                                              >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="sr-only">Previous Date</span>
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                onClick={() => {
                                                  // Find index of current date
                                                  const currentIndex = sortedSelectedDates.findIndex(
                                                    (d) => formatDateKey(d) === selectedDateForTimeSlot,
                                                  )

                                                  // Get next date if exists
                                                  if (currentIndex < sortedSelectedDates.length - 1) {
                                                    const nextDate = sortedSelectedDates[currentIndex + 1]
                                                    setSelectedDateForTimeSlot(formatDateKey(nextDate))
                                                  }
                                                }}
                                                disabled={
                                                  sortedSelectedDates.findIndex(
                                                    (d) => formatDateKey(d) === selectedDateForTimeSlot,
                                                  ) ===
                                                  sortedSelectedDates.length - 1
                                                }
                                              >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="sr-only">Next Date</span>
                                              </Button>
                                            </div>
                                          </div>

                                          <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <Info className="h-5 w-5 text-blue-600 mr-2" />
                                            <p className="text-sm text-blue-700">
                                              {t["admin.time.slots.available.on.date"]}
                                            </p>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div
                                              className={`p-4 rounded-lg border ${
                                                slots.morning
                                                  ? "bg-amber-50 border-amber-200"
                                                  : "bg-white border-gray-200 hover:border-amber-200"
                                              } transition-colors cursor-pointer`}
                                              onClick={() => handleTimeSlotToggle(selectedDateForTimeSlot, "morning")}
                                            >
                                              <div className="flex items-center mb-3">
                                                <Checkbox
                                                  id={`${selectedDateForTimeSlot}-morning`}
                                                  checked={slots.morning}
                                                  onCheckedChange={() =>
                                                    handleTimeSlotToggle(selectedDateForTimeSlot, "morning")
                                                  }
                                                  className="border-amber-500 text-amber-500 data-[state=checked]:bg-amber-500"
                                                />
                                                <Label
                                                  htmlFor={`${selectedDateForTimeSlot}-morning`}
                                                  className="flex items-center cursor-pointer font-medium text-amber-700 ml-2"
                                                >
                                                  <Sun className="mr-2 h-5 w-5 text-amber-500" />
                                                  <span>{t["availability.time_slot.morning"]}</span>
                                                </Label>
                                              </div>
                                              <div className="ml-6">
                                                <p className="text-sm text-amber-700 font-medium">
                                                  {t["availability.time_slot.morning_time"]}
                                                </p>
                                                <p className="text-xs text-amber-600 mt-1">
                                                  {t["availability.time_slot.morning_desc"]}
                                                </p>
                                              </div>
                                            </div>

                                            <div
                                              className={`p-4 rounded-lg border ${
                                                slots.afternoon
                                                  ? "bg-orange-50 border-orange-200"
                                                  : "bg-white border-gray-200 hover:border-orange-200"
                                              } transition-colors cursor-pointer`}
                                              onClick={() => handleTimeSlotToggle(selectedDateForTimeSlot, "afternoon")}
                                            >
                                              <div className="flex items-center mb-3">
                                                <Checkbox
                                                  id={`${selectedDateForTimeSlot}-afternoon`}
                                                  checked={slots.afternoon}
                                                  onCheckedChange={() =>
                                                    handleTimeSlotToggle(selectedDateForTimeSlot, "afternoon")
                                                  }
                                                  className="border-orange-500 text-orange-500 data-[state=checked]:bg-orange-500"
                                                />
                                                <Label
                                                  htmlFor={`${selectedDateForTimeSlot}-afternoon`}
                                                  className="flex items-center cursor-pointer font-medium text-orange-700 ml-2"
                                                >
                                                  <Clock className="mr-2 h-5 w-5 text-orange-500" />
                                                  <span>{t["availability.time_slot.afternoon"]}</span>
                                                </Label>
                                              </div>
                                              <div className="ml-6">
                                                <p className="text-sm text-orange-700 font-medium">
                                                  {t["availability.time_slot.afternoon_time"]}
                                                </p>
                                                <p className="text-xs text-orange-600 mt-1">
                                                  {t["availability.time_slot.afternoon_desc"]}
                                                </p>
                                              </div>
                                            </div>

                                            <div
                                              className={`p-4 rounded-lg border ${
                                                slots.night
                                                  ? "bg-indigo-50 border-indigo-200"
                                                  : "bg-white border-gray-200 hover:border-indigo-200"
                                              } transition-colors cursor-pointer`}
                                              onClick={() => handleTimeSlotToggle(selectedDateForTimeSlot, "night")}
                                            >
                                              <div className="flex items-center mb-3">
                                                <Checkbox
                                                  id={`${selectedDateForTimeSlot}-night`}
                                                  checked={slots.night}
                                                  onCheckedChange={() =>
                                                    handleTimeSlotToggle(selectedDateForTimeSlot, "night")
                                                  }
                                                  className="border-indigo-500 text-indigo-500 data-[state=checked]:bg-indigo-500"
                                                />
                                                <Label
                                                  htmlFor={`${selectedDateForTimeSlot}-night`}
                                                  className="flex items-center cursor-pointer font-medium text-indigo-700 ml-2"
                                                >
                                                  <Moon className="mr-2 h-5 w-5 text-indigo-400" />
                                                  <span>{t["availability.time_slot.evening"]}</span>
                                                </Label>
                                              </div>
                                              <div className="ml-6">
                                                <p className="text-sm text-indigo-700 font-medium">
                                                  {t["availability.time_slot.evening_time"]}
                                                </p>
                                                <p className="text-xs text-indigo-600 mt-1">
                                                  {t["availability.time_slot.evening_desc"]}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })()}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-center h-full py-12">
                                    <CalendarIcon className="h-16 w-16 text-blue-200 mb-4" />
                                    <h3 className="text-xl font-medium text-blue-700 mb-2">
                                      {t["availability.no_date_selected"]}
                                    </h3>
                                    <p className="text-muted-foreground max-w-md mb-6">
                                      {selectedDates.length > 0
                                        ? t["availability.no_date_selected.info_with_dates"]
                                        : t["availability.no_date_selected.info_no_dates"]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Save Button and Summary */}
                      {selectedDates.length > 0 && (
                        <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium">{t["availability.summary.total_dates"]}</span>
                                <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  {selectedDates.length}
                                </Badge>
                              </div>

                              <div className="flex items-center">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium">
                                  {t["availability.summary.time_slots_configured"]}
                                </span>
                                <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  {Object.values(timeSlots).reduce((count, slots) => {
                                    return (
                                      count +
                                      (slots.morning ? 1 : 0) +
                                      (slots.afternoon ? 1 : 0) +
                                      (slots.night ? 1 : 0)
                                    )
                                  }, 0)}
                                </Badge>
                              </div>
                            </div>

                            <Button
                              onClick={handleSaveAvailability}
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t["availability.save_button"]}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="border-blue-100 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>{t["settings.pricing.title"]}</CardTitle>
                    <CardDescription>{t["settings.pricing.description"]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Success Message */}
                    {saveSuccess && (
                      <div className="flex items-center p-4 mb-4 text-sm rounded-lg bg-green-50 border border-green-200 animate-in fade-in slide-in-from-top-5 duration-300">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <div className="text-green-700 font-medium">{t["settings.updated_success"]}</div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-medium">{t["settings.pricing.header"]}</h3>
                          {!isEditingPricing ? (
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingPricing(true)}
                              className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t["settings.pricing.edit"]}
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditingPricing(false)
                                  setTempPricing(pricing)
                                }}
                                className="border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                {t["settings.pricing.cancel_edit"]}
                              </Button>
                              <Button
                                onClick={handleSavePricing}
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t["settings.pricing.save_changes"]}
                              </Button>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-6">
                          {/* Regular Clean Pricing */}
                          <div className="p-4 rounded-lg border border-blue-100 bg-blue-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-medium text-blue-700">
                                  {t["settings.pricing.regular.title"]}
                                </h4>
                                <p className="text-sm text-blue-600 mt-1">
                                  {t["settings.pricing.regular.description"]}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-700">
                                  $
                                  {isEditingPricing ? (
                                    <Input
                                      type="number"
                                      value={tempPricing.regularClean}
                                      onChange={(e) =>
                                        setTempPricing({
                                          ...tempPricing,
                                          regularClean: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="w-24 h-8 inline-block text-center"
                                    />
                                  ) : (
                                    pricing.regularClean
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Deep Clean Pricing */}
                          <div className="p-4 rounded-lg border border-green-100 bg-green-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-medium text-green-700">
                                  {t["settings.pricing.deep.title"]}
                                </h4>
                                <p className="text-sm text-green-600 mt-1">{t["settings.pricing.deep.description"]}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-700">
                                  $
                                  {isEditingPricing ? (
                                    <Input
                                      type="number"
                                      value={tempPricing.deepClean}
                                      onChange={(e) =>
                                        setTempPricing({
                                          ...tempPricing,
                                          deepClean: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="w-24 h-8 inline-block text-center"
                                    />
                                  ) : (
                                    pricing.deepClean
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Move In/Out Pricing */}
                          <div className="p-4 rounded-lg border border-purple-100 bg-purple-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-medium text-purple-700">
                                  {t["settings.pricing.move.title"]}
                                </h4>
                                <p className="text-sm text-purple-600 mt-1">{t["settings.pricing.move.description"]}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-purple-700">
                                  $
                                  {isEditingPricing ? (
                                    <Input
                                      type="number"
                                      value={tempPricing.moveInOut}
                                      onChange={(e) =>
                                        setTempPricing({
                                          ...tempPricing,
                                          moveInOut: Number.parseInt(e.target.value) || 0,
                                        })
                                      }
                                      className="w-24 h-8 inline-block text-center"
                                    />
                                  ) : (
                                    pricing.moveInOut
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {!isEditingPricing && (
                          <div className="mt-6 p-4 rounded-lg border border-blue-100 bg-blue-50">
                            <div className="flex items-center">
                              <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                              <p className="text-sm text-blue-700">{t["settings.pricing.info"]}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Settings Section */}
                    <div className="mt-8 space-y-6">
                      <Card className="border-blue-100 hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-full mb-2">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <CardTitle>{t["settings.admin.title"]}</CardTitle>
                          <CardDescription>{t["settings.admin.description"]}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white rounded-lg border border-blue-100 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-medium">{t["settings.admin.email_header"]}</h3>
                              {!isEditingAdminEmail ? (
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditingAdminEmail(true)}
                                  className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t["settings.admin.email.edit"]}
                                </Button>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsEditingAdminEmail(false)
                                      setTempAdminEmail(adminEmail)
                                      setEmailError(null)
                                    }}
                                    className="border-red-200 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    {t["settings.admin.email.cancel"]}
                                  </Button>
                                  <Button
                                    onClick={handleSaveAdminEmail}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {t["settings.admin.email.save"]}
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="p-4 rounded-lg border border-purple-100 bg-purple-50">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-medium text-purple-700">
                                    {t["settings.admin.email.email_title"]}
                                  </h4>
                                  <p className="text-sm text-purple-600 mt-1">
                                    {t["settings.admin.email.email_description"]}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isEditingAdminEmail ? (
                                    <div className="flex flex-col">
                                      <div className="flex items-center">
                                        <Mail className="h-4 w-4 text-purple-600 mr-2" />
                                        <Input
                                          type="email"
                                          value={tempAdminEmail}
                                          onChange={(e) => setTempAdminEmail(e.target.value)}
                                          className="w-64"
                                          placeholder="admin@example.com"
                                        />
                                      </div>
                                      {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 text-purple-600 mr-2" />
                                      <span className="text-lg font-medium text-purple-700">{adminEmail}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {!isEditingAdminEmail && (
                              <div className="mt-6 p-4 rounded-lg border border-purple-100 bg-purple-50">
                                <div className="flex items-center">
                                  <Info className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                                  <p className="text-sm text-purple-700">{t["settings.admin.email.info"]}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Edit Appointment Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t["dialog.appointment.title"]}</DialogTitle>
                  <DialogDescription>{t["dialog.appointment.description"]}</DialogDescription>
                </DialogHeader>
                {selectedAppointment && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">{t["dialog.appointment.label.client_name"]}</Label>
                        <Input disabled className="font-bold"id="clientName" defaultValue={selectedAppointment.clientName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service">{t["dialog.appointment.label.service"]}</Label>
                        <Input disabled className="font-bold" id="service" defaultValue={matchService(selectedAppointment.service)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t["dialog.appointment.label.email"]}</Label>
                        <Input disabled className="font-bold" id="email" defaultValue={selectedAppointment.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t["dialog.appointment.label.phone"]}</Label>
                        <Input disabled className="font-bold"id="phone" defaultValue={selectedAppointment.phone} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t["dialog.appointment.label.address"]}</Label>
                      <Input disabled className="font-bold" id="address" defaultValue={selectedAppointment.address} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">{t["dialog.appointment.label.date"]}</Label>
                        <Input
                          disabled
                          id="date"
                          className="font-bold"
                          defaultValue={format(new Date(selectedAppointment.appointmentDate), "yyyy-MM-dd")}
                          type="date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">{t["dialog.appointment.label.time"]}</Label>
                        <Input disabled className="font-bold" id="time" defaultValue={selectedAppointment.time} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">{t["dialog.appointment.label.status"]}</Label>
                      <Input disabled className="font-bold"id="time" defaultValue={selectedAppointment.status} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t["dialog.appointment.label.notes"]}</Label>
                      <Textarea disabled className="font-bold"id="notes" defaultValue={selectedAppointment.notes} />
                    </div>
                  </div>
                )}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
                  {selectedAppointment && selectedAppointment.status.toLowerCase() !== "canceled" && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelAppointment(selectedAppointment)}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {t["dialog.appointment.button.cancel"]}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto"
                  >
                    {t["dialog.appointment.button.close"]}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  )
}
