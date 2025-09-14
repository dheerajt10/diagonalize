"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2 } from "lucide-react"
import { VerificationCode } from "./verification-code"
import { api, ApiError } from "@/lib/api"
import { createPasskey } from "./createPasskey"

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [signupEmail, setSignupEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("signup-email") as string
    const company = formData.get("company") as string

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.signup({
        email,
        company,
      })
      
      setSuccess(response.message)
      setSignupEmail(email)
      setShowVerification(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to send verification email: ${err.message}`)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToSignup = () => {
    setShowVerification(false)
    setSignupEmail("")
    setError(null)
    setSuccess(null)
  }

  const handleVerifyCode = async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.verify({
        email: signupEmail,
        otp: code,
      })

      if (response.success) {
        setSuccess('Email verified successfully! You can now sign in.')

        const options = await api.getCredentialOptions(signupEmail);
        const credential = await createPasskey(options);

        console.log("Submitting credentials");

        await api.submitCredentials(credential, signupEmail);

        // Redirect to dashboard or handle successful verification
        window.location.href = '/dashboard'
      } else {
        setError(response.message || 'Verification failed')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Verification failed: ${err.message}`)
      } else {
        setError('An unexpected error occurred during verification.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (showVerification) {
    return <VerificationCode email={signupEmail} onBack={handleBackToSignup} onVerify={handleVerifyCode} isLoading={isLoading} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Blind</span>
        </div>
      </div>

      <Card className="border border-border shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center text-balance">
            Welcome to the professional community
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-pretty">
            Join millions of professionals sharing insights anonymously
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="h-11 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">
                    Work Email
                  </Label>
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="h-11 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll verify your company email to maintain community trust
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Your company name"
                    required
                    className="h-11 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying account..." : "Verify Account"}
                </Button>
              </form>

              <div className="text-xs text-muted-foreground text-center text-pretty">
                By signing up, you agree to our{" "}
                <button className="text-primary hover:text-primary/80 transition-colors">Terms of Service</button> and{" "}
                <button className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground text-pretty">
          Trusted by professionals at 50,000+ companies worldwide
        </p>
      </div>
    </div>
  )
}
