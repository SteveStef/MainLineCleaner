

"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Menu, Phone, Mail, Clock, User, MessageSquare, X, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

export default function ResponsiveHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-gradient-to-r from-blue-600 to-cyan-500 mr-2" />
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Main Line Cleaners
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="../#services"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Services</span>
          </Link>
          <Link
            href="../#about"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            <User className="h-4 w-4" />
            <span>About</span>
          </Link>
          <Link
            href="../#testimonials"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Testimonials</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            <Clock className="h-4 w-4" />
            <span>Book Now</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="../#contact">
          <Button className="hidden md:flex bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            <Phone className="mr-2 h-4 w-4" /> Get a Quote
          </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Mobile Menu Content */}
            <SheetContent side="left" className="w-[80%] sm:w-[350px] border-r">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center">
                  <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    MainLine Cleaners
                  </span>
                </SheetTitle>
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>

              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="../#services"
                  className="flex items-center gap-3 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Services</span>
                </Link>
                <Link
                  href="../#about"
                  className="flex items-center gap-3 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  href="../#testimonials"
                  className="flex items-center gap-3 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Testimonials</span>
                </Link>
                <Link
                  href="/calendar"
                  className="flex items-center gap-3 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Clock className="h-5 w-5" />
                  <span>Book Now</span>
                </Link>

                <Link href="../#contact" className="mt-4 pt-4 border-t">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Phone className="mr-2 h-4 w-4" /> Get a Quote
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="bg-blue-500 h-[2px]"></div>
    </header>
  )
}

