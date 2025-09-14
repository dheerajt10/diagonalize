"use client"

import { Post } from "@/components/post"
import { DashboardHeader } from "@/components/dashboard-header"

export default function HomePage() {
  const mockPosts = [
    {
      username: "Tech Industry",
      company: "Amazon • S H I T !",
      timestamp: "Yesterday",
      title: "Mira Murati and Ilya Sutskever are my role models",
      content:
        'Raised billions of dollars > Have been straight up vibing for years > Give occasional interviews and speeches, get paid $$$$ for each appearance > Release zero products, just tell investors that you\'re doing "research" Bro... where do I sign up?',
      likes: 17,
      comments: 16,
      views: 660,
    },
    {
      username: "Bay Area",
      company: "Robinhood • mxbn73",
      timestamp: "8h",
      title: "Biggest mistake I ever made buying in the Bay Area",
      content:
        "For everyone thinking about buying in the Bay Area — please learn from my mistake. I overpaid for a house out of desperation, and just two months in I already regret it. The mortgage payment is eating my base salary, the job market is unstable, and I'm basically house poor now.\n\nDon't let FOMO drive your decisions like I did.",
      likes: 42,
      comments: 28,
      views: 1240,
    },
    {
      username: "Product Management",
      company: "Google • L5",
      timestamp: "2d",
      title: "Why I'm leaving Google after 6 years",
      content:
        "After 6 years at Google, I'm finally pulling the trigger and leaving. The bureaucracy has gotten insane, innovation is dead, and every project gets killed after 2 years anyway.\n\nStarting at a Series A startup next month. Scared but excited to actually ship products that matter again.",
      likes: 203,
      comments: 67,
      views: 5680,
    },
    {
      username: "Startup Life",
      company: "Stripe • IC4",
      timestamp: "1w",
      title: "Stripe's work culture is actually incredible",
      content:
        "Been at Stripe for 2 years now and honestly can't imagine working anywhere else. The engineering culture is top-tier, everyone is incredibly smart, and the problems we're solving are genuinely interesting.\n\nPlus the compensation is competitive with FAANG but with way less politics. If you're thinking about joining, do it.",
      likes: 89,
      comments: 34,
      views: 2100,
    },
    {
      username: "Data Science",
      company: "Netflix • Senior",
      timestamp: "3d",
      title: "Netflix's recommendation algorithm is broken",
      content:
        "Working on the recommendation team and I can confirm - our algorithm is absolutely broken. We keep recommending the same 20 shows to everyone, ignore user preferences, and prioritize Netflix originals over quality content.\n\nThe worst part? Management knows and doesn't care because engagement metrics look good.",
      likes: 312,
      comments: 145,
      views: 8900,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="border-t border-border bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="p-6">
            <div className="space-y-4">
              {mockPosts.map((post, index) => (
                <Post
                  key={index}
                  username={post.username}
                  company={post.company}
                  timestamp={post.timestamp}
                  title={post.title}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                  views={post.views}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
