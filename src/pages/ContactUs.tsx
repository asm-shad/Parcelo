import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  HeadphonesIcon,
  MailCheckIcon,
} from "lucide-react";

interface ContactUsProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
}

export const ContactUs = ({
  //   title = "Get in Touch",
  description = "Have questions about our parcel delivery services? Our team is here to help you with any inquiries, support needs, or partnership opportunities.",
  phone = "+1 (555) 123-4567",
  email = "support@parcelo.com",
  address = "123 Delivery Street, Logistics District, City, 10001",
  hours = "Monday - Friday: 8:00 AM - 8:00 PM EST\nSaturday: 9:00 AM - 5:00 PM EST\nSunday: Closed",
}: ContactUsProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-background container mx-auto">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              We're Here to <span className="text-primary">Help</span>
            </h1>
            <p className="mb-10 text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
            {/* Contact Information */}
            <div className="flex flex-col gap-10">
              <div className="text-center lg:text-left">
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels. Our support
                  team is always ready to assist you.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Phone Support
                        </h3>
                        <p className="text-muted-foreground mb-2">{phone}</p>
                        <p className="text-sm text-muted-foreground">
                          Speak directly with our support team
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                        <p className="text-muted-foreground mb-2">
                          <a
                            href={`mailto:${email}`}
                            className="hover:text-primary transition-colors"
                          >
                            {email}
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Office Address
                        </h3>
                        <p className="text-muted-foreground mb-2">{address}</p>
                        <p className="text-sm text-muted-foreground">
                          Visit our headquarters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Business Hours
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {hours}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="flex flex-col gap-6 rounded-lg border p-8 bg-card">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form and we'll get back to you shortly
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      type="text"
                      id="firstname"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      type="text"
                      id="lastname"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Email" required />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    type="text"
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    id="message"
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Support Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Additional Support Options
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer multiple ways to get the help you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="mb-4">Live Chat Support</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Get instant answers from our support team through our live
                  chat service.
                </p>
                <Button variant="outline">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <MailCheckIcon className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="mb-4">Help Center</CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Browse our comprehensive knowledge base for answers to common
                  questions.
                </p>
                <Button variant="outline">Visit Help Center</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  How long does delivery take?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Standard delivery takes 3-5 business days. Express options are
                  available for next-day delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What areas do you serve?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We deliver nationwide and offer international shipping to over
                  200 countries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  How can I track my package?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use your tracking number in our app or website for real-time
                  updates on your delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Do you offer insurance?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer comprehensive insurance options for valuable
                  packages.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
