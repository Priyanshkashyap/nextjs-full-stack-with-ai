"use client";

import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Message } from "@/src/model/User";
import { ApiResponse } from "@/src/types/ApiResponse";
import { acceptMessageSchema } from "@/src/schemas/acceptMessageSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import { Loader2, RefreshCcw } from "lucide-react";

import MessageCard from "@/components/ui/MessageCard";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const username = session?.user?.username ?? "";

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast.success("URL copied", {
      description: "Profile URL has been copied to clipboard",
    });
  };

  // Fetch current accept message setting
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response =
        await axios.get<ApiResponse>("/api/accept-messages");

      setValue(
        "acceptMessages",
        response.data.isAcceptingMessage ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch all messages
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const response =
          await axios.get<ApiResponse>("/api/get-messages");

        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

        toast.error(
          axiosError.response?.data.message ??
            "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-messages",
        {
          acceptMessages: !acceptMessages,
        }
      );

      setValue("acceptMessages", !acceptMessages);

      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ??
          "Failed to update message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter(
        (message) => message._id.toString() !== messageId
      )
    );
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">
        User Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Link
        </h2>

        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="w-full mr-2"
          />

          <Button onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />

        <span className="ml-2">
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;