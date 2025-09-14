"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Clock, User, Calendar, Stethoscope } from "lucide-react"

export function MedicalNotesEditor() {
  const [notes, setNotes] = useState("")
  const [patientUsername, setPatientUsername] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const wordCount = notes
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground tracking-tight">Clinical Notes</h1>
                  <p className="text-sm text-muted-foreground">Professional Documentation System</p>
                </div>
              </div>
              {lastSaved && (
               <div className="text-xs font-medium bg-muted/50 text-muted-foreground border-0 px-2 py-1 rounded-md flex items-center gap-1.5">
               <Clock className="h-3 w-3" />
               Saved {lastSaved.toLocaleTimeString()}
             </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <Card className="mb-8 p-6 bg-card border border-border/50 shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 rounded-lg bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                  Patient Username
                </label>
                <input
                  type="text"
                  placeholder="Enter patient username"
                  value={patientUsername}
                  onChange={(e) => setPatientUsername(e.target.value)}
                  className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium text-lg w-full focus:ring-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <label htmlFor="notes" className="text-lg font-semibold text-foreground mb-1 block">
                  Clinical Documentation
                </label>
                <p className="text-sm text-muted-foreground">
                  Record patient observations, assessments, and treatment plans
                </p>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </div>
            </div>

            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Begin documenting clinical notes...

Chief Complaint:

History of Present Illness:

Physical Examination:

Assessment & Plan:"
              className="w-full h-[32rem] p-6 bg-muted/20 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground placeholder:text-muted-foreground leading-relaxed text-base transition-all duration-200"
              style={{ fontFamily: "inherit" }}
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setLastSaved(new Date())
                  // Handle submit logic here
                }}
                disabled={!patientUsername.trim() || !notes.trim()}
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                Submit Notes
              </button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
