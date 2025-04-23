"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, Clock, Shield, Award, Users, ChevronLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "../../Header"

// This would normally come from your translation file or CMS
const serviceData = {
  cleaning: {
    title: "Professional Cleaning Services",
    shortDesc: "Expert cleaning solutions tailored to your specific needs",
    longDesc:
      "Our professional cleaning services are designed to provide comprehensive solutions for homes and businesses of all sizes. We use eco-friendly products and advanced techniques to ensure spotless results every time.",
    gradientFrom: "blue-600",
    gradientTo: "cyan-500",
    features: [
      "Deep cleaning of all surfaces",
      "Eco-friendly cleaning products",
      "Trained and vetted cleaning professionals",
      "Flexible scheduling options",
      "Satisfaction guarantee",
      "Custom cleaning plans",
    ],
    benefits: [
      {
        title: "Save Time",
        description: "Reclaim your valuable time while we handle the cleaning",
        icon: Clock,
      },
      {
        title: "Health & Safety",
        description: "Improve indoor air quality and reduce allergens",
        icon: Shield,
      },
      {
        title: "Professional Results",
        description: "Enjoy consistently superior cleaning outcomes",
        icon: Award,
      },
      {
        title: "Customized Service",
        description: "Solutions tailored to your specific requirements",
        icon: Users,
      },
    ],
    faqs: [
      {
        question: "How often should I schedule cleaning services?",
        answer:
          "The frequency depends on your specific needs. We offer weekly, bi-weekly, monthly, and one-time cleaning services to accommodate different requirements.",
      },
      {
        question: "Are your cleaning products safe for pets and children?",
        answer:
          "Yes, we use eco-friendly, non-toxic cleaning products that are safe for children, pets, and the environment while still delivering excellent cleaning results.",
      },
      {
        question: "How long does a typical cleaning service take?",
        answer:
          "The duration varies based on the size of your space and the type of cleaning requested. A standard cleaning for an average-sized home typically takes 2-3 hours with our professional team.",
      },
      {
        question: "Do I need to be present during the cleaning service?",
        answer:
          "No, you don't need to be present. Many of our clients provide a key or access instructions, allowing our trusted professionals to clean while you're away.",
      },
    ],
    process: [
      "Initial consultation to understand your needs",
      "Customized cleaning plan development",
      "Scheduling at your convenience",
      "Professional cleaning execution",
      "Quality inspection and feedback",
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "Homeowner",
        comment: "The cleaning team was professional, thorough, and efficient. My home has never looked better!",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "Office Manager",
        comment:
          "We've been using their services for our office for over a year now. Consistently excellent results and reliable service.",
        rating: 5,
      },
      {
        name: "Emily Rodriguez",
        role: "Property Manager",
        comment:
          "Their attention to detail is impressive. They've become our go-to cleaning service for all our properties.",
        rating: 4,
      },
    ],
  },
}

