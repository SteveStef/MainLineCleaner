"use client"

import type React from "react"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import { Checkbox } from "@/components/ui/checkbox"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useState, useEffect, useContext } from "react"
import { format, addDays, isSameDay, isToday } from "date-fns"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Home,
  MessageSquare,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  Check,
  Award,
  CreditCard,
  Info,
  Loader2,
  MapPin,
  Square,
} from "lucide-react"

import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatDateToSpanish } from "@/lib/utils"
import Header from "../Header"
import Footer from "../Footer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export interface ServiceType {
  id: string
  name: string // translation key for the title
  description: string // translation key for the description
  price: string // dollars
  duration: string // e.g. "2–3 hours"
  features: string[] // translation keys for each feature
}

const serviceTypesDefaults: ServiceType[] = [
  {
    id: "REGULAR",
    name: "regularService",
    description: "regularServiceDesc",
    price: "",
    duration: "2–3 hours",
    features: ["weeklyService", "allRoomsCleaned"],
  },
  {
    id: "ENVIRONMENT",
    name: "environmentService",
    description: "environmentServiceDesc",
    price: "",
    duration: "3–4 hours",
    features: ["ecoFriendlyProducts", "sustainableMethods"],
  },
  {
    id: "DEEP",
    name: "deepService",
    description: "deepServiceDesc",
    price: "",
    duration: "4–5 hours",
    features: ["recommendedQuarterly", "hardToReachAreas"],
  },
  {
    id: "HAZMAT",
    name: "hazmatService",
    description: "hazmatServiceDesc",
    price: "",
    duration: "5–6 hours",
    features: ["certifiedTechnicians", "safetyProtocols"],
  },
  {
    id: "FIRE",
    name: "fireService",
    description: "fireServiceDesc",
    price: "",
    duration: "5–6 hours",
    features: ["smokeRemoval", "odorElimination"],
  },
  {
    id: "WATER",
    name: "waterService",
    description: "waterServiceDesc",
    price: "",
    duration: "5–6 hours",
    features: ["waterExtraction", "moldPrevention"],
  },
  {
    id: "MOVE",
    name: "moveService",
    description: "moveServiceDesc",
    price: "",
    duration: "3–4 hours",
    features: ["oneTimeDeep", "applianceCleaning"],
  },
  {
    id: "DECEASED",
    name: "deceasedService",
    description: "deceasedServiceDesc",
    price: "",
    duration: "4–5 hours",
    features: ["discreetService", "thoroughSanitization"],
  },
  {
    id: "EXPLOSIVE",
    name: "explosiveResidueService",
    description: "explosiveResidueServiceDesc",
    price: "",
    duration: "6–7 hours",
    features: ["expertTechnicians", "completeDecontamination"],
  },
  {
    id: "MOLD",
    name: "moldService",
    description: "moldServiceDesc",
    price: "",
    duration: "5–6 hours",
    features: ["moldTesting", "completeRemoval"],
  },
  {
    id: "CONSTRUCTION",
    name: "constructionService",
    description: "constructionServiceDesc",
    price: "",
    duration: "3–4 hours",
    features: ["debrisRemoval", "dustElimination"],
  },
  {
    id: "COMMERCIAL",
    name: "commercialService",
    description: "commercialServiceDesc",
    price: "",
    duration: "6–7 hours",
    features: ["afterHoursService", "customizedPlans"],
  },
]

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  zipcode?: string
  squareFeet?: string
}

function generateRequestId() {
  let result = ""
  for (let i = 0; i < 12; i++) {
    const randomByte = Math.floor(Math.random() * 256)
    result += ("0" + randomByte.toString(16)).slice(-2)
  }
  return result
}

