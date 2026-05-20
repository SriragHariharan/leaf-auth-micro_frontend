import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import '../index.scss';
import axios from 'axios';
import { AUTH_PATHS, authUrl } from '../constants/constants';
import { showErrorToast } from 'hostApp/toast';
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
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    axios.post(authUrl(AUTH_PATHS.confirmEmail), { ...data })
      .then(resp => {
        setInfoMessage(resp?.data?.message);
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={designRecipes.authFormShell}>
      <div aria-hidden="true" className={designRecipes.authDecorBlurTop} />
      <div aria-hidden="true" className={designRecipes.authDecorBlurBottom} />
      <div className={designRecipes.authFormContent}>
        <AuthBrand className="mb-10" />

        <h2 className="text-3xl font-semibold tracking-tight text-ds-text-primary">Forgot your password?</h2>
        <p className="mt-2 text-ds-text-muted">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className={designRecipes.formLabel}>
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
                className={`peer ${designRecipes.inputWithIcon} ${errors.email ? designRecipes.inputError : ''}`}
              />
            </div>
            {errors.email && (
              <p className={designRecipes.formError}>
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

          <button type="submit" disabled={loading} className={designRecipes.buttonSubmitFull}>
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
          <Link to="/login" className={designRecipes.linkBrand}>
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EnterEmailForm;
