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
    // Pick random cover + quote on page load
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
    <div className="relative min-h-screen w-full">
      {/* Hero Section with Dynamic Image */}
      <div className="h-64 w-full overflow-hidden relative">
        <img
          src={cover}
          alt="profile cover"
          className="w-full h-full object-cover transition-all duration-700"
        />

        {/* Action Buttons */}
        <div className="absolute top-4 right-6 flex gap-3">
          <UpdateProfileModal></UpdateProfileModal>
          <Button
            onClick={() => navigate("/parcel/create")}
            className="rounded-xl shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg text-foreground cursor-pointer"
          >
            Create Parcel
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
            <AvatarImage src={user?.picture} alt={user?.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-3xl font-semibold text-foreground">
            {user?.name || "Unnamed User"}
          </h1>
          <p className="text-muted-foreground">{user?.email || "No email"}</p>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="capitalize">
              {user?.role || "User"}
            </Badge>
            <Badge
              className={
                user?.isActive === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {user?.isActive || "Inactive"}
            </Badge>
            {user?.isVerified ? (
              <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Verified
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-500">Unverified</Badge>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-500" />
            <span>{user?.phone || "No phone provided"}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-500" />
            <span>{user?.address || "No address provided"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span>
              Member since{" "}
              {user?.createdAt
                ? new Date(user?.createdAt).getFullYear()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-14 text-center">
          <blockquote className="text-xl italic font-medium text-muted-foreground">
            “{quote}”
          </blockquote>
        </div>
      </div>
    </div>
  );
}
