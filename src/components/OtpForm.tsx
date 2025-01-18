import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { LEAF_AX_TOKEN, LEAF_BACKEND_URL, LEAF_USER_ID } from '../constants/constants';
import { showErrorToast } from '../helpers/toastify';
import { useNavigate } from 'react-router';

import '../index.scss'
import { ToastContainer } from 'react-toastify';

interface FormData {
  otp: string;
}

const OtpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null); // Store interval ID

  const navigate = useNavigate();

  // Function to format the time left in mm:ss format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Initialize the timer
  const startTimer = (startTime: number) => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000; // Decrease the time by 1 second
      });
    }, 1000);
    setTimerInterval(interval); // Store the interval
  };

  useEffect(() => {
    const storedTime = localStorage.getItem('otpTimerStart');
    const currentTime = Date.now();

    let initialTime = 3000; // Default to 5 minutes (300000ms)

    if (storedTime) {
      const timeElapsed = currentTime - Number(storedTime);
      initialTime = Math.max(0, 3000 - timeElapsed); // Calculate remaining time
    } else {
      localStorage.setItem('otpTimerStart', currentTime.toString()); // Start a new timer if it doesn't exist
    }

    setTimeLeft(initialTime);  // Set initial time left
    startTimer(initialTime);  // Start the timer with initial time

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval); // Cleanup on component unmount
      }
    };
  }, []);

  const onSubmit = (data: FormData) => {
    let userID = localStorage.getItem(LEAF_USER_ID)
    axios.post( LEAF_BACKEND_URL + "/user/auth/confirm-otp", { ...data, userID } )
    .then(resp => {
      localStorage.setItem(LEAF_AX_TOKEN, resp?.data?.data?.token)
      console.log(resp);
      navigate("/profile")
    })
    .catch(err => showErrorToast(err?.response?.data?.error?.message))
  };

  const resendOtpRequest = () => {
    axios.post( LEAF_BACKEND_URL + "/user/auth/resend-otp" )
    .then(resp => console.log(resp))
    .catch(err => showErrorToast(err?.response?.data?.error?.message))
  }

  // Resend OTP logic
  const resendOtp = (): void => {
    resendOtpRequest();
    const currentTime = Date.now();
    localStorage.setItem('otpTimerStart', currentTime.toString()); // Update the stored time
    setTimeLeft(3000); // Reset the timer to 5 minutes (300000ms)

    if (timerInterval) {
      clearInterval(timerInterval); // Clear existing interval before starting a new one
    }

    startTimer(3000); // Start the timer again from 5 minutes
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-8 lg:px-16">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">leaf</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enter the OTP</h2>
        <p className="text-gray-600 mb-8">
          We sent an OTP to your email address. Please enter it below to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* OTP Field */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              {...register('otp', {
                required: 'OTP is required',
                pattern: {
                  value: /^[0-9]{6}$/, // Assuming OTP is a 6-digit number
                  message: 'OTP must be 6 digits',
                },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            {errors.otp && <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 px-4 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Submit OTP
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-red-500 font-semibold">
          Do not refresh the page. Refreshing might cause the OTP to expire.
        </p>

        {/* Resend OTP button */}
        {timeLeft <= 0 && (
          <p className="mt-8 text-center text-sm text-gray-600">
            Didn’t receive an OTP?{' '}
            <span onClick={resendOtp} className="font-medium text-green-600 hover:text-green-500">
              Resend OTP
            </span>
          </p>
        )}

        {/* Timer Display */}
        <div className="absolute bottom-8 right-8 text-xs md:text-xl font-semibold text-gray-800 bg-green-300 p-4 rounded-full">
          <p>Time Left: {formatTime(timeLeft)}</p>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;