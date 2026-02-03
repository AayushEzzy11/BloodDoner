import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Target, 
  Award,
  MapPin,
  Calendar,
  Phone,
  Mail,

} from "lucide-react";
import { Link } from "react-router-dom";
const stats = [
  { label: "Registered Donors", value: "1,500+", icon: Users },
  { label: "Lives Saved", value: "1,000+", icon: Heart },
  { label: "Partner Hospitals", value: "75+", icon: MapPin },
  { label: "Years of Service", value: "4+", icon: Calendar }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-brand-gray sm:text-5xl lg:text-6xl">
                About <span className="text-primary">SahayogRed</span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
                We're on a mission to save lives by connecting blood donors with those in need 
                across Nepal through technology, compassion, and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To create a reliable, efficient, and accessible blood donation network that 
                  saves lives across Nepal. We believe every person deserves access to safe 
                  blood when they need it most, regardless of their location or circumstances.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">

                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A Nepal where no one dies due to blood shortage. We envision a future where 
                  technology seamlessly connects generous donors with those in critical need, 
                  creating a culture of life-saving generosity throughout our nation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gray sm:text-4xl">
              Our Impact in Numbers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how we're making a difference across Nepal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm font-medium text-brand-gray mt-2">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gray sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Compassion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every decision we make is driven by empathy and the urgent need to help those in medical emergencies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive for the highest standards in technology, safety, and service to ensure reliable blood matching.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in the power of community and work to build lasting relationships between donors and recipients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Join Our Mission
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Whether you're a donor, healthcare professional, or someone who wants to help, 
              there's a place for you in our community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-lg px-8 py-3"
              >
                <Link to="/register">Become a Donor</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/contact">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
