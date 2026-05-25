'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SignInPage() {
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
      const res = await fetch('http://localhost:5000/api/auth/chef-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || 'Unable to sign in';
        setError(
          msg.includes('business owner')
            ? `${msg} Sign in at http://localhost:3002/login`
            : msg
        );
        setLoading(false);
        return;
      }

      window.localStorage.setItem('chefToken', data.token);
      const chefName = `${data.chef.firstName} ${data.chef.lastName}`.trim();
      window.localStorage.setItem('chefName', chefName);
      window.dispatchEvent(
        new CustomEvent('chef-profile-updated', {
          detail: {
            name: chefName,
            profilePhotoUrl: data.chef.profilePhotoUrl,
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="title font-bold text-center mb-10 text-black tracking-tight">
          Sign In
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="chef@example.com"
              className="w-full p-4 bg-[#EDEDED] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-[#EDEDED] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 rounded p-3">{error}</div>
          ) : null}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="keep-signed-in"
              className="w-5 h-5 border-gray-400 rounded bg-[#FDF0E0] accent-orange-400"
            />
            <label htmlFor="keep-signed-in" className="text-sm text-black">
              Keep me signed in
            </label>
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
