"use client"

import { useState, useContext } from "react"
import type React from "react"
import Cookies from "js-cookie"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Lock, AlertCircle, LogIn, User, KeyRound, ShieldCheck, WifiOff } from "lucide-react"

import { LanguageContext } from "@/contexts/language-context"
import { translations } from "@/translations"
import type { Language } from "@/translations"
import Header from "../Header";
import {baseRequest} from "@/lib/utils";

type Step = "credentials" | "verification"

export default function AuthFlow({ username, password, setAuth, setUsername, setPassword }: any) {
  const [currentStep, setCurrentStep] = useState<Step>("credentials")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    verificationCode: "",
  })

  const { language } = useContext(LanguageContext)
  const t = translations[language as Language]

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    verificationCode: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState("")

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Update form state
    setFormData((prevForm) => ({
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

    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError("")
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate username and password
    const newErrors = {
      username: "",
      password: "",
      verificationCode: "",
    }

    let hasErrors = false

    if (!formData.username.trim()) {
      newErrors.username = t["usernameRequired"]
      hasErrors = true
    }

    if (!formData.password.trim()) {
      newErrors.password = t["passwordRequired"]
      hasErrors = true
    }

    setErrors(newErrors)

    if (hasErrors) {
      return
    }

    setIsSubmitting(true)
    setGeneralError("")

    try {
      const body = {
        username: formData.username,
        password: formData.password,
      };

      const response = await baseRequest("POST", "/verify-credentials", body);
      if (response?.ok) {
        // If credentials are valid, move to verification step
        setCurrentStep("verification")
        setUsername(formData.username)
        setPassword(formData.password)
      } else if (response?.status === 401) {
        // Handle unauthorized (invalid credentials)
        setGeneralError(t["invalidCredentials"])
      } else if (response?.status === 429) {
        // Handle rate limiting
        setGeneralError(t["tooManyAttempts"])
      } else {
        // Handle other errors
        setGeneralError(t["credentialsVerificationError"])
      }
    } catch (err) {
      console.error(err)
      // Handle network errors
      setGeneralError(t["connectionError"])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate verification code
    if (!formData.verificationCode.trim()) {
      setErrors((prev) => ({ ...prev, verificationCode: t["verificationCodeRequired"] }))
      return
    } else if (formData.verificationCode.length !== 6) {
      setErrors((prev) => ({ ...prev, verificationCode: t["verificationCodeLengthError"] }))
      return
    }

    setIsSubmitting(true)
    setGeneralError("")

    try {
      // Send verification code to the verification endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: formData.verificationCode,
      })

      if (response.ok) {
        const token = await response.text()
        Cookies.set("tempauthtoken", token, {
          secure: true,
          sameSite: "strict",
          path: "/",
        })
        setAuth(true)
      } else if (response.status === 401) {
        setGeneralError(t["invalidVerificationCode"])
      } else if (response.status === 410) {
        setGeneralError(t["expiredVerificationCode"])
      } else {
        setGeneralError(t["verificationError"])
      }
    } catch (err) {
      console.error(err)
      // Handle network errors
      setGeneralError(t["connectionError"])
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepTitle = () => {
    switch (currentStep) {
      case "credentials":
        return t["secureAccessTitle"]
      case "verification":
        return t["twoFactorAuthenticationTitle"]
      default:
        return t["authenticationTitle"]
    }
  }

  const renderStepDescription = () => {
    switch (currentStep) {
      case "credentials":
        return t["credentialsDescription"]
      case "verification":
        return t["verificationDescription"].replace("{username}", formData.username)
      default:
        return ""
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "credentials":
        return (
          <form className="space-y-4" method="post" onSubmit={handleCredentialsSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium leading-none flex items-center gap-1">
                <User className="h-4 w-4 text-blue-500" />
                {t["usernameLabel"]}
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder={t["usernamePlaceholder"]}
                className={errors.username ? "border-red-500" : ""}
                value={formData.username}
                onChange={handleInputChange}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <p id="username-error" className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium leading-none flex items-center gap-1">
                  <Lock className="h-4 w-4 text-blue-500" />
                  {t["passwordLabel"]}
                </Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t["passwordPlaceholder"]}
                className={errors.password ? "border-red-500" : ""}
                value={formData.password}
                onChange={handleInputChange}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                  {t["verifyingButton"]}
                </>
              ) : (
                t["continueButton"]
              )}
            </Button>
          </form>
        )

      case "verification":
        return (
          <form className="space-y-4" onSubmit={handleVerificationSubmit}>
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-sm font-medium leading-none flex items-center gap-1">
                <KeyRound className="h-4 w-4 text-blue-500" />
                {t["verificationCodeLabel"]}
              </Label>
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                inputMode="numeric"
                placeholder={t["verificationCodePlaceholder"]}
                className={errors.verificationCode ? "border-red-500" : ""}
                value={formData.verificationCode}
                onChange={handleInputChange}
                maxLength={6}
                aria-describedby={errors.verificationCode ? "code-error" : undefined}
              />
              {errors.verificationCode && (
                <p id="code-error" className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.verificationCode}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                  {t["verifyingButton"]}
                </>
              ) : (
                t["accessContentButton"]
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setCurrentStep("credentials")}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {t["backToLogin"]}
              </button>
            </div>

            <div className="text-center text-sm">
              {t["didNotReceiveCode"]}{" "}
              <button
                type="button"
                onClick={() => {
                  // Resend code logic would go here
                  alert(t["codeResentAlert"])
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {t["resendCode"]}
              </button>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  // Custom error alert component
  const ErrorAlert = ({ message, icon = <AlertCircle /> }: { message: string; icon?: React.ReactNode }) => {
    if (!message) return null

    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2" role="alert">
        <span className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0">{icon}</span>
        <p className="text-red-700 text-sm">{message}</p>
      </div>
    )
  }

  // Progress indicator
  const renderProgressIndicator = () => {
    const steps = ["credentials", "verification"]
    const currentIndex = steps.indexOf(currentStep)

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentIndex
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              aria-label={`Step ${index + 1} ${index <= currentIndex ? "active" : "inactive"}`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 ${
                  index < currentIndex ? "bg-gradient-to-r from-blue-600 to-cyan-500" : "bg-gray-200"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="space-y-4 max-w-md w-full">
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                  {currentStep === "credentials" ? (
                    <LogIn className="h-6 w-6 text-blue-600" />
                  ) : (
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {renderStepTitle()}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {renderStepDescription()}
                </p>

                <div className="rounded-lg border bg-white p-6 shadow-lg w-full">
                  {generalError && (
                    <ErrorAlert
                      message={generalError}
                      icon={
                        generalError.includes("connection") ? (
                          <WifiOff className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )
                      }
                    />
                  )}

                  {renderProgressIndicator()}
                  {renderCurrentStep()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
