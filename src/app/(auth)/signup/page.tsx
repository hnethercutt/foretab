'use client';
import styles from '../auth.module.css';
import Form from 'next/form';
import GoogleContinueButton from '@/components/google-continue-button';
import SignupForm from '@/components/signup-form';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Tooltip } from '@mui/material';

export default function Signup() {
  return (
    <div>
      <GoogleContinueButton />
      <SignupForm />
    </div>
  );
}
