'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithGoogle } from '@/services/user-service';
import Image from 'next/image';
import './google-continue-button.css';

export default function GoogleContinueButton() {
  const router = useRouter();
  const [error, setError] = useState('');

  const continueWithGoogle = async () => {
    signInWithGoogle().then(function (_result) {
      if (!_result.success) {
        // Same message for any failed attempt
        setError(_result.message);
      } else {
        router.push('/');
      }
    });
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <button onClick={continueWithGoogle} className="google-btn">
        <Image
          src="ctn_with_google_btn_neutral.svg"
          width="200"
          height="40"
          alt="Continue with Google"
        />
      </button>
    </div>
  );
}
