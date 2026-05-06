import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import '../index.scss';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { LEAF_BACKEND_URL } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';
import AuthBrand from './AuthBrand';

interface FormData {
  email: string;
}

const EnterEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
  });

  const [infoMessage, setInfoMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Create loading state

  const onSubmit = (data: FormData) => {
    setLoading(true); // Set loading to true when the request starts
    axios.post(LEAF_BACKEND_URL + "/user/auth/confirm-email", { ...data })
      .then(resp => {
        setInfoMessage(resp?.data?.message);
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message))
      .finally(() => {
        setLoading(false); // Set loading to false when the request is complete
      });
  };

  const inputBase =
    "peer h-11 w-full rounded-xl border border-transparent bg-gray-100/70 pl-10 pr-3 text-[15px] text-gray-900 placeholder:text-gray-400 hover:bg-gray-100 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 focus:outline-none transition";
  const inputError =
    "border-red-300 bg-red-50/40 hover:bg-red-50/60 focus:border-red-400 focus:ring-red-500/10";

  return (
    <div className="relative h-full w-full flex flex-col justify-center items-center px-8 lg:px-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl"
      />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full max-w-md">
        <AuthBrand className="mb-10" />

        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Forgot your password?</h2>
        <p className="mt-2 text-gray-500">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 peer-focus:text-green-600 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
                className={`${inputBase} ${errors.email ? inputError : ''}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}

            {infoMessage && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 ring-1 ring-inset ring-green-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {infoMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition focus:outline-none focus:ring-4 focus:ring-green-500/30 active:scale-[0.99] ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Get Reset Link'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Recollected your password?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-700 hover:underline">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EnterEmailForm;