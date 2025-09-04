import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import type { IErrorResponse } from "@/types";
import type { FileMetadata } from "@/hooks/use-file-upload";

// Form validation schema - using strings for numeric fields like the tour example
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
  weightKg: z.string().min(1, "Weight is required"),
  fee: z.string().min(1, "Fee is required"),
  sender: z.string().min(1, "Sender is required"),
  receiver: z.string().min(1, "Receiver is required"),
  senderAddress: z.string().min(1, "Sender address is required"),
  receiverAddress: z.string().min(1, "Receiver address is required"),
});

export default function CreateParcel() {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);
  const [createParcel] = useCreateParcelMutation();

  // Fetch current user info
  const { data: userInfo, isLoading: userLoading } =
    useUserInfoQuery(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      weightKg: "",
      fee: "",
      sender: userInfo?.data?._id || "",
      receiver: "",
      senderAddress: userInfo?.data?.address || "",
      receiverAddress: "",
    },
  });

  // Update sender address when sender is selected
  const handleSenderChange = (userId: string) => {
    if (userId === userInfo?.data?._id) {
      form.setValue("senderAddress", userInfo.data.address || "");
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Creating parcel...");

    try {
      // Convert string fields to numbers like in the tour example
      const parcelData = {
        ...data,
        weightKg: Number(data.weightKg),
        fee: Number(data.fee),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(parcelData));

      // Add images to formData
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("files", image);
        }
      });

      const res = await createParcel(formData).unwrap();

      if (res.success) {
        toast.success("Parcel created successfully", { id: toastId });
        form.reset();
        setImages([]);
      } else {
        toast.error("Failed to create parcel", { id: toastId });
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as IErrorResponse).message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-16">
      <Card>
        <CardHeader>
          <CardTitle>Create New Parcel</CardTitle>
          <CardDescription>Add a new parcel to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="create-parcel-form"
              className="space-y-5"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Parcel title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Parcel type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Parcel description"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="0.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSenderChange(value);
                        }}
                        value={field.value}
                        disabled={userLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userInfo?.data && (
                            <SelectItem value={userInfo.data._id}>
                              {userInfo.data.name} (You)
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver</FormLabel>
                      <FormControl>
                        <Input placeholder="Receiver ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="senderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Sender's address"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiverAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Receiver's address"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Parcel Images</FormLabel>
                <MultipleImageUploader onChange={setImages} />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="create-parcel-form">
            Create Parcel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
