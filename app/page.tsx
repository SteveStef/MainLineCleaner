"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { CheckCircle, MapPin, Phone, Mail, Clock, Star, ArrowRight, Award, Sparkles, Home, MessageSquare, User, ClipboardCheck, AlertCircle } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import Header from "./Header"

import Clean from "../images/cleanHouse.jpg"
import Clean2 from "../images/clean.jpg"
import Clean3 from "../images/spotless.jpeg"
import Clean4 from "../images/livingroom.jpg"

export default function MainLineCleaners() {
  const [requestQuoteForm, setRequestQuoteForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const [testimonials, setTestimonials] = useState([]);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);

  // Images for the slideshow
  const slideshowImages = [Clean, Clean3, Clean4]

  // Functions to navigate testimonials
  const nextTestimonialPage = () => {
    const maxPages = Math.ceil(testimonials.length / 3) - 1;
    setCurrentTestimonialPage(prev => prev >= maxPages ? 0 : prev + 1);
  };

  const prevTestimonialPage = () => {
    const maxPages = Math.ceil(testimonials.length / 3) - 1;
    setCurrentTestimonialPage(prev => prev <= 0 ? maxPages : prev - 1);
  };

  // Autoplay functionality
  useEffect(() => {
    let slideInterval: NodeJS.Timeout

    if (autoplay) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1))
      }, 5000)
    }

    return () => {
      if (slideInterval) clearInterval(slideInterval)
    }
  }, [autoplay, slideshowImages.length])

  useEffect(() => {
    async function getReviews() {
      try {
        const url: string = `${process.env.NEXT_PUBLIC_API_URL}/reviews`
        const options = { method: "GET" };
        const response: any = await fetch(url, options);
        if(response.ok) {
          const data = await response.json();
          setTestimonials(data);
        }
      } catch(err) {
        console.log(err);
      }
    }
    getReviews();
  },[])

  // Functions to control the slideshow
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideshowImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideshowImages.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const toggleAutoplay = () => {
    setAutoplay((prev) => !prev)
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Update form state
    setRequestQuoteForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    return true
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    }

    // Validate required fields
    let hasErrors = false

    if (!requestQuoteForm.firstName.trim()) {
      newErrors.firstName = "First name is required"
      hasErrors = true
    }

    if (!requestQuoteForm.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      hasErrors = true
    }

    if (!requestQuoteForm.email.trim()) {
      newErrors.email = "Email is required"
      hasErrors = true
    } else if (!validateEmail(requestQuoteForm.email)) {
      newErrors.email = "Please enter a valid email address"
      hasErrors = true
    }

    if (!requestQuoteForm.phone.trim()) {
      newErrors.phone = "Phone number is required"
      hasErrors = true
    } else if (!validatePhone(requestQuoteForm.phone)) {
      newErrors.phone = "Please enter a valid phone number"
      hasErrors = true
    }

    if (!requestQuoteForm.service) {
      newErrors.service = "Please select a service"
      hasErrors = true
    }

    setErrors(newErrors)
    if (!hasErrors) {
      setIsSubmitting(true)

      try {
        const url: string = `http://localhost:9080/requestQuote`
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestQuoteForm),
        }
        const response: any = await fetch(url, options)
        console.log(response)

        if (response.ok) {
          setSubmitSuccess(true)
          setRequestQuoteForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            service: "",
            message: "",
          })
        } else {
          console.error("Form submission failed")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
    <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Professional Cleaning Services for the Main Line
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide top-quality residential and commercial cleaning services throughout the Main Line area. Our
                  professional team ensures your space is spotless and sanitized.
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Eco-Friendly</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Top-Rated</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <Link href="/calendar">Book Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25"></div>
                  <div
                    className="relative mx-auto overflow-hidden rounded-xl sm:w-full lg:order-last shadow-lg transition-all duration-300 hover:shadow-2xl"
                    onMouseEnter={() => setAutoplay(false)}
                    onMouseLeave={() => setAutoplay(true)}
                  >
                    {/* Main slideshow image */}
                          <div className="relative w-full h-[300px] md:h-[400px]">
                      {slideshowImages.map((image, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
                            currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
                          }`}
                          >
                          <div className="relative w-full h-[300px] md:h-[400px]">
                          <Image
                          src={image || "/placeholder.svg"}
                          fill
                          alt={`Professional cleaning services ${index + 1}`}
                          className="object-cover object-center"
                          priority={index === 0}
                          />
                          </div>
                        </div>
                      ))}

                      {/* Navigation arrows - adjusted for better vertical centering */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          prevSlide()
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md transition-all hover:bg-white hover:text-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Previous slide"
                      >
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
                          className="h-5 w-5"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          nextSlide()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md transition-all hover:bg-white hover:text-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Next slide"
                      >
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
                          className="h-5 w-5"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>

                      {/* Slide indicators */}
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
                        {slideshowImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all ${
                              currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>

                      {/* Autoplay toggle */}
                      <button
                        onClick={toggleAutoplay}
                        className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md transition-all hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
                      >
                        {autoplay ? (
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
                            className="h-4 w-4"
                          >
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
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
                            className="h-4 w-4"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium">
                  Our Services
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Comprehensive Cleaning Solutions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We offer a variety of cleaning services tailored to your specific needs.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12 px-4">
              <div className="relative grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
                {/* First Card - Left */}
                <div className="group relative z-10 flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:mt-8 md:self-start hover:border-blue-200">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-600 to-blue-400 p-1">
                    <div className="rounded-full bg-white p-3">
                      <Home className="h-7 w-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4"></div>
                  <h3 className="text-xl font-bold text-blue-600">Regular Cleaning</h3>
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <p className="text-center text-muted-foreground">
                    Our standard cleaning service includes dusting, vacuuming, mopping, and sanitizing all surfaces.
                  </p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Weekly or bi-weekly service</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>All rooms thoroughly cleaned</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="mt-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                    Learn More
                  </Button>
                </div>

                {/* Second Card - Center (positioned lower) */}
                <div className="group relative z-20 flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl md:mt-16 md:self-center hover:border-cyan-200">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 p-1">
                    <div className="rounded-full bg-white p-3">
                      <Sparkles className="h-7 w-7 text-cyan-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4"></div>
                  <h3 className="text-xl font-bold text-cyan-600">Deep Cleaning</h3>
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-cyan-600 to-blue-500"></div>
                  <p className="text-center text-muted-foreground">
                    A thorough cleaning that reaches every corner, including behind appliances and inside cabinets.
                  </p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-600" />
                      <span>Recommended quarterly</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-600" />
                      <span>Includes hard-to-reach areas</span>
                    </li>
                  </ul>
                  <Button className="mt-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white">
                    Learn More
                  </Button>
                </div>

                {/* Third Card - Right */}
                <div className="group relative z-10 flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:mt-8 md:self-start hover:border-emerald-200">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 p-1">
                    <div className="rounded-full bg-white p-3">
                      <CheckCircle className="h-7 w-7 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4"></div>
                  <h3 className="text-xl font-bold text-emerald-600">Move In/Out Cleaning</h3>
                  <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                  <p className="text-center text-muted-foreground">
                    Prepare your new home or leave your old one spotless with our specialized move-in/out cleaning.
                  </p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>One-time deep cleaning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Includes appliance cleaning</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="mt-2 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" className="gap-1 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                View All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25"></div>
                <Image
                  src={Clean2}
                  width={550}
                  height={550}
                  alt="Our cleaning team"
                  className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg"
                />
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium">
                  About Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Trusted Cleaning Professionals
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  With over 10 years of experience serving the Main Line area, our team of professional cleaners is
                  dedicated to providing exceptional service. We use eco-friendly products and proven techniques to
                  ensure your space is not only clean but healthy.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Fully insured and bonded professionals</span>
                  </li>
                  <li className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Eco-friendly cleaning products</span>
                  </li>
                  <li className="flex items-center gap-2 bg-cyan-50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-cyan-600" />
                    <span>Satisfaction guaranteed</span>
                  </li>
                  <li className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>Flexible scheduling options</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  What Our Clients Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what our satisfied customers have to say.
                </p>
              </div>
            </div>
            <div className="relative mx-auto max-w-5xl py-12">
              <div className="grid gap-6 lg:grid-cols-3">
{testimonials
  .slice(currentTestimonialPage * 3, currentTestimonialPage * 3 + 3)
  .map((testimonial, index) => (
    <div
      key={index}
      className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-md hover:shadow-lg transition-shadow bg-white h-64"
    >
      <div className="space-y-2">
        <div className="flex text-yellow-500">
          {Array.from({ length: testimonial.stars }, (_, idx) => (
            <Star key={idx} className="fill-yellow-500 h-5 w-5" />
          ))}
          {Array.from({ length: 5 - testimonial.stars }, (_, idx) => (
            <Star key={idx} className="h-5 w-5" />
          ))}
        </div>
        <p className="text-muted-foreground overflow-hidden text-ellipsis line-clamp-3">
          {testimonial.content}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2">
          <User className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{testimonial.clientName}</p>
          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
        </div>
      </div>
    </div>
  ))}
              </div>
              
              {/* Testimonial navigation arrows */}
              <div className="flex justify-between items-center mt-8">
                <button 
                  onClick={prevTestimonialPage}
                  className="rounded-full bg-white p-3 text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:text-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Previous testimonials"
                >
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
                    className="h-5 w-5"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                
                {/* Pagination indicators */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialPage(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        currentTestimonialPage === index ? "bg-blue-600 w-8" : "bg-blue-200 hover:bg-blue-400"
                      }`}
                      aria-label={`Go to testimonial page ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextTestimonialPage}
                  className="rounded-full bg-white p-3 text-blue-600 shadow-md transition-all hover:bg-blue-50 hover:text-blue-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Next testimonials"
                >
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
                    className="h-5 w-5"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  <Link href="/reviews">Share Your Experience</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium">
                  Contact Us
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions or ready to schedule a cleaning? Contact us today for a free quote.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <MapPin className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-sm text-muted-foreground">123 Main Line Avenue, Bryn Mawr, PA 19010</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <Phone className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-muted-foreground">(610) 555-1234</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">info@mainlinecleaners.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <Clock className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 8am - 6pm</p>
                      <p className="text-sm text-muted-foreground">Saturday: 9am - 4pm</p>
                      <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-6 shadow-lg">
                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-green-600">Quote Request Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for your interest in MainLine Cleaners. We've received your request and will get back
                        to you within 24 hours.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Request a Quote
                    </h3>
                    <form className="space-y-4" onSubmit={handleSubmitRequest}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm font-medium leading-none flex items-center gap-1"
                          >
                            <User className="h-4 w-4 text-blue-500" />
                            First name
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Enter your first name"
                            className={errors.firstName ? "border-red-500" : ""}
                            value={requestQuoteForm.firstName}
                            onChange={handleInputChange}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm font-medium leading-none flex items-center gap-1"
                          >
                            <User className="h-4 w-4 text-blue-500" />
                            Last name
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Enter your last name"
                            className={errors.lastName ? "border-red-500" : ""}
                            value={requestQuoteForm.lastName}
                            onChange={handleInputChange}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-xs flex items-center mt-1">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium leading-none flex items-center gap-1">
                          <Mail className="h-4 w-4 text-blue-500" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className={errors.email ? "border-red-500" : ""}
                          value={requestQuoteForm.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium leading-none flex items-center gap-1">
                          <Phone className="h-4 w-4 text-blue-500" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className={errors.phone ? "border-red-500" : ""}
                          value={requestQuoteForm.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service" className="text-sm font-medium leading-none flex items-center gap-1">
                          <ClipboardCheck className="h-4 w-4 text-blue-500" />
                          Service Needed
                        </Label>
                        <select
                          id="service"
                          name="service"
                          className={`w-full h-10 px-3 py-2 text-sm rounded-md border ${
                            errors.service ? "border-red-500" : "border-input"
                          } bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                          value={requestQuoteForm.service}
                          onChange={handleInputChange}
                        >
                          <option value="">Select a service</option>
                          <option value="regular">Regular Cleaning</option>
                          <option value="deep">Deep Cleaning</option>
                          <option value="move">Move In/Out Cleaning</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.service && (
                          <p className="text-red-500 text-xs flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.service}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium leading-none flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your cleaning needs"
                          className="min-h-[100px]"
                          value={requestQuoteForm.message}
                          onChange={handleInputChange}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                MainLine Cleaners
              </div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                Professional cleaning services for homes and businesses throughout the Main Line area.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#services" className="text-muted-foreground hover:text-foreground">
                      Residential
                    </Link>
                  </li>
                  <li>
                    <Link href="#services" className="text-muted-foreground hover:text-foreground">
                      Commercial
                    </Link>
                  </li>
                  <li>
                    <Link href="#services" className="text-muted-foreground hover:text-foreground">
                      Special Cleaning
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MainLine Cleaners. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
