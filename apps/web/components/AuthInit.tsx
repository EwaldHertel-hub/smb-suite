'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens } from '@/store/slices/authSlice';

export function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken) {
      dispatch(setTokens({ accessToken, refreshToken: refreshToken || undefined, user: null }));
    }
  }, [dispatch]);

  return null;
}