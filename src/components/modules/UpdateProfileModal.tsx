import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useUpdateProfileMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import SingleImageUploader from "../SingleImageUploader";

export function UpdateProfileModal() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  // Fetch current user to prefill
  const { data: userData } = useUserInfoQuery(undefined);
  const user = userData?.data;

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  // Reset form when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!user?._id) {
      toast.error("User information not loaded");
      return;
    }

    // Create FormData for mixed content (text + file)
    const formData = new FormData();

    // Append JSON data as string
    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        phone: data.phone,
        address: data.address,
      })
    );

    // Append file if exists
    if (image) {
      formData.append("file", image);
    }

    // Debug: Log FormData contents
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, value.type, value.size);
      } else {
        console.log(key, value);
      }
    }

    try {
      const res = await updateProfile({ userId: user._id, formData }).unwrap();
      console.log("UpdateProfile response:", res);
      toast.success("Profile updated successfully!");
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          Update Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-5"
            id="update-profile-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <div>
              <FormLabel className="mb-2">Profile Picture</FormLabel>
              <SingleImageUploader onChange={setImage} />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className="text-foreground"
            type="submit"
            form="update-profile-form"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
