"use client"
import { useState, useEffect, useContext, useRef } from "react"
import type React from "react"
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Services from "@/components/services"

import {
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Award,
  Sparkles,
  MessageSquare,
  User,
  ClipboardCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "./Header"
import Footer from "./Footer"

import Clean from "../images/cleanHouse.jpg"
import Clean2 from "../images/clean.jpg"
import Clean3 from "../images/spotless.jpeg"
import Clean4 from "../images/livingroom.jpg"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import { tes } from "@/lib/utils"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const slideIn = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
}

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
  },
}

function MainLineCleanersContent() {
  const { language } = useContext(LanguageContext)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

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

  const [testimonials, setTestimonials] = useState([])

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0)

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Scroll-linked animations
  const aboutRef = useRef(null)
  const isAboutInView = useInView(aboutRef, { once: false, amount: 0.3 })

  const testimonialsRef = useRef(null)
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })

  const contactRef = useRef(null)
  const isContactInView = useInView(contactRef, { once: false, amount: 0.3 })

  // Get translations based on current language
  const t = translations[language as Language]

  // Images for the slideshow
  const slideshowImages = [Clean, Clean3, Clean4]

  // Functions to navigate testimonials
  const nextTestimonialPage = () => {
    const maxPages = Math.ceil(testimonials.length / 3) - 1
    setCurrentTestimonialPage((prev) => (prev >= maxPages ? 0 : prev + 1))
  }

  const prevTestimonialPage = () => {
    const maxPages = Math.ceil(testimonials.length / 3) - 1
    setCurrentTestimonialPage((prev) => (prev <= 0 ? maxPages : prev - 1))
  }

  useEffect(() => {}, [testimonials])

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
        const options = { method: "GET" }
        const response: any = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()
          for (let i = 0; i < data.length; i++) {
            data[i]["content.es"] = await tes(data[i].content)
          }
          setTestimonials(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getReviews()
  }, [])

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
    const phoneRegex = /^\+?1?\s*(?:$$\d{3}$$|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/
    return phoneRegex.test(phone)
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
      newErrors.firstName = t.firstNameRequired
      hasErrors = true
    }

    if (!requestQuoteForm.lastName.trim()) {
      newErrors.lastName = t.lastNameRequired
      hasErrors = true
    }

    if (!requestQuoteForm.email.trim()) {
      newErrors.email = t.emailRequired
      hasErrors = true
    } else if (!validateEmail(requestQuoteForm.email)) {
      newErrors.email = t.invalidEmail
      hasErrors = true
    }

    if (!requestQuoteForm.phone.trim()) {
      newErrors.phone = t.phoneRequired
      hasErrors = true
    } else if (!validatePhone(requestQuoteForm.phone)) {
      newErrors.phone = t.invalidPhone
      hasErrors = true
    }

    if (!requestQuoteForm.service) {
      newErrors.service = t.serviceRequired
      hasErrors = true
    }

    setErrors(newErrors)
    if (!hasErrors) {
      setIsSubmitting(true)

      try {
        const url: string = `${process.env.NEXT_PUBLIC_API_URL}/requestQuote`
        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestQuoteForm),
        }

        const response: any = await fetch(url, options)

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
        {/* Hero Section with Parallax Effect */}
        <motion.section
          id="hero"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white relative"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div className="space-y-4" variants={fadeIn}>
                <motion.div
                  className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </motion.div>
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  variants={slideIn}
                >
                  {t.heroTitle}
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  {t.heroDescription}
                </motion.p>
                <motion.div className="flex flex-wrap gap-3 mt-2" variants={staggerContainer}>
                  <motion.div
                    className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                    variants={scaleUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{t.ecoFriendly}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    variants={scaleUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">{t.topRated}</span>
                  </motion.div>
                </motion.div>
                <motion.div className="flex flex-col gap-2 min-[400px]:flex-row mt-4" variants={fadeIn}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/calendar">{t.bookNow}</Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => scrollToSection("about")}
                    >
                      {t.learnMore}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div className="relative" variants={fadeIn} style={{ opacity, scale }}>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="relative mx-auto overflow-hidden rounded-xl sm:w-full lg:order-last shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                >
                  {/* Main slideshow image */}
                  <div className="relative w-full h-[300px] md:h-[400px]">
                    <AnimatePresence mode="wait">
                      {slideshowImages.map(
                        (image, index) =>
                          currentSlide === index && (
                            <motion.div
                              key={index}
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0, scale: 1.1 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.7 }}
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
                            </motion.div>
                          ),
                      )}
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevSlide()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Previous slide"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextSlide()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Next slide"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>

                    {/* Slide indicators */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
                      {slideshowImages.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            currentSlide === index ? "bg-white w-8" : "bg-white/50 w-2.5"
                          }`}
                          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.8)", scale: 1.2 }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Autoplay toggle */}
                    <motion.button
                      onClick={toggleAutoplay}
                      className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 p-2 text-blue-600 shadow-md"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 1)" }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
                    >
                      {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <Services />

        {/* About Section */}
        <motion.section
          id="about"
          ref={aboutRef}
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white"
          initial="hidden"
          animate={isAboutInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div className="relative" variants={fadeIn}>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25"
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Image
                    src={Clean2 || "/placeholder.svg"}
                    width={550}
                    height={550}
                    alt="Our cleaning team"
                    className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <motion.div className="space-y-4" variants={staggerContainer}>
                <motion.div
                  className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2"
                  variants={scaleUp}
                  whileHover={{ scale: 1.1 }}
                >
                  <User className="h-6 w-6 text-blue-600" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium"
                  variants={slideIn}
                >
                  {t.aboutUs}
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  variants={fadeIn}
                >
                  {t.trustedProfessionals}
                </motion.h2>

                <motion.p
                  className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  {t.aboutDescription}
                </motion.p>

                <motion.ul className="grid gap-2" variants={staggerContainer}>
                  <motion.li
                    className="flex items-center gap-2 bg-green-50 p-2 rounded-lg"
                    variants={slideIn}
                    whileHover={{ x: 5, backgroundColor: "rgba(240, 253, 244, 1)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>{t.insuredProfessionals}</span>
                  </motion.li>

                  <motion.li
                    className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg"
                    variants={slideIn}
                    whileHover={{ x: 5, backgroundColor: "rgba(239, 246, 255, 1)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>{t.ecoProducts}</span>
                  </motion.li>

                  <motion.li
                    className="flex items-center gap-2 bg-cyan-50 p-2 rounded-lg"
                    variants={slideIn}
                    whileHover={{ x: 5, backgroundColor: "rgba(236, 254, 255, 1)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-cyan-600" />
                    <span>{t.satisfactionGuaranteed}</span>
                  </motion.li>

                  <motion.li
                    className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg"
                    variants={slideIn}
                    whileHover={{ x: 5, backgroundColor: "rgba(236, 253, 245, 1)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span>{t.flexibleScheduling}</span>
                  </motion.li>
                </motion.ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          id="testimonials"
          ref={testimonialsRef}
          className="w-full py-12 md:py-24 lg:py-24"
          initial="hidden"
          animate={isTestimonialsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6">
            <motion.div className="flex flex-col items-center justify-center space-y-4 text-center" variants={fadeIn}>
              <motion.div
                className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full"
                whileHover={{ scale: 1.1 }}
                animate={pulseAnimation}
              >
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </motion.div>

              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium"
                  variants={scaleUp}
                >
                  {t.testimonials}
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  variants={fadeIn}
                >
                  {t.clientsSay}
                </motion.h2>

                <motion.p
                  className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  {t.testimonialsDescription}
                </motion.p>
              </div>
            </motion.div>

            <div className="relative mx-auto max-w-5xl py-12">
              <motion.div className="grid gap-6 lg:grid-cols-3" variants={staggerContainer}>
                <AnimatePresence mode="wait">
                  {testimonials
                    .slice(currentTestimonialPage * 3, currentTestimonialPage * 3 + 3)
                    .map((testimonial, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-md bg-white h-64"
                        variants={fadeIn}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="space-y-2">
                          <motion.div
                            className="flex text-yellow-500"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.1,
                                },
                              },
                            }}
                          >
                            {Array.from({ length: testimonial.stars }, (_, idx) => (
                              <motion.div
                                key={idx}
                                variants={{
                                  hidden: { opacity: 0, scale: 0 },
                                  visible: { opacity: 1, scale: 1 },
                                }}
                              >
                                <Star className="fill-yellow-500 h-5 w-5" />
                              </motion.div>
                            ))}
                            {Array.from({ length: 5 - testimonial.stars }, (_, idx) => (
                              <motion.div
                                key={idx + testimonial.stars}
                                variants={{
                                  hidden: { opacity: 0, scale: 0 },
                                  visible: { opacity: 1, scale: 1 },
                                }}
                              >
                                <Star className="h-5 w-5" />
                              </motion.div>
                            ))}
                          </motion.div>
                          <p className="text-muted-foreground overflow-hidden text-ellipsis line-clamp-3">
                            {language === "en" ? testimonial.content : testimonial["content.es"] || ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.div className="rounded-full bg-blue-100 p-2" whileHover={{ scale: 1.1 }}>
                            <User className="h-4 w-4 text-blue-600" />
                          </motion.div>
                          <div>
                            <p className="font-medium">{testimonial.clientName}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>

              {/* Testimonial navigation arrows */}
              <div className="flex justify-between items-center mt-8">
                <motion.button
                  onClick={prevTestimonialPage}
                  className="rounded-full bg-white p-3 text-blue-600 shadow-md"
                  whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Previous testimonials"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>

                {/* Pagination indicators */}
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentTestimonialPage(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentTestimonialPage === index ? "bg-blue-600 w-8" : "bg-blue-200 w-2.5"
                      }`}
                      whileHover={{
                        scale: 1.2,
                        backgroundColor: currentTestimonialPage === index ? "#2563eb" : "#93c5fd",
                      }}
                      aria-label={`Go to testimonial page ${index + 1}`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={nextTestimonialPage}
                  className="rounded-full bg-white p-3 text-blue-600 shadow-md"
                  whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Next testimonials"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              <motion.div className="flex justify-center mt-8" variants={fadeIn}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/reviews">{t.shareExperience}</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          ref={contactRef}
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white"
          initial="hidden"
          animate={isContactInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
              <motion.div className="space-y-4" variants={staggerContainer}>
                <motion.div
                  className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2"
                  variants={scaleUp}
                  whileHover={{ scale: 1.1 }}
                >
                  <Mail className="h-6 w-6 text-blue-600" />
                </motion.div>

                <motion.div
                  className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium"
                  variants={slideIn}
                >
                  {t.contactUs}
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                  variants={fadeIn}
                >
                  {t.getInTouch}
                </motion.h2>

                <motion.p
                  className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  variants={fadeIn}
                >
                  {t.contactDescription}
                </motion.p>

                <motion.div className="grid gap-4" variants={staggerContainer}>
                  <motion.div
                    className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm"
                    variants={slideIn}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <MapPin className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t.address}</h3>
                      <p className="text-sm text-muted-foreground">{t.addressValue}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm"
                    variants={slideIn}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <Phone className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t.phone}</h3>
                      <p className="text-sm text-muted-foreground">{t.phoneValue}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm"
                    variants={slideIn}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t.email}</h3>
                      <p className="text-sm text-muted-foreground">{t.emailValue}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm"
                    variants={slideIn}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <Clock className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t.hours}</h3>
                      <p className="text-sm text-muted-foreground">{t.mondayFriday}</p>
                      <p className="text-sm text-muted-foreground">{t.saturday}</p>
                      <p className="text-sm text-muted-foreground">{t.sunday}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="rounded-lg border bg-white p-6 shadow-lg"
                variants={fadeIn}
                whileHover={{
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-8 space-y-6 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="rounded-full bg-green-100 p-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      >
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </motion.div>
                      <div className="space-y-2">
                        <motion.h3
                          className="text-2xl font-bold text-green-600"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {t.quoteSuccess}
                        </motion.h3>
                        <motion.p
                          className="text-muted-foreground"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {t.quoteSuccessMessage}
                        </motion.p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setSubmitSuccess(false)}
                          className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          {t.submitAnother}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        {t.requestQuote}
                      </h3>
                      <form className="space-y-4" onSubmit={handleSubmitRequest}>
                        <motion.div className="grid grid-cols-2 gap-4" variants={staggerContainer}>
                          <motion.div className="space-y-2" variants={fadeIn}>
                            <Label
                              htmlFor="firstName"
                              className="text-sm font-medium leading-none flex items-center gap-1"
                            >
                              <User className="h-4 w-4 text-blue-500" />
                              {t.firstName}
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder={t.firstName}
                              className={errors.firstName ? "border-red-500" : ""}
                              value={requestQuoteForm.firstName}
                              onChange={handleInputChange}
                            />
                            {errors.firstName && (
                              <motion.p
                                className="text-red-500 text-xs flex items-center mt-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.firstName}
                              </motion.p>
                            )}
                          </motion.div>

                          <motion.div className="space-y-2" variants={fadeIn}>
                            <Label
                              htmlFor="lastName"
                              className="text-sm font-medium leading-none flex items-center gap-1"
                            >
                              <User className="h-4 w-4 text-blue-500" />
                              {t.lastName}
                            </Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder={t.lastName}
                              className={errors.lastName ? "border-red-500" : ""}
                              value={requestQuoteForm.lastName}
                              onChange={handleInputChange}
                            />
                            {errors.lastName && (
                              <motion.p
                                className="text-red-500 text-xs flex items-center mt-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {errors.lastName}
                              </motion.p>
                            )}
                          </motion.div>
                        </motion.div>

                        <motion.div className="space-y-2" variants={fadeIn}>
                          <Label htmlFor="email" className="text-sm font-medium leading-none flex items-center gap-1">
                            <Mail className="h-4 w-4 text-blue-500" />
                            {t.email}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t.email}
                            className={errors.email ? "border-red-500" : ""}
                            value={requestQuoteForm.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <motion.p
                              className="text-red-500 text-xs flex items-center mt-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.email}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div className="space-y-2" variants={fadeIn}>
                          <Label htmlFor="phone" className="text-sm font-medium leading-none flex items-center gap-1">
                            <Phone className="h-4 w-4 text-blue-500" />
                            {t.phone}
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={t.phone}
                            className={errors.phone ? "border-red-500" : ""}
                            value={requestQuoteForm.phone}
                            onChange={handleInputChange}
                          />
                          {errors.phone && (
                            <motion.p
                              className="text-red-500 text-xs flex items-center mt-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.phone}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div className="space-y-2" variants={fadeIn}>
                          <Label htmlFor="service" className="text-sm font-medium leading-none flex items-center gap-1">
                            <ClipboardCheck className="h-4 w-4 text-blue-500" />
                            {t.service}
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
                            <option value="">{t.selectService}</option>
                            <option value="regular">{t.regularService}</option>
                            <option value="deep">{t.deepService}</option>
                            <option value="move">{t.moveService}</option>
                            <option value="other">{t.otherService}</option>
                          </select>
                          {errors.service && (
                            <motion.p
                              className="text-red-500 text-xs flex items-center mt-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.service}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div className="space-y-2" variants={fadeIn}>
                          <Label htmlFor="message" className="text-sm font-medium leading-none flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            {t.message}
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder={t.messagePlaceholder}
                            className="min-h-[100px]"
                            value={requestQuoteForm.message}
                            onChange={handleInputChange}
                          />
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} variants={fadeIn}>
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
                            disabled={isSubmitting}
                          >
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
                                {t.submitting}
                              </>
                            ) : (
                              t.submitRequest
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.section>
        {/* Floating Navigation */}
        <motion.div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={() => scrollToSection("hero")}
            className={`w-3 h-3 rounded-full ${scrollYProgress.get() < 0.2 ? "bg-blue-600 scale-125" : "bg-gray-300"}`}
            whileHover={{ scale: 1.5 }}
            aria-label="Scroll to top"
          />
          <motion.button
            onClick={() => scrollToSection("about")}
            className={`w-3 h-3 rounded-full ${
              scrollYProgress.get() >= 0.2 && scrollYProgress.get() < 0.5 ? "bg-blue-600 scale-125" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.5 }}
            aria-label="Scroll to about section"
          />
          <motion.button
            onClick={() => scrollToSection("testimonials")}
            className={`w-3 h-3 rounded-full ${
              scrollYProgress.get() >= 0.5 && scrollYProgress.get() < 0.8 ? "bg-blue-600 scale-125" : "bg-gray-300"
            }`}
            whileHover={{ scale: 1.5 }}
            aria-label="Scroll to testimonials section"
          />
          <motion.button
            onClick={() => scrollToSection("contact")}
            className={`w-3 h-3 rounded-full ${scrollYProgress.get() >= 0.8 ? "bg-blue-600 scale-125" : "bg-gray-300"}`}
            whileHover={{ scale: 1.5 }}
            aria-label="Scroll to contact section"
          />
        </motion.div>
        {/* Scroll to top button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: scrollYProgress.get() > 0.2 ? 1 : 0,
            scale: scrollYProgress.get() > 0.2 ? 1 : 0,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
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
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      </main>
      <Footer />
    </div>
  )
}

export default MainLineCleanersContent
