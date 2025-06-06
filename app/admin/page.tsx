"use client"

import { useState, useEffect, useContext } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Trash2, CalendarIcon, Globe, AlertCircle, CheckCircle, Clock, X, Sun, Moon, Sparkles, ChevronLeft, ChevronRight, Info, ArrowLeft, Settings, Edit, Mail, User, Landmark, Loader2,
  Phone,
  MapPin,
  Home,
  FileText,
  Tag,
  Ruler,
  Building,
  CreditCard,
  Receipt,
  Percent,
  PiggyBank,
  CheckCircle2,
  XCircle,
  DollarSign
} from "lucide-react"
import Login from "./login"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import {tes, formatDateToSpanish, baseRequest} from "@/lib/utils"
import RevenueChart from "@/components/chart";
import AppointmentsTable from "./appointmentFilter"

const colorSchemes = {
  regularClean: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-700",
    textLight: "text-blue-600",
  },
  deepClean: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-700",
    textLight: "text-green-600",
  },
  moveInOut: {
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-700",
    textLight: "text-purple-600",
  },
  environmentPrice: {
    bg: "bg-teal-50",
    border: "border-teal-100",
    text: "text-teal-700",
    textLight: "text-teal-600",
  },
  firePrice: { bg: "bg-red-50", border: "border-red-100", text: "text-red-700", textLight: "text-red-600" },
  waterPrice: {
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    text: "text-cyan-700",
    textLight: "text-cyan-600",
  },
  deceasedPrice: {
    bg: "bg-gray-50",
    border: "border-gray-100",
    text: "text-gray-700",
    textLight: "text-gray-600",
  },
  hazmat: {
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    text: "text-yellow-700",
    textLight: "text-yellow-600",
  },
  explosiveResidue: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-700",
    textLight: "text-orange-600",
  },
  moldPrice: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    text: "text-emerald-700",
    textLight: "text-emerald-600",
  },
  constructionPrice: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
    textLight: "text-amber-600",
  },
  commercialPrice: {
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-700",
    textLight: "text-indigo-600",
  },
}

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
  zipcode: string
  chargedAmount: string
  squareFeet: number
  state: string
  profit: string
  applicationFee: string
  grossAmount: string
  paypalFee: string
  salesTax: string
  notesES?: string
}

const defaultPricing = {
  regularClean: 0,
  deepClean: 0,
  moveInOut: 0,
  environmentPrice: 0,
  firePrice: 0,
  waterPrice: 0,
  deceasedPrice: 0,
  hazmatPrice: 0,
  explosiveResiduePrice: 0,
  moldPrice: 0,
  constructionPrice: 0,
  commercialPrice: 0,
  customPrice: 0
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
  const [clients, setClients] = useState<Appointment[]>([]);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [isDeletingClients, setIsDeletingClients] = useState(false)

  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [refundAmount, setRefundAmount] = useState<string>("0");
  const [error, setError] = useState<string>("");

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlotMap>({})
  const [selectedDateForTimeSlot, setSelectedDateForTimeSlot] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [revenueData, setRevenueData] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState({
    profit: 0,
    grossRevenue: 0,
    salesTax: 0,
    paypalFees: 0,
    applicationFee: 0,
  })

  const renderStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower === "completed") {
      return (
          <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t[status] || status}
          </Badge>
      )
    } else if (statusLower === "canceled") {
      return (
          <Badge className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" />
            {t[status] || status}
          </Badge>
      )
    } else {
      return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {t[status] || status}
          </Badge>
      )
    }
  }

  const [weekViewDate, setWeekViewDate] = useState<Date>(new Date())
  const { language, setLanguage } = useContext(LanguageContext)
  const t = translations[language as Language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  const [pricing, setPricing] = useState(defaultPricing)
  const [tempPricing, setTempPricing] = useState(defaultPricing)

  const [isEditingPricing, setIsEditingPricing] = useState(false)

  const [adminEmail, setAdminEmail] = useState("")
  const [tempAdminEmail, setTempAdminEmail] = useState("")
  const [isEditingAdminEmail, setIsEditingAdminEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const [selectedClientIds, setSelectedClientIds] = useState<Set<number>>(new Set())
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // For the new client dialog
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipcode: ""
  })
  const [isAddingClient, setIsAddingClient] = useState(false)
  const [clientAddSuccess, setClientAddSuccess] = useState(false)
  const [clientFormErrors, setClientFormErrors] = useState<Record<string, string>>({})
