"use client";
import { useContext } from "react"
import Link from "next/link"
import {
  CheckCircle,
  Phone,
  Clock,
  User,
  MessageSquare,
  Globe,
  Sparkles,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"

export default function Footer() {
  const { language, setLanguage } = useContext(LanguageContext)
  const t = translations[language as Language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <footer className="w-full bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top section with logo and navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-700 pb-8">
          {/* Logo and company info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {t.companyName}
              </div>
            </Link>
            <p className="text-slate-300 text-sm mb-4">{t.footerDescription}</p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">{t.services}</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="../#services"
                className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{t.services}</span>
              </Link>
              <Link
                href="../#about"
                className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                <User className="h-4 w-4" />
                <span>{t.about}</span>
              </Link>
              <Link
                href="../#testimonials"
                className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{t.testimonials}</span>
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                <Clock className="h-4 w-4" />
                <span>{t.bookNow}</span>
              </Link>
            </nav>
          </div>

          {/* Contact information */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">{t.contactUs}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-cyan-400 mt-0.5" />
                <span className="text-sm text-slate-300">{t.phoneValue}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-cyan-400 mt-0.5" />
                <span className="text-sm text-slate-300">{t.emailValue}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-cyan-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p>{t.mondayFriday}</p>
                  <p>{t.saturday}</p>
                  <p>{t.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action and language toggle */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">{t.getInTouch}</h3>
            <div className="space-y-4">
              <Link href="../#contact">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  <Phone className="mr-2 h-4 w-4" /> {t.getQuote}
                </Button>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{t.language}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{language === "en" ? "English" : "Español"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-xs text-slate-400 mb-4 md:mb-0">
            {new Date().getFullYear()} {t.companyName}. {t.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  )
}
