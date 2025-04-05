"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  X,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowLeft,
} from "lucide-react"

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

  // State for availability management
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotMap>({})
  const [selectedDateForTimeSlot, setSelectedDateForTimeSlot] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [calendarView, setCalendarView] = useState<boolean>(true)

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
      if(app.status === type) count++;
    }

    return count
  }
  console.log(allAppointments);

  useEffect(() => {
    async function getAppointments() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/appointments`;
        const response = await fetch(url)
        if (response.ok) {
          const appointments = await response.json();
          setAllAppointments(appointments)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getAppointments()
  }, [])

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
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "bearer " },
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
    const nowUTC = new Date();
    return new Date(appointment.appointmentDate) > nowUTC;
  });

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
      setErrorMessage("Cannot select dates in the past. Please choose a current or future date.")
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
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" /> Upcoming
          </Badge>
        )
      case "completed":
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homepage
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-blue-50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              All Appointments
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              Manage Availability
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Canceled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{searchForCount("canceled")}</div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Today's Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 border-blue-100 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view appointments</CardDescription>
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
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</CardDescription>
                </CardHeader>
                <CardContent>
                  {todaysAppointments.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {todaysAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                              <TableCell className="font-medium">{appointment.clientName}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>{appointment.service}</TableCell>
                              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAppointment(appointment)
                                        setIsEditDialogOpen(true)
                                      }}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                                    <DropdownMenuItem>Complete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground border rounded-lg">
                      No appointments scheduled for this day
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
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next 5 scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingAppointments.slice(0, 5).map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                            <TableCell className="font-medium">{appointment.clientName}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{format(new Date(appointment.appointmentDate), "MMM d, yyyy")}</span>
                                <span className="text-sm text-muted-foreground">{appointment.time}</span>
                              </div>
                            </TableCell>
                            <TableCell>{appointment.service}</TableCell>
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
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    No upcoming appointments
                  </div>
                )}
                {upcomingAppointments.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("upcoming")}
                      className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View All Upcoming Appointments
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
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all scheduled appointments</CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search appointments..."
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
                      <DropdownMenuItem onClick={() => setSearchQuery("upcoming")}>Upcoming</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchQuery("completed")}>Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchQuery("canceled")}>Canceled</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSearchQuery("")}>Clear Filters</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell>{appointment.service}</TableCell>
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
                            <TableCell className="max-w-[200px] truncate" title={appointment.notes}>
                              {appointment.notes || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedAppointment(appointment)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                                  <DropdownMenuItem>Complete</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No appointments found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming">
            <Card className="border-blue-100 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>View and manage all upcoming appointments</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search upcoming appointments..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.length > 0 ? (
                        upcomingAppointments
                          .filter(
                            (appointment) =>
                              appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              appointment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              appointment.service.toLowerCase().includes(searchQuery.toLowerCase()),
                          )
                          .map((appointment) => (
                            <TableRow key={appointment.id}>
                              <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                              <TableCell className="font-medium">{appointment.clientName}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{format(new Date(appointment.appointmentDate), "MMM d, yyyy")}</span>
                                  <span className="text-sm text-muted-foreground">{appointment.time}</span>
                                </div>
                              </TableCell>
                              <TableCell>{appointment.service}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm">{appointment.email}</span>
                                  <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={appointment.address}>
                                {appointment.address}
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={appointment.notes}>
                                {appointment.notes || "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedAppointment(appointment)
                                        setIsEditDialogOpen(true)
                                      }}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Cancel</DropdownMenuItem>
                                    <DropdownMenuItem>Complete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No upcoming appointments found.
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
                <CardTitle>Manage Availability</CardTitle>
                <CardDescription>Set your available dates and time slots</CardDescription>
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
                            <span>Select Dates</span>
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
                                    newTimeSlots[dateKey] = { morning: true, afternoon: true, night: true}
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
                                <span>Selected Dates ({selectedDates.length})</span>
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
                                  Clear All
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
                                <p className="text-sm">No dates selected</p>
                              </div>
                            )}
                          </div>

                          {/* Bottom section - Time slot configuration */}
                          <div className="flex-1">
                            {selectedDateForTimeSlot ? (
                              <div>
                                {(() => {
                                  const date = selectedDates.find((d) => formatDateKey(d) === selectedDateForTimeSlot)
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
                                          Select the time slots when you're available on this date.
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
                                              <span>Morning</span>
                                            </Label>
                                          </div>
                                          <div className="ml-6">
                                            <p className="text-sm text-amber-700 font-medium">8:00 AM - 12:00 PM</p>
                                            <p className="text-xs text-amber-600 mt-1">
                                              Early appointments, perfect for clients who prefer morning services.
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
                                              <span>Afternoon</span>
                                            </Label>
                                          </div>
                                          <div className="ml-6">
                                            <p className="text-sm text-orange-700 font-medium">12:00 PM - 5:00 PM</p>
                                            <p className="text-xs text-orange-600 mt-1">
                                              Midday appointments, ideal for lunch break services.
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
                                              <span>Evening</span>
                                            </Label>
                                          </div>
                                          <div className="ml-6">
                                            <p className="text-sm text-indigo-700 font-medium">5:00 PM - 9:00 PM</p>
                                            <p className="text-xs text-indigo-600 mt-1">
                                              Evening appointments, convenient for clients after work hours.
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
                                <h3 className="text-xl font-medium text-blue-700 mb-2">No Date Selected</h3>
                                <p className="text-muted-foreground max-w-md mb-6">
                                  {selectedDates.length > 0
                                    ? "Please select a date from the list above to configure available time slots."
                                    : "Start by selecting dates from the calendar to configure your availability."}
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
                            <span className="text-sm font-medium">Total dates:</span>
                            <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {selectedDates.length}
                            </Badge>
                          </div>

                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Time slots configured:</span>
                            <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {Object.values(timeSlots).reduce((count, slots) => {
                                return (
                                  count + (slots.morning ? 1 : 0) + (slots.afternoon ? 1 : 0) + (slots.night ? 1 : 0)
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
                          Save Availability
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>Make changes to the appointment details.</DialogDescription>
            </DialogHeader>
            {selectedAppointment && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" defaultValue={selectedAppointment.clientName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select defaultValue={selectedAppointment.service}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular Cleaning">Regular Cleaning</SelectItem>
                        <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                        <SelectItem value="Move In/Out Cleaning">Move In/Out Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue={selectedAppointment.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={selectedAppointment.phone} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={selectedAppointment.address} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      defaultValue={format(new Date(selectedAppointment.appointmentDate), "yyyy-MM-dd")}
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" defaultValue={selectedAppointment.time} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedAppointment.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" defaultValue={selectedAppointment.notes} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

