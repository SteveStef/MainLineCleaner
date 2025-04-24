"use client"

import type React from "react"

import { useState, useContext, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { CheckCircle, Sparkles, Home, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"

interface Service {
  id: string // the value= you'll use on the <SelectItem>
  translationKey: string // e.g. "regularService"
  descKey: string // e.g. "regularServiceDesc"
  features: string[] // e.g. ["weeklyService","allRoomsCleaned"]
  Icon: React.ComponentType<any> // the icon component
  gradientFrom: string // tailwind color (no #) e.g. "blue-600"
  gradientTo: string // e.g. "blue-400"
  route: string // link href
}

const services: Service[] = [
  {
    id: "REGULAR",
    translationKey: "regularService",
    descKey: "regularServiceDesc",
    features: ["weeklyService", "allRoomsCleaned"],
    Icon: Home,
    gradientFrom: "blue-600",
    gradientTo: "blue-400",
    route: "/services/regular",
  },
  {
    id: "ENVIRONMENT",
    translationKey: "environmentService",
    descKey: "environmentServiceDesc",
    features: ["ecoFriendlyProducts", "sustainableMethods"],
    Icon: Sparkles,
    gradientFrom: "green-600",
    gradientTo: "green-400",
    route: "/services/environment",
  },
  {
    id: "DEEP",
    translationKey: "deepService",
    descKey: "deepServiceDesc",
    features: ["recommendedQuarterly", "hardToReachAreas"],
    Icon: Sparkles,
    gradientFrom: "cyan-600",
    gradientTo: "blue-500",
    route: "/services/deep",
  },
  {
    id: "HAZMAT",
    translationKey: "hazmatService",
    descKey: "hazmatServiceDesc",
    features: ["certifiedTechnicians", "safetyProtocols"],
    Icon: AlertCircle,
    gradientFrom: "yellow-600",
    gradientTo: "yellow-400",
    route: "/services/hazmat",
  },
  {
    id: "FIRE",
    translationKey: "fireService",
    descKey: "fireServiceDesc",
    features: ["smokeRemoval", "odorElimination"],
    Icon: AlertCircle,
    gradientFrom: "red-600",
    gradientTo: "red-400",
    route: "/services/fire",
  },
  {
    id: "WATER",
    translationKey: "waterService",
    descKey: "waterServiceDesc",
    features: ["waterExtraction", "moldPrevention"],
    Icon: AlertCircle,
    gradientFrom: "blue-600",
    gradientTo: "blue-400",
    route: "/services/water",
  },
  {
    id: "MOVE_IN_OUT",
    translationKey: "moveService",
    descKey: "moveServiceDesc",
    features: ["oneTimeDeep", "applianceCleaning"],
    Icon: CheckCircle,
    gradientFrom: "emerald-600",
    gradientTo: "emerald-400",
    route: "/services/move",
  },
  {
    id: "DECEASED",
    translationKey: "deceasedService",
    descKey: "deceasedServiceDesc",
    features: ["discreetService", "thoroughSanitization"],
    Icon: AlertCircle,
    gradientFrom: "purple-600",
    gradientTo: "purple-400",
    route: "/services/deceased",
  },
  {
    id: "EXPLOSIVE_RESIDUE",
    translationKey: "explosiveResidueService",
    descKey: "explosiveResidueServiceDesc",
    features: ["expertTechnicians", "completeDecontamination"],
    Icon: AlertCircle,
    gradientFrom: "orange-600",
    gradientTo: "orange-400",
    route: "/services/explosive",
  },
  {
    id: "MOLD",
    translationKey: "moldService",
    descKey: "moldServiceDesc",
    features: ["moldTesting", "completeRemoval"],
    Icon: AlertCircle,
    gradientFrom: "teal-600",
    gradientTo: "teal-400",
    route: "/services/mold",
  },
  {
    id: "CONSTRUCTION",
    translationKey: "constructionService",
    descKey: "constructionServiceDesc",
    features: ["debrisRemoval", "dustElimination"],
    Icon: Home,
    gradientFrom: "amber-600",
    gradientTo: "amber-400",
    route: "/services/construction",
  },
  {
    id: "COMMERCIAL",
    translationKey: "commercialService",
    descKey: "commercialServiceDesc",
    features: ["afterHoursService", "customizedPlans"],
    Icon: Home,
    gradientFrom: "indigo-600",
    gradientTo: "indigo-400",
    route: "/services/commercial",
  },
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
    },
  },
}

const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: 0.2,
    },
  },
}

