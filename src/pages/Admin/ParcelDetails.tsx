import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetParcelDetailsQuery } from "@/redux/features/parcel/parcel.api";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserByIdQuery } from "@/redux/features/auth/auth.api";

export default function ParcelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: parcel, isLoading, error } = useGetParcelDetailsQuery(id!);

  // Extract sender and receiver IDs from parcel data
  const senderId = parcel?.sender?.$oid || parcel?.sender;
  const receiverId = parcel?.receiver?.$oid || parcel?.receiver;

  // Fetch sender details using the getUserById endpoint
  const {
    data: senderData,
    isLoading: isLoadingSender,
    error: senderError,
  } = useGetUserByIdQuery(senderId, {
    skip: !senderId,
  });

  // Fetch receiver details using the getUserById endpoint
  const {
    data: receiverData,
    isLoading: isLoadingReceiver,
    error: receiverError,
  } = useGetUserByIdQuery(receiverId, {
    skip: !receiverId,
  });

  // Extract user data from response (assuming the API returns { data: user })
  const sender = senderData?.data;
  const receiver = receiverData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading parcel details. Please try again.
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/admin/parcel")}>
                Back to Parcels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parcel Details</h1>
          <p className="text-muted-foreground">
            Viewing details for parcel {parcel.trackingId}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/parcel")}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parcel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tracking ID
                </label>
                <p className="font-mono">{parcel.trackingId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <Badge
                  variant={
                    parcel.currentStatus === "Delivered"
                      ? "default"
                      : parcel.currentStatus === "Blocked" ||
                        parcel.currentStatus === "Cancelled"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {parcel.currentStatus}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Title
              </label>
              <p className="font-medium">{parcel.title}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <p className="text-sm">{parcel.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                <p>{parcel.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Weight
                </label>
                <p>{parcel.weightKg} kg</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Fee
              </label>
              <p>${parcel.fee.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Sender Address
              </label>
              <p>{parcel.senderAddress}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Receiver Address
              </label>
              <p>{parcel.receiverAddress}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p>{format(new Date(parcel.createdAt), "PPP pp")}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p>{format(new Date(parcel.updatedAt), "PPP pp")}</p>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Sender
              </label>
              {isLoadingSender ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : senderError ? (
                <p className="text-sm text-destructive">
                  Error loading sender info
                </p>
              ) : sender ? (
                <>
                  <p className="text-sm">{sender.name || sender.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {sender.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {sender._id}
                  </p>
                  {sender.phone && (
                    <p className="text-xs text-muted-foreground">
                      Phone: {sender.phone}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sender information not available
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Receiver
              </label>
              {isLoadingReceiver ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : receiverError ? (
                <p className="text-sm text-destructive">
                  Error loading receiver info
                </p>
              ) : receiver ? (
                <>
                  <p className="text-sm">
                    {receiver.name || receiver.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {receiver.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {receiver._id}
                  </p>
                  {receiver.phone && (
                    <p className="text-xs text-muted-foreground">
                      Phone: {receiver.phone}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Receiver information not available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        {parcel.images && parcel.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Parcel Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {parcel.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Parcel image ${index + 1}`}
                    className="rounded-md object-cover h-40 w-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
