import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role } from "@/constants/role";

export default function HeroSection() {
  const navigate = useNavigate();
  const { data: userResponse, isLoading } = useUserInfoQuery(undefined);

  if (isLoading) {
    return null;
  }

  // Access the nested data property
  const user = userResponse?.data;
  const userRole = user?.role;

  const handleSecondButtonClick = () => {
    if (!userRole) {
      navigate("/sender/parcel/create");
      return;
    }

    switch (userRole) {
      case role.receiver:
        navigate("/receiver/parcels-to-receive");
        break;
      case role.sender:
        navigate("/sender/parcel/create");
        break;
      case role.admin:
      case role.superAdmin:
        navigate("/admin/parcel");
        break;
      default:
        navigate("/track");
    }
  };

  const secondButtonLabel =
    userRole === role.receiver
      ? "Incoming Parcels"
      : userRole === role.sender
      ? "Send a Package"
      : userRole === role.admin || userRole === role.superAdmin
      ? "Manage Parcels"
      : "Send a Package";

  return (
    <section
      id="home"
      className="dark relative flex h-svh max-h-[1400px] w-svw overflow-hidden bg-[url('https://images.unsplash.com/photo-1591955506264-3f5a6834570a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat font-sans after:absolute after:left-0 after:top-0 after:z-10 after:h-full after:w-full after:bg-black/40 after:content-[''] md:h-svh"
    >
      <div className="relative z-30 m-auto flex max-w-[46.25rem] flex-col items-center justify-center gap-6 px-5">
        <h1 className="text-foreground text-center font-serif text-4xl leading-tight md:text-6xl xl:text-[4.4rem]">
          Fast, Secure & Reliable Parcel Delivery
        </h1>
        <p className="text-foreground text-center text-base">
          Experience seamless parcel delivery with our state-of-the-art
          platform. Whether you're sending or receiving, we ensure your packages
          are handled with care and delivered on time, every time.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            className="h-fit w-fit rounded-full px-7 py-4 text-sm font-medium leading-tight bg-primary hover:bg-primary/90 text-foreground cursor-pointer"
            onClick={() => navigate("/track")}
          >
            Track Your Parcel
          </Button>
          <Button
            className="h-fit w-fit rounded-full px-7 py-4 text-sm font-medium leading-tight bg-white text-gray-900 hover:bg-white/90 cursor-pointer"
            onClick={handleSecondButtonClick}
          >
            {secondButtonLabel}
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/noise.png')] bg-repeat opacity-10" />
    </section>
  );
}
