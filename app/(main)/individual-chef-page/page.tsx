
'use client';

import { useEffect, useState } from 'react';
import HeroSection from './_components/HeroSection';
import ChefReviewForRestaurants from './_components/ChefReviewForRestaurants';
import Adertising from './_components/Adertising';
import ChefWebsiteButton from './_components/ChefWebsiteButton';
import type { ChefProfile } from '@/types/chef';

const page = () => {
 const [chef, setChef] = useState<ChefProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChef = async () => {
      const token = window.localStorage.getItem('chefToken');
      if (!token) {
        setError('Please sign in first to view your chef profile.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/chef-me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Unable to load chef profile');
          setLoading(false);
          return;
        }

        setChef(data.chef);
      } catch (err) {
        setError('Unable to load chef profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChef();
  }, []);

  return (
    <div className="">
      <HeroSection chef={chef} />

      <div className="flex flex-col -mt-8 relative z-10 page-width">
        <div className="flex flex-col">
          <ChefWebsiteButton />
        </div>

        <div className="flex items-start max-xl:flex-wrap gap-6 max-xl:pb-5 mb-18">
          <ChefReviewForRestaurants />
          <Adertising />
        </div>
      </div>

      {loading && (
        <div className="page-width py-8 text-center text-lg text-gray-700">Loading chef profile...</div>
      )}

      {error && !loading && (
        <div className="page-width py-8 text-center text-lg text-red-600">{error}</div>
      )}
    </div>
  );
};

export default page;
