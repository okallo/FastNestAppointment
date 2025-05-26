'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { jwtDecode } from 'jwt-decode';
import Spinner from './pages'; 

interface TokenPayload {
  sub: string;
  role: string;
  exp: number;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/pages/auth/login');
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token');
        router.replace('/login');
        return;
      }

      switch (decoded.role) {
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        case 'doctor':
          router.replace('/doctor/dashboard');
          break;
        case 'patient':
          router.replace('/patient/dashboard');
          break;
        default:
          router.replace('/login');
      }
    } catch (error) {
      localStorage.removeItem('access_token');
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return <>{loading && <Spinner />}</>;
}
