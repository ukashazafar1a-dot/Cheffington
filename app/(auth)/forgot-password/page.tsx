'use client';

import Link from 'next/link';
import { useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/website-forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || 'Unable to send password reset email'
        );
      }
      setSuccess(
        data.message ||
          'If an approved account exists for that email, a password reset link has been sent.'
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to send password reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="title mb-4 text-center font-bold tracking-tight text-black">
          Forgot password
        </h1>
        <p className="mb-10 text-center text-black/70">
          Enter the email for your approved Cheffington account. We&apos;ll send
          a reset link if it matches.
        </p>

        <form className="form-card space-y-6" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="chef@example.com"
              className="input-field"
              autoComplete="email"
              disabled={loading || Boolean(success)}
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
            disabled={loading || Boolean(success)}
            className="w-full button button-primary"
          >
            {loading ? 'Sending...' : 'Send reset link'}
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
