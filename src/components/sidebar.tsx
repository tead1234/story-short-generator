"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Code2,
  ChevronLeft,
  Settings,
  Key,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);

  return (
    <div className="relative">
      <div
        className={cn(
          "pb-12 min-h-screen border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-60",
          className
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              {!isCollapsed && (
                <h2 className="text-lg font-semibold">Story Short</h2>
              )}
            </div>
          </div>
          {!isCollapsed && (
            <>
              <div className="px-3 py-2">
                <Collapsible
                  open={settingsOpen}
                  onOpenChange={setSettingsOpen}
                  className="space-y-2"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Settings size={16} />
                        설정
                      </span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          settingsOpen ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 pl-8"
                      asChild
                    >
                      <Link href="/">
                        <Key size={16} className="text-purple-500" />
                        API 키 관리
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 pl-8"
                      asChild
                    >
                      <Link href="/docs">
                        <Code2 size={16} className="text-orange-500" />
                        API 문서
                      </Link>
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <div className="px-3 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/playground">
                    <Play size={16} className="text-green-500" />
                    Playground
                  </Link>
                </Button>
              </div>
            </>
          )}
          {isCollapsed && (
            <div className="px-3 py-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-center p-2"
                  asChild
                >
                  <Link href="/">
                    <Key size={16} className="text-purple-500" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center p-2"
                  asChild
                >
                  <Link href="/docs">
                    <Code2 size={16} className="text-orange-500" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center p-2"
                  asChild
                >
                  <Link href="/playground">
                    <Play size={16} className="text-green-500" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-6 w-6 absolute -right-3 top-6 rounded-full border shadow-md",
          isCollapsed ? "rotate-180" : ""
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
} 