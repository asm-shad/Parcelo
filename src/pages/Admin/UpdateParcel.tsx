/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, User, MapPin, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useGetParcelDetailsQuery,
  useUpdateParcelMutation,
  useUpdateParcelStatusMutation,
} from "@/redux/features/parcel/parcel.api";
import { parcelStatus } from "@/constants/parcelStatus";
import { useNavigate, useParams } from "react-router";

// Updated status flow - admin can only update up to In Transit
const statusFlow = {
  [parcelStatus.Requested]: [parcelStatus.Approved, parcelStatus.Blocked],
  [parcelStatus.Approved]: [parcelStatus.Dispatched, parcelStatus.Blocked],
  [parcelStatus.Dispatched]: [parcelStatus.InTransit, parcelStatus.Blocked],
  [parcelStatus.InTransit]: [], // Admin cannot set to Delivered
  [parcelStatus.Delivered]: [],
  [parcelStatus.Blocked]: [parcelStatus.Approved],
};

const formSchema = z.object({
  status: z.string(),
  dispatchDate: z.date().optional().nullable(),
  estimatedDeliveryDate: z.date().optional().nullable(),
  isBlocked: z.boolean(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ITrackingEvent {
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

interface IParcel {
  _id: string;
  trackingId: string;
  title: string;
  description: string;
  type: string;
  weightKg: number;
  fee: number;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  senderAddress: string;
  receiverAddress: string;
  currentStatus: string;
  images?: string[];
  dispatchDate?: string;
  estimatedDeliveryDate?: string;
  isBlocked?: boolean;
  isCancelled?: boolean;
  isDelivered?: boolean;
  trackingEvents: ITrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export default function UpdateParcel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: parcelData, isLoading, error } = useGetParcelDetailsQuery(id!);
  const [updateParcel] = useUpdateParcelMutation();
  const [updateParcelStatus] = useUpdateParcelStatusMutation();

  const parcel = parcelData as unknown as IParcel;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      isBlocked: false,
      note: "",
      dispatchDate: null,
      estimatedDeliveryDate: null,
    },
  });

  useEffect(() => {
    if (parcel) {
      form.reset({
        status: parcel.currentStatus,
        isBlocked: parcel.isBlocked || false,
        dispatchDate: parcel.dispatchDate
          ? new Date(parcel.dispatchDate)
          : null,
        estimatedDeliveryDate: parcel.estimatedDeliveryDate
          ? new Date(parcel.estimatedDeliveryDate)
          : null,
        note: "",
      });
    }
  }, [parcel, form]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      if (values.status !== parcel?.currentStatus) {
        // Update status with tracking event
        await updateParcelStatus({
          parcelId: id,
          parcelInfo: {
            status: values.status,
            location: "Admin Office",
            note: values.note,
          },
        }).unwrap();
      }

      // Update parcel details
      const updateData: any = {};

      if (
        values.dispatchDate !==
        (parcel?.dispatchDate ? new Date(parcel.dispatchDate) : null)
      ) {
        updateData.dispatchDate = values.dispatchDate;
      }

      if (
        values.estimatedDeliveryDate !==
        (parcel?.estimatedDeliveryDate
          ? new Date(parcel.estimatedDeliveryDate)
          : null)
      ) {
        updateData.estimatedDeliveryDate = values.estimatedDeliveryDate;
      }

      if (values.isBlocked !== parcel?.isBlocked) {
        updateData.isBlocked = values.isBlocked;
      }

      if (Object.keys(updateData).length > 0) {
        await updateParcel({
          parcelId: id,
          parcelInfo: updateData,
        }).unwrap();
      }

      navigate("/admin/parcel");
    } catch (error) {
      console.error("Failed to update parcel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const availableStatuses =
    statusFlow[parcel.currentStatus as keyof typeof statusFlow] || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Parcel</h1>
          <p className="text-muted-foreground">
            Manage parcel status and details
          </p>
        </div>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => navigate("/admin/parcel")}
        >
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parcel Information Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Parcel Information</CardTitle>
            <CardDescription>Details of the parcel</CardDescription>
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
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Current Status
                </label>
                <Badge
                  variant={
                    parcel.currentStatus === parcelStatus.Delivered
                      ? "default"
                      : parcel.currentStatus === parcelStatus.Blocked
                      ? "destructive"
                      : "outline"
                  }
                  className="mt-1"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Sender
                </label>
                <p className="text-sm">{parcel.sender?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {parcel.sender?.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Receiver
                </label>
                <p className="text-sm">{parcel.receiver?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {parcel.receiver?.email}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created At
              </label>
              <p className="text-sm">
                {format(new Date(parcel.createdAt), "PPP pp")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm">
                {format(new Date(parcel.updatedAt), "PPP pp")}
              </p>
            </div>

            {parcel.images && parcel.images.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Images
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {parcel.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Parcel image ${index + 1}`}
                      className="rounded-md object-cover h-20 w-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Form Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Update Status & Details</CardTitle>
            <CardDescription>
              Change parcel status and manage details (Admin can update up to In
              Transit only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                          {availableStatuses.length === 0 && (
                            <SelectItem value={parcel.currentStatus} disabled>
                              No status changes available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Next available statuses based on current status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === parcelStatus.Approved && (
                  <>
                    <FormField
                      control={form.control}
                      name="dispatchDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dispatch Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedDeliveryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Estimated Delivery Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="isBlocked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Block Parcel</FormLabel>
                        <FormDescription>
                          Prevent further status changes until unblocked
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a note for this status change..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Parcel
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Status History Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status History</CardTitle>
            <CardDescription>
              Tracking events and status changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parcel.trackingEvents && parcel.trackingEvents.length > 0 ? (
              <div className="space-y-4">
                {parcel.trackingEvents
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        {index !== parcel.trackingEvents.length - 1 && (
                          <div className="w-0.5 h-16 bg-border"></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              event.status === parcelStatus.Delivered
                                ? "default"
                                : event.status === parcelStatus.Blocked ||
                                  event.status === parcelStatus.Cancelled
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {event.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.timestamp), "PP pp")}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          <span>By: {event.updatedBy?.name || "System"}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Location: {event.location}</span>
                        </div>
                        {event.note && (
                          <div className="flex items-start text-sm text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1 mt-0.5" />
                            <span>Note: {event.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No status history available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
