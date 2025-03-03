import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, ListChecks } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <ListChecks className="h-6 w-6 text-primary" />
              <span className="font-bold">TaskZen</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Manage your tasks with AI-powered intelligence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskZen helps you prioritize, organize, and complete your tasks efficiently with
                    AI-powered suggestions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-priority-low" />
                      <h3 className="font-semibold">Smart Prioritization</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-powered task prioritization helps you focus on what matters most.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-priority-medium" />
                      <h3 className="font-semibold">Time Management</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Organize tasks by due date and priority to manage your time effectively.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Task Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

