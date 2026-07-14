"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MessageSquareText, Sparkles, Send } from "lucide-react";

import { messageSchema } from "@/src/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/src/types/ApiResponse";

type PublicProfileResponse = {
  success: boolean;
  message?: string;
  username?: string;
  isAcceptingMessage?: boolean;
};

type MessageFormValues = {
  content: string;
};

export default function PublicMessagePage() {
  const params = useParams<{ username: string }>();

  const username = useMemo(() => {
    const raw = params?.username;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);
  const [profileFound, setProfileFound] = useState<boolean | null>(null);

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = form;

  const messageValue = watch("content");

  const loadProfile = async () => {
    if (!username) return;

    setIsLoadingProfile(true);

    try {
      const response = await axios.get<PublicProfileResponse>(
        `/api/u/${encodeURIComponent(username)}`
      );

      setProfileFound(true);
      setIsAcceptingMessage(!!response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<PublicProfileResponse>;

      if (axiosError.response?.status === 404) {
        setProfileFound(false);
      } else {
        toast.error(
          axiosError.response?.data.message ?? "Failed to load profile"
        );
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleSuggestMessages = async () => {
    if (!isAcceptingMessage) return;

    setIsSuggesting(true);

    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content:
                "Generate three open-ended anonymous message suggestions separated by ||",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const text = await response.text();

      const parsedSuggestions = text
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean);

      setSuggestions(parsedSuggestions);

      if (parsedSuggestions.length === 0) {
        toast.error("No suggestions were generated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suggestions");
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit = async (data: MessageFormValues) => {
    if (!username) return;

    if (!isAcceptingMessage) {
      toast.error("This user is not accepting messages right now");
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.success(response.data.message || "Message sent successfully");
      reset();
      setSuggestions([]);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError.response?.data.message ?? "Failed to send message"
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileFound === false) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-muted p-3">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">User not found</h1>
              <p className="text-sm text-muted-foreground">
                The profile you opened does not exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Anonymous Messages
              </p>
              <h1 className="mt-1 text-3xl font-bold">
                Send a message to @{username}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your message will be sent anonymously.
              </p>
            </div>

            <div
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isAcceptingMessage
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAcceptingMessage ? "Accepting messages" : "Not accepting"}
            </div>
          </div>

          {!isAcceptingMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              This user is not accepting anonymous messages right now.
            </div>
          )}
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your message</label>
              <textarea
                {...register("content")}
                placeholder="Write your anonymous message here..."
                rows={6}
                disabled={!isAcceptingMessage || isSending}
                className="min-h-[150px] w-full rounded-2xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.content && (
                <p className="text-sm text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={handleSuggestMessages}
                disabled={!isAcceptingMessage || isSuggesting}
                className="gap-2"
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Suggest Messages
              </Button>

              <Button
                type="submit"
                disabled={!isAcceptingMessage || isSending}
                className="gap-2"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send
              </Button>
            </div>
          </form>
        </div>

        {suggestions.length > 0 && (
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Suggested messages</h2>

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  type="button"
                  disabled={!isAcceptingMessage}
                  onClick={() =>
                    setValue("content", suggestion, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="w-full rounded-2xl border px-4 py-3 text-left text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messageValue?.length > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Message length: {messageValue.length}/300
          </p>
        )}
      </div>
    </div>
  );
}