import axios from "axios";
import { X } from "lucide-react";

import { Message } from "@/src/model/User";
import { ApiResponse } from "@/src/types/ApiResponse";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({
  message,
  onMessageDelete,
}: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );

    toast.success(response.data.message);

    onMessageDelete(message._id.toString());
  };

  return (
    <Card>
      <CardHeader>

        <CardTitle>
          Card Title
        </CardTitle>

        <AlertDialog>

          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>

            <AlertDialogHeader>

              <AlertDialogTitle>
                Are you absolutely sure?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. This will
                permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>

              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDeleteConfirm}
              >
                Continue
              </AlertDialogAction>

            </AlertDialogFooter>

          </AlertDialogContent>

        </AlertDialog>

        <CardDescription>
          Card Description
        </CardDescription>

      </CardHeader>

      <CardContent>
        <p>Card Content</p>
      </CardContent>

      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>

    </Card>
  );
};

export default MessageCard;