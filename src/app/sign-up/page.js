
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission state
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/users", {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(
        response.data.message || "Account created successfully"
      );

      // Registration does not automatically create a session.
      router.push("/sign-in");

    } catch (error) {
      console.error("Error signing up:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to create your account"
      );
    } finally {
      setLoading(false);
    }
  };

  // Shared styling for all input fields
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Header />

      <main className="flex justify-center px-4 py-10 sm:py-14">

        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          {/* Page heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Begin your journey with eha-natal.
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First name */}
            <div>
              <label htmlFor="firstName" className={labelClass}>
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className={inputClass}
              />
            </div>

            {/* Last name */}
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#7461A8] py-3 font-semibold text-white transition hover:bg-[#62508F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Link to sign-in */}
          <p className="mt-7 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#7461A8] hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}
