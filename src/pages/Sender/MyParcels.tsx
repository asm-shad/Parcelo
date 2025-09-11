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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  Edit,
  Save,
  X,
  Ban,
  DollarSign,
  Box,
  FileText,
  AlertCircle
} from "lucide-react";
import { useCancelParcelMutation, useGetParcelQuery, useUpdateParcelMutation } from "@/redux/features/parcel/parcel.api";

interface IParcel {
  _id: string;
  trackingId: string;
  title: string;
  description: string;
  type: string;
  weightKg: number;
  fee: number;
  sender: string;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IParcelResponse {
  success: boolean;
  message: string;
  data: IParcel[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  IN_TRANSIT: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  RETURNED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const statusIcons: Record<string, React.ComponentType<any>> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PICKED_UP: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  RETURNED: Ban,
};

export default function MyParcels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingParcel, setEditingParcel] = useState<string | null>(null);
  const [updatedParcelData, setUpdatedParcelData] = useState<Partial<IParcel> | null>(null);
  const [parcels, setParcels] = useState<IParcel[]>([]);

  const { data: parcelsResponse, isLoading, error, refetch } = useGetParcelQuery(undefined);
  const [updateParcel] = useUpdateParcelMutation();
  const [cancelParcel] = useCancelParcelMutation();

  useEffect(() => {
    if (parcelsResponse) {
      console.log('Raw API response:', parcelsResponse);
      
      // Handle different possible response structures
      if (Array.isArray(parcelsResponse)) {
        setParcels(parcelsResponse);
      } else if (parcelsResponse.data && Array.isArray(parcelsResponse.data)) {
        setParcels(parcelsResponse.data);
      } else if (parcelsResponse.success && Array.isArray(parcelsResponse.data)) {
        setParcels(parcelsResponse.data);
      } else {
        console.warn('Unexpected API response structure:', parcelsResponse);
        setParcels([]);
      }
    }
  }, [parcelsResponse]);

  const filteredParcels = parcels.filter((parcel: IParcel) => {
    const matchesSearch = 
      parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || parcel.currentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditParcel = (parcel: IParcel) => {
    setEditingParcel(parcel._id);
    setUpdatedParcelData({
      title: parcel.title,
      description: parcel.description,
      type: parcel.type,
      weightKg: parcel.weightKg,
      receiverAddress: parcel.receiverAddress,
    });
  };

  const handleCancelEdit = () => {
    setEditingParcel(null);
    setUpdatedParcelData(null);
  };

  const handleSaveParcel = async (parcelId: string) => {
    if (!updatedParcelData) return;

    try {
      await updateParcel({
        parcelId,
        parcelInfo: updatedParcelData
      }).unwrap();

      toast.success("Parcel updated successfully");
      setEditingParcel(null);
      setUpdatedParcelData(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update parcel");
      console.error("Error updating parcel:", error);
    }
  };

  const handleCancelParcel = async (parcelId: string) => {
    try {
      await cancelParcel({ parcelId }).unwrap();
      toast.success("Parcel cancelled successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to cancel parcel");
      console.error("Error cancelling parcel:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (!updatedParcelData) return;

    setUpdatedParcelData({
      ...updatedParcelData,
      [field]: value
    });
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status] || Package;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 if (error) {
    console.error('Error loading parcels:', error);
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

  // Debug information in development
  if (process.env.NODE_ENV === 'development' && !isLoading) {
    console.log('Processed parcels:', parcels);
    console.log('Filtered parcels:', filteredParcels);
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header with debug info */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              My Parcels
            </h1>
            <p className="text-muted-foreground mt-2">
              {parcels.length} parcel(s) found
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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by tracking ID, title, description, or receiver address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-lg"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Status:
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Parcels Table */}
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
                  ? "You haven't created any parcels yet."
                  : "No parcels match your search criteria."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Parcel Details</TableHead>
                    <TableHead>Delivery Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timeline</TableHead>
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
                        {editingParcel === parcel._id ? (
                          <div className="space-y-2">
                            <Input
                              value={updatedParcelData?.title || ""}
                              onChange={(e) => handleInputChange("title", e.target.value)}
                              placeholder="Title"
                            />
                            <Input
                              value={updatedParcelData?.description || ""}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              placeholder="Description"
                            />
                            <Input
                              value={updatedParcelData?.type || ""}
                              onChange={(e) => handleInputChange("type", e.target.value)}
                              placeholder="Type"
                            />
                            <Input
                              type="number"
                              value={updatedParcelData?.weightKg || ""}
                              onChange={(e) => handleInputChange("weightKg", parseFloat(e.target.value))}
                              placeholder="Weight (kg)"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-semibold">
                              <Box className="h-4 w-4" />
                              {parcel.title}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3" />
                              <span className="text-muted-foreground">{parcel.description}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>Type: {parcel.type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>Weight: {parcel.weightKg} kg</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-3 w-3" />
                              <span>Fee: ${parcel.fee}</span>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingParcel === parcel._id ? (
                          <Input
                            value={updatedParcelData?.receiverAddress || ""}
                            onChange={(e) => handleInputChange("receiverAddress", e.target.value)}
                            placeholder="Receiver Address"
                          />
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">From: {parcel.senderAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span className="text-sm">To: {parcel.receiverAddress}</span>
                            </div>
                            {parcel.deliveredAt && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Delivered: {formatDate(parcel.deliveredAt)}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(parcel.currentStatus)}
                          <Badge className={statusColors[parcel.currentStatus]}>
                            {parcel.currentStatus.replace("_", " ")}
                          </Badge>
                        </div>
                        {parcel.isCancelled && (
                          <Badge variant="destructive" className="mt-1">
                            Cancelled
                          </Badge>
                        )}
                        {parcel.isDelivered && (
                          <Badge variant="default" className="mt-1">
                            Delivered
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div>Created: {formatDate(parcel.createdAt)}</div>
                          <div>Updated: {formatDate(parcel.updatedAt)}</div>
                          {parcel.trackingEvents.length > 0 && (
                            <div className="text-muted-foreground">
                              {parcel.trackingEvents.length} tracking events
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingParcel === parcel._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveParcel(parcel._id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {parcel.currentStatus === "PENDING" && !parcel.isCancelled && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditParcel(parcel)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelParcel(parcel._id)}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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