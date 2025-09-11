import { useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  Shield,
  BarChart3,
  Bell,
  Users,
  Package,
  Truck,
  Calendar,
  Lock,
  Eye,
  Smartphone,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export const FeaturesPage = () => {
  const { data } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (data?.data?.email) {
      // User is logged in, navigate to home page and scroll to top
      navigate("/");
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      // User is not logged in, navigate to login page and scroll to top
      navigate("/login");
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const coreFeatures = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Real-Time Tracking",
      description:
        "Track your parcels in real-time with live location updates and estimated delivery times.",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Delivery",
      description:
        "Express delivery options with guaranteed time slots for urgent shipments.",
      image:
        "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Handling",
      description:
        "Advanced security measures to ensure your packages are safe throughout the journey.",
      image:
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Smart Analytics",
      description:
        "Detailed insights into your shipping patterns and delivery performance metrics.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "Instant Notifications",
      description:
        "Get real-time alerts for package status updates, delivery attempts, and confirmations.",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-User Access",
      description:
        "Collaborate with your team by granting access to shipment tracking and management.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const deliveryOptions = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Standard Delivery",
      description: "Economical option with 3-5 business days delivery",
      price: "From $5.99",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Express Delivery",
      description: "Next day delivery for urgent packages",
      price: "From $12.99",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Scheduled Delivery",
      description: "Choose your preferred delivery date and time",
      price: "From $9.99",
    },
  ];

  const securityFeatures = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "End-to-End Encryption",
      description:
        "All package data is encrypted throughout the delivery process",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Live Monitoring",
      description: "24/7 surveillance of high-value packages during transit",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Insurance Options",
      description:
        "Protect your shipments with comprehensive insurance coverage",
    },
  ];

  const technologyFeatures = [
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile App",
      description:
        "Manage deliveries on the go with our intuitive mobile application",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Global Network",
      description: "International shipping to over 200 countries worldwide",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "AI Optimization",
      description:
        "Smart algorithms that optimize delivery routes for efficiency",
    },
  ];

  return (
    <div className="min-h-screen bg-background" id="features">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Powerful Delivery Solutions
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Everything You Need for
              <span className="text-primary"> Seamless Delivery</span>
            </h1>
            <p className="mb-10 text-xl text-muted-foreground leading-relaxed">
              Discover the features that make Parcelo the most reliable parcel
              delivery platform, designed to simplify shipping for businesses
              and individuals alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 text-foreground"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/contact-us")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Core Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful tools designed to streamline your shipping experience
              from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <Card
                key={index}
                className="h-full overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-left pb-3">
                  <CardDescription className="leading-snug">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={feature.image}
                    alt={feature.title}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Flexible Delivery Options
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the service that best fits your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryOptions.map((option, index) => (
              <Card key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    {option.icon}
                  </div>
                </div>
                <CardTitle className="mb-2">{option.title}</CardTitle>
                <CardDescription className="mb-4">
                  {option.description}
                </CardDescription>
                <div className="text-2xl font-bold text-primary mb-4">
                  {option.price}
                </div>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Technology Sections */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Security Features */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Security & Protection</h3>
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Features */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Advanced Technology</h3>
              <div className="space-y-4">
                {technologyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-primary text-foreground">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to Simplify Your Deliveries?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of satisfied customers who trust Parcelo with their
              shipping needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 cursor-pointer"
                onClick={handleGetStarted}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-primary-foreground border-primary-foreground cursor-pointer"
                onClick={() => navigate("/contact-us")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};
