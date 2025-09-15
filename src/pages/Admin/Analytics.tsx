// src/components/DashboardAnalytics.tsx
import React from "react";
import {
  Package,
  Users,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserStatsQuery,
  useGetParcelStatsQuery,
} from "@/redux/features/stats/stats.api";

// Define types for the API responses
interface UserStats {
  totalUsers: number;
  newUsersInLast7Days: number;
  newUsersInLast30Days: number;
  totalActiveUsers: number;
  totalInActiveUsers: number;
  totalBlockedUsers: number;
  usersByRole: Array<{ _id: string; count: number }>;
}

interface ParcelStats {
  totalParcels: number;
  parcelsLast7Days: number;
  parcelsLast30Days: number;
  totalDeliveredParcels: number;
  totalCancelledParcels: number;
  totalBlockedParcels: number;
  totalRevenue: number;
  avgParcelValue: number;
  avgDeliveryDays: number;
  parcelsByStatus: Array<{ _id: string; count: number }>;
  topSenders: Array<{
    _id: string;
    senderInfo: { name?: string; email: string };
    parcelCount: number;
  }>;
  topReceivers: Array<{
    _id: string;
    receiverInfo: { name?: string; email: string };
    parcelCount: number;
  }>;
}

export default function Analytics() {
  const {
    data: userStatsResponse,
    isLoading: userStatsLoading,
    error: userStatsError,
  } = useGetUserStatsQuery(undefined);
  const {
    data: parcelStatsResponse,
    isLoading: parcelStatsLoading,
    error: parcelStatsError,
  } = useGetParcelStatsQuery(undefined);

  // Extract the actual data from the response
  const userStats = userStatsResponse?.data as UserStats | undefined;
  const parcelStats = parcelStatsResponse?.data as ParcelStats | undefined;

  if (userStatsError || parcelStatsError) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive">
        <div className="text-destructive text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Error Loading Analytics
          </h3>
          <p>Failed to load dashboard statistics. Please try again later.</p>
        </div>
      </div>
    );
  }

  const isLoading = userStatsLoading || parcelStatsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive overview of your parcel delivery system
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <StatCard
          title="Total Users"
          value={userStats?.totalUsers || 0}
          icon={<Users className="h-6 w-6" />}
          description="Registered users in the system"
          loading={isLoading}
          trend={{
            value: userStats?.newUsersInLast7Days || 0,
            label: "new in 7 days",
          }}
        />

        {/* Total Parcels Card */}
        <StatCard
          title="Total Parcels"
          value={parcelStats?.totalParcels || 0}
          icon={<Package className="h-6 w-6" />}
          description="All parcels in the system"
          loading={isLoading}
          trend={{
            value: parcelStats?.parcelsLast7Days || 0,
            label: "new in 7 days",
          }}
        />

        {/* Delivered Parcels Card */}
        <StatCard
          title="Delivered"
          value={parcelStats?.totalDeliveredParcels || 0}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          description="Successfully delivered parcels"
          loading={isLoading}
          percentage={
            parcelStats?.totalParcels
              ? Math.round(
                  ((parcelStats.totalDeliveredParcels || 0) /
                    parcelStats.totalParcels) *
                    100
                )
              : 0
          }
        />

        {/* Revenue Card */}
        <StatCard
          title="Total Revenue"
          value={`$${(parcelStats?.totalRevenue || 0).toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6 text-amber-500" />}
          description="Total revenue from delivered parcels"
          loading={isLoading}
          trend={{
            value: `$${(parcelStats?.avgParcelValue || 0).toFixed(2)}`,
            label: "avg per parcel",
          }}
        />
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <StatItem
                  icon={<UserCheck className="h-4 w-4 text-green-500" />}
                  label="Active Users"
                  value={userStats?.totalActiveUsers || 0}
                />
                <StatItem
                  icon={<UserX className="h-4 w-4 text-gray-500" />}
                  label="Inactive Users"
                  value={userStats?.totalInActiveUsers || 0}
                />
                <StatItem
                  icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                  label="Blocked Users"
                  value={userStats?.totalBlockedUsers || 0}
                />
                <StatItem
                  icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                  label="New (30 days)"
                  value={userStats?.newUsersInLast30Days || 0}
                />

                {/* User Roles Breakdown */}
                <div className="col-span-2 mt-4">
                  <h4 className="font-semibold mb-2">Users by Role</h4>
                  <div className="space-y-2">
                    {userStats?.usersByRole?.map((role) => (
                      <div
                        key={role._id}
                        className="flex justify-between items-center"
                      >
                        <Badge variant="outline" className="capitalize">
                          {role._id.toLowerCase()}
                        </Badge>
                        <span className="font-medium">{role.count}</span>
                      </div>
                    ))}
                    {(!userStats?.usersByRole ||
                      userStats.usersByRole.length === 0) && (
                      <div className="text-center text-muted-foreground py-2">
                        No role data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parcel Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parcel Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <StatItem
                  icon={<Truck className="h-4 w-4 text-blue-500" />}
                  label="In Transit"
                  value={
                    parcelStats?.parcelsByStatus?.find(
                      (s) => s._id === "in-transit"
                    )?.count || 0
                  }
                />
                <StatItem
                  icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                  label="Delivered"
                  value={parcelStats?.totalDeliveredParcels || 0}
                />
                <StatItem
                  icon={<XCircle className="h-4 w-4 text-red-500" />}
                  label="Cancelled"
                  value={parcelStats?.totalCancelledParcels || 0}
                />
                <StatItem
                  icon={<AlertCircle className="h-4 w-4 text-amber-500" />}
                  label="Blocked"
                  value={parcelStats?.totalBlockedParcels || 0}
                />

                {/* Delivery Performance */}
                <div className="col-span-2 mt-4">
                  <h4 className="font-semibold mb-2">Delivery Performance</h4>
                  <div className="space-y-2">
                    <StatItem
                      icon={<Clock className="h-4 w-4" />}
                      label="Avg Delivery Time"
                      value={
                        parcelStats?.avgDeliveryDays
                          ? `${parcelStats.avgDeliveryDays.toFixed(1)} days`
                          : "N/A"
                      }
                    />
                    <StatItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Parcels (30 days)"
                      value={parcelStats?.parcelsLast30Days || 0}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Senders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Top Senders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {parcelStats?.topSenders
                  ?.slice(0, 5)
                  .map((sender, index: number) => (
                    <div
                      key={sender._id}
                      className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">
                            {sender.senderInfo.name || sender.senderInfo.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {sender.parcelCount} parcels
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {(!parcelStats?.topSenders ||
                  parcelStats.topSenders.length === 0) && (
                  <div className="text-center text-muted-foreground py-4">
                    No sender data available
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Receivers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Top Receivers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {parcelStats?.topReceivers
                  ?.slice(0, 5)
                  .map((receiver, index: number) => (
                    <div
                      key={receiver._id}
                      className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">
                            {receiver.receiverInfo.name ||
                              receiver.receiverInfo.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {receiver.parcelCount} parcels
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {(!parcelStats?.topReceivers ||
                  parcelStats.topReceivers.length === 0) && (
                  <div className="text-center text-muted-foreground py-4">
                    No receiver data available
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  loading: boolean;
  percentage?: number;
  trend?: {
    value: number | string;
    label: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  loading,
  percentage,
  trend,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-3/4 mb-2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
        {(percentage !== undefined || trend) && !loading && (
          <div className="mt-2">
            {percentage !== undefined && (
              <Badge
                variant={percentage >= 70 ? "default" : "secondary"}
                className="mr-2"
              >
                {percentage}% success rate
              </Badge>
            )}
            {trend && (
              <span className="text-xs text-muted-foreground">
                {trend.value} {trend.label}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-muted rounded-lg">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
};
