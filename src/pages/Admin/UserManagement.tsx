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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUsersQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/auth.api";
import {
  Phone,
  MapPin,
  User as UserIcon,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Save,
  X,
} from "lucide-react";
import { role, IsActive } from "@/constants/role";
import { toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Create types from the objects
type UserRoleType = keyof typeof role;
type IsActiveType = keyof typeof IsActive;

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRoleType;
  phone?: string;
  address?: string;
  picture?: string;
  isActive: IsActiveType;
  isVerified: boolean;
  createdAt: string;
}

interface UsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IUser[];
}

const roleColors: Record<UserRoleType, string> = {
  [role.superAdmin]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [role.admin]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [role.sender]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [role.receiver]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  superAdmin: "",
  admin: "",
  receiver: "",
  sender: "",
};

const statusColors: Record<IsActiveType, string> = {
  [IsActive.ACTIVE]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [IsActive.INACTIVE]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [IsActive.BLOCKED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  ACTIVE: "",
  INACTIVE: "",
  BLOCKED: "",
};

const roleIcons: Record<UserRoleType, React.ComponentType<any>> = {
  [role.superAdmin]: Shield,
  [role.admin]: Shield,
  [role.sender]: UserIcon,
  [role.receiver]: UserIcon,
  superAdmin: UserIcon,
  admin: UserIcon,
  receiver: UserIcon,
  sender: UserIcon,
};

const statusIcons: Record<IsActiveType, React.ComponentType<any>> = {
  [IsActive.ACTIVE]: CheckCircle,
  [IsActive.INACTIVE]: XCircle,
  [IsActive.BLOCKED]: Ban,
  ACTIVE: CheckCircle,
  INACTIVE: XCircle,
  BLOCKED: Ban,
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

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [updatedRole, setUpdatedRole] = useState<UserRoleType | "">("");
  const [updatedStatus, setUpdatedStatus] = useState<IsActiveType | "">("");

  // Use debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // API call with filtering parameters
  const { data, isLoading, error, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit,
    searchTerm: debouncedSearchTerm || undefined, // FIXED: Changed to searchTerm
    role: roleFilter !== "all" ? roleFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const usersResponse = data as UsersResponse;
  const totalPage = usersResponse?.meta?.totalPage || 1;
  const usersData = usersResponse?.data || [];
  const totalItems = usersResponse?.meta?.total || 0;

  const [updateProfile] = useUpdateProfileMutation();

  const handleEditUser = (user: IUser) => {
    setEditingUser(user._id);
    setUpdatedRole(user.role);
    setUpdatedStatus(user.isActive);
  };

  const handleSaveUser = async (userId: string) => {
    try {
      const updateData: any = {};

      if (updatedRole) {
        updateData.role = updatedRole;
      }

      if (updatedStatus) {
        updateData.isActive = updatedStatus;
      }

      await updateProfile({
        userId,
        formData: updateData,
      }).unwrap();

      toast.success("User updated successfully");
      setEditingUser(null);
      setUpdatedRole("");
      setUpdatedStatus("");
      refetch();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUpdatedRole("");
    setUpdatedStatus("");
  };

  const getRoleIcon = (roleValue: UserRoleType) => {
    const IconComponent = roleIcons[roleValue] || UserIcon;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusIcon = (status: IsActiveType) => {
    const IconComponent = statusIcons[status] || CheckCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  // Helper function to get values from the objects
  const getUserRoleValues = () => Object.values(role);
  const getIsActiveValues = () => Object.values(IsActive);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, roleFilter, statusFilter]);

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading users. Please try again.
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage all users in the system with ease
            </p>
          </div>
          {/* <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-primary/30 hover:bg-primary/10"
            >
              Refresh
            </Button>
          </div> */}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by name, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-1/2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Role:
              </span>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {getUserRoleValues().map((roleValue) => (
                    <SelectItem key={roleValue} value={roleValue}>
                      {roleValue.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {getIsActiveValues().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          "Loading users..."
        ) : (
          <>
            Showing {usersData.length} of {totalItems} users
            {(debouncedSearchTerm ||
              roleFilter !== "all" ||
              statusFilter !== "all") && (
              <span>
                {" "}
                (filtered by{" "}
                {debouncedSearchTerm && `search: "${debouncedSearchTerm}"`}
                {debouncedSearchTerm &&
                  (roleFilter !== "all" || statusFilter !== "all") &&
                  " and "}
                {roleFilter !== "all" && `role: ${roleFilter}`}
                {roleFilter !== "all" && statusFilter !== "all" && " and "}
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
          ) : usersData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {debouncedSearchTerm ||
                roleFilter !== "all" ||
                statusFilter !== "all"
                  ? "No users match your search criteria."
                  : "No users found in the system."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
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
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Verified</TableHead>
                      <TableHead className="font-semibold">
                        Created At
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.map((user) => (
                      <TableRow key={user._id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.picture ? (
                              <img
                                src={user.picture}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone || "Not updated yet"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-xs">
                                {user.address || "Not updated yet"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {editingUser === user._id ? (
                            <Select
                              value={updatedRole}
                              onValueChange={(value) =>
                                setUpdatedRole(value as UserRoleType)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {getUserRoleValues()
                                  .filter(
                                    (roleValue) => roleValue !== role.superAdmin
                                  ) // Don't allow changing to super admin
                                  .map((roleValue) => (
                                    <SelectItem
                                      key={roleValue}
                                      value={roleValue}
                                    >
                                      {roleValue.replace("_", " ")}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              <Badge
                                className={roleColors[user.role]}
                                variant="outline"
                              >
                                {user.role.replace("_", " ")}
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingUser === user._id ? (
                            <Select
                              value={updatedStatus}
                              onValueChange={(value) =>
                                setUpdatedStatus(value as IsActiveType)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {getIsActiveValues().map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(user.isActive)}
                              <Badge
                                className={statusColors[user.isActive]}
                                variant="outline"
                              >
                                {user.isActive}
                              </Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isVerified ? "default" : "outline"}
                            className={
                              user.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingUser === user._id ? (
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
                                onClick={() => handleSaveUser(user._id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-4">
                              {user.role !== role.superAdmin && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </Button>
                              )}
                            </div>
                          )}
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
