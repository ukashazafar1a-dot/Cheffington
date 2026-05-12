import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <h1 className="title font-bold text-center mb-10 text-black tracking-tight">
          Sign In
        </h1>

        <form className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Username or Email Address
            </label>
            <input
              type="text"
              className="w-full p-4 bg-[#EDEDED] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-black">
              Password
            </label>
            <input
              type="password"
              className="w-full p-4 bg-[#EDEDED] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
          </div>

          {/* Checkbox */}
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

          {/* Sign In Button */}
          <Link href="/claim-a-restaurant-3">
            <button
              type="submit"
              className="w-full button button-primary"
            >
              SIGN IN
            </button>
          </Link>

          {/* Footer Links */}
          <div className="flex justify-between text-sm mt-4">
            <p className="text-black">
              Not a member? <Link href="join-2-create-profile" className="underline font-semibold">Sign up here.</Link>
            </p>
            <Link href="#" className="text-black underline font-semibold">
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Brand and Mascot Section */}
        <div className="relative mt-20 flex justify-center">
          <h2 className="body-subtitle">
            Cheffington
          </h2>

       
          <div className="absolute -right-4 -bottom-4 md:-right-20">
            {/* Replace src with your chicken mascot image */}
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