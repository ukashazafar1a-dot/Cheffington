'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(
    () => String(searchParams.get('token') || '').trim(),
    [searchParams]
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError(
        'This reset link is missing a token. Request a new link from the sign-in page.'
      );
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/website-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Unable to reset password');
      }
      setSuccess(data.message || 'Password updated. You can sign in now.');
      window.setTimeout(() => router.replace('/sign-in'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="title mb-4 text-center font-bold tracking-tight text-black">
          Reset password
        </h1>
        <p className="mb-10 text-center text-black/70">
          Choose a new password for your Cheffington account.
        </p>

        <form className="form-card space-y-6" onSubmit={handleSubmit}>
          {!token ? (
            <div className="form-error">
              This page needs a valid reset link from your email.
            </div>
          ) : null}

          <div className="form-field">
            <label className="form-label">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input-field"
              autoComplete="new-password"
              minLength={6}
              disabled={loading || Boolean(success) || !token}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Confirm new password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="input-field"
              autoComplete="new-password"
              minLength={6}
              disabled={loading || Boolean(success) || !token}
              required
            />
          </div>

          {error ? <div className="form-error">{error}</div> : null}
          {success ? (
            <div className="rounded-md border border-green-700/20 bg-green-50 px-3 py-2 text-sm text-green-800">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || Boolean(success) || !token}
            className="w-full button button-primary"
          >
            {loading ? 'Saving...' : 'Update password'}
          </button>

          <p className="text-center text-sm text-black">
            <Link href="/sign-in" className="underline font-semibold">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <p className="text-black/60">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
