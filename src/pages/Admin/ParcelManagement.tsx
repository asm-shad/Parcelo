import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Use a const object for status values
const ParcelStatus = {
  Requested: "Requested",
  Approved: "Approved",
  Dispatched: "Dispatched",
  InTransit: "In Transit",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Blocked: "Blocked",
} as const;

interface IParcel {
  _id: string;
  trackingId: string;
  title: string;
  type: string;
  weightKg: number;
  fee: number;
  receiverAddress: string;
  createdAt: string;
  currentStatus: string;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [ParcelStatus.Requested]: "secondary",
  [ParcelStatus.Approved]: "outline",
  [ParcelStatus.Dispatched]: "outline",
  [ParcelStatus.InTransit]: "outline",
  [ParcelStatus.Delivered]: "default",
  [ParcelStatus.Cancelled]: "destructive",
  [ParcelStatus.Blocked]: "destructive",
};

export default function ParcelManagement() {
  const navigate = useNavigate();
  const [parcels, setParcels] = useState<IParcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<IParcel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Use getAllParcelsQuery for admin access
  const { data, isLoading, error, refetch } = useGetAllParcelsQuery(undefined);

  useEffect(() => {
    if (data) {
      setParcels(data);
      setFilteredParcels(data);
    }
  }, [data]);

  useEffect(() => {
    let result = parcels;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (parcel) =>
          parcel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parcel.receiverAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((parcel) => parcel.currentStatus === statusFilter);
    }

    setFilteredParcels(result);
  }, [searchTerm, statusFilter, parcels]);

  const handleEdit = (id: string) => {
    navigate(`/admin/parcel/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading parcels. Please try again.
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
      {/* Stylish Header with Border */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Parcel Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage all parcels in the system with ease
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-blue-30 hover:bg-blue-50 cursor-pointer"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by title, tracking ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg"
            />
          </div>
          <div className="w-full md:w-1/3 flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            <div className="w-full md:w-1/3 flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(ParcelStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Full-page Table */}
      <Card className="w-full">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {parcels.length === 0
                  ? "No parcels found in the system."
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
                    <TableHead className="font-semibold">Tracking ID</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Weight (kg)</TableHead>
                    <TableHead className="font-semibold">Fee</TableHead>
                    <TableHead className="font-semibold">
                      Receiver Address
                    </TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcels.map((parcel) => (
                    <TableRow key={parcel._id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm">
                        {parcel.trackingId}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {parcel.title}
                      </TableCell>
                      <TableCell className="capitalize">
                        {parcel.type}
                      </TableCell>
                      <TableCell>{parcel.weightKg} kg</TableCell>
                      <TableCell>${parcel.fee.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {parcel.receiverAddress}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(parcel.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusVariant[parcel.currentStatus] || "default"
                          }
                          className="whitespace-nowrap"
                        >
                          {parcel.currentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(parcel._id)}
                          className={
                            parcel.currentStatus === ParcelStatus.Delivered
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                              : "bg-blue-50 text-foreground border-blue-200"
                          }
                        >
                          {parcel.currentStatus === ParcelStatus.Delivered
                            ? "View"
                            : "Edit"}
                        </Button>
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
