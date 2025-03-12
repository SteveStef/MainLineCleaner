"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Star, CheckCircle, User, MapPin, ClipboardList, MessageSquare, Send, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "../Header"

export default function ReviewPage() {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    reviewText: "",
    serviceType: "",
  })

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, serviceType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any  = {
      clientName: formData.name,
      stars: rating,
      location: formData.location,
      service: formData.serviceType,
      content: formData.reviewText,
    };
    const url: string = `${process.env.NEXT_PUBLIC_API_URL}/review`;
    const options = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    };

    try {
      await fetch(url, options);
      setSubmitted(true)
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <section className="w-full py-4 md:py-8 lg:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Share Your Experience
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  We value your feedback! Let us know about your experience with MainLine Cleaners.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Verified Reviews</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Top-Rated Service</span>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              {!submitted ? (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      Submit a Review
                    </CardTitle>
                    <CardDescription className="text-base">
                      Your honest feedback helps us improve our services and helps other customers make informed
                      decisions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="rating" className="text-lg flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Your Rating
                        </Label>
                        <div className="flex items-center gap-1 p-4 bg-amber-50 rounded-lg">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => handleRatingHover(star)}
                              onMouseLeave={handleRatingLeave}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-10 w-10 ${
                                  (hoveredRating ? star <= hoveredRating : star <= rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                } transition-colors`}
                              />
                              <span className="sr-only">{star} stars</span>
                            </button>
                          ))}
                          <span className="ml-4 text-lg font-medium">
                            {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select a rating"}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            Your Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Smith"
                            className="h-12"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Your Location
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Bryn Mawr, Ardmore, etc."
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-lg flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-blue-500" />
                          Service Type
                        </Label>
                        <Select value={formData.serviceType} onValueChange={handleSelectChange} required>
                          <SelectTrigger id="serviceType" className="h-12">
                            <SelectValue placeholder="Select the service you received" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular Cleaning</SelectItem>
                            <SelectItem value="deep">Deep Cleaning</SelectItem>
                            <SelectItem value="move">Move In/Out Cleaning</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reviewText" className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          Your Review
                        </Label>
                        <Textarea
                          id="reviewText"
                          name="reviewText"
                          value={formData.reviewText}
                          onChange={handleInputChange}
                          placeholder="Share your experience with our cleaning service..."
                          className="min-h-[200px] text-base"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                        disabled={
                          rating === 0 ||
                          !formData.name ||
                          !formData.location ||
                          !formData.reviewText ||
                          !formData.serviceType
                        }
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Submit Review
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl mt-4">Thank You for Your Review!</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We appreciate you taking the time to share your experience with MainLine Cleaners. Your feedback
                      helps us improve our services and helps other customers make informed decisions.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-8">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                Why Your Review Matters
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Improve Our Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback helps us identify areas where we can improve and provide better service.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="rounded-full bg-cyan-100 p-3 mb-3">
                    <User className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-medium mb-2">Help Other Customers</h3>
                  <p className="text-sm text-muted-foreground">
                    Your reviews help other customers make informed decisions about our services.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="rounded-full bg-emerald-100 p-3 mb-3">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium mb-2">Recognize Our Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Positive feedback motivates our cleaning professionals to maintain high standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="space-y-4">
              <div className="text-xl font-bold">MainLine Cleaners</div>
              <p className="max-w-[350px] text-sm text-muted-foreground">
                Professional cleaning services for homes and businesses throughout the Main Line area.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/#about" className="text-muted-foreground hover:text-foreground">
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
                    <Link href="/#services" className="text-muted-foreground hover:text-foreground">
                      Residential
                    </Link>
                  </li>
                  <li>
                    <Link href="/#services" className="text-muted-foreground hover:text-foreground">
                      Commercial
                    </Link>
                  </li>
                  <li>
                    <Link href="/#services" className="text-muted-foreground hover:text-foreground">
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

