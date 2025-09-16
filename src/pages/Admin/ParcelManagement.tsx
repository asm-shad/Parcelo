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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface ParcelResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IParcel[];
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

// Custom debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ParcelManagement() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Use custom debounce hook for search
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Use getAllParcelsQuery with filter parameters - UPDATED PARAMETER NAMES
  const { data, isLoading, error, refetch } = useGetAllParcelsQuery({
    page: currentPage,
    limit,
    searchTerm: debouncedSearchTerm || undefined, // Changed from 'search' to 'searchTerm'
    currentStatus: statusFilter !== "all" ? statusFilter : undefined, // Changed from 'status' to 'currentStatus'
  });

  const parcelResponse = data as ParcelResponse;
  const totalPage = parcelResponse?.meta?.totalPage || 1;
  const parcelsData = parcelResponse?.data || [];
  const totalItems = parcelResponse?.meta?.total || 0;

  const handleAction = (parcelId: string, currentStatus: string) => {
    if (currentStatus === ParcelStatus.Delivered) {
      navigate(`/admin/parcel/${parcelId}`);
    } else {
      navigate(`/admin/parcel/update/${parcelId}`);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

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

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          "Loading parcels..."
        ) : (
          <>
            Showing {parcelsData.length} of {totalItems} parcels
            {(debouncedSearchTerm || statusFilter !== "all") && (
              <span>
                {" "}
                (filtered by{" "}
                {debouncedSearchTerm && `search: "${debouncedSearchTerm}"`}
                {debouncedSearchTerm && statusFilter !== "all" && " and "}
                {statusFilter !== "all" && `status: ${statusFilter}`})
              </span>
            )}
          </>
        )}
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
          ) : parcelsData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {debouncedSearchTerm || statusFilter !== "all"
                  ? "No parcels match your search criteria."
                  : "No parcels found in the system."}
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
            <>
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">
                        Tracking ID
                      </TableHead>
                      <TableHead className="font-semibold">Title</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">
                        Weight (kg)
                      </TableHead>
                      <TableHead className="font-semibold">Fee</TableHead>
                      <TableHead className="font-semibold">
                        Receiver Address
                      </TableHead>
                      <TableHead className="font-semibold">
                        Created At
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parcelsData.map((parcel) => (
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
                            onClick={() =>
                              handleAction(parcel._id, parcel.currentStatus)
                            }
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

              {/* Pagination */}
              {totalPage > 1 && (
                <div className="flex justify-end p-4 mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: totalPage },
                        (_, index) => index + 1
                      ).map((page) => (
                        <PaginationItem
                          key={page}
                          onClick={() => setCurrentPage(page)}
                        >
                          <PaginationLink isActive={currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPage)
                            )
                          }
                          className={
                            currentPage === totalPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
