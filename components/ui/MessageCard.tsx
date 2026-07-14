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

    <CardHeader className="flex flex-row justify-between items-start">

      <div>
        <CardTitle className="break-words">
          {message.content}
        </CardTitle>

        <CardDescription>
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </div>

      <AlertDialog>

        <AlertDialogTrigger asChild>

          <Button variant="destructive" size="icon">
            <X className="w-4 h-4" />
          </Button>

        </AlertDialogTrigger>

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Message?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </CardHeader>

  </Card>
);
}
export default MessageCard;
