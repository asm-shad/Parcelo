import { useEffect, useState } from "react";
import { useTrackParcelQuery } from "@/redux/features/parcel/parcel.api";
import { parcelStatus } from "@/constants/parcelStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Package,
  MapPin,
  Clock,
  User,
  FileText,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useParams } from "react-router";

interface TrackingEvent {
  status: string;
  timestamp: string;
  location: string;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  note?: string;
}

interface TrackingData {
  _id: string;
  trackingId: string;
  currentStatus: string;
  trackingEvents: TrackingEvent[];
  estimatedDeliveryDate?: string;
  deliveredAt?: string;
}

interface TrackingResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: TrackingData;
}

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusIcons: Record<string, React.ComponentType<any>> = {
  [parcelStatus.Requested]: Package,
  [parcelStatus.Approved]: CheckCircle,
  [parcelStatus.Dispatched]: Truck,
  [parcelStatus.InTransit]: Truck,
  [parcelStatus.Delivered]: CheckCircle,
  [parcelStatus.Cancelled]: AlertCircle,
  [parcelStatus.Blocked]: AlertCircle,
};

// Updated status colors using your shadcn palette
const statusColors: Record<string, string> = {
  [parcelStatus.Requested]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [parcelStatus.Approved]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [parcelStatus.Dispatched]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [parcelStatus.InTransit]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [parcelStatus.Delivered]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [parcelStatus.Cancelled]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [parcelStatus.Blocked]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

// Helper function to get proper badge variant
const getBadgeVariant = (status: string) => {
  switch (status) {
    case parcelStatus.Delivered:
      return "default";
    case parcelStatus.Cancelled:
    case parcelStatus.Blocked:
      return "destructive";
    default:
      return "outline";
  }
};

export default function TrackParcel() {
  const { trackingId: urlTrackingId } = useParams();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const [searchId, setSearchId] = useState("");

  // Auto-search when URL has a trackingId
  useEffect(() => {
    if (urlTrackingId && urlTrackingId !== searchId) {
      setTrackingId(urlTrackingId);
      setSearchId(urlTrackingId);
    }
  }, [urlTrackingId, searchId]);

  const { data, isLoading, error } = useTrackParcelQuery(searchId, {
    skip: !searchId,
  });

  const trackingData = (data as TrackingResponse)?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchId(trackingId.trim());
    }
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  // Check if we have an error
  const hasError: boolean = !!(error && (error as ApiError)?.status === 404);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-accent/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className="text-center mb-8"
          style={{ animation: "fadeIn 0.6s ease-out" }}
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Package
                className="h-16 w-16 text-primary"
                style={{ animation: "bounce 2s infinite" }}
              />
              <div className="absolute -top-2 -right-2">
                <div
                  className="w-4 h-4 bg-green-500 rounded-full"
                  style={{ animation: "pulse 2s infinite" }}
                ></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Track Your Parcel
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your tracking ID to get real-time updates
          </p>
        </div>

        {/* Search Form */}
        <Card
          className="mb-8 shadow-lg border-border bg-card/80 backdrop-blur-sm"
          style={{ animation: "slideUp 0.5s ease-out" }}
        >
          <CardContent className="p-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter tracking ID (e.g., TRK123456789)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg border-2 border-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <Button
                type="submit"
                className="py-6 px-8 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all transform hover:scale-105 shadow-md text-foreground cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Tracking...
                  </div>
                ) : (
                  "Track Package"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchId && (
          <div style={{ animation: "fadeIn 0.6s ease-out" }}>
            {isLoading && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            )}

            {hasError && (
              <Card className="mb-6 border-destructive/20 bg-destructive/10">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-destructive-foreground mb-2">
                    Package Not Found
                  </h3>
                  <p className="text-destructive-foreground/80">
                    No package found with tracking ID: {searchId}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setTrackingId("");
                      setSearchId("");
                    }}
                  >
                    Try Another ID
                  </Button>
                </CardContent>
              </Card>
            )}

            {trackingData && (
              <div className="space-y-6">
                {/* Status Overview */}
                <Card className="shadow-lg border-border bg-gradient-to-r from-card to-accent/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-card-foreground mb-2">
                          Tracking ID: {trackingData.trackingId}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1",
                              statusColors[trackingData.currentStatus] ||
                                "bg-muted text-muted-foreground"
                            )}
                          >
                            {getStatusIcon(trackingData.currentStatus)}
                            <span>{trackingData.currentStatus}</span>
                          </div>
                        </div>
                      </div>
                      {trackingData.estimatedDeliveryDate && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Estimated Delivery
                          </p>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {format(
                              new Date(trackingData.estimatedDeliveryDate),
                              "MMM dd, yyyy"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Timeline */}
                <Card className="shadow-lg border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      Package Journey
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {trackingData.trackingEvents &&
                      trackingData.trackingEvents.length > 0 ? (
                        trackingData.trackingEvents
                          .slice()
                          .reverse()
                          .map(
                            (
                              event: TrackingEvent,
                              index: number,
                              array: TrackingEvent[]
                            ) => (
                              <div key={index} className="flex">
                                {/* Timeline line */}
                                <div className="flex flex-col items-center mr-4">
                                  <div
                                    className={cn(
                                      "w-3 h-3 rounded-full border-2 border-background shadow",
                                      index === 0
                                        ? "bg-green-500"
                                        : "bg-primary"
                                    )}
                                    style={
                                      index === 0
                                        ? { animation: "pulse 2s infinite" }
                                        : {}
                                    }
                                  />
                                  {index !== array.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gradient-to-b from-primary/40 to-primary/20 mt-1" />
                                  )}
                                </div>

                                {/* Event content */}
                                <div className="flex-1 pb-6">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={getBadgeVariant(event.status)}
                                      >
                                        {event.status}
                                      </Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {format(
                                        new Date(event.timestamp),
                                        "MMM dd, yyyy 'at' h:mm a"
                                      )}
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4" />
                                      <span>{event.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <User className="h-4 w-4" />
                                      <span>
                                        Updated by:{" "}
                                        {event.updatedBy?.name || "System"}
                                      </span>
                                    </div>

                                    {event.note && (
                                      <div className="flex items-start gap-2 text-muted-foreground mt-2 p-3 bg-accent/20 rounded-lg">
                                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span className="italic">
                                          "{event.note}"
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                          <p>No tracking events available yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Animation for delivered packages */}
                {trackingData.currentStatus === parcelStatus.Delivered &&
                  trackingData.deliveredAt && (
                    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                      <CardContent className="p-6 text-center">
                        <div style={{ animation: "bounce 2s infinite" }}>
                          <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                          Package Delivered! 🎉
                        </h3>
                        <p className="text-green-600 dark:text-green-400">
                          Successfully delivered on{" "}
                          {format(
                            new Date(trackingData.deliveredAt),
                            "PPPP 'at' p"
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Empty State Illustration */}
        {!searchId && !urlTrackingId && (
          <div
            className="text-center mt-16"
            style={{ animation: "fadeIn 0.6s ease-out" }}
          >
            <div className="mb-6">
              <div className="relative inline-block">
                <Truck
                  className="h-24 w-24 text-primary/60 mx-auto mb-4"
                  style={{ animation: "float 3s ease-in-out infinite" }}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
                  style={{ animation: "pulse 2s infinite" }}
                ></div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">
              Ready to track your package?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter your unique tracking ID above to see real-time updates,
              current status, and the complete journey of your package.
            </p>
          </div>
        )}
      </div>

      {/* Add global styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
