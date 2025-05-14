"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useRef, useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, ChevronLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "../../Header"
import { serviceInfo, serviceInfoES } from "./serviceInfo"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import Services from "@/components/services"

export default function ServicePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const { service } = useParams<{ service: string }>()

  const { language } = useContext(LanguageContext)
  const t = translations[language as Language]

  const [serviced, setServiced] = useState(() => {
    if (!service) return null
    const key = service.toUpperCase()
    return language === "es" ? (serviceInfoES[key]?.cleaning ?? null) : (serviceInfo[key]?.cleaning ?? null)
  })

  useEffect(() => {
    if (!service) return
    const key = service.toUpperCase()
    if (language === "es") {
      setServiced(serviceInfoES[key]?.cleaning ?? null)
    } else {
      setServiced(serviceInfo[key]?.cleaning ?? null)
    }
  }, [service, language])

  // Refs for scroll animations
  const overviewRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const faqsRef = useRef<HTMLDivElement>(null)

  // Check if sections are in view
  const overviewInView = useInView(overviewRef, { once: false, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 })
  const processInView = useInView(processRef, { once: false, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: false, amount: 0.3 })
  const faqsInView = useInView(faqsRef, { once: false, amount: 0.3 })

  // Update active tab based on scroll position
  useEffect(() => {
    if (overviewInView) setActiveTab("overview")
    else if (featuresInView) setActiveTab("features")
    else if (processInView) setActiveTab("process")
    else if (benefitsInView) setActiveTab("benefits")
    else if (faqsInView) setActiveTab("faqs")
  }, [overviewInView, featuresInView, processInView, benefitsInView, faqsInView])

  // In a real application, you would fetch this data based on the service parameter
  // For this example, we'll just use the cleaning service data

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

  if (!serviced) return <div>Loading...</div>

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
      >
        <Header />
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 z-0">
            <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundColor: "#1e40af",
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
                    href="../#services"
                    className="flex items-center text-sm font-medium text-blue-600 hover:underline transition-all duration-300 hover:text-blue-800"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t["back.to.services"]}
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
                  {serviced.title}
                </span>
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {serviced.shortDesc}
                </p>
                <motion.div
                    className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: "6rem" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.div>
              <motion.div variants={fadeIn} className="pt-6" whileHover={{ scale: 1.03 }}>
                <Link href="/calendar">
                  <Button>{t["book.now"]}</Button>
                </Link>
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
                        <h3 className="text-xl font-bold mb-4">{t["quick.navigation"]}</h3>
                        <nav className="space-y-2">
                          {[
                            { id: "overview", label: t["nav.overview"] },
                            { id: "features", label: t["nav.features"] },
                            { id: "process", label: t["nav.process"] },
                            { id: "benefits", label: t["nav.benefits"] },
                            { id: "faqs", label: t["nav.faqs"] },
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
                        <h3 className="text-xl font-bold mb-4">{t["ready.to.get.started"]}</h3>
                        <p className="text-muted-foreground mb-4">{t["contact.us.for.quote"]}</p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Link href="../#contact">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300">
                              {t["request.quote"]}
                            </Button>
                          </Link>
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
                    {t["service.overview"]}
                  </span>
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">{serviced.longDesc}</p>
                    <motion.div
                        className="relative rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 my-8 shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                      <Image
                          src={serviced.image || "/placeholder.svg"}
                          alt="Professional cleaning service"
                          fill
                          className="object-cover"
                      />
                    </motion.div>

                    <p className="text-muted-foreground">{t["professional.team.description"]}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-700">{t["comprehensive.solutions"]}</h3>
                        <p className="text-muted-foreground">
                          {t["comprehensive.solutions.description"]?.replace("{service}", serviced.title.toLowerCase())}
                        </p>
                        <h3 className="text-xl font-semibold text-blue-700">{t["customized.approach"]}</h3>
                        <p className="text-muted-foreground">{t["customized.approach.description"]}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-700">{t["trained.professionals"]}</h3>
                        <p className="text-muted-foreground">{t["trained.professionals.description"]}</p>
                        <h3 className="text-xl font-semibold text-blue-700">{t["quality.assurance"]}</h3>
                        <p className="text-muted-foreground">{t["quality.assurance.description"]}</p>
                      </div>
                    </div>
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
                    {t["key.features"]}
                  </span>
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {serviced.features.map((feature, index) => (
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
                            <h3 className="font-medium text-blue-800">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                    {t["our.process"]}
                  </span>
                  </motion.h2>
                  <div className="relative border-l-2 border-blue-200 pl-8 ml-4 space-y-10">
                    {serviced.process.map((step, index) => (
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
                                ? t["process.step1.description"]
                                : index === 1
                                    ? t["process.step2.description"]
                                    : index === 2
                                        ? t["process.step3.description"]
                                        : index === 3
                                            ? t["process.step4.description"]
                                            : t["process.step5.description"]}
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
                    {t["benefits"]}
                  </span>
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {serviced.benefits.map((benefit, index) => (
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
                        <h3 className="text-xl font-bold mb-2">{t["ready.to.experience"]}</h3>
                        <p>{t["contact.today"]}</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="../calendar">
                          <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                            {t["get.started"]}
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        <Services />
      </motion.div>
  )
}
