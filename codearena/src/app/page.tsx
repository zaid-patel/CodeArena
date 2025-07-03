import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Trophy, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Master Competitive Programming
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Solve challenging problems, compete in contests, and improve your coding skills with our platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="gap-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" size="lg">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to excel in competitive programming
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Diverse Problem Set</h3>
              <p className="text-muted-foreground">
                Access thousands of coding problems across various difficulty levels and topics.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Regular Contests</h3>
              <p className="text-muted-foreground">
                Participate in weekly coding contests and compete with programmers worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow coders, discuss solutions, and learn from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Improve Your Coding Skills?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of programmers who are mastering algorithms and data structures on our platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg">Sign Up Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
