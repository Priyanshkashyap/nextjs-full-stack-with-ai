"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";

import { useRouter, useParams } from "next/navigation";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { verifySchema } from "@/src/schemas/verifySchema";
import { ApiResponse } from "@/src/types/ApiResponse";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyAccount() {

    const router = useRouter();

    const params = useParams<{
        username: string;
    }>();

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<
        z.infer<typeof verifySchema>
    >({
        resolver:
            zodResolver(
                verifySchema
            ),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (
        data: z.infer<typeof verifySchema>
    ) => {

        setIsSubmitting(true);

        try {

            const response =
                await axios.post<ApiResponse>(
                    "/api/verify-code",
                    {
                        username:
                            params.username,
                        code:
                            data.code,
                    }
                );

            toast.success(
                response.data.message
            );

            router.replace(
                "/sign-in"
            );

        }
        catch (error) {

            const axiosError =
                error as AxiosError<ApiResponse>;

            toast.error(
                axiosError.response
                    ?.data.message ??
                "Verification failed"
            );
        }
        finally {

            setIsSubmitting(false);
        }
    };

    return (
        <div className="
            flex
            justify-center
            items-center
            min-h-screen
            bg-gray-100
        ">
            <div className="
                w-full
                max-w-md
                p-8
                space-y-8
                bg-white
                rounded-lg
                shadow-md
            ">

                <div className="text-center">

                    <h1 className="
                        text-4xl
                        font-extrabold
                        tracking-tight
                        lg:text-5xl
                        mb-4
                    ">
                        Verify Your Account
                    </h1>

                    <p className="text-muted-foreground">
                        Enter the verification code
                        sent to your email
                    </p>

                </div>

                <form
                    onSubmit={
                        handleSubmit(
                            onSubmit
                        )
                    }
                    className="space-y-6"
                >

                    <FieldGroup>

                        <Field>

                            <FieldLabel>
                                Verification Code
                            </FieldLabel>

                            <Input
                                placeholder="Enter OTP"
                                {...register(
                                    "code"
                                )}
                            />

                            <FieldDescription>
                                Enter the 6 digit code
                                sent to your email.
                            </FieldDescription>

                            {
                                errors.code && (
                                    <FieldError>
                                        {
                                            errors
                                                .code
                                                .message
                                        }
                                    </FieldError>
                                )
                            }

                        </Field>

                    </FieldGroup>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={
                            isSubmitting
                        }
                    >
                        {
                            isSubmitting
                                ? "Verifying..."
                                : "Verify Account"
                        }
                    </Button>

                </form>

            </div>
        </div>
    );
}