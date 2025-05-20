import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GlobeIcon as GolfBall } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <GolfBall className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TeeTimeRadar</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Never Miss Your Perfect Tee Time Again
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  TeeTimeRadar alerts you when your preferred tee times become available at your favorite golf courses.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button size="lg" variant="outline" className="px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                    <path d="m16 8-4 4-2-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Set Your Preferences</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose your favorite courses, preferred times, and number of players.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Get Notified</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive instant alerts when your preferred tee times become available.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-primary p-3 text-primary-foreground">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" />
                    <path d="M10 19c0-3.3 2.7-6 6-6s6 2.7 6 6H10z" />
                    <path d="M4.8 17.8c-.4-1.2-1.5-2-2.8-1.9-1.3 0-2.4.9-2.8 2.1" />
                    <path d="M2 12c1.1 0 2 .9 2 2s-.9 2-2 2" />
                    <path d="M4.9 6.2C5.2 5 6.3 4.1 7.5 4c1.2-.1 2.3.7 2.7 1.9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Book Instantly</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Quickly book your tee time before someone else grabs it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <GolfBall className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">TeeTimeRadar</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TeeTimeRadar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
