"use client"

import type React from "react"

import { useState, useContext } from "react"
import Link from "next/link"
import { Star, CheckCircle, User, MapPin, ClipboardList, MessageSquare, Send, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "../Header"
import Footer from "../Footer"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"

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

  const { language } = useContext(LanguageContext)
  const t = translations[language as Language];

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
                  {t["shareExperienceHeading"]}
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  {t["shareExperienceSubheading"]}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{t["verifiedReviews"]}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">{t["topRatedService"]}</span>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              {!submitted ? (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg border-b">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      {t["submitReview"]}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t["submitReviewDescription"]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="rating" className="text-lg flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          {t["yourRating"]}
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
                            {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : t["selectRating"]}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-500" />
                            {t["yourName"]}
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t["namePlaceholder"]}
                            className="h-12"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            {t["yourLocation"]}
                          </Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder={t["locationPlaceholder"]}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-lg flex items-center gap-2">
                          <ClipboardList className="h-5 w-5 text-blue-500" />
                          {t["serviceType"]}
                        </Label>
                        <Select value={formData.serviceType} onValueChange={handleSelectChange} required>
                          <SelectTrigger id="serviceType" className="h-12">
                            <SelectValue placeholder={t["serviceTypePlaceholder"]} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">{t["regularCleaning"]}</SelectItem>
                            <SelectItem value="deep">{t["deepCleaning"]}</SelectItem>
                            <SelectItem value="move">{t["moveInOutCleaning"]}</SelectItem>
                            <SelectItem value="other">{t["other"]}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reviewText" className="text-lg flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          {t["yourReview"]}
                        </Label>
                        <Textarea
                          id="reviewText"
                          name="reviewText"
                          value={formData.reviewText}
                          onChange={handleInputChange}
                          placeholder={t["reviewPlaceholder"]}
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
                        {t["submitReviewButton"]}
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
                    <CardTitle className="text-3xl mt-4">{t["thankYouReview"]}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {t["thankYouMessage"]}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-8">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <Link href="/">{t["returnToHome"]}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-lg border shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600" />
                {t["whyReviewMatters"]}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg">
                  <div className="rounded-full bg-blue-100 p-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["improveOurService"]}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t["improveOurServiceDescription"]}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cyan-50 rounded-lg">
                  <div className="rounded-full bg-cyan-100 p-3 mb-3">
                    <User className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["helpOtherCustomers"]}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t["helpOtherCustomersDescription"]}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="rounded-full bg-emerald-100 p-3 mb-3">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-medium mb-2">{t["recognizeOurTeam"]}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t["recognizeOurTeamDescription"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
