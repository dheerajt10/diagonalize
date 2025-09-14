"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye, Share, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface PostProps {
  username: string
  company: string
  timestamp: string
  title: string
  content: string
  likes: number
  comments: number
  views: number
  avatarUrl?: string
}

export function Post({
  username,
  company,
  timestamp,
  title,
  content,
  likes: initialLikes,
  comments,
  views,
  avatarUrl,
}: PostProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Post Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Avatar className="w-12 h-12 border border-border">
          <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-white font-medium">
            {username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-base leading-tight">{username}</h3>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-muted-foreground text-sm">{timestamp}</span>
          </div>

          <div className="mt-1">
            <span className="text-muted-foreground text-sm font-medium">{company}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-semibold text-foreground mb-3 leading-tight">{title}</h2>
        <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{content}</p>
      </div>

      {/* Engagement Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 h-8 px-2 ${
              isLiked ? "text-red-600 hover:text-red-700" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{comments}</span>
          </Button>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{views}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
