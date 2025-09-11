/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  User,
  Phone,
  Box,
  FileText,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { useConfirmDeliveryMutation, useGetIncomingParcelsQuery } from "@/redux/features/parcel/parcel.api";

interface IParcel {
  _id: string;
  trackingId: string;
  title: string;
  description: string;
  type: string;
  weightKg: number;
  fee: number;
  sender: {
    name: string;
    phone: string;
    email: string;
  };
  receiver: string;
  senderAddress: string;
  receiverAddress: string;
  currentStatus: string;
  trackingEvents: Array<{
    status: string;
    timestamp: string;
    location?: string;
    description?: string;
  }>;
  isBlocked: boolean;
  isCancelled: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

const statusColors: Record<string, string> = {
  Requested: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Dispatched: "bg-purple-100 text-purple-800",
  "In Transit": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Blocked: "bg-gray-100 text-gray-800",
};

const statusIcons: Record<string, React.ComponentType<any>> = {
  Requested: Clock,
  Approved: CheckCircle,
  Dispatched: Truck,
  "In Transit": Truck,
  Delivered: CheckCircle,
  Cancelled: Clock,
  Blocked: Clock,
};

export default function ParcelsToReceive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parcels, setParcels] = useState<IParcel[]>([]);

  const { data: parcelsResponse, isLoading, error, refetch } = useGetIncomingParcelsQuery(undefined);
  const [confirmDelivery] = useConfirmDeliveryMutation();

  useEffect(() => {
    if (parcelsResponse) {
      // Filter out delivered parcels and only show parcels that are not delivered
      const incomingParcels = parcelsResponse.filter((parcel: IParcel) => 
        !parcel.isDelivered && parcel.currentStatus !== "Delivered"
      );
      setParcels(incomingParcels);
    }
  }, [parcelsResponse]);

  const filteredParcels = parcels.filter((parcel: IParcel) => {
    return (
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.sender.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleConfirmDelivery = async (parcelId: string) => {
    try {
      await confirmDelivery(parcelId).unwrap();
      toast.success("Delivery confirmed successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to confirm delivery");
      console.error("Error confirming delivery:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status] || Package;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Error loading parcels</h3>
              <p className="mt-2">
                {(error as any)?.data?.message || 'Please try again later.'}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Parcels to Receive
            </h1>
            <p className="text-muted-foreground mt-2">
              {parcels.length} incoming parcel(s) found
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-primary/30 hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by tracking ID, title, or sender name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {parcels.length === 0
                  ? "No incoming parcels to receive."
                  : "No parcels match your search criteria."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Parcel Details</TableHead>
                    <TableHead>Sender Info</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcels.map((parcel: IParcel) => (
                    <TableRow key={parcel._id} className="hover:bg-muted/30">
                      <TableCell className="font-mono font-medium">
                        {parcel.trackingId}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-semibold">
                            <Box className="h-4 w-4" />
                            {parcel.title}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3" />
                            <span className="text-muted-foreground">{parcel.description}</span>
                          </div>
                          <div className="text-sm">
                            Type: {parcel.type} • {parcel.weightKg} kg
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-3 w-3" />
                            <span>Fee: ${parcel.fee}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{parcel.sender.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{parcel.sender.phone}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {parcel.sender.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{parcel.receiverAddress}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(parcel.currentStatus)}
                          <Badge className={statusColors[parcel.currentStatus]}>
                            {parcel.currentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(parcel.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {parcel.currentStatus === "In Transit" && (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmDelivery(parcel._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm Delivery
                          </Button>
                        )}
                        {parcel.currentStatus !== "In Transit" && (
                          <span className="text-xs text-muted-foreground">
                            Wait for delivery
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}