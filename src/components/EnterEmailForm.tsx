import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import '../index.scss'
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { LEAF_BACKEND_URL } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';

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

  const [infoMessage, setInfoMessage] = useState<string>("")
  const onSubmit = (data: FormData) => {
    axios.post(LEAF_BACKEND_URL + "/user/auth/confirm-email", {...data})
    .then(resp => setInfoMessage(resp?.data?.message))
    .catch(err => showErrorToast(err?.response?.data?.error?.message));
  };


  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-8 lg:px-16">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">leaf</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Your Password?</h2>
        <p className="text-gray-600 mb-8">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}

            {
              infoMessage && (
                <p className="mt-1 text-sm text-green-700">{infoMessage}</p>
              )
            }
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 px-4 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Get Reset Link
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Recollected your password?{' '}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EnterEmailForm;