'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

type WebsiteRole = 'chef' | 'business_owner';

type LoginSuccess = {
  success: true;
  token: string;
  chef: {
    firstName?: string;
    lastName?: string;
    applicationType?: string;
    profilePhotoUrl?: string;
  };
};

type LoginRoleChoice = {
  success: false;
  needsRoleChoice: true;
  availableRoles: WebsiteRole[];
  memberApplicationType?: string;
  message?: string;
};

function roleLabelForChoice(
  role: WebsiteRole,
  memberApplicationType?: string
) {
  if (role === 'business_owner') return 'Business Owner';
  if (memberApplicationType === 'public') return 'Member';
  return 'Chef';
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState<WebsiteRole | null>(null);
  const [roleChoice, setRoleChoice] = useState<{
    roles: WebsiteRole[];
    memberApplicationType?: string;
  } | null>(null);

  const completeLogin = (data: LoginSuccess) => {
    window.localStorage.setItem('chefToken', data.token);
    const chefName = `${data.chef.firstName ?? ''} ${data.chef.lastName ?? ''}`.trim();
    window.localStorage.setItem('chefName', chefName);

    // Always replace so a prior Business Owner session cannot leave a stale role label.
    if (data.chef.applicationType) {
      window.localStorage.setItem(
        'chefApplicationType',
        data.chef.applicationType
      );
    } else {
      window.localStorage.removeItem('chefApplicationType');
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
  };

  const attemptLogin = async (asRole?: WebsiteRole) => {
    setError('');
    setLoading(true);
    if (asRole) setPendingRole(asRole);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/chef-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(asRole ? { asRole } : {}),
        }),
      });

      const data = (await res.json()) as
        | LoginSuccess
        | LoginRoleChoice
        | { success: false; message?: string };

      if (
        res.ok &&
        data &&
        'needsRoleChoice' in data &&
        data.needsRoleChoice
      ) {
        setRoleChoice({
          roles: data.availableRoles ?? ['chef', 'business_owner'],
          memberApplicationType: data.memberApplicationType,
        });
        return;
      }

      if (!res.ok || !data || !('token' in data) || !data.success || !data.chef) {
        setError(
          (data && 'message' in data && data.message) || 'Unable to sign in'
        );
        return;
      }

      setRoleChoice(null);
      completeLogin(data);
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setPendingRole(null);
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Enter while choosing a role should not wipe the choice / re-hit the API.
    if (roleChoice) return;
    await attemptLogin();
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
              onChange={(e) => {
                setEmail(e.target.value);
                setRoleChoice(null);
                setError('');
              }}
              type="email"
              placeholder="chef@example.com"
              className="input-field"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setRoleChoice(null);
                setError('');
              }}
              type="password"
              placeholder="Enter your password"
              className="input-field"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {roleChoice ? (
            <div className="space-y-3 rounded-md border border-black/10 bg-black/[0.03] p-4">
              <p className="text-sm text-black">
                This email has more than one account. Sign in as:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {roleChoice.roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    disabled={loading}
                    onClick={() => void attemptLogin(role)}
                    className="w-full button button-primary"
                  >
                    {pendingRole === role
                      ? 'Signing in...'
                      : `Sign in as ${roleLabelForChoice(
                          role,
                          roleChoice.memberApplicationType
                        )}`}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <div className="form-error">{error}</div> : null}

          <div className="form-checkbox-row">
            <input type="checkbox" id="keep-signed-in" />
            <label htmlFor="keep-signed-in">Keep me signed in</label>
          </div>

          {!roleChoice ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full button button-primary"
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          ) : null}

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
