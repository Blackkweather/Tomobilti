import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

export default function EmailVerification() {
  const [, setLocation] = useLocation();
  
  // Get token from URL params manually
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const emailFromUrl = urlParams.get("email");
  
  const [email, setEmail] = useState(emailFromUrl || "");
  const [status, setStatus] = useState<"pending" | "success" | "error" | "resend">("pending");
  const [message, setMessage] = useState("");

  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-email", { token });
      return response.json();
    },
    onSuccess: () => {
      setStatus("success");
      setMessage("Email verified successfully!");
      setTimeout(() => setLocation("/login"), 3000);
    },
    onError: (error: Error) => {
      setStatus("error");
      setMessage(error.message);
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/resend-verification", { email });
      return response.json();
    },
    onSuccess: () => {
      setStatus("resend");
      setMessage("Verification email sent! Check your inbox.");
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    }
  }, [token]);

  const handleResendEmail = () => {
    if (email) {
      resendEmailMutation.mutate(email);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Redirecting to sign in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            <div className="mt-6 space-y-4">
              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={resendEmailMutation.isPending}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {resendEmailMutation.isPending ? "Sending..." : "Resend verification email"}
                </button>
              )}
              <button
                onClick={() => setLocation("/register")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-blue-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {token ? "Verifying your email..." : "Check your email"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {token 
              ? "Please wait while we verify your email address."
              : `We've sent a verification link to ${email || "your email address"}`
            }
          </p>
          {status === "resend" && (
            <p className="mt-4 text-sm text-green-600">{message}</p>
          )}
          {!token && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or
              </p>
              {email ? (
                <button
                  onClick={handleResendEmail}
                  disabled={resendEmailMutation.isPending}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                >
                  {resendEmailMutation.isPending ? "Sending..." : "resend verification email"}
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={handleResendEmail}
                    disabled={!email || resendEmailMutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {resendEmailMutation.isPending ? "Sending..." : "Send verification email"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
