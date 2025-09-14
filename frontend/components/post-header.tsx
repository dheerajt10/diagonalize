import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PostHeaderProps {
  username: string
  company: string
  timestamp: string
  avatarUrl?: string
}

export function PostHeader({ username, company, timestamp, avatarUrl }: PostHeaderProps) {
  return (
    <div className="flex items-start gap-3 p-4">
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
  )
}
