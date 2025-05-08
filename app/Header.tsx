"use client"
export const runtime = "edge";
import { useState, useContext } from "react"
import Link from "next/link"
import { CheckCircle, Menu, Phone, Star, Clock, User, MessageSquare, Globe, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import { motion, useScroll } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useContext(LanguageContext)
  const { scrollYProgress } = useScroll()

  const t = translations[language as Language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Dos Chicas
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          <Link
            href="../#services"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{t.services}</span>
          </Link>
          <Link
            href="../#about"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <User className="h-4 w-4" />
            <span>{t.about}</span>
          </Link>
          <Link
            href="../#testimonials"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{t.testimonials}</span>
          </Link>
          <Link
            href="/manage-appointment"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <Star className="h-4 w-4" />
            <span>{t.myAppointment}</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <Clock className="h-4 w-4" />
            <span>{t.bookNow}</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="../#contact" className="hidden sm:block">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md transition-all duration-300">
              <Phone className="mr-2 h-4 w-4" /> {t.getQuote}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hidden md:flex items-center justify-center h-9 px-2.5"
            aria-label={`Change language to ${language === "en" ? "Spanish" : "English"}`}
          >
            <Globe className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </Button>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Content */}
            <SheetContent side="left" className="w-[85%] sm:w-[350px] border-r p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="flex items-center">
                    <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      Dos Chicas
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1 p-4 flex-1">
                  <Link
                    href="../#services"
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-base font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>{t.services}</span>
                  </Link>
                  <Link
                    href="../#about"
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-base font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>{t.about}</span>
                  </Link>
                  <Link
                    href="../#testimonials"
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-base font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>{t.testimonials}</span>
                  </Link>
                  <Link
                    href="/appointment"
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-base font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Star className="h-5 w-5" />
                    <span>{t.myAppointment || "My Appointment"}</span>
                  </Link>
                  <Link
                    href="/calendar"
                    className="flex items-center gap-3 py-3 px-2 rounded-md text-base font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Clock className="h-5 w-5" />
                    <span>{t.bookNow}</span>
                  </Link>
                </div>

                <div className="border-t p-4 space-y-4">
                  <Button
                    variant="outline"
                    onClick={toggleLanguage}
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <Globe className="h-5 w-5" />
                    <span>{language === "en" ? "Español" : "English"}</span>
                  </Button>

                  <Link href="../#contact" className="block">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Phone className="mr-2 h-4 w-4" /> {t.getQuote}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <motion.div
        className="fixed top-15 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />
    </header>
  )
}
