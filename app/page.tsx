import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CC</span>
            </div>
            <span className="font-bold text-xl text-foreground">CampusConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20">Verified Students Only</Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">Safe & Verified Campus Deliveries</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Connect with verified students for secure deliveries within campus. Post requests, share trips, and build
            trust in your university community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Join CampusConnect
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Students Trust CampusConnect</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Verified Students</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  School email verification and student ID confirmation ensure only real students participate.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Real-time Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure messaging between matched students to coordinate delivery details safely.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Live Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your deliveries in real-time and get updates throughout the process.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Rating System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Build trust through our community rating system and verified reviews.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Simple & Secure Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Verify Your Identity</h3>
              <p className="text-muted-foreground">
                Register with your school email and upload your student ID for verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Post or Accept</h3>
              <p className="text-muted-foreground">
                Create delivery requests or accept trips from other verified students.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Connect & Deliver</h3>
              <p className="text-muted-foreground">Chat securely, track deliveries, and rate your experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Ready to Join Your Campus Community?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start connecting with verified students for safe and reliable deliveries today.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">CC</span>
            </div>
            <span className="font-semibold text-foreground">CampusConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connecting students for safe & verified deliveries within campus.
          </p>
        </div>
      </footer>
    </div>
  )
}
