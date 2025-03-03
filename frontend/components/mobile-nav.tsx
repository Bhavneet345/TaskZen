"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, ListChecks } from "lucide-react"

interface NavItem {
  title: string
  href: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Tasks",
    href: "/dashboard",
  },
  {
    title: "Calendar",
    href: "/dashboard",
  },
  {
    title: "Settings",
    href: "/dashboard",
  },
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
          <ListChecks className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold">TaskZen</span>
        </Link>
        <nav className="mt-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center px-2 py-1 text-base font-medium transition-colors hover:text-primary",
                pathname === item.href && "text-primary",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

