import React from 'react';
import { Leaf } from 'lucide-react';

interface AuthBrandProps {
  className?: string;
}

const AuthBrand = ({ className = 'mb-10' }: AuthBrandProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 ring-1 ring-green-100">
          <Leaf className="h-5 w-5 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">leaf</h1>
      </div>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400">
        Travel · Connect · Share
      </p>
    </div>
  );
};

export default AuthBrand;
