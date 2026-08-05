'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/chef-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Unable to sign in');
        setLoading(false);
        return;
      }

      window.localStorage.setItem('chefToken', data.token);
      const chefName = `${data.chef.firstName} ${data.chef.lastName}`.trim();
      window.localStorage.setItem('chefName', chefName);
      if (data.chef.applicationType) {
        window.localStorage.setItem(
          'chefApplicationType',
          data.chef.applicationType
        );
      }
      window.dispatchEvent(
        new CustomEvent('chef-profile-updated', {
          detail: {
            name: chefName,
            profilePhotoUrl: data.chef.profilePhotoUrl,
            roleLabel:
              data.chef.applicationType === 'business_owner'
                ? 'Business Owner'
                : data.chef.applicationType === 'public'
                  ? 'Member'
                  : 'Chef',
            applicationType: data.chef.applicationType,
          },
        })
      );

      const returnUrl = searchParams.get('returnUrl');
      const destination =
        returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
          ? returnUrl
          : '/individual-chef-page';
      router.push(destination);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="title mb-10 text-center font-bold tracking-tight text-black">
          Sign In
        </h1>

        <form className="form-card space-y-6" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="chef@example.com"
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="input-field"
            />
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <div className="form-checkbox-row">
            <input type="checkbox" id="keep-signed-in" />
            <label htmlFor="keep-signed-in">Keep me signed in</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full button button-primary"
          >
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>

          <div className="flex justify-between text-sm mt-4">
            <p className="text-black">
              Not a member?{' '}
              <Link href="/join-2-create-profile" className="underline font-semibold">
                Sign up here.
              </Link>
            </p>
            <Link href="#" className="text-black underline font-semibold">
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="relative mt-20 flex justify-center">
          <h2 className="body-subtitle">Cheffington</h2>
          <div className="absolute -right-4 -bottom-4 md:-right-20">
            <img
              src="/signlogo.png"
              alt="Cheffington Mascot"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
