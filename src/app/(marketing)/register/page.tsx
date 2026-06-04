"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth/store";
import { registerLocalUser } from "@/lib/auth/local-users";

const Schema = z
  .object({
    firstName: z.string().min(1, "Please enter your first name.").max(40),
    lastName: z.string().min(1, "Please enter your last name.").max(40),
    username: z.string().min(3, "At least 3 characters.").max(40),
    email: z.string().email("Enter a valid email."),
    password: z.string().min(6, "At least 6 characters."),
    confirm: z.string().min(6),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof Schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      const user = await registerLocalUser({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      const res = await fetch("/api/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { message?: string } | null;
        setServerError(err?.message ?? "Could not issue a session token.");
        return;
      }
      setUser(user);
      router.push("/");
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 space-y-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Join Shoply
        </p>
        <h1 className="font-display text-4xl text-[var(--color-ink)]">Create your account</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Local accounts are stored in your browser only. For cross-device access, use the
          DummyJSON demo on the sign-in screen.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" error={errors.firstName?.message}>
            <Input
              autoComplete="given-name"
              invalid={!!errors.firstName}
              {...register("firstName")}
            />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input
              autoComplete="family-name"
              invalid={!!errors.lastName}
              {...register("lastName")}
            />
          </Field>
        </div>
        <Field label="Username" error={errors.username?.message}>
          <Input autoComplete="username" invalid={!!errors.username} {...register("username")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <Field label="Confirm password" error={errors.confirm?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            invalid={!!errors.confirm}
            {...register("confirm")}
          />
        </Field>

        {serverError ? (
          <p
            role="alert"
            className="rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {serverError}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-ink)] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">{label}</label>
      {children}
      {error ? <p className="text-xs text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
