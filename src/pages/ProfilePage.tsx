import { useEffect, useState } from "react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, MapPin, Calendar, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { motivationalQuotes } from "@/constants/motivationalQuotes";
import { coverImages } from "@/constants/coverImages";
import { UpdateProfileModal } from "@/components/modules/UpdateProfileModal";

export default function ProfilePage() {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  const [cover, setCover] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setCover(coverImages[Math.floor(Math.random() * coverImages.length)]);
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Hero Section with Dynamic Image */}
      <div className="h-56 sm:h-64 w-full relative">
        <img
          src={cover}
          alt="profile cover"
          className="w-full h-full object-cover transition-all duration-700"
        />

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-6 flex gap-2 sm:gap-3 flex-wrap justify-end">
          <UpdateProfileModal />
          <Button
            onClick={() => navigate("/parcel/create")}
            className="rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-foreground text-sm sm:text-base"
          >
            Create Parcel
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 sm:-mt-16 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl sm:text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-foreground break-words">
            {user?.name || "Unnamed User"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground break-all">
            {user?.email || "No email"}
          </p>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="capitalize text-sm">
              {user?.role || "User"}
            </Badge>
            <Badge
              className={`text-sm ${
                user?.isActive === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user?.isActive || "Inactive"}
            </Badge>
            {user?.isVerified ? (
              <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1 text-sm">
                <ShieldCheck className="h-4 w-4" /> Verified
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-500 text-sm">
                Unverified
              </Badge>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2 sm:gap-3">
            <Phone className="h-5 w-5 text-blue-500 shrink-0" />
            <span className="truncate">
              {user?.phone || "No phone provided"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
            <span className="truncate">
              {user?.address || "No address provided"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
            <span>
              Member since{" "}
              {user?.createdAt
                ? new Date(user?.createdAt).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-10 sm:mt-14 text-center px-2">
          <blockquote className="text-lg sm:text-xl italic font-medium text-muted-foreground">
            “{quote}”
          </blockquote>
        </div>
      </div>
    </div>
  );
}