// Function to add a new client
  const addNewClient = async () => {
    const errors: Record<string, string> = {}

    if (!newClient.name.trim()) {
      errors.name = t.requiredField
    }

    if (!newClient.email.trim()) {
      errors.email = t.requiredField
    } else if (!/^\S+@\S+\.\S+$/.test(newClient.email)) {
      errors.email = t.invalidEmail
    }

    if (!newClient.phone.trim()) {
      errors.phone = t.requiredField
    }

    if (!newClient.address.trim()) {
      errors.address = t.requiredField
    }
    if (!newClient.zipcode.trim()) {
      errors.zipcode = t.requiredField
    }
    if (Object.keys(errors).length > 0) {
      setClientFormErrors(errors)
      return
    }
    setIsAddingClient(true)
    setClientFormErrors({})

    try {
      const response = await baseRequest("POST", "/client", newClient);
      if (response?.ok) {
        setClientAddSuccess(true)
        getClients()
        setTimeout(() => {
          setNewClient({
            name: "",
            email: "",
            phone: "",
            address: "",
            zipcode: ""
          })
          setIsNewClientDialogOpen(false)
          setClientAddSuccess(false)
        }, 1000)
      } else {
        if(response?.status === 400) {
          setError("Client with that email already exists");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error(err)
      setError(t.connectionError)
    } finally {
      setIsAddingClient(false)
    }
  }
  const handleDeleteClient = async() => {
    try {
      const selectedClients = clients.filter(client => selectedClientIds.has(client.id));
      const clientIds = selectedClients.map(client => client.id);
      const response = await baseRequest("DELETE", "/clients", clientIds);
      if (response?.ok) {
        getClients();
        setSelectedClientIds(new Set());
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  }

  const handleNewClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewClient(prev => ({ ...prev, [name]: value }))
    if (clientFormErrors[name]) {
      setClientFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const toggleClientSelection = (clientId: number) => {
    const newSelection = new Set(selectedClientIds)
    if (newSelection.has(clientId)) {
      newSelection.delete(clientId)
    } else {
      newSelection.add(clientId)
    }
    setSelectedClientIds(newSelection)
  }

// Select or deselect all clients
  const toggleSelectAllClients = () => {
    if (selectedClientIds.size === clients.length) {
      setSelectedClientIds(new Set())
    } else {
      const allIds = new Set(clients.map(client => client.id))
      setSelectedClientIds(allIds)
    }
  }

  // Send emails to selected clients
  const sendEmailToClients = async () => {
    if (selectedClientIds.size === 0) return
    setIsSendingEmail(true)

    try {
      const selectedClients = clients.filter(client => selectedClientIds.has(client.id))
      const emailAddresses = selectedClients.map(client => client.email)
      const body = {
        clientEmails: emailAddresses,
        subject: emailSubject,
        message: emailBody
      };
      baseRequest("POST", "/clients/email", body);
      setEmailSent(true)
      setTimeout(() => {
        setEmailSubject("")
        setEmailBody("")
        setIsEmailDialogOpen(false)
        setEmailSent(false)
      }, 1000);
    } catch (err) {
      console.error(err)
      setError("An error occurred while sending emails")
    } finally {
      setIsSendingEmail(false)
    }
  }


  // Add a new state to track the current month displayed in the calendar
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date())

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
      if (app.status.toLowerCase() === type.toLowerCase()) count++
    }

    return count
  }

  useEffect(() => {
    async function authenticate() {
      try {
        const response = await baseRequest("GET", "/authenticate");
        if (response?.ok) {
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
      const response = await baseRequest("GET", "/appointments");
      if (response?.ok) {
        const appointments = await response?.json()
        for (let i = 0; i < appointments.length; i++) {
          const appointmentDate = new Date(appointments[i].appointmentDate)
          if (appointmentDate < new Date()) {
            appointments[i].status = "completed"
          }
        }
        setAllAppointments(appointments);
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function getClients() {
    try {
      const response = await baseRequest("GET", "/clients");
      if (response?.ok) {
        const appointments = await response?.json()
        setClients(appointments);
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (auth) {
      getAppointments();
      getRevenueDetails();
      getClients();
    }
  }, [auth])

  async function getRevenueDetails() {
    try {
      const response = await baseRequest("GET", "/paypal-info");
      if (response?.ok) {
        const details = await response?.json()
        setYearlyRevenue(details.yearlyRevenue);
        setRevenueData(details.monthlyRevenue);
        setFinancialMetrics({
          profit: details.profit || 0,
          grossRevenue: details.gross || 0,
          salesTax: details.salesTax || 0,
          paypalFees: details.paypalFee || 0,
          applicationFee: details.applicationFee || 0,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    async function adminDetails() {
      try {
        const response = await baseRequest("GET", "/service-details");
        if (response?.ok) {
          const details: any = await response?.json()
          const vals = {
            regularClean: Number.parseFloat(details.regularPrice),
            deepClean: Number.parseFloat(details.deepCleanPrice),
            moveInOut: Number.parseFloat(details.moveInOutPrice),
            environmentPrice: Number.parseFloat(details.environmentPrice),
            hazmatPrice: Number.parseFloat(details.hazmatPrice),
            firePrice: Number.parseFloat(details.firePrice),
            waterPrice: Number.parseFloat(details.waterPrice),
            deceasedPrice: Number.parseFloat(details.deceasedPrice),
            explosiveResiduePrice: Number.parseFloat(details.explosiveResiduePrice),
            moldPrice: Number.parseFloat(details.moldPrice),
            constructionPrice: Number.parseFloat(details.constructionPrice),
            commercialPrice: Number.parseFloat(details.commercialPrice),
            customPrice: Number.parseFloat(details.customPrice),
          }

          setPricing(vals)
          setTempPricing(vals)
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
      const cleanedTimeSlots = cleanUpTimeSlots()
      const availabilityObj = []
      for (const key in cleanedTimeSlots) {
        availabilityObj.push({ ...cleanedTimeSlots[key], date: key, available: true })
      }
      const response = await baseRequest("POST", "/availability", availabilityObj);
      if (response?.ok) {
        await getAvailability()
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        const errorData = await response?.json().catch(() => null)
        const errorMsg = errorData?.message || `Server error: ${response?.status} ${response?.statusText}`
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
      const body = {
        regularPrice: tempPricing.regularClean.toFixed(2),
        moveInOutPrice: tempPricing.moveInOut.toFixed(2),
        deepCleanPrice: tempPricing.deepClean.toFixed(2),
        environmentPrice: tempPricing.environmentPrice.toFixed(2),
        firePrice: tempPricing.firePrice.toFixed(2),
        waterPrice: tempPricing.waterPrice.toFixed(2),
        deceasedPrice: tempPricing.deceasedPrice.toFixed(2),
        hazmatPrice: tempPricing.hazmatPrice.toFixed(2),
        explosiveResiduePrice: tempPricing.explosiveResiduePrice.toFixed(2),
        moldPrice: tempPricing.moldPrice.toFixed(2),
        constructionPrice: tempPricing.constructionPrice.toFixed(2),
        commercialPrice: tempPricing.commercialPrice.toFixed(2),
        customPrice: tempPricing.customPrice.toFixed(2),
      };
      const response = await baseRequest("PUT", "/update-admin-pricing", body);
      if (response?.ok) {
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
      const response = await baseRequest("PUT", "/update-admin-email", tempAdminEmail);
      if (response?.ok) {
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
      const currDate = new Date(year, month - 1, day)
      if (!isDateInPast(currDate)) second.push(currDate)
    }
    setTimeSlots(first)
    setSelectedDates(second)
  }

  async function getAvailability() {
    try {
      const response = await baseRequest("GET", "/availability");
      if (response?.ok) {
        const json = await response?.json()
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
  const filteredAppointments = allAppointments
      .filter((appointment) => {
        const q = searchQuery.toLowerCase()
        const nameMatch    = appointment.clientName.toLowerCase().includes(q)
        const emailMatch   = appointment.email.toLowerCase().includes(q)
        const serviceMatch = appointment.service.toLowerCase().includes(q)
        const statusMatch  = appointment.status.toLowerCase().includes(q)

        // format appointmentDate to "MM/DD/YYYY"
        const dateStr = new Date(appointment.appointmentDate)
            .toLocaleDateString('en-US')  // e.g. "5/1/2025"
            .toLowerCase()

        const dateMatch = dateStr.includes(q)

        return nameMatch || emailMatch || serviceMatch || statusMatch || dateMatch
      })

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

  // Get start and end dates of a week
  const getWeekDates = (date: Date) => {
    const day = date.getDay() // 0 is Sunday, 6 is Saturday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(date)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    return { monday, sunday }
  }

  // Get appointments for a specific week
  const getWeekAppointments = (date: Date) => {
    const { monday, sunday } = getWeekDates(date)

    return allAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate)
      return appointmentDate >= monday && appointmentDate <= sunday
    })
  }

  // Navigate to previous or next week
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(weekViewDate)
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7))
    setWeekViewDate(newDate)
  }

  const isDateInPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date <= today
  }

  // Update the selectCurrentMonth function to use the tracked month instead of the current system month
  const selectCurrentMonth = () => {
    // Use the tracked calendar month instead of the current system month
    const year = currentCalendarMonth.getFullYear()
    const month = currentCalendarMonth.getMonth()

    // Get the first and last day of the displayed month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Create array of all dates in the month
    const datesInMonth = []
    const currentDate = new Date(firstDay)

    while (currentDate <= lastDay) {
      // Only add dates that aren't in the past
      if (!isDateInPast(currentDate)) {
        datesInMonth.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Create a map of existing dates for quick lookup
    const existingDatesMap = {}
    selectedDates.forEach((date) => {
      existingDatesMap[formatDateKey(date)] = true
    })

    // Filter out dates that are already selected
    const newDatesToAdd = datesInMonth.filter((date) => {
      const dateKey = formatDateKey(date)
      return !existingDatesMap[dateKey]
    })

    // Merge existing dates with new dates
    const updatedDates = [...selectedDates, ...newDatesToAdd]

    // Update selected dates
    setSelectedDates(updatedDates)

    // Create time slots for newly added dates
    const newTimeSlots = { ...timeSlots }
    newDatesToAdd.forEach((date) => {
      const dateKey = formatDateKey(date)
      if (!newTimeSlots[dateKey]) {
        newTimeSlots[dateKey] = { morning: true, afternoon: true, night: true }
      }
    })

    setTimeSlots(newTimeSlots)
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
              <Clock className="mr-1 h-3 w-3" /> {t["confirmed"]}
            </Badge>
        )
      case "completed":
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="mr-1 h-3 w-3" /> {t["completed"]}
            </Badge>
        )
      case "canceled":
        return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <X className="mr-1 h-3 w-3" /> {t["canceled"]}
            </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Sort dates chronologically
  const sortedSelectedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())

  async function cancelAppointment(appointment: Appointment, refundAmount: string) {
    setLoading(true)

    try {
      const response = await baseRequest("POST", "/cancel-appointment", {appointment, refundAmount})
      setIsEditDialogOpen(false)
      if (response?.ok) {
        await getAppointments()
        await getRevenueDetails()
        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setErrorMessage(t["settings.cancel.appointment.error"])
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      }
    } catch (err) {
      console.log(err)
      setErrorMessage(t["settings.cancel.appointment.error"])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setLoading(false);
    setIsCancelling(false);
    setSelectedAppointment(null);
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
                        value="weekView"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      {t["tabs.week_view"] || "Week View"}
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
                        value="Graph"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      {t["revenue.chart"]}
                    </TabsTrigger>

                    <TabsTrigger
                        value="settings"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      {t["tabs.settings"]}
                    </TabsTrigger>
                    <TabsTrigger
                        value="clients"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      {t["tab.clients"]}
                    </TabsTrigger>
                  </TabsList>
                   <TabsContent value="clients">
                     <Card>
                       <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                           <CardTitle>{t["admin.contacts.title"]}</CardTitle>
                           <CardDescription>{t["admin.contacts.description"]}</CardDescription>
                         </div>

                         <div className="flex flex-col sm:flex-row gap-2">
                         <Button
                             disabled={selectedClientIds.size === 0}
                             onClick={() => setIsEmailDialogOpen(true)}
                             className="flex items-center gap-2"
                         >
                           <Mail className="h-4 w-4" />
                           {t.sendEmail}
                         </Button>

                         <Button
                             onClick={() => setIsNewClientDialogOpen(true)}
                             variant="outline"
                             className="flex items-center gap-2"
                         >
                           <User className="h-4 w-4" />
                           {t.addClient}
                         </Button>
                                   {/* Add delete button here */}
                           <Button
                               disabled={selectedClientIds.size === 0}
                               onClick={() => setIsDeleteConfirmationOpen(true)}
                               variant="destructive"
                               className="flex items-center gap-2"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </CardHeader>
                       <CardContent>
                         <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                           <Input
                               placeholder={t["admin.contacts.search"]}
                               value={searchQuery}
                               onChange={(e) => setSearchQuery(e.target.value)}
                               className="max-w-sm"
                           />
                           <div className="flex items-center gap-2">
                             <Checkbox
                                 id="selectAll"
                                 checked={clients.length > 0 && selectedClientIds.size === clients.length}
                                 onCheckedChange={toggleSelectAllClients}
                             />
                             <Label htmlFor="selectAll">{t.selectAll}</Label>
                           </div>
                         </div>
                         <div className="overflow-x-auto">
                           <Table className="w-full">
                             <TableHeader>
                               <TableRow>
                                 <TableHead className="w-10"></TableHead>
                                 <TableHead className="whitespace-nowrap">{t["admin.tab.clients"]}</TableHead>
                                 <TableHead className="hidden sm:table-cell">{t.email}</TableHead>
                                 <TableHead className="hidden md:table-cell">{t.phone}</TableHead>
                                 <TableHead className="hidden lg:table-cell">{t.address}</TableHead>
                                 <TableHead className="hidden lg:table-cell">{t["label.zipcode"]}</TableHead>
                               </TableRow>
                             </TableHeader>
                             <TableBody>
                               {clients
                                   .filter(client =>
                                       client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                       client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                       client.phone.includes(searchQuery) ||
                                       client.address.includes(searchQuery) ||
                                       client.zipcode.includes(searchQuery)
                                   )
                                   .map((client, index) => (
                                       <TableRow key={index}>
                                         <TableCell className="px-2">
                                           <Checkbox
                                               checked={selectedClientIds.has(client.id)}
                                               onCheckedChange={() => toggleClientSelection(client.id)}
                                           />
                                         </TableCell>
                                         <TableCell className="font-medium">
                                           {client.name}
                                           <div className="sm:hidden text-sm text-muted-foreground mt-1">
                                             {client.email}
                                           </div>
                                           <div className="md:hidden text-sm text-muted-foreground mt-0.5">
                                             {client.phone}
                                           </div>
                                         </TableCell>
                                         <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                                         <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                                         <TableCell className="hidden lg:table-cell">{client.address}</TableCell>
                                         <TableCell className="hidden lg:table-cell">{client.zipcode}</TableCell>
                                       </TableRow>
                                   ))}
                             </TableBody>
                           </Table>
                         </div>
                       </CardContent>
                     </Card>
                     {/* Delete Confirmation Dialog */}
                     <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
                       <AlertDialogContent>
                         <AlertDialogHeader>
                           <AlertDialogTitle>{t.confirmDeletion}</AlertDialogTitle>
                           <AlertDialogDescription>
                             {t.deleteConfirmationMessage?.replace("{count}", selectedClientIds.size.toString())}
                             {selectedClientIds.size === 1 ? " " + t.client : " " + t.clients}. {t.thisActionCannotBeUndone}
                           </AlertDialogDescription>
                         </AlertDialogHeader>
                             {/** ← conditional error message */}
                         {error && (
                             <div className="px-6 py-2 text-sm text-destructive">
                               {error}
                             </div>
                         )}
                         <AlertDialogFooter>
                           <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                           <AlertDialogAction
                               onClick={handleDeleteClient}
                               disabled={isDeletingClients}
                               className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
                           >
                             {isDeletingClients ? t.deleting : t.delete}
                             {isDeletingClients && <Loader2 className="h-4 w-4 animate-spin" />}
                           </AlertDialogAction>
                         </AlertDialogFooter>
                       </AlertDialogContent>
                     </AlertDialog>
                     {/* Email Dialog */}
                     <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                       <DialogContent className="sm:max-w-md">
                         <DialogHeader>
                           <DialogTitle>{t.sendEmail}</DialogTitle>
                           <DialogDescription>
                             {t.sendingEmailTo} {selectedClientIds.size} {selectedClientIds.size === 1 ? t.client : t.clients}
                           </DialogDescription>
                         </DialogHeader>
                         <div className="space-y-4 py-2">
                           <div className="space-y-2">
                             <Label htmlFor="subject">{t.subject}</Label>
                             <Input
                                 id="subject"
                                 value={emailSubject}
                                 onChange={(e) => setEmailSubject(e.target.value)}
                                 placeholder={t.emailSubjectPlaceholder}
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="message">{t.message}</Label>
                             <textarea
                                 id="message"
                                 value={emailBody}
                                 onChange={(e) => setEmailBody(e.target.value)}
                                 placeholder={t.emailMessagePlaceholder}
                                 className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                             />
                           </div>
                         </div>
                         <DialogFooter>
                           <Button type="button" variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                             {t.cancel}
                           </Button>
                           <Button
                               type="submit"
                               onClick={sendEmailToClients}
                               disabled={!emailSubject || !emailBody || isSendingEmail}
                               className="flex items-center gap-2"
                           >
                             {isSendingEmail ? t.sending : emailSent ? t.sent : t.send}
                             {isSendingEmail && <span className="animate-spin">⏳</span>}
                             {emailSent && <CheckCircle className="h-4 w-4" />}
                           </Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>

                     <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
                       <DialogContent className="sm:max-w-md">
                         <DialogHeader>
                           <DialogTitle>{t.addNewClient}</DialogTitle>
                           <DialogDescription>
                             {t.addNewClientDesc}
                           </DialogDescription>
                         </DialogHeader>

                         {/* Display form-level error at the top for better visibility */}
                         {error && (
                             <div
                                 className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2 mb-4"
                                 role="alert"
                                 aria-live="assertive"
                             >
                               <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                               <div>
                                 <p className="font-medium">{t.errorOccurred || 'An error occurred'}</p>
                                 <p className="text-sm">{error}</p>
                               </div>
                             </div>
                         )}

                         <div className="space-y-4 py-2">
                           <div className="space-y-2">
                             <Label htmlFor="name" className="flex items-center gap-1">
                               {t.name} <span className="text-red-500">*</span>
                             </Label>
                             <Input
                                 id="name"
                                 name="name"
                                 value={newClient.name}
                                 onChange={handleNewClientInputChange}
                                 placeholder={t.namePlaceholder}
                                 className={clientFormErrors.name ? "border-red-500 ring-red-200 focus-visible:ring-red-200" : ""}
                                 aria-invalid={!!clientFormErrors.name}
                                 aria-describedby={clientFormErrors.name ? "name-error" : undefined}
                             />
                             {clientFormErrors.name && (
                                 <p id="name-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                   <AlertCircle className="h-3 w-3" />
                                   {clientFormErrors.name}
                                 </p>
                             )}
                           </div>

                           <div className="space-y-2">
                             <Label htmlFor="email" className="flex items-center gap-1">
                               {t.email} <span className="text-red-500">*</span>
                             </Label>
                             <Input
                                 id="email"
                                 name="email"
                                 type="email"
                                 value={newClient.email}
                                 onChange={handleNewClientInputChange}
                                 placeholder={t.emailPlaceholder}
                                 className={clientFormErrors.email ? "border-red-500 ring-red-200 focus-visible:ring-red-200" : ""}
                                 aria-invalid={!!clientFormErrors.email}
                                 aria-describedby={clientFormErrors.email ? "email-error" : undefined}
                             />
                             {clientFormErrors.email && (
                                 <p id="email-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                   <AlertCircle className="h-3 w-3" />
                                   {clientFormErrors.email}
                                 </p>
                             )}
                           </div>

                           <div className="space-y-2">
                             <Label htmlFor="phone" className="flex items-center gap-1">
                               {t.phone} <span className="text-red-500">*</span>
                             </Label>
                             <Input
                                 id="phone"
                                 name="phone"
                                 value={newClient.phone}
                                 onChange={handleNewClientInputChange}
                                 placeholder={t.phonePlaceholder}
                                 className={clientFormErrors.phone ? "border-red-500 ring-red-200 focus-visible:ring-red-200" : ""}
                                 aria-invalid={!!clientFormErrors.phone}
                                 aria-describedby={clientFormErrors.phone ? "phone-error" : undefined}
                             />
                             {clientFormErrors.phone && (
                                 <p id="phone-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                   <AlertCircle className="h-3 w-3" />
                                   {clientFormErrors.phone}
                                 </p>
                             )}
                           </div>

                           <div className="space-y-2">
                             <Label htmlFor="address" className="flex items-center gap-1">
                               {t.address} <span className="text-red-500">*</span>
                             </Label>
                             <Input
                                 id="address"
                                 name="address"
                                 value={newClient.address}
                                 onChange={handleNewClientInputChange}
                                 placeholder={t.addressPlaceholder}
                                 className={clientFormErrors.address ? "border-red-500 ring-red-200 focus-visible:ring-red-200" : ""}
                                 aria-invalid={!!clientFormErrors.address}
                                 aria-describedby={clientFormErrors.address ? "address-error" : undefined}
                             />
                             {clientFormErrors.address && (
                                 <p id="address-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                   <AlertCircle className="h-3 w-3" />
                                   {clientFormErrors.address}
                                 </p>
                             )}
                           </div>

                           <div className="space-y-2">
                             <Label htmlFor="zipcode" className="flex items-center gap-1">
                               {t.zipcode} <span className="text-red-500">*</span>
                             </Label>
                             <Input
                                 id="zipcode"
                                 name="zipcode"
                                 value={newClient.zipcode}
                                 onChange={handleNewClientInputChange}
                                 placeholder={t.zipcodePlaceholder}
                                 className={clientFormErrors.zipcode ? "border-red-500 ring-red-200 focus-visible:ring-red-200" : ""}
                                 aria-invalid={!!clientFormErrors.zipcode}
                                 aria-describedby={clientFormErrors.zipcode ? "zipcode-error" : undefined}
                             />
                             {clientFormErrors.zipcode && (
                                 <p id="zipcode-error" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                   <AlertCircle className="h-3 w-3" />
                                   {clientFormErrors.zipcode}
                                 </p>
                             )}
                           </div>
                         </div>

                         <DialogFooter className="mt-6">
                           <Button type="button" variant="outline" onClick={() => setIsNewClientDialogOpen(false)}>
                             {t.cancel}
                           </Button>
                           <Button
                               type="submit"
                               onClick={addNewClient}
                               disabled={isAddingClient}
                               className="flex items-center gap-2"
                           >
                             {isAddingClient ? t.adding : clientAddSuccess ? t.added : t.add}
                             {isAddingClient && <Loader2 className="h-4 w-4 animate-spin" />}
                             {clientAddSuccess && <CheckCircle className="h-4 w-4" />}
                           </Button>
                         </DialogFooter>
                       </DialogContent>
                     </Dialog>
                   </TabsContent>
                  <TabsContent value="Graph">
                    <RevenueChart
                        data={revenueData}
                        title={t["monthly.gross.revenue"]}
                        description=""
                        showDataLabels={true}
                        lineColor="rgb(59, 130, 246)"
                        fillColor="rgba(59, 130, 246, 0.1)"
                    />

                    {/* —— YEARLY REVENUE TABLE —— */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-2">
                        {t["chart.yearly_revenue"] || 'Past Yearly Revenue'}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                              {t["table.year"] || 'Year'}
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              {t["table.revenue"] || 'Revenue'}
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              {t["table.profit"] || 'Profit'}
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              {t["table.sales_tax_due"] || 'Sales Tax Due'}
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              {t["table.paypal_fee"] || 'PayPal Fee'}
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-500">
                              {t["table.applicationFee"]}
                            </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {yearlyRevenue.map(({ year, revenue, profit, salesTax, paypalFee, applicationFee}) => (
                              <tr key={year}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {year}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {revenue?.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {profit?.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {salesTax?.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {paypalFee?.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {applicationFee?.toLocaleString(undefined, {
                                    style: 'currency',
                                    currency: 'USD',
                                  })}
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* —— end table —— */}
                  </TabsContent>

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
                          <div className="text-2xl font-bold text-blue-600">{searchForCount("confirmed")}</div>
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

                    {/* Financial Metrics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-6">
                      <Card className="border-green-100 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-2">
                            <Landmark className="h-5 w-5 text-green-600" />
                          </div>
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t["admin.dashboard.gross"]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            ${financialMetrics.grossRevenue.toFixed(2)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-emerald-100 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="inline-flex items-center justify-center p-2 bg-emerald-100 rounded-full mb-2">
                            <Sparkles className="h-5 w-5 text-emerald-600" />
                          </div>
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t["admin.dashboard.profit"]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-emerald-600">${financialMetrics.profit.toFixed(2)}</div>
                        </CardContent>
                      </Card>

                      <Card className="border-amber-100 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-2">
                            <Landmark className="h-5 w-5 text-amber-600" />
                          </div>
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t["admin.dashboard.sales_tax"]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-amber-600">${financialMetrics.salesTax.toFixed(2)}</div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-100 hover:shadow-md transition-shadow hidden">
                        <CardHeader className="pb-2">
                          <div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-full mb-2">
                            <Landmark className="h-5 w-5 text-purple-600" />
                          </div>
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {t["admin.dashboard.paypal_fees"]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            ${financialMetrics.paypalFees.toFixed(2)}
                          </div>
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
                          <CardDescription>
                            {date && language === "es"
                                ? formatDateToSpanish(format(date, "EEEE, MMMM d, yyyy"))
                                : date && language === "en"
                                    ? format(date, "EEE, MMM d, yyyy")
                                    : t["select.a.date"]}
                          </CardDescription>
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
                                          <TableCell>{t[appointment.time]}</TableCell>
                                          <TableCell>{t[appointment.service]}</TableCell>
                                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                          <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={async () => {
                                                  if (language === "es") appointment.notesES = await tes(appointment.notes);
                                                  setSelectedAppointment(appointment);
                                                  setIsEditDialogOpen(true);
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
                                  {upcomingAppointments
                                      .slice(0, 5)
                                      .filter((appointment) => appointment.status !== "canceled")
                                      .map((appointment) => (
                                          <TableRow key={appointment.id}>
                                            <TableCell className="font-medium">{appointment.bookingId}</TableCell>
                                            <TableCell className="font-medium">{appointment.clientName}</TableCell>
                                            <TableCell>
                                              <div className="flex flex-col">
                                      <span>
                                        {language === "en"
                                            ? format(new Date(appointment.appointmentDate), "MMM d, yyyy")
                                            : formatDateToSpanish(
                                                format(new Date(appointment.appointmentDate), "MMM d, yyyy"),
                                                false,
                                            )}
                                      </span>
                                                <span className="text-sm text-muted-foreground">{t[appointment.time]}</span>
                                              </div>
                                            </TableCell>
                                            <TableCell>{t[appointment.service]}</TableCell>

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
                                                  onClick={async () => {
                                                    if (language === "es") appointment.notesES = await tes(appointment.notes);
                                                    setSelectedAppointment(appointment);
                                                    setIsEditDialogOpen(true);
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* All Appointments Tab */}
                  <TabsContent value="appointments">
                    <AppointmentsTable
                        appointments={allAppointments}
                        language={language}
                        t={t}
                        formatDateToSpanish={formatDateToSpanish}
                        getStatusBadge={getStatusBadge}
                        tes={tes}
                        setSelectedAppointment={setSelectedAppointment}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                    />

                  </TabsContent>

                  {/* Week View Tab */}
                  <TabsContent value="weekView">
                    <Card className="border-blue-100 hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle>{t["week_view.title"] || "Weekly Schedule"}</CardTitle>
                        <CardDescription>
                          {t["week_view.description"] || "View and manage appointments for the week"}
                        </CardDescription>

                        <div className="flex items-center justify-between mt-4">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigateWeek("prev")}
                              className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {t["week_view.prev_week"] || "Previous Week"}
                          </Button>

                          <div className="text-center font-medium">
                            {(() => {
                              const { monday, sunday } = getWeekDates(weekViewDate)
                              return language === "en"
                                  ? `${format(monday, "MMM d")} - ${format(sunday, "MMM d, yyyy")}`
                                  : `${formatDateToSpanish(format(monday, "MMM d, yyyy"), false)} - ${formatDateToSpanish(format(sunday, "MMM d, yyyy"), false)}`
                            })()}
                          </div>

                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigateWeek("next")}
                              className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {t["week_view.next_week"] || "Next Week"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {Array.from({ length: 7 }).map((_, index) => {
                            const date = new Date(getWeekDates(weekViewDate).monday)
                            date.setDate(date.getDate() + index)

                            return (
                                <div key={index} className="text-center">
                                  <div className="font-medium mb-1">
                                    {language === "en"
                                        ? format(date, "EEE")
                                        : formatDateToSpanish(format(date, "EEE"), true)}
                                  </div>
                                  <div
                                      className={`text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto
                              ${areDatesOnSameDay(date, new Date()) ? "bg-blue-500 text-white" : ""}`}
                                  >
                                    {date.getDate()}
                                  </div>
                                </div>
                            )
                          })}
                        </div>

                        <div className="space-y-4">
                          {(() => {
                            const weekAppointments = getWeekAppointments(weekViewDate)

                            if (weekAppointments.length === 0) {
                              return (
                                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                    {t["week_view.no_appointments"]}
                                  </div>
                              )
                            }

                            // Group appointments by day
                            const dayGroups = Array.from({ length: 7 }).map((_, index) => {
                              const date = new Date(getWeekDates(weekViewDate).monday)
                              date.setDate(date.getDate() + index)

                              const dayAppointments = weekAppointments.filter((appointment) =>
                                  areDatesOnSameDay(new Date(appointment.appointmentDate), date),
                              )

                              return { date, appointments: dayAppointments }
                            })

                            return dayGroups
                                .map((group, groupIndex) => {
                                  if (group.appointments.length === 0) return null

                                  return (
                                      <div key={groupIndex} className="border rounded-lg overflow-hidden">
                                        <div
                                            className={`py-2 px-4 font-medium ${
                                                areDatesOnSameDay(group.date, new Date())
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-blue-50 text-blue-700"
                                            }`}
                                        >
                                          {language === "en"
                                              ? format(group.date, "EEEE, MMMM d, yyyy")
                                              : formatDateToSpanish(format(group.date, "EEEE, MMMM d, yyyy"))}
                                        </div>

                                        <div className="divide-y">
                                          {group.appointments.map((appointment, index) => {
                                            const serviceColor = (() => {
                                              switch (appointment.service) {
                                                case "regularClean":
                                                  return colorSchemes.regularClean
                                                case "deepClean":
                                                  return colorSchemes.deepClean
                                                case "moveInOut":
                                                  return colorSchemes.moveInOut
                                                default:
                                                  return colorSchemes.regularClean
                                              }
                                            })()

                                            return (
                                                <div key={index} className="p-4 hover:bg-gray-50">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-start gap-3">
                                                      <div
                                                          className={`w-2 h-full min-h-[24px] rounded-full ${serviceColor.bg} ${serviceColor.border}`}
                                                      ></div>
                                                      <div>
                                                        <div className="font-medium">{appointment.clientName}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                          <Clock className="h-3 w-3" />
                                                          {t[appointment.time]}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                          {t[appointment.service]}
                                                        </div>
                                                      </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                      {getStatusBadge(appointment.status)}
                                                      <Button
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={async() => {
                                                            if (language === "es") appointment.notesES = await tes(appointment.notes);
                                                            setSelectedAppointment(appointment);
                                                            setIsEditDialogOpen(true);
                                                          }}
                                                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                      >
                                                        {t["button.view_details"]}
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                  )
                                })
                                .filter(Boolean)
                          })()}
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
                                  <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-200 hover:bg-green-50 hover:text-green-600"
                                        onClick={selectCurrentMonth}
                                    >
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      <span>{t["select.current.month"]}</span>
                                    </Button>
                                  </div>
                                </div>

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
                                    onMonthChange={setCurrentCalendarMonth}
                                    defaultMonth={currentCalendarMonth}
                                    disabled={isDateInPast}
                                    className="rounded-md"
                                    modifiersClassNames={{
                                      selected: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
                                    }}
                                />
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
                                                        <div className="font-medium text-sm">
                                                          {language === "en"
                                                              ? format(date, "MMM d, yyyy")
                                                              : formatDateToSpanish(format(date, "MMM d, yyyy"), true)}
                                                        </div>
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                              {Object.entries(tempPricing || pricing).map(([key, value]) => {
                                const colorScheme = colorSchemes[key] || {
                                  bg: "bg-slate-50",
                                  border: "border-slate-100",
                                  text: "text-slate-700",
                                  textLight: "text-slate-600",
                                }
                                // Format the key for display (convert camelCase to Title Case with spaces)
                                const formattedKey = key
                                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                                    .replace(/Price$/, " Price") // Add space before "Price" if it's at the end

                                return (
                                    <div key={key} className={`p-4 rounded-lg border ${colorScheme.border} ${colorScheme.bg}`}>
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                          <h4 className={`text-lg font-medium ${colorScheme.text}`}>
                                            {t[`settings.pricing.${key}.title`] || formattedKey}
                                          </h4>
                                          <p className={`text-sm ${colorScheme.textLight} mt-1`}>
                                            {t[`settings.pricing.${key}.description`] ||
                                                `Set the price for ${formattedKey.toLowerCase()} services`}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="flex flex-col items-end">
                        <span className={`text-2xl font-bold ${colorScheme.text}`}>
                          $
                          {isEditingPricing ? (
                              <Input
                                  type="number"
                                  value={tempPricing[key]}
                                  min={0}
                                  onChange={(e) =>
                                      setTempPricing({
                                        ...tempPricing,
                                        [key]: Number.parseFloat(e.target.value) || 0,
                                      })
                                  }
                                  className="w-24 h-8 inline-block text-center"
                              />
                          ) : (
                              pricing[key]
                          )}
                        </span>
                                            <span className={`text-xs ${colorScheme.textLight}`}>{t["per.square.foot"]}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                )
                              })}
                            </div>

                            {!isEditingPricing && (
                                <div className="mt-6 p-4 rounded-lg border border-blue-100 bg-blue-50">
                                  <div className="flex items-center">
                                    <Info className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-blue-700">
                                      {t["settings.pricing.info"]} {t["settings.all.square"]}
                                    </p>
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
                                      <h4 className="text-lg font-medium text-purple-700">{t["settings.admin.email.email_title"]}</h4>
                                      <p className="text-sm text-purple-600 mt-1">{t["settings.admin.email.email_description"]}</p>
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

                {/* Appointment Details Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader className="pb-2">
                      <DialogTitle className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                        {t["dialog.appointment.title"]}
                      </DialogTitle>
                      <DialogDescription className="text-gray-500">{t["dialog.appointment.description"]}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                      {/* Booking ID and Status */}
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-sm px-3 py-1 border-blue-200 flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {selectedAppointment?.bookingId}
                        </Badge>
                        {selectedAppointment && renderStatusBadge(selectedAppointment?.status)}
                      </div>

                      {/* Client Information */}
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.client_name"]}</p>
                              <p className="font-medium">{selectedAppointment?.clientName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Building className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.service"]}</p>
                              <p className="font-medium">{selectedAppointment && t[selectedAppointment.service]}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Mail className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.email"]}</p>
                              <p className="font-medium break-words">{selectedAppointment?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Phone className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.phone"]}</p>
                              <p className="font-medium">{selectedAppointment?.phone}</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Location Information */}
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Home className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.address"]}</p>
                              {selectedAppointment && (
                                  <p className="font-medium">
                                    {selectedAppointment.address}
                                  </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.state"]}</p>
                              <p className="font-medium">{selectedAppointment?.state}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.zipcode"]}</p>
                              {selectedAppointment && (
                                  <p className="font-medium">
                                    {selectedAppointment.zipcode}
                                  </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Ruler className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.square_feet"]}</p>
                              <p className="font-medium">{selectedAppointment?.squareFeet?.toLocaleString()} sq ft</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Appointment Details */}
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.date"]}</p>
                              <p className="font-medium">
                                {selectedAppointment && format(new Date(selectedAppointment.appointmentDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div>
                              <p className="text-sm text-gray-500">{t["dialog.appointment.label.time"]}</p>
                              <p className="font-medium">{selectedAppointment && t[selectedAppointment.time]}</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Financial Information */}
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <CreditCard className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.amount.charged"] || "Charged Amount"}</p>
                              <p className="font-medium text-green-600">${selectedAppointment?.chargedAmount?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Receipt className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.amount.gross"]}</p>
                              <p className="font-medium">${selectedAppointment?.grossAmount?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Percent className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.fee.application"]}</p>
                              <p className="font-medium text-amber-600">${selectedAppointment?.applicationFee?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <Percent className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.fee.paypal"]}</p>
                              <p className="font-medium text-amber-600">${selectedAppointment?.paypalFee?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <PiggyBank className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.profit"]}</p>
                              <p className="font-medium text-green-600">${selectedAppointment?.profit?.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 text-gray-400">
                              <DollarSign className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">{t["label.salesTax"]}</p>
                              <p className="font-medium text-amber-600">${selectedAppointment?.salesTax?.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Notes */}
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-3 items-start gap-4">
                          <div className="col-span-3">
                            <p className="font-medium">{language === "en" ? "English Notes:" : "Notas en Español:"}</p>
                            <p className="font-medium break-words whitespace-pre-wrap w-full overflow-hidden text-wrap">
                              {selectedAppointment && (language === "en" ? selectedAppointment.notes : selectedAppointment.notesES)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0 mt-4">
                      {selectedAppointment && selectedAppointment.status.toLowerCase() !== "canceled" && (
                          <Button
                              variant="destructive"
                              onClick={() => {
                                setIsEditDialogOpen(false)
                                setIsCancelling(true)
                              }}
                              disabled={loading}
                              className="w-full sm:w-auto flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            {t["dialog.appointment.button.cancel"]}
                          </Button>
                      )}
                      <Button
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {t["dialog.appointment.button.close"]}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isCancelling && selectedAppointment} onOpenChange={setIsCancelling}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{t["dialog.refund.title"]}</DialogTitle>
                      <DialogDescription>
                        {t["dialog.refund.description"]}
                        {parseFloat(selectedAppointment?.chargedAmount) > 0 && ` Maximum refund amount: $${selectedAppointment.chargedAmount}.`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {error && <p className="text-sm text-red-500 ">{error}</p>}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="refundAmount" className="text-right">
                          {t["dialog.refund.label.amount"]}
                        </Label>
                        <div className="col-span-3 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                              id="refundAmount"
                              type="number"
                              value={refundAmount}
                              onChange={(e) => {
                                const value = Number.parseFloat(e.target.value)
                                const maxAmount = parseFloat(selectedAppointment?.chargedAmount) || 0

                                if (isNaN(value)) {
                                  setRefundAmount(e.target.value)
                                  setError("");
                                } else if (value > maxAmount) {
                                  setError(`Amount cannot exceed $${maxAmount}`)
                                  setRefundAmount(maxAmount.toString())
                                } else if (value < 0) {
                                  setError("Amount cannot be negative")
                                  setRefundAmount("0")
                                } else {
                                  setError("")
                                  setRefundAmount(e.target.value)
                                }
                              }}
                              className="pl-7"
                              min="0"
                              max={selectedAppointment?.chargedAmount}
                              step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCancelling(false)}>
                        {t["dialog.refund.button.cancel"]}
                      </Button>
                      <Button
                          variant="destructive"
                          onClick={() => cancelAppointment(selectedAppointment, refundAmount)}
                          disabled={
                              loading || error !== "" || isNaN(Number.parseFloat(refundAmount)) || Number.parseFloat(refundAmount) <= 0
                          }
                      >
                        {t["dialog.refund.button.confirm"]}
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