export default function BookingPage() {
  const { language } = useContext(LanguageContext)
  const t = translations[language as Language]
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)

  const [availableDays, setAvailableDays] = useState<any>([])
  const [timeSlots, setTimeSlots] = useState<any>([])
  const [availability, setAvailability] = useState<any>([])
  const [paymentError, setPaymentError] = useState<string>("")

  const [serviceTypes, setServiceTypes] = useState<any>(serviceTypesDefaults)

  const [bookingId, setBookingId] = useState<string>("")
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
    notes: "",
    smsConsent: false,
    squareFeet: 0
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestId, setRequestId] = useState(generateRequestId())

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [apiErrors, setApiErrors] = useState<{
    prices?: string
    availability?: string
    payment?: string
    general?: string
  }>({})

  const [searchQuery, setSearchQuery] = useState<string>("")

  // Create localized time slot names using bracket-notation.
  const localizedTimeSlotNames: { [key: string]: string } = {
    morning: t["timeslot.morning"],
    afternoon: t["timeslot.afternoon"],
    night: t["timeslot.night"],
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const key = `${year}-${month}-${day}`
    for (let i = 0; i < availability.length; i++) {
      if (availability[i].date === key) {
        const tmp: any = []
        if (availability[i].morning) tmp.push({ value: "MORNING", label: localizedTimeSlotNames.morning })
        if (availability[i].afternoon) tmp.push({ value: "AFTERNOON", label: localizedTimeSlotNames.afternoon })
        if (availability[i].night) tmp.push({ value: "NIGHT", label: localizedTimeSlotNames.night })
        setTimeSlots(tmp)
        break
      }
    }
  }
  useEffect(() => {
    if (selectedDate) handleDateSelect(selectedDate)
  }, [language])

  async function getServicePrices() {
    setIsLoadingPrices(true)
    setApiErrors((prev) => ({ ...prev, prices: undefined }))
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/service-details`
      const response = await fetch(url)
      if (response.ok) {
        const details: any = await response.json()
        const tmp = [...serviceTypes]
        tmp[0].price = details.regularPrice
        tmp[1].price = details.environmentPrice
        tmp[2].price = details.deepCleanPrice
        tmp[3].price = details.hazmat
        tmp[4].price = details.firePrice
        tmp[5].price = details.waterPrice
        tmp[6].price = details.moveInOutPrice
        tmp[7].price = details.deceasedPrice
        tmp[8].price = details.explosiveResidue
        tmp[9].price = details.moldPrice
        tmp[10].price = details.constructionPrice
        tmp[11].price = details.commercialPrice
        setServiceTypes(tmp)
      } else {
        setApiErrors((prev) => ({ ...prev, prices: t["toast.error_loading_prices_description"] }))
        toast({
          title: t["toast.error_loading_prices_title"],
          description: t["toast.error_loading_prices_description"],
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      setApiErrors((prev) => ({ ...prev, prices: t["toast.connection_error_description"] }))
      toast({
        title: t["toast.connection_error_title"],
        description: t["toast.connection_error_description"],
        variant: "destructive",
      })
    } finally {
      setIsLoadingPrices(false)
    }
  }

  const isDateAvailable = (date: Date) => {
    return availableDays.some((availableDate) => isSameDay(date, availableDate))
  }

//  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 //k   const { name, value } = e.target
   // setUserInfo((prev) => ({ ...prev, [name]: value }))
 // }

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setUserInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined })) // Clear error on change
  }

  // Validate user info using t for error messages.
  const validateUserInfo = () => {
    const newErrors: FormErrors = {}
    if (!userInfo.firstName.trim()) newErrors.firstName = t["error.first_name_required"]
    if (!userInfo.lastName.trim()) newErrors.lastName = t["error.last_name_required"]
    if (!userInfo.zipcode.trim()) newErrors.zipcode = t["error.zipcode_required"]
    if (!userInfo.email.trim()) {
      newErrors.email = t["error.email_required"]
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = t["error.email_invalid"]
    }
    if (!userInfo.phone.trim()) {
      newErrors.phone = t["error.phone_required"]
    } else if (!/^\d{10,}$/.test(userInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = t["error.phone_invalid"]
    }
    if (!userInfo.address.trim()) newErrors.address = t["error.address_required"]
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  const handleNextStep = () => {
    if (currentStep === 3) {
      const { isValid, errors: newErrors } = validateUserInfo()
      setErrors(newErrors)
      if (!isValid) return
    }
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setSelectedTimeSlot(undefined)
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const handleSubmit = async (orderId: string) => {
    setIsSubmitting(true)
    setPaymentError("")
    setApiErrors((prev) => ({ ...prev, payment: undefined }))

    try {
      const body = {
        orderId,
        clientName: userInfo.firstName + " " + userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        zipcode: userInfo.zipcode,
        time: selectedTimeSlot, // MORNING or NIGHT or AFTERNOON
        service: selectedService, // REGULAR // these are enums must conform
        notes: userInfo.notes,
        appointmentDate: selectedDate,
        smsConsent: userInfo.smsConsent,
        squareFeet: userInfo.squareFeet
      }

      const url: string = `${process.env.NEXT_PUBLIC_API_URL}/paypal/captureOrder?requestId=${requestId}`
      const options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }

      const response: any = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        setBookingId(data.bookingId)
        setIsSubmitted(true)
        setRequestId(generateRequestId())
        toast({
          title: t["booking.confirmed"],
          // Manually interpolate email in the confirmation string.
          description: t["booking.confirmation_email"].replace("{email}", userInfo.email),
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || t["toast.payment_failed_description"]
        setPaymentError(errorMessage)
        setApiErrors((prev) => ({ ...prev, payment: errorMessage }))
        toast({
          title: t["toast.payment_failed_title"],
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      setPaymentError(t["toast.connection_error_description"])
      setApiErrors((prev) => ({ ...prev, payment: t["toast.connection_error_description"] }))
      toast({
        title: t["toast.connection_error_title"],
        description: t["toast.connection_error_description"],
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDateInPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date <= today
  }

  async function getAvailability() {
    setIsLoadingAvailability(true)
    setApiErrors((prev) => ({ ...prev, availability: undefined }))
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        setAvailability(json)
        const tmp = []
        for (let i = 0; i < json.length; i++) {
          const [year, month, day] = json[i].date.split("-").map(Number)
          const currDate = new Date(year, month - 1, day)
          if (!isDateInPast(currDate)) tmp.push(currDate)
        }
        setAvailableDays(tmp)
      } else {
        setApiErrors((prev) => ({
          ...prev,
          availability: t["toast.error_loading_prices_description"],
        }))
        toast({
          title: t["toast.error_loading_prices_title"],
          description: t["toast.error_loading_prices_description"],
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(err)
      setApiErrors((prev) => ({
        ...prev,
        availability: t["toast.connection_error_description"],
      }))
      toast({
        title: t["toast.connection_error_title"],
        description: t["toast.connection_error_description"],
        variant: "destructive",
      })
    } finally {
      setIsLoadingAvailability(false)
    }
  }

  useEffect(() => {
    getAvailability()
    getServicePrices()
  }, [])

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return !!selectedDate
      case 2:
        return !!selectedTimeSlot
      case 3:
        return (
          !!userInfo.firstName.trim() &&
          !!userInfo.lastName.trim() &&
          !!userInfo.email.trim() &&
          !!userInfo.phone.trim() &&
          !!userInfo.address.trim()
        )
      case 4:
        return !!selectedService
      default:
        return true
    }
  }

  const getServiceById = (id: string) => {
    return serviceTypes.find((service) => service.id === id)
  }

  const getFilteredServices = () => {
    if (!searchQuery.trim()) return serviceTypes

    const query = searchQuery.toLowerCase()
    return serviceTypes.filter((service: ServiceType) => {
      const nameMatch = t[service.name].toLowerCase().includes(query)
      const descMatch = t[service.description].toLowerCase().includes(query)
      const featuresMatch = service.features.some((feature) => t[feature].toLowerCase().includes(query))
      return nameMatch || descMatch || featuresMatch
    })
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Calendar className="h-5 w-5 text-blue-600" />
            {t["step_title.date"]}
          </>
        )
      case 2:
        return (
          <>
            <Clock className="h-5 w-5 text-blue-600" />
            {t["step_title.time_slot"]}
          </>
        )
      case 3:
        return (
          <>
            <User className="h-5 w-5 text-blue-600" />
            {t["step_title.user_information"]}
          </>
        )
      case 4:
        return (
          <>
            <Sparkles className="h-5 w-5 text-blue-600" />
            {t["step_title.service_type"]}
          </>
        )
      case 5:
        return (
          <>
            <CreditCard className="h-5 w-5 text-blue-600" />
            {t["step_title.payment"]}
          </>
        )
      default:
        return t["booking.confirmed"]
    }
  }

  const createPayPalOrder = async () => {
    setIsProcessingPayment(true)
    setApiErrors((prev) => ({ ...prev, payment: undefined }))
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({}),
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/paypal/createOrder?serviceType=${selectedService}`,
        options,
      )
      if (response.ok) {
        const orderId = await response.text()
        return orderId
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || t["toast.payment_initialization_failed_description"]
        setApiErrors((prev) => ({ ...prev, payment: errorMessage }))
        toast({
          title: t["toast.payment_initialization_failed_title"],
          description: errorMessage,
          variant: "destructive",
        })
        return ""
      }
    } catch (err) {
      console.error(err)
      setApiErrors((prev) => ({ ...prev, payment: t["toast.connection_error_description"] }))
      toast({
        title: t["toast.connection_error_title"],
        description: t["toast.connection_error_description"],
        variant: "destructive",
      })
      return ""
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handlePayPalApproval = async (data: any) => {
    setIsProcessingPayment(true)
    try {
      await handleSubmit(data.orderID)
    } catch (err) {
      console.error(err)
      setApiErrors((prev) => ({ ...prev, payment: t["toast.payment_processing_error_description"] }))
      toast({
        title: t["toast.payment_processing_error_title"],
        description: t["toast.payment_processing_error_description"],
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const renderErrorAlert = (error: string | undefined, title: string) => {
    if (!error) return null
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  function getSalesTax(service: any) {
    const serv = getServiceById(service)
    return 0.06 * Number.parseFloat(serv.price)
  }

  function getTotalAmount(service: string) {
    const serv = getServiceById(service)
    return (Number.parseFloat(serv.price) + getSalesTax(service)).toFixed(2)
  }

  function calculateSavings(service: string) {
    const basePrice = Number.parseFloat(getServiceById(service)?.price || "0")
    return (basePrice * 0.1).toFixed(2);
  }

  const renderBookingSummary = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-lg mb-4 flex items-center gap-2 border-b pb-2 border-blue-200">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            {t["booking_summary.heading"]}
          </h3>

          {isLoadingPrices || isLoadingAvailability ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
              <p className="text-muted-foreground">{t["loading.booking_details"]}</p>
            </div>
          ) : selectedDate ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t["label.date"]}</p>
                  <p className="font-medium">
                    {language === "es"
                      ? formatDateToSpanish(format(selectedDate, "EEEE, MMMM d yyyy"))
                      : format(selectedDate, "EEEE, MMMM d yyyy")}
                  </p>
                </div>
              </div>

              {selectedTimeSlot && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t["label.time"]}</p>
                    <p className="font-medium">{t["" + selectedTimeSlot]}</p>
                  </div>
                </div>
              )}

              {selectedService && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t["label.service"]}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{t[getServiceById(selectedService)?.name]}</p>
                      <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        ${getServiceById(selectedService)?.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        {getServiceById(selectedService)?.duration}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {userInfo.firstName && userInfo.lastName && (
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t["label.customer"]}</p>
                    <p className="font-medium">
                      {userInfo.firstName} {userInfo.lastName}
                    </p>
                    {userInfo.address && (
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-[200px]">{userInfo.address}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Info className="h-10 w-10 text-blue-300 mb-2" />
              <p className="text-muted-foreground">{t["booking_summary.default_text"]}</p>
            </div>
          )}

          {selectedService && selectedDate && selectedTimeSlot && (
            <div className="mt-6 pt-4 border-t border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                {t["label.price_breakdown"]}
              </h4>

              <div className="space-y-3 bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                    {t["label.base_price"]}
                  </span>
                  <span className="font-medium">${getServiceById(selectedService)?.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
                    {t["label.sales_tax"]} (6%)
                  </span>
                  <span className="font-medium">${getSalesTax(selectedService).toFixed(2)}</span>
                </div>

                <div className="h-px bg-blue-100 my-2"></div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">{t["label.total_price"]}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-blue-700">${getTotalAmount(selectedService)}</span>
                    <span className="text-xs text-green-600">{t["label.includes_tax"]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 bg-blue-50 p-2 rounded-md">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">{t["label.best_value"] || "penguins"}</span>
              </div>
            </div>
          )}
        </div>

        {(isProcessingPayment || isSubmitting) && currentStep === 5 && (
          <Alert className="bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
            <AlertTitle>{t["alert.processing_booking_title"]}</AlertTitle>
            <AlertDescription>{t["alert.processing_booking_description"]}</AlertDescription>
          </Alert>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Info className="h-5 w-5 text-yellow-600" />
            {t["booking_info.heading"]}
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{t["booking_info.item1"]}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{t["booking_info.item2"]}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{t["booking_info.item3"]}</span>
            </li>
          </ul>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center justify-center">
            <Award className="h-8 w-8 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">{t["trusted.customers"]}</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {t["header.title"]}
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">{t["header.subtitle"]}</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    currentStep === step
                      ? "border-blue-600 bg-blue-100 text-blue-600"
                      : currentStep > step
                        ? "border-green-600 bg-green-100 text-green-600"
                        : "border-gray-300 bg-gray-100 text-gray-500",
                  )}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 hidden sm:block",
                    currentStep === step
                      ? "text-blue-600 font-medium"
                      : currentStep > step
                        ? "text-green-600"
                        : "text-gray-500",
                  )}
                >
                  {step === 1
                    ? t["step.date"]
                    : step === 2
                      ? t["step.time"]
                      : step === 3
                        ? t["step.details"]
                        : step === 4
                          ? t["step.service"]
                          : t["step.payment"]}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {isSubmitted ? (
          <Card className="max-w-3xl mx-auto border shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-4 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-center">{t["booking.confirmed"]}</h3>
                <p className="text-center mt-2 max-w-md">
                  {t["booking.scheduled"]
                    .replace("{date}", selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "")
                    .replace("{time}", t[selectedTimeSlot] || "")}
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 max-w-md w-full">
                  <h4 className="font-medium">{t["booking.reference"]}</h4>
                  <p className="text-lg font-mono text-center mt-2 bg-white p-2 rounded border border-blue-200">
                    {bookingId}
                  </p>
                </div>
                <p className="text-center text-muted-foreground mt-4 max-w-md">
                  {t["booking.confirmation_email"].replace("{email}", userInfo.email)}
                </p>
                <Button
                  className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  onClick={() => window.location.reload()}
                >
                  {t["button.book_another"]}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 max-w-8xl mx-auto">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <Card className="border shadow-lg h-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                  <CardTitle className="text-xl flex items-center gap-2">{getStepTitle()}</CardTitle>
                </CardHeader>

                <CardContent className="p-3">
                  {currentStep === 1 && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground">{t["step1.instructions"]}</p>

                      {renderErrorAlert(apiErrors.availability, t["alert.availability_error_title"])}

                      {isLoadingAvailability ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                          <p className="text-muted-foreground">{t["step1.loading"]}</p>
                        </div>
                      ) : (
                        <div className="p-1 max-w-xl mx-auto">
                          <div className="flex items-center justify-between mb-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentMonth((prev) => addDays(prev, -30))}
                              className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                            >
                              <ChevronLeft className="h-5 w-5" />
                              <span className="sr-only">{t["button.prev_month"]}</span>
                            </Button>
                            <div className="text-2xl font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentMonth((prev) => addDays(prev, 30))}
                              className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                            >
                              <ChevronRight className="h-5 w-5" />
                              <span className="sr-only">{t["button.next_month"]}</span>
                            </Button>
                          </div>

                          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-3">
                            {[
                              t["weekday.sun"],
                              t["weekday.mon"],
                              t["weekday.tue"],
                              t["weekday.wed"],
                              t["weekday.thu"],
                              t["weekday.fri"],
                              t["weekday.sat"],
                            ].map((day, idx) => (
                              <div key={idx} className="text-blue-700 py-2 text-base">
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 42 }).map((_, index) => {
                              const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                              const offset = firstDayOfMonth.getDay()
                              const date = new Date(
                                currentMonth.getFullYear(),
                                currentMonth.getMonth(),
                                index - offset + 1,
                              )
                              const dayNumber = date.getDate()
                              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()

                              if (!isCurrentMonth) {
                                return <div key={`empty-${index}`} className="h-12 w-full"></div>
                              }

                              const isAvailable = isDateAvailable(date)
                              const isSelected = selectedDate && isSameDay(date, selectedDate)

                              return (
                                <button
                                  key={date.toString()}
                                  type="button"
                                  onClick={() => isAvailable && handleDateSelect(date)}
                                  className={cn(
                                    "flex h-12 w-full items-center justify-center rounded-md transition-all text-lg",
                                    isToday(date) && "font-bold",
                                    isAvailable
                                      ? "bg-green-100 hover:bg-green-200 text-green-800 hover:scale-105 shadow-sm"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                                    isSelected && "ring-2 ring-blue-500 bg-blue-100 text-blue-800",
                                  )}
                                  disabled={!isAvailable}
                                >
                                  {dayNumber}
                                </button>
                              )
                            })}
                          </div>

                          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <div className="h-4 w-4 rounded-full bg-green-500"></div>
                              <span>{t["label.available"]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                              <span>{t["label.unavailable"]}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        {t["step2.instructions"].replace(
                          "{date}",
                          selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "",
                        )}
                      </p>

                      <RadioGroup
                        value={selectedTimeSlot}
                        onValueChange={setSelectedTimeSlot}
                        className="grid gap-3 max-w-md mx-auto"
                      >
                        {timeSlots.map((slot, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "flex items-center space-x-2 p-4 rounded-md border transition-all",
                              selectedTimeSlot === slot.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300",
                            )}
                          >
                            <RadioGroupItem value={slot.value} id={slot.value} className="text-blue-600" />
                            <Label
                              htmlFor={slot.value}
                              className="flex items-center gap-2 text-base cursor-pointer w-full"
                            >
                              <Clock className="h-5 w-5 text-blue-500" />
                              {slot.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

{currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t["step3.instructions"]}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {t["label.first_name"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={userInfo.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "border-red-500" : ""}
                maxLength={20}
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {t["label.last_name"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={userInfo.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "border-red-500" : ""}
                maxLength={20}
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {t["label.email"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userInfo.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
                maxLength={40}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {t["label.phone"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={userInfo.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
                maxLength={20}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* Square Feet with Tooltip */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="squareFeet" className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  {t["label.square_feet"] || "Square Feet"} <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help text-muted-foreground">
                        <Info className="h-4 w-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t["tooltip.square_feet"]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="squareFeet"
                name="squareFeet"
                type="number"
                value={userInfo.squareFeet || ""}
                onChange={handleInputChange}
                className={errors.squareFeet ? "border-red-500" : ""}
                min={1}
              />
              {errors.squareFeet && <p className="text-red-500 text-xs">{errors.squareFeet}</p>}
            </div>

            {/* zipcode */}
            <div className="space-y-2">
              <Label htmlFor="zipcode" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {t["label.zipcode"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipcode"
                name="zipcode"
                value={userInfo.zipcode}
                onChange={handleInputChange}
                className={errors.zipcode? "border-red-500" : ""}
                maxLength={5}
              />
              {errors.zipcode && <p className="text-red-500 text-xs">{errors.zipcode}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                {t["label.address"]} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                className={errors.address ? "border-red-500" : ""}
                maxLength={75}
              />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>

            {/* SMS Consent Checkbox */}
            <div className="space-y-2 md:col-span-2 hidden">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smsConsent"
                  name="smsConsent"
                  checked={userInfo.smsConsent || false}
                  onCheckedChange={(checked) => {
                    handleInputChange({
                      target: {
                        name: "smsConsent",
                        value: checked,
                      },
                    })
                  }}
                />
                <Label
                  htmlFor="smsConsent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t["consent.for.sms"]}
                </Label>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {t["label.special_instructions"]}
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder={t["placeholder.special_instructions"]}
                value={userInfo.notes}
                onChange={handleInputChange}
                className="min-h-[100px]"
                maxLength={600}
              />
            </div>
          </div>
        </div>
      )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{t["step4.instructions"]}</p>

                      {renderErrorAlert(apiErrors.prices, t["alert.pricing_error_title"])}

                      {isLoadingPrices ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                          <p className="text-muted-foreground">{t["loading.service_options"]}</p>
                        </div>
                      ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder={t["search.services.placeholder"]}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-search"
                              >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                              </svg>
                            </div>
                          </div>

                          <RadioGroup value={selectedService} onValueChange={setSelectedService} className="grid gap-6">
                            {getFilteredServices().length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {getFilteredServices().map((service: any) => (
    <div
      key={service.id}
      className={cn(
        "relative flex flex-col rounded-lg border transition-all",
        selectedService === service.id
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 hover:border-blue-300 hover:shadow-sm",
      )}
      onClick={() => setSelectedService(service.id)}
    >
      {/* Top row with service name and price */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <RadioGroupItem value={service.id} id={service.id} className="text-blue-600" />
          <Label htmlFor={service.id} className="text-lg font-semibold cursor-pointer">
            {t[service.name]}
          </Label>
        </div>
        <div className="font-bold text-lg text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
          ${service.price}
        </div>
      </div>

      {/* Bottom row with Learn More button */}
      <div className="border-t p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.preventDefault()
            window.open(`/services/${service.id.toLowerCase()}`, "_blank")
          }}
        >
          {t["button.learn_more"] || "Learn More"} →
        </Button>
      </div>
    </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="rounded-full bg-gray-100 p-3 mb-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-400"
                                  >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                  </svg>
                                </div>
                                <h3 className="font-medium mb-1">
                                  {t["search.no_results_title"] || "No services found"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {t["search.no_results_description"] ||
                                    "Try a different search term or browse all services"}
                                </p>
                                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                                  {t["search.clear"]}
                                </Button>
                              </div>
                            )}
                          </RadioGroup>

                          {getFilteredServices().length > 0 && (
                            <div className="text-center text-sm text-muted-foreground">
                              {getFilteredServices().length === 1
                                ? t["search.showing_single"]
                                : t["search.showing_multiple"]?.replace(
                                    "{count}",
                                    getFilteredServices().length.toString(),
                                  ) || `Showing ${getFilteredServices().length} services`}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <p className="text-muted-foreground">{t["step5.instructions"]}</p>

                      {renderErrorAlert(apiErrors.payment || paymentError, t["alert.payment_error_title"])}

                      <div className="p-4 rounded-lg border max-w-2xl mx-auto">
                        {isProcessingPayment && (
                          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                              <p className="font-medium text-blue-700">{t["label.processing_payment"]}</p>
                            </div>
                          </div>
                        )}

                        <PayPalScriptProvider
                          options={{
                            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                            currency: "USD",
                            enableFunding: "venmo",
                          }}
                        >
                          <div className="relative">
                            <PayPalButtons
                              createOrder={createPayPalOrder}
                              onApprove={async (data, actions) => {
                                await handlePayPalApproval(data)
                              }}
                              onError={(err) => {
                                console.error(err)
                                setApiErrors((prev) => ({
                                  ...prev,
                                  payment: t["toast.payment_error_description"],
                                }))
                                toast({
                                  title: t["toast.payment_error_title"],
                                  description: t["toast.payment_error_description"],
                                  variant: "destructive",
                                })
                              }}
                              style={{ layout: "vertical" }}
                              disabled={isProcessingPayment || isSubmitting}
                            />
                          </div>
                        </PayPalScriptProvider>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-2xl mx-auto">
                        <h3 className="font-medium flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-yellow-600" />
                          {t["payment.note_heading"]}
                        </h3>
                        <p className="text-sm mt-1">{t["payment.note_description"]}</p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-gray-50 p-4 rounded-b-lg flex flex-col sm:flex-row gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1 || isSubmitting || isProcessingPayment}
                    className="sm:w-auto w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t["button.previous"]}
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !isStepComplete() ||
                        isSubmitting ||
                        isProcessingPayment ||
                        isLoadingPrices ||
                        isLoadingAvailability
                      }
                      className="sm:w-auto w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {(isLoadingPrices || isLoadingAvailability) && currentStep < 5 ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t["loading.service_options"]}
                        </>
                      ) : (
                        <>
                          {t["button.next"]}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="border shadow-lg h-full">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                      {t["booking_summary.heading"]}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">{renderBookingSummary()}</CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            {t["section.why_choose.title"]}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
              <div className="rounded-full bg-blue-100 p-3 mb-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">{t["why_choose.professional_service.heading"]}</h3>
              <p className="text-sm text-muted-foreground">{t["why_choose.professional_service.description"]}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-lg">
              <div className="rounded-full bg-cyan-100 p-3 mb-3">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="font-medium mb-2">{t["why_choose.flexible_scheduling.heading"]}</h3>
              <p className="text-sm text-muted-foreground">{t["why_choose.flexible_scheduling.description"]}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg">
              <div className="rounded-full bg-emerald-100 p-3 mb-3">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium mb-2">{t["why_choose.satisfaction_guaranteed.heading"]}</h3>
              <p className="text-sm text-muted-foreground">{t["why_choose.satisfaction_guaranteed.description"]}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