const lineVariants = {
  hidden: { width: 0 },
  visible: {
    width: "3rem",
    transition: {
      duration: 0.6,
      delay: 0.3,
    },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ServicesComponent() {
  const [currentServicesPage, setCurrentServicesPage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const prefersReducedMotion = useReducedMotion()

  const { language } = useContext(LanguageContext)
  const t = translations[language as Language]

  // Reset animation state when animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const nextServicesPage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(1)
    const maxPages = Math.ceil(services.length / 4) - 1
    setCurrentServicesPage((prev) => (prev >= maxPages ? 0 : prev + 1))
  }

  const prevServicesPage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(-1)
    const maxPages = Math.ceil(services.length / 4) - 1
    setCurrentServicesPage((prev) => (prev <= 0 ? maxPages : prev - 1))
  }

  const goToPage = (index: number) => {
    if (isAnimating || index === currentServicesPage) return
    setIsAnimating(true)
    setDirection(index > currentServicesPage ? 1 : -1)
    setCurrentServicesPage(index)
  }

  return (
    <motion.section
      id="services"
      className="w-full py-12 md:py-24 lg:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={prefersReducedMotion ? {} : fadeIn}
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          variants={prefersReducedMotion ? {} : staggerContainer}
        >
          <motion.div
            className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full"
            variants={prefersReducedMotion ? {} : iconVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </motion.div>
          <div className="space-y-2">
            <motion.div
              className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-sm text-white font-medium"
              variants={prefersReducedMotion ? {} : fadeIn}
            >
              {t.ourServices}
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
              variants={prefersReducedMotion ? {} : fadeIn}
            >
              {t.comprehensiveSolutions}
            </motion.h2>
            <motion.p
              className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              variants={prefersReducedMotion ? {} : fadeIn}
            >
              {t.servicesDescription}
            </motion.p>
          </div>
        </motion.div>
        <div className="mx-auto max-w-7xl py-12 px-4">
          {/* Services carousel */}
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentServicesPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={prefersReducedMotion ? {} : {}}
                custom={direction}
              >
                {services.slice(currentServicesPage * 4, currentServicesPage * 4 + 4).map((svc, idx) => {
                  const { id, translationKey, descKey, features, Icon, gradientFrom, gradientTo, route } = svc

                  // Stagger animation based on index
                  const delay = idx * 0.1

                  // Create safe class names for Tailwind
                  const gradientClass = `from-${gradientFrom} to-${gradientTo}`
                  const textClass = `text-${gradientFrom}`
                  const hoverBgClass = `hover:bg-${gradientTo.replace(/-\d+$/, "-50")}`
                  const borderClass = `border-${gradientTo}`

                  return (
                    <motion.div
                      key={id}
                      className={`group relative flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 shadow-lg h-[400px]`}
                      variants={prefersReducedMotion ? {} : cardVariants}
                      custom={idx}
                      transition={{ delay }}
                      whileHover={{
                        y: -8,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        borderColor: `var(--${gradientTo.replace(/-\d+$/, "-400")})`,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.div
                        className={`absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${gradientClass} p-1`}
                        variants={prefersReducedMotion ? {} : iconVariants}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className="rounded-full bg-white p-3">
                          <Icon className={textClass} />
                        </div>
                      </motion.div>

                      <motion.h3
                        className={`mt-8 text-xl font-bold ${textClass}`}
                        variants={prefersReducedMotion ? {} : fadeIn}
                      >
                        {t[translationKey]}
                      </motion.h3>

                      <motion.div
                        className={`h-1 w-0 rounded-full bg-gradient-to-r ${gradientClass}`}
                        variants={prefersReducedMotion ? {} : lineVariants}
                      />

                      <motion.p
                        className="text-center text-muted-foreground h-[80px]"
                        variants={prefersReducedMotion ? {} : fadeIn}
                      >
                        {t[descKey]}
                      </motion.p>

                      <br />
                      <br />

                      <motion.ul
                        className="mt-2 space-y-2 text-sm"
                        variants={prefersReducedMotion ? {} : staggerContainer}
                      >
                        {features.map((feat, featureIdx) => (
                          <motion.li
                            key={feat}
                            className="flex items-center gap-2"
                            variants={prefersReducedMotion ? {} : listItemVariants}
                            custom={featureIdx}
                            transition={{ delay: delay + featureIdx * 0.1 }}
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: delay + featureIdx * 0.1 + 0.2 }}
                            >
                              <CheckCircle className={textClass} />
                            </motion.div>
                            <span>{t[feat]}</span>
                          </motion.li>
                        ))}
                      </motion.ul>

                      <motion.div
                        className="mt-auto pt-4"
                        variants={prefersReducedMotion ? {} : fadeIn}
                        transition={{ delay: delay + 0.4 }}
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" size="sm" className={`${borderClass} ${hoverBgClass} ${textClass}`}>
                            <Link href={route}>{t.learnMore}</Link>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>

            {/* Services navigation arrows */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                onClick={prevServicesPage}
                className="rounded-full bg-white p-3 text-blue-600 shadow-md"
                whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                whileTap={{ scale: 0.9 }}
                disabled={isAnimating}
                aria-label="Previous services"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>

              {/* Pagination indicators */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(services.length / 4) }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentServicesPage === index ? "bg-blue-600 w-8" : "bg-blue-200 w-2.5"
                    }`}
                    whileHover={{
                      scale: 1.2,
                      backgroundColor: currentServicesPage === index ? "#2563eb" : "#93c5fd",
                    }}
                    disabled={isAnimating}
                    aria-label={`Go to services page ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextServicesPage}
                className="rounded-full bg-white p-3 text-blue-600 shadow-md"
                whileHover={{ scale: 1.1, backgroundColor: "#f0f9ff" }}
                whileTap={{ scale: 0.9 }}
                disabled={isAnimating}
                aria-label="Next services"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
