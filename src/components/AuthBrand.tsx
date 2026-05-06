import React from 'react';
import { Leaf } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

interface AuthBrandProps {
  className?: string;
}

const AuthBrand = ({ className = 'mb-10' }: AuthBrandProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <div className={`${designRecipes.panel} flex h-10 w-10 items-center justify-center bg-ds-brand-50 ring-1 ring-ds-brand-100`}>
          <Leaf className="h-5 w-5 text-ds-brand-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ds-text-primary">leaf</h1>
      </div>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-ds-text-muted">
        Travel · Connect · Share
      </p>
    </div>
  );
};

export default AuthBrand;
