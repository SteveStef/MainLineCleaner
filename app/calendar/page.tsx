"use client";

import type React from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
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
  Award
} from "lucide-react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils";
import Header from "../Header";

const timeSlotNames = {
  "Morning, 8:00AM - 11:00AM": "morning",
  "Afternoon, 12:00PM - 5:00PM": "afternoon",
  "Night, 6:00PM - 9:00PM": "night",
};

// Service types
const serviceTypes = [
]

// Form validation
interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
}

function generateRequestId() {
  let result = '';
  for (let i = 0; i < 12; i++) {
    const randomByte = Math.floor(Math.random() * 256);
    result += ('0' + randomByte.toString(16)).slice(-2);
  }
  return result;
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)

  const [availableDays, setAvailableDays] = useState<any>([]);
  const [timeSlots, setTimeSlots] = useState<any>([]);
  const [availability, setAvailability] = useState<any>([]);

  const [serviceTypes, setServiceTypes] = useState<any>([
  {
    id: "regular",
    name: "Regular Cleaning",
    description: "Standard cleaning service for maintained homes",
    price: "$",
    duration: "2-3 hours",
    features: ["All rooms dusted and vacuumed", "Kitchen and bathroom sanitized", "Floors mopped", "Trash removed"],
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    description: "Thorough cleaning for homes needing extra attention",
    price: "$",
    duration: "4-6 hours",
    features: [
      "All regular cleaning services",
      "Inside cabinets and appliances",
      "Window sills and baseboards",
      "Detailed bathroom scrubbing",
      "Wall spot cleaning",
    ],
  },
  {
    id: "move",
    name: "Move In/Out Cleaning",
    description: "Complete cleaning for moving situations",
    price: "$",
    duration: "5-8 hours",
    features: [
      "All deep cleaning services",
      "Inside all cabinets and drawers",
      "Refrigerator and oven cleaning",
      "Window cleaning",
      "Garage sweeping",
    ],
  },
  ]);

  const [bookingId, setBookingId] = useState<string>("");

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  // Form validation
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [requestId, setRequestId] = useState(generateRequestId());

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    for(let i = 0; i < availability.length; i++) {
      if(availability[i].date === key) {
        let tmp: any = [];
        if(availability[i].morning) tmp.push("Morning, 8:00AM - 11:00AM");
        if(availability[i].afternoon) tmp.push("Afternoon, 12:00PM - 5:00PM");
        if(availability[i].night) tmp.push("Night, 6:00PM - 9:00PM");
        setTimeSlots(tmp);
        break;
      }
    }
  }

  useEffect(() => {
    async function getServicePrices() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/service-details`;
        const response = await fetch(url);
        if (response.ok) {
          const details:any = await response.json();
          console.log(details);
          const tmp = [...serviceTypes];
          tmp[0].price = "$" + details.regularPrice;
          tmp[1].price = "$" + details.deepCleanPrice;
          tmp[2].price = "$" + details.moveInOutPrice;
          setServiceTypes(tmp);
        }
      } catch (err) {
        console.log(err)
      }
    }
    getServicePrices();
  },[]);

  // Check if a date is available
  const isDateAvailable = (date: Date) => {
    return availableDays.some((availableDate) => isSameDay(date, availableDate))
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Validate user information form
  const validateUserInfo = () => {
    const newErrors: FormErrors = {}

    if (!userInfo.firstName.trim()) newErrors.firstName = "First name is required"
    if (!userInfo.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!userInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!userInfo.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,}$/.test(userInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number is invalid"
    }

    if (!userInfo.address.trim()) newErrors.address = "Address is required"

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors }
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 3) {
      // Validate user information before proceeding
      const { isValid, errors: newErrors } = validateUserInfo()
      setErrors(newErrors)
      if (!isValid) return
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    if(currentStep === 2) {
      setSelectedTimeSlot(undefined);
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }

  }

  // Handle final submission
  const handleSubmit = async (orderId:string) => {
    setIsSubmitting(true)
    try {
      const body = {
        orderId,
        clientName: userInfo.firstName + " " + userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        time: timeSlotNames[selectedTimeSlot],
        service: selectedService,
        notes: userInfo.notes,
        appointmentDate: selectedDate
      };
      const url: string = `${process.env.NEXT_PUBLIC_API_URL}/paypal/captureOrder?requestId=${requestId}`;
      const options = { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body) };
      const response: any = await fetch(url, options);
      if(response.ok) {
        const data = response.json();
        console.log(data);
        setBookingId(data.bookingId);
        setIsSubmitting(false)
        setIsSubmitted(true)
        setRequestId(generateRequestId());
      }
    } catch(err) {
      console.log(err);
    }
  }

  async function getAvailability() {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/availability`;
      const response = await fetch(url)
        if (response.ok) {
          const json = await response.json();
          setAvailability(json);
          let tmp = [];
          for(let i = 0; i < json.length; i++) {
            const [year, month, day] = json[i].date.split('-').map(Number);
            tmp.push(new Date(year, month - 1, day));
          }
          setAvailableDays(tmp);
        }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAvailability();
  },[])

  // Check if current step is complete and next button should be enabled
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: // Date selection
        return !!selectedDate
      case 2: // Time slot selection
        return !!selectedTimeSlot
      case 3: // User information
        // Check if all required fields are filled without calling validateUserInfo
        return (
          !!userInfo.firstName.trim() &&
          !!userInfo.lastName.trim() &&
          !!userInfo.email.trim() &&
          !!userInfo.phone.trim() &&
          !!userInfo.address.trim()
        )
      case 4: // Service selection
        return !!selectedService
      default:
        return true
    }
  }

  // Get service details by ID
  const getServiceById = (id: string) => {
    return serviceTypes.find((service) => service.id === id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <Header />

      <main className="container px-4 py-8 md:py-12 max-w-6xl mx-auto">

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Book Your Cleaning Service
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Complete the steps below to schedule your professional cleaning service.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
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
                    ? "Date"
                    : step === 2
                      ? "Time"
                      : step === 3
                        ? "Details"
                        : step === 4
                          ? "Service"
                          : "Summary"}
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

        {/* Main Content Card */}
        <Card className="max-w-5xl mx-auto border shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
            <CardTitle className="text-xl flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Select Date
                </>
              )}
              {currentStep === 2 && (
                <>
                  <Clock className="h-5 w-5 text-blue-600" />
                  Select Time Slot
                </>
              )}
              {currentStep === 3 && (
                <>
                  <User className="h-5 w-5 text-blue-600" />
                  Your Information
                </>
              )}
              {currentStep === 4 && (
                <>
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Select Service Type
                </>
              )}
              {currentStep === 5 && (
                <>
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                  Booking Summary
                </>
              )}
            </CardTitle>

          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please select a date for your cleaning service. Green dates are available for booking.
                </p>

                <div className="p-1 max-w-xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth((prev) => addDays(prev, -30))}
                      className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">Previous month</span>
                    </Button>
                    <div className="text-2xl font-medium">{format(currentMonth, "MMMM yyyy")}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth((prev) => addDays(prev, 30))}
                      className="rounded-full hover:bg-blue-100 hover:text-blue-600"
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span className="sr-only">Next month</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-3">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-blue-700 py-2 text-base">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 42 }).map((_, index) => {
                        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                        const offset = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
                        const date = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            index - offset + 1,
                        );
                      const dayNumber = date.getDate()
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth()

                      if (!isCurrentMonth) {
                        return <div key={`empty-${index}`} className="h-16 w-full"></div>
                      }

                      const isAvailable = isDateAvailable(date)
                      const isSelected = selectedDate && isSameDay(date, selectedDate)

                      return (
                        <button
                          key={date.toString()}
                          type="button"
                          onClick={() => isAvailable && handleDateSelect(date)}
                          className={cn(
                            "flex h-16 w-full items-center justify-center rounded-md transition-all text-lg",
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
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <p className="font-medium">Selected Date:</p>
                    <p className="text-xl text-blue-700">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Time Slot Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please select a time slot for your cleaning service on{" "}
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}.
                </p>

                <RadioGroup
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                  className="grid gap-3 max-w-md mx-auto"
                >
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className={cn(
                        "flex items-center space-x-2 p-4 rounded-md border transition-all",
                        selectedTimeSlot === slot
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300",
                      )}
                    >
                      <RadioGroupItem value={slot} id={slot} className="text-blue-600" />
                      <Label htmlFor={slot} className="flex items-center gap-2 text-base cursor-pointer w-full">
                        <Clock className="h-5 w-5 text-blue-500" />
                        {slot}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedTimeSlot && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                    <p className="font-medium">Selected Time:</p>
                    <p className="text-lg text-blue-700">{selectedTimeSlot}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: User Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Please provide your contact information so we can confirm your booking.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userInfo.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Special Instructions
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requests or instructions"
                      value={userInfo.notes}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Service Type Selection */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-muted-foreground">Please select the type of cleaning service you need.</p>

                <RadioGroup
                  value={selectedService}
                  onValueChange={setSelectedService}
                  className="grid gap-4 max-w-2xl mx-auto"
                >
                  {serviceTypes.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "flex flex-col p-4 rounded-md border transition-all",
                        selectedService === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300",
                      )}
                    >
                      <div className="flex items-start">
                        <RadioGroupItem value={service.id} id={service.id} className="text-blue-600 mt-1" />
                        <div className="ml-2 flex-1">
                          <Label htmlFor={service.id} className="text-lg font-medium cursor-pointer">
                            {service.name}
                          </Label>
                          <p className="text-muted-foreground">{service.description}</p>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{service.duration}</span>
                            </div>
                            <div className="font-medium text-blue-700">{service.price}</div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 5: Summary */}
            {currentStep === 5 && (
              <div className="space-y-6">
                {!isSubmitted ? (
                  <>
                    <p className="text-muted-foreground">Please review your booking details before confirming.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Appointment Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">{selectedTimeSlot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Service:</span>
                            <span className="font-medium">
                              {selectedService && getServiceById(selectedService)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">
                              {selectedService && getServiceById(selectedService)?.duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium text-blue-700">
                              {selectedService && getServiceById(selectedService)?.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          Customer Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">
                              {userInfo.firstName} {userInfo.lastName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{userInfo.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{userInfo.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="font-medium">{userInfo.address}</span>
                          </div>

                          {userInfo.notes && (
                            <div className="mt-3">
                              <span className="text-muted-foreground">Special Instructions:</span>
                              <p className="mt-1 text-sm">{userInfo.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>


                    <div className="p-4 rounded-lg border max-w-2xl mx-auto">
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        enableFunding: "venmo"
      }}
    >
      <div>

        <PayPalButtons
          createOrder={async (data, actions) => {
            try {
              const options = {method: "POST", headers: {"Content-Type" : "application/json; charset=utf-8"}, body: JSON.stringify({})};
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paypal/createOrder?serviceType=${selectedService}`, options);
              if(response.ok) {
                const orderId = await response.text();
                return orderId;
              } else return "";
            } catch(err) {
              console.log(err);
              return "";
            }
          }}
          onApprove={async (data, actions) => {
            await handleSubmit(data.orderID);
          }}
        />
      </div>
    </PayPalScriptProvider>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 max-w-2xl mx-auto">
                      <h3 className="font-medium flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-yellow-600" />
                        Please Note
                      </h3>
                      <p className="text-sm mt-1">
                        By confirming this booking, you agree to our terms and conditions. We'll send a confirmation
                        email with your booking details.
                      </p>
                    </div>

                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-green-100 p-4 mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-center">Booking Confirmed!</h3>
                    <p className="text-center mt-2 max-w-md">
                      Your cleaning service has been scheduled for{" "}
                      {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTimeSlot}.
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 max-w-md w-full">
                      <h4 className="font-medium">Booking Reference</h4>
                      <p className="text-lg font-mono text-center mt-2 bg-white p-2 rounded border border-blue-200">
                        {/* Generate a random booking reference */}
                        {`BK-${bookingId}`}
                      </p>
                    </div>
                    <p className="text-center text-muted-foreground mt-4 max-w-md">
                      A confirmation email has been sent to {userInfo.email}. We'll contact you before your appointment
                      to confirm details.
                    </p>
                    <Button
                      className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                      onClick={() => window.location.reload()}
                    >
                      Book Another Service
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50 p-4 rounded-b-lg flex flex-col sm:flex-row gap-3 justify-between">
            {!isSubmitted && (
              <>
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="sm:w-auto w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps - 1 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={!isStepComplete()}
                    className="sm:w-auto w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : currentStep === totalSteps - 1 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={!isStepComplete()}
                    className="sm:w-auto w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    Review Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) :<></>
                }
              </>
            )}

          </CardFooter>
        </Card>
            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Why Choose MainLine Cleaners
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Professional Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team of experienced cleaners delivers exceptional quality every time.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="rounded-full bg-cyan-100 p-3 mb-3">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-medium mb-2">Flexible Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Book appointments that fit your schedule with our convenient online system.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="rounded-full bg-emerald-100 p-3 mb-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">
                    We're not happy until you're happy with the results of our cleaning service.
                  </p>
                </div>
              </div>
            </div>

      </main>


      <footer className="w-full border-t bg-white mt-12">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="text-xl font-bold">Main Line Cleaners</div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                Professional cleaning services for homes and businesses.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Residential
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Commercial
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Special Cleaning
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          </div>
        </div>
      </footer>
    </div>
  )
}







/*
            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Why Choose MainLine Cleaners
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Professional Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team of experienced cleaners delivers exceptional quality every time.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="rounded-full bg-cyan-100 p-3 mb-3">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-medium mb-2">Flexible Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Book appointments that fit your schedule with our convenient online system.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="rounded-full bg-emerald-100 p-3 mb-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-sm text-muted-foreground">
                    We're not happy until you're happy with the results of our cleaning service.
                  </p>
                </div>
              </div>
            </div>
 * */
