"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/lib/api"

interface Email {
  peer: string
  mail_from: string
  rcpt_to: string[]
  subject: string
  body: string
  message_for: string
  attachments: any[]
}

export default function TestPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_BASE_URL + '/emails', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // The API returns a single email object, so we wrap it in an array
      setEmails(Array.isArray(data) ? data : [data])
    } catch (err) {
      if (err instanceof Error && err.message.includes('CORS')) {
        setError('CORS error: The server needs to allow cross-origin requests. Try opening the ngrok URL directly in your browser first, or add CORS headers to your server.')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch emails')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">SMTP Email Viewer</h1>
          <Button onClick={fetchEmails} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {loading && emails.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading emails...</p>
            </CardContent>
          </Card>
        ) : emails.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No emails found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {emails.map((email, index) => (
              <Card key={index} className="border border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Email Message {index + 1}</CardTitle>
                  <CardDescription>
                    SMTP Email Format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* SMTP-style format display */}
                    <div className="bg-muted p-4 rounded-md font-mono text-sm">
                      <div className="space-y-1">
                        <div><span className="text-blue-600">FROM = </span>"{email.mail_from}"</div>
                        <div><span className="text-blue-600">TO = </span>[{email.rcpt_to.map(recipient => `"${recipient}"`).join(', ')}]</div>
                        <div><span className="text-blue-600">SUBJECT = </span>"{email.subject}"</div>
                        <div><span className="text-blue-600">BODY = </span>"{email.body.replace(/\r\n/g, '\\r\\n')}"</div>
                      </div>
                    </div>
                    
                    {/* Raw message format */}
                    <div className="bg-gray-50 p-4 rounded-md border">
                      <h4 className="font-semibold mb-2 text-sm text-gray-600">Raw Message Format:</h4>
                      <pre className="text-sm whitespace-pre-wrap font-mono">
{`From: ${email.mail_from}
To: ${email.rcpt_to.join(', ')}
Subject: ${email.subject}

${email.body}`}
                      </pre>
                    </div>
                    
                    {/* Additional metadata */}
                    <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                      <p><strong>Peer Connection:</strong> {email.peer}</p>
                      <p><strong>Message Target:</strong> {email.message_for}</p>
                      {email.attachments.length > 0 && (
                        <p><strong>Attachments:</strong> {email.attachments.length} file(s)</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
