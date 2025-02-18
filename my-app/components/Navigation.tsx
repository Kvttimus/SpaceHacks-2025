"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Telescope, Palette, Book, Star } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon: React.ElementType
}

const tabs: Tab[] = [
  {
    id: "create",
    label: "Create",
    icon: Palette,
  },
  {
    id: "explore",
    label: "Explore",
    icon: Telescope,
  },
  {
    id: "learn",
    label: "Learn",
    icon: Book,
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: Star,
  },
]

interface NavigationProps {
  activeTab: string
  onChange: (id: string) => void
}

export function Navigation({ activeTab, onChange }: NavigationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <nav className="max-w-screen-xl mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-8 text-sm font-medium text-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative px-3 py-1.5 transition-colors hover:text-white/90",
                  activeTab === tab.id ? "text-white" : "text-white/60",
                )}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "linear-gradient(to right, rgb(168, 85, 247), rgb(59, 130, 246))",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

