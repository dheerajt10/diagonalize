"use client"

import { Search, Bell, Home, DollarSign, Star, Briefcase, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            B
          </div>
          <span className="font-semibold text-lg text-foreground">Blind</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-foreground hover:text-primary">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Salaries</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Reviews</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Jobs</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-muted-foreground hover:text-primary"
          >
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">For Business</span>
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            Sign in
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
