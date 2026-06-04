"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth/store";
import { authenticateLocalUser } from "@/lib/auth/local-users";

const Schema = z.object({
  username: z.string().min(1, "Enter your username or email."),
  password: z.string().min(1, "Enter your password."),
});

type FormValues = z.infer<typeof Schema>;

const DEMO = { username: "emilys", password: "emilyspass" };

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";
  const reason = searchParams.get("reason");
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSubmitting(true);
    try {
      // 1. Try DummyJSON via our route handler.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = (await res.json()) as { user: import("@/types/auth").AuthUser };
        setUser(data.user);
        router.push(from);
        router.refresh();
        return;
      }

      // 2. Fall back to local accounts on this device.
      const localUser = await authenticateLocalUser(values.username, values.password);
      if (localUser) {
        const localRes = await fetch("/api/auth/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: localUser.id,
            username: localUser.username,
            email: localUser.email,
            firstName: localUser.firstName,
            lastName: localUser.lastName,
          }),
        });
        if (localRes.ok) {
          setUser(localUser);
          router.push(from);
          router.refresh();
          return;
        }
      }

      const err = (await res.json().catch(() => null)) as { message?: string } | null;
      setServerError(err?.message ?? "Invalid credentials.");
    } catch {
      setServerError("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 space-y-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
          {reason === "favorite" ? "One step away" : "Welcome back"}
        </p>
        <h1 className="font-display text-4xl text-[var(--color-ink)]">
          {reason === "favorite" ? "Sign in to save favorites" : "Sign in to Shoply"}
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {reason === "favorite"
            ? "Use the demo credentials below, or sign in with an account you created on this device — you'll come right back."
            : "Use the demo credentials, or sign in with an account you created on this device."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-1">
          <label htmlFor="username" className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Username or email
          </label>
          <Input
            id="username"
            autoComplete="username"
            invalid={!!errors.username}
            {...register("username")}
          />
          {errors.username ? (
            <p className="text-xs text-[var(--color-danger)]">{errors.username.message}</p>
          ) : null}
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-[var(--color-danger)]">{errors.password.message}</p>
          ) : null}
        </div>

        {serverError ? (
          <p
            role="alert"
            className="rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]"
          >
            {serverError}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-8 space-y-4 border-t border-[var(--color-line)] pt-6 text-sm text-[var(--color-muted)]">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
          <div className="space-y-0.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Demo credentials
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              <code className="font-mono text-xs">{DEMO.username}</code>
              {" / "}
              <code className="font-mono text-xs">{DEMO.password}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setValue("username", DEMO.username, { shouldValidate: true });
              setValue("password", DEMO.password, { shouldValidate: true });
            }}
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink)] underline-offset-4 hover:underline"
          >
            Fill
          </button>
        </div>
        <p className="text-center">
          New here?{" "}
          <Link href="/register" className="text-[var(--color-ink)] underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
