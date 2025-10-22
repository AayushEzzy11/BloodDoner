import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Bell, MapPin, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-brand-gray sm:text-5xl">
            How SahayogRed Works
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Learn how our platform connects blood donors with those in need,
            making blood donation simple, safe, and effective across Nepal.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple 3-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>1. Register</CardTitle>
                <CardDescription>
                  Create your profile with blood type, location, and contact
                  information. Our verification process ensures safety for all
                  users.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>2. Get Matched</CardTitle>
                <CardDescription>
                  Receive instant notifications when someone nearby needs your
                  blood type. Our smart matching considers location and urgency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>3. Save Lives</CardTitle>
                <CardDescription>
                  Connect with recipients, coordinate donation logistics, and
                  help save lives in your community through our secure platform.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <CardTitle>Location-Based Matching</CardTitle>
                </div>
                <CardDescription>
                  Our intelligent system finds the nearest compatible donors to
                  minimize travel time and ensure faster response during
                  emergencies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Verified Profiles</CardTitle>
                </div>
                <CardDescription>
                  All donors and seekers undergo verification to ensure
                  authenticity and safety for all platform users.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-primary" />
                  <CardTitle>Real-Time Notifications</CardTitle>
                </div>
                <CardDescription>
                  Instant push notifications alert donors when blood is needed,
                  enabling rapid response for emergency situations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle>24/7 Emergency Support</CardTitle>
                </div>
                <CardDescription>
                  Round-the-clock emergency response system ensures help is
                  available whenever it's needed most.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-accent/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-brand-gray mb-4">
            Ready to Start Saving Lives?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of donors across Nepal making a difference every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Register as Donor</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