export default function ServicePage({ params }: { params: { service: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  // Refs for scroll animations
  const overviewRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  // Check if sections are in view
  const overviewInView = useInView(overviewRef, { once: false, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const processInView = useInView(processRef, { once: false, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: false, amount: 0.3 })
  const faqsInView = useInView(faqsRef, { once: false, amount: 0.3 })
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.3 })

  // Update active tab based on scroll position
  useEffect(() => {
    if (overviewInView) setActiveTab("overview")
    else if (featuresInView) setActiveTab("features")
    else if (processInView) setActiveTab("process")
    else if (benefitsInView) setActiveTab("benefits")
    else if (faqsInView) setActiveTab("faqs")
    else if (testimonialsInView) setActiveTab("testimonials")
  }, [overviewInView, featuresInView, processInView, benefitsInView, faqsInView, testimonialsInView])

  // In a real application, you would fetch this data based on the service parameter
  // For this example, we'll just use the cleaning service data
  const service = serviceData.cleaning

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen"
    >
    <Header />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 z-0">
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{ backgroundPosition: "100% 100%" }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%231e40af' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div variants={fadeIn}>
              <Link
                href="/services"
                className="flex items-center text-sm font-medium text-blue-600 hover:underline transition-all duration-300 hover:text-blue-800"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Services
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full shadow-md"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            >
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </motion.div>

            <motion.div className="space-y-2" variants={fadeIn}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
                  {service.title}
                </span>
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {service.shortDesc}
              </p>
              <motion.div
                className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>

            <motion.div variants={fadeIn} className="pt-6" whileHover={{ scale: 1.03 }}>
              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Quick Navigation</h3>
                      <nav className="space-y-2">
                        {[
                          { id: "overview", label: "Overview" },
                          { id: "features", label: "Features" },
                          { id: "process", label: "Process" },
                          { id: "benefits", label: "Benefits" },
                          { id: "faqs", label: "FAQs" },
                          { id: "testimonials", label: "Testimonials" },
                        ].map((item) => (
                          <motion.a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`flex items-center p-2 rounded-lg transition-colors ${
                              activeTab === item.id
                                ? "bg-blue-100 text-blue-600 font-medium"
                                : "text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
                            }`}
                            whileHover={{ x: 5 }}
                            onClick={() => setActiveTab(item.id)}
                          >
                            <ArrowRight
                              className={`h-4 w-4 mr-2 transition-transform duration-300 ${activeTab === item.id ? "translate-x-1" : ""}`}
                            />
                            {item.label}
                          </motion.a>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
                      <p className="text-muted-foreground mb-4">Contact us today for a free consultation and quote.</p>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300">
                          Request a Quote
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Overview */}
              <motion.div
                id="overview"
                className="scroll-mt-24"
                ref={overviewRef}
                initial="hidden"
                animate={overviewInView ? "visible" : "hidden"}
                variants={fadeIn}
              >
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Service Overview
                  </span>
                </h2>
                <div className="prose max-w-none">
                  <p className="text-lg text-muted-foreground mb-6">{service.longDesc}</p>
                  <motion.div
                    className="relative rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 my-8 shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/placeholder.svg?height=600&width=1200"
                      alt="Professional cleaning service"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <p className="text-muted-foreground">
                    Our professional team brings years of experience and specialized knowledge to every cleaning
                    project. Whether you need residential cleaning, commercial cleaning, or specialized cleaning
                    services, we have the expertise and equipment to exceed your expectations.
                  </p>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                id="features"
                className="scroll-mt-24"
                ref={featuresRef}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.h2 className="text-2xl font-bold tracking-tight mb-6" variants={fadeIn}>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Key Features
                  </span>
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300"
                      variants={itemFadeIn}
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px] shadow-md">
                        <div className="rounded-full bg-white p-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800">{feature}</h3>
                        <p className="text-sm text-muted-foreground">
                          {index % 2 === 0
                            ? "Our comprehensive approach ensures no detail is overlooked."
                            : "We customize our services to meet your specific requirements."}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Process */}
              <motion.div
                id="process"
                className="scroll-mt-24"
                ref={processRef}
                initial="hidden"
                animate={processInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.h2 className="text-2xl font-bold tracking-tight mb-6" variants={fadeIn}>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Our Process
                  </span>
                </motion.h2>
                <div className="relative border-l-2 border-blue-200 pl-8 ml-4 space-y-10">
                  {service.process.map((step, index) => (
                    <motion.div key={index} className="relative" variants={itemFadeIn} custom={index}>
                      <motion.div
                        className="absolute -left-[42px] flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg"
                        whileHover={{ scale: 1.2 }}
                      >
                        {index + 1}
                      </motion.div>
                      <h3 className="text-lg font-medium text-blue-800">{step}</h3>
                      <p className="text-muted-foreground">
                        {index === 0
                          ? "We begin by understanding your specific cleaning needs and preferences."
                          : index === 1
                            ? "Based on your requirements, we develop a tailored cleaning plan."
                            : index === 2
                              ? "We work around your schedule to minimize disruption."
                              : index === 3
                                ? "Our professional team executes the cleaning plan with precision."
                                : "We ensure your complete satisfaction with our service."}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                id="benefits"
                className="scroll-mt-24"
                ref={benefitsRef}
                initial="hidden"
                animate={benefitsInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.h2 className="text-2xl font-bold tracking-tight mb-6" variants={fadeIn}>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Benefits
                  </span>
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={itemFadeIn}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="overflow-hidden border-0 shadow-lg h-full">
                        <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500" />
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px] shadow-md">
                              <div className="rounded-full bg-white p-2">
                                <benefit.icon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-blue-800">{benefit.title}</h3>
                              <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                id="faqs"
                className="scroll-mt-24"
                ref={faqsRef}
                initial="hidden"
                animate={faqsInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.h2 className="text-2xl font-bold tracking-tight mb-6" variants={fadeIn}>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Frequently Asked Questions
                  </span>
                </motion.h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      variants={itemFadeIn}
                      className="overflow-hidden rounded-lg border shadow-md"
                    >
                      <motion.button
                        className={`flex w-full cursor-pointer items-center justify-between p-4 font-medium text-left ${
                          activeFaq === index ? "bg-blue-50" : "bg-white"
                        }`}
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                      >
                        <span className="text-blue-800">{faq.question}</span>
                        <motion.span animate={{ rotate: activeFaq === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronDown className="h-5 w-5 text-blue-600" />
                        </motion.span>
                      </motion.button>
                      <AnimatePresence>
                        {activeFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-4 pt-0 bg-white">
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div
                id="testimonials"
                className="scroll-mt-24"
                ref={testimonialsRef}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                <motion.h2 className="text-2xl font-bold tracking-tight mb-6" variants={fadeIn}>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Client Testimonials
                  </span>
                </motion.h2>
                <div className="grid grid-cols-1 gap-6">
                  {service.testimonials.map((testimonial, index) => (
                    <motion.div key={index} variants={itemFadeIn} whileHover={{ scale: 1.02 }}>
                      <Card className="overflow-hidden border-0 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-[2px] shadow-md">
                              <div className="rounded-full bg-white p-1">
                                <div className="rounded-full bg-blue-100 p-2">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.svg
                                    key={i}
                                    className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </motion.svg>
                                ))}
                              </div>
                              <p className="text-muted-foreground mb-2 italic">"{testimonial.comment}"</p>
                              <div>
                                <p className="font-medium text-blue-800">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                className="rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Ready to experience our premium cleaning service?</h3>
                      <p>Contact us today for a free consultation and quote.</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">Get Started</Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Related Services
              </span>
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our other professional services
            </p>
            <motion.div
              className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
              initial={{ width: 0 }}
              whileInView={{ width: "3rem" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{
                  y: -15,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 shadow-lg"
              >
                <motion.div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-1 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="rounded-full bg-white p-3">
                    <CheckCircle className="h-7 w-7 text-blue-600" />
                  </div>
                </motion.div>

                <h3 className="mt-8 text-xl font-bold text-blue-600">
                  {i === 1 ? "Commercial Cleaning" : i === 2 ? "Specialized Cleaning" : "Residential Cleaning"}
                </h3>
                <motion.div
                  className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  viewport={{ once: true }}
                />
                <p className="text-center text-muted-foreground h-[80px]">
                  {i === 1
                    ? "Professional cleaning solutions for offices and commercial spaces"
                    : i === 2
                      ? "Specialized cleaning for unique surfaces and environments"
                      : "Comprehensive cleaning services for homes of all sizes"}
                </p>

                <ul className="mt-2 space-y-2 text-sm">
                  {[1, 2, 3].map((j) => (
                    <motion.li
                      key={j}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.1 }}
                    >
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>
                        {i === 1
                          ? j === 1
                            ? "Office cleaning"
                            : j === 2
                              ? "Retail spaces"
                              : "Industrial facilities"
                          : i === 2
                            ? j === 1
                              ? "Carpet cleaning"
                              : j === 2
                                ? "Window cleaning"
                                : "Post-construction"
                            : j === 1
                              ? "Regular cleaning"
                              : j === 2
                                ? "Deep cleaning"
                                : "Move-in/out cleaning"}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto pt-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500 hover:bg-cyan-50 text-blue-600 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300"
                    >
                      <Link href={`/services/${i === 1 ? "commercial" : i === 2 ? "specialized" : "residential"}`}>
                        Learn More
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
