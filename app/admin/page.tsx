"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  X,
  Plus,
} from "lucide-react"
import Header from "../Header"

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
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState<boolean>(false)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])

  // State for availability management
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotMap>({})


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
    async function getAppointments() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/appointments`
        const response = await fetch(url)
        if (response.ok) {
          const appointments = await response.json()
          setAllAppointments(appointments)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getAppointments()
  }, [])

  const handleSaveAvailability = async () => {
    const isValid = selectedDates.every((date) => {
      const dateKey = date.toISOString().split("T")[0]
      const slots = timeSlots[dateKey]
      return slots && (slots.morning || slots.afternoon || slots.night)
    })

    if (!isValid) {
      alert("Please ensure all selected days have at least one time slot selected");
      return
    }

    try {

      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`;
      const cleanedTimeSlots = cleanUpTimeSlots();
      let availabilityObj = [];
      for(let key in cleanedTimeSlots) {
        availabilityObj.push({...cleanedTimeSlots[key], date: key, available: true});
      }
      const options = { method: "POST", headers: {"Content-Type": "application/json", Authorization: "bearer "}, body: JSON.stringify(availabilityObj) };
      const response = await fetch(url, options);
      console.log(response);
      if(response.ok) {
        await getAvailability();
        setIsTimeSlotDialogOpen(false);
      }
    } catch(err) {
      console.log(err);
    }
  }

  function cleanUpTimeSlots() {
    let tmp:any = {};
    for (let i = 0; i < selectedDates.length; i++) {
      const date = selectedDates[i];
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      tmp[key] = timeSlots[key];
    }
    return tmp;
  }

  function updateDatesAndSlots(response:any) {
    let first:any= {};
    let second: any = [];
    for(let i = 0; i < response.length; i++) {
      let curr: any = response[i];
      first[curr.date] = {morning: curr.morning, afternoon: curr.afternoon, night: curr.night};
      const [year, month, day] = curr.date.split('-').map(Number);
      second.push(new Date(year, month - 1, day));
    }
    setTimeSlots(first);
    setSelectedDates(second);
  }

  async function getAvailability() {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`;
      const response = await fetch(url)
        if (response.ok) {
          const json = await response.json();
          updateDatesAndSlots(json);
        }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAvailability();
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden md:flex gap-1 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  onClick={() => setIsTimeSlotDialogOpen(true)}
                >
                  Manage Availability
                </Button>
              </div>
            </div>

            {/* Stats */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments {}</CardTitle>
                  <CalendarIcon className={`h-4 w-4 text-white-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allAppointments.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Clock className={`h-4 w-4 text-cyan-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{searchForCount("Confirmed")}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className={`h-4 w-4 text-green-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{searchForCount("Completed")}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Canceled</CardTitle>
                  <X className={`h-4 w-4 text-red-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{searchForCount("Canceled")}</div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Appointments */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{
                      booked: (date) => isDayWithAppointments(date),
                    }}
                    modifiersStyles={{
                      booked: {
                        fontWeight: "bold",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "0.375rem",
                      },
                    }}
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-100"></div>
                      <span className="text-xs text-muted-foreground">Has appointments</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => setIsTimeSlotDialogOpen(true)}
                    >
                      Manage Slots
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    {date
                      ? date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Appointments"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setDate(date.getDate() - 1)
                          setDate(newDate)
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Day</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (date) {
                          const newDate = new Date(date)
                          newDate.setDate(date.getDate() + 1)
                          setDate(newDate)
                        }
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Day</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todaysAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {todaysAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{appointment.time}</span>
                              <Badge
                                variant={
                                  appointment.status === "Confirmed"
                                    ? "default"
                                    : appointment.status === "Pending"
                                      ? "outline"
                                      : "destructive"
                                }
                                className={appointment.status === "Confirmed" ? "bg-green-500" : undefined}
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="text-sm font-medium">{appointment.clientName}</div>
                            <div className="text-sm text-muted-foreground">{appointment.service}</div>
                            <div className="text-xs text-muted-foreground">{appointment.address}</div>
                          </div>
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No appointments</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        There are no appointments scheduled for this day.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* All Appointments Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Appointments</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search appointments..." className="w-[200px] md:w-[300px] pl-8" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAppointments.map((appointment: Appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.id}</TableCell>
                          <TableCell>{appointment.clientName}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                appointment.status === "Confirmed"
                                  ? "default"
                                  : appointment.status === "Canceled"
                                    ? "destructive"
                                    : "default"
                              }
                              className={appointment.status === "Confirmed" ? "bg-green-500" : undefined}
                            >
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>5</strong> of <strong>24</strong> appointments
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" disabled>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Page</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8">
                      2
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Appointment Details Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View and edit appointment information.</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input id="id" value={selectedAppointment.id} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Input id="client" value={selectedAppointment.clientName} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={selectedAppointment.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input id="phone" value={selectedAppointment.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select defaultValue={selectedAppointment.service}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Cleaning">Regular Cleaning</SelectItem>
                    <SelectItem value="Deep Cleaning">Deep Cleaning</SelectItem>
                    <SelectItem value="Move In/Out Cleaning">Move In/Out Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedAppointment.appointmentDate.toString()}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input id="time" value={selectedAppointment.time} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedAppointment.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input id="address" value={selectedAppointment.address} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Availability Dialog */}
      <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[1000px] h-[90vh] max-h-[800px] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Manage Availability</DialogTitle>
            <DialogDescription>Select days and set your availability for each time slot.</DialogDescription>
          </DialogHeader>

          {/* Responsive layout that stacks on mobile and shows side-by-side on larger screens */}
          <div className="flex flex-col lg:flex-row h-[calc(90vh-180px)] max-h-[620px] overflow-hidden">
            {/* Calendar Selection Side - Full width on mobile, half width on desktop */}
            <div className="w-full lg:w-1/3 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r">
              <h3 className="font-medium mb-4">Select Days</h3>
              <ManageAvailabilityCalendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
            </div>

            {/* Time Slots Configuration Side - Full width on mobile, half width on desktop */}
            <div className="w-full lg:w-4/6 p-6 overflow-y-auto">
              <h3 className="font-medium mb-4">Configure Time Slots</h3>
              <TimeSlotConfiguration selectedDates={selectedDates} timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setIsTimeSlotDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              onClick={handleSaveAvailability}
            >
              Save Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ManageAvailabilityCalendarProps {
  selectedDates: Date[]
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>
}

function ManageAvailabilityCalendar({ selectedDates, setSelectedDates }: ManageAvailabilityCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  const handleDateSelect = (date: Date): void => {
    setSelectedDates((prev) => {
      // Check if date is already selected
      const isSelected = prev.some(
        (d) =>
          d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
      )

      // If selected, remove it; otherwise, add it
      if (isSelected) {
        return prev.filter(
          (d) =>
            !(
              d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear()
            ),
        )
      } else {
        return [...prev, date]
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newMonth = new Date(month)
            newMonth.setMonth(month.getMonth() - 1)
            setMonth(newMonth)
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Month</span>
        </Button>
        <h3 className="font-medium">{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newMonth = new Date(month)
            newMonth.setMonth(month.getMonth() + 1)
            setMonth(newMonth)
          }}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Month</span>
        </Button>
      </div>

      {/* Calendar with improved mobile styling */}
      <div className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          month={month}
          onMonthChange={setMonth}
          className="rounded-md border w-full max-w-[280px]"
          modifiers={{
            selected: selectedDates,
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              color: "white",
              borderRadius: "0.375rem",
            },
          }}
        />
      </div>

      {/* Selected dates with improved scrolling */}
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium">Selected Days ({selectedDates.length})</h4>
        <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1">
          {selectedDates.length > 0 ? (
            selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date, index) => (
                <Badge key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                    onClick={() => handleDateSelect(date)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))
          ) : (
            <p className="text-sm text-muted-foreground">No days selected</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface TimeSlotConfigurationProps {
  selectedDates: Date[]
  timeSlots: TimeSlotMap
  setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlotMap>>
}

function TimeSlotConfiguration({ selectedDates, timeSlots, setTimeSlots }: TimeSlotConfigurationProps) {
  // Initialize time slots for selected dates
  useEffect(() => {
    const initialTimeSlots = { ...timeSlots }

    selectedDates.forEach((date) => {
      const dateKey = date.toISOString().split("T")[0]

      // Only initialize if not already present
      if (!initialTimeSlots[dateKey]) {
        initialTimeSlots[dateKey] = {
          morning: true,
          afternoon: true,
          night: true,
        }
      }
    })

    setTimeSlots(initialTimeSlots)
  }, [selectedDates, setTimeSlots])

  const toggleTimeSlot = (dateKey: string, slot: "morning" | "afternoon" | "night"): void => {
    setTimeSlots((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [slot]: !prev[dateKey][slot],
      },
    }))
  }

  const setAllSlotsForDate = (dateKey: string, value: boolean): void => {
    setTimeSlots((prev) => ({
      ...prev,
      [dateKey]: {
        morning: value,
        afternoon: value,
        night: value,
      },
    }))
  }

  const isAnySlotSelected = (dateKey: string): boolean => {
    return timeSlots[dateKey]?.morning || timeSlots[dateKey]?.afternoon || timeSlots[dateKey]?.night || false
  }

  const areAllSlotsSelected = (dateKey: string): boolean => {
    return (timeSlots[dateKey]?.morning && timeSlots[dateKey]?.afternoon && timeSlots[dateKey]?.night) || false
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">Time Slots</h4>
      </div>

      {/* Scrollable container for time slots */}
      <div className="rounded-md border divide-y overflow-y-auto max-h-[480px]">
        {selectedDates.length > 0 ? (
          selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((date, index) => {
              const dateKey = date.toISOString().split("T")[0]
              return (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`select-all-${dateKey}`} className="text-xs text-muted-foreground">
                        {areAllSlotsSelected(dateKey) ? "Deselect All" : "Select All"}
                      </Label>
                      <input
                        type="checkbox"
                        id={`select-all-${dateKey}`}
                        checked={areAllSlotsSelected(dateKey)}
                        onChange={() => setAllSlotsForDate(dateKey, !areAllSlotsSelected(dateKey))}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Responsive grid for time slots */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-md border cursor-pointer transition-colors ${
                        timeSlots[dateKey]?.morning ? "bg-blue-50 border-blue-200 text-blue-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleTimeSlot(dateKey, "morning")}
                    >
                      <div className="text-sm font-medium">Morning</div>
                      <div className="text-xs text-muted-foreground">8am - 12pm</div>
                    </div>

                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-md border cursor-pointer transition-colors ${
                        timeSlots[dateKey]?.afternoon ? "bg-blue-50 border-blue-200 text-blue-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleTimeSlot(dateKey, "afternoon")}
                    >
                      <div className="text-sm font-medium">Afternoon</div>
                      <div className="text-xs text-muted-foreground">12pm - 5pm</div>
                    </div>

                    <div
                      className={`flex flex-col items-center justify-center p-4 rounded-md border cursor-pointer transition-colors ${
                        timeSlots[dateKey]?.night ? "bg-blue-50 border-blue-200 text-blue-700" : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleTimeSlot(dateKey, "night")}
                    >
                      <div className="text-sm font-medium">Night</div>
                      <div className="text-xs text-muted-foreground">5pm - 9pm</div>
                    </div>
                  </div>

                  {!isAnySlotSelected(dateKey) && (
                    <div className="text-xs text-red-500 mt-1">Please select at least one time slot</div>
                  )}
                </div>
              )
            })
        ) : (
          <div className="p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-2 text-sm font-medium">No days selected</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Select days from the calendar to configure availability
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

