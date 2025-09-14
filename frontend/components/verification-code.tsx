"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, ArrowLeft } from "lucide-react"

interface VerificationCodeProps {
  email: string
  onBack: () => void
  onVerify: (code: string) => void
}

export function VerificationCode({ email, onBack, onVerify }: VerificationCodeProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode.length !== 6) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onVerify(fullCode)
    setIsLoading(false)
  }

  const handleResend = async () => {
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

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
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1 h-8 w-8 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-balance">Check your email</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-pretty">
            We sent a verification code to <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-lg bg-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isLoading || code.join("").length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground text-pretty">
          We verify all accounts to maintain community trust and safety
        </p>
      </div>
    </div>
  )
}
