import { Button } from "@/components/ui/button";

interface AboutProps {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}

const defaultCompanies = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    alt: "TechCorp",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    alt: "Global Logistics",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    alt: "E-Commerce Partners",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    alt: "Retail Networks",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    alt: "Business Solutions",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    alt: "Supply Chain Experts",
  },
];

const defaultAchievements = [
  { label: "Parcels Delivered", value: "50K+" },
  { label: "Happy Customers", value: "10K+" },
  { label: "Cities Covered", value: "50+" },
  { label: "On-time Delivery Rate", value: "98%" },
];

export const About = ({
  title = "About Parcelo",
  description = "Parcelo is a modern parcel delivery platform that connects senders and receivers with seamless, secure, and efficient delivery services. Our mission is to revolutionize the logistics industry with technology-driven solutions.",
  mainImage = {
    src: "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Parcel delivery team",
  },
  secondaryImage = {
    src: "https://images.unsplash.com/photo-1591955506264-3f5a6834570a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Package handling",
  },
  breakout = {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    alt: "Delivery icon",
    title: "Trusted Delivery Partner",
    description:
      "Join thousands of businesses and individuals who trust Parcelo for their delivery needs. Our secure platform ensures your packages are in safe hands from pickup to delivery.",
    buttonText: "Start Shipping",
    buttonUrl: "/register",
  },
  companiesTitle = "Trusted by businesses worldwide",
  companies = defaultCompanies,
  achievementsTitle = "Our Delivery Excellence",
  achievementsDescription = "We take pride in our numbers, which reflect our commitment to quality service and customer satisfaction in the parcel delivery industry.",
  achievements = defaultAchievements,
}: AboutProps = {}) => {
  return (
    <section className="py-24 md:py-32 bg-background" id="about">
      <div className="container px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-16 grid gap-8 text-center md:grid-cols-2 md:text-left md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed md:pl-8">
            {description}
          </p>
        </div>

        {/* Image Grid Section */}
        <div className="grid gap-8 lg:grid-cols-3 mb-24 md:mb-32">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="w-full h-full max-h-[520px] md:max-h-[620px] rounded-2xl object-cover lg:col-span-2 shadow-lg"
          />
          <div className="flex flex-col gap-6 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-muted p-6 md:p-8 md:w-1/2 lg:w-auto shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">
                    P
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {breakout.title}
                </h3>
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {breakout.description}
                </p>
              </div>
              <Button
                className="w-full md:w-auto md:mr-auto text-foreground"
                asChild
                size="lg"
              >
                <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="w-full h-64 md:h-auto md:w-1/2 lg:w-full grow basis-0 rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>

        {/* Companies Section - Fixed visibility issue */}
        <div className="py-16 md:py-24 bg-card rounded-2xl px-4 mb-24 md:mb-32 border">
          <h2 className="text-center text-4xl md:text-3xl font-bold text-foreground/90 mb-12">
            {companiesTitle}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8 px-4">
            {companies.map((company, idx) => (
              <div
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border"
                key={company.src + idx}
              >
                <img
                  src={company.src}
                  alt={company.alt}
                  className="h-8 w-auto md:h-10 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-muted p-8 md:p-16 shadow-lg border">
          <div className="flex flex-col gap-6 text-center md:text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {achievementsTitle}
            </h2>
            <p className="max-w-2xl text-muted-foreground text-lg md:text-xl">
              {achievementsDescription}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
            {achievements.map((item, idx) => (
              <div
                className="flex flex-col gap-3 p-4 bg-background/80 rounded-xl shadow-sm border"
                key={item.label + idx}
              >
                <span className="text-3xl font-bold text-primary md:text-4xl">
                  {item.value}
                </span>
                <p className="text-sm font-medium text-muted-foreground md:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] bg-[size:80px_80px] opacity-10 md:block"></div>
        </div>
      </div>
    </section>
  );
};
