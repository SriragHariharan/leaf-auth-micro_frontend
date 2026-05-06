import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import '../index.scss';
import axios from 'axios';
import { LEAF_BACKEND_URL } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';
import AuthBrand from './AuthBrand';
import { designRecipes } from 'hostApp/designRecipes';

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

  const inputBase = `${designRecipes.inputBase} peer h-11 border-transparent pl-10 pr-3 text-base`;
  const inputError = designRecipes.inputError;

  return (
    <div className="relative h-full w-full flex flex-col justify-center items-center px-8 lg:px-16 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-ds-brand-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-ds-brand-50/70 blur-3xl"
      />
      <div className="relative w-full max-w-md">
        <AuthBrand className="mb-10" />

        <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Forgot your password?</h2>
        <p className="mt-2 text-ds-text-muted">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ds-text-secondary">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-muted peer-focus:text-ds-brand-600 transition-colors" />
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
              <p className="mt-1.5 flex items-center gap-1 text-xs text-ds-state-danger">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email.message}
              </p>
            )}

            {infoMessage && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-ds-state-successSoft p-3 text-sm text-ds-state-success ring-1 ring-inset ring-ds-brand-100">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {infoMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${designRecipes.buttonPrimary} flex h-11 w-full items-center justify-center gap-2 px-4 shadow-dsBrand active:scale-[0.99] ${loading ? 'cursor-not-allowed shadow-none' : ''}`}
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

        <p className="mt-8 text-center text-sm text-ds-text-secondary">
          Recollected your password?{' '}
          <Link to="/login" className="font-medium text-ds-brand-600 hover:text-ds-brand-700 hover:underline">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EnterEmailForm;