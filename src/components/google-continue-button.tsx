'use client'

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/user-service';
import Image from 'next/image';
import './google-continue-button.css';

export default function GoogleContinueButton() {
    const router = useRouter();

    const continueWithGoogle = async () => {
        /*
         * Displays googles login page in a pop up and handles the result
         * It runs the same for a sign up, so we only need one function for this
        */
        signInWithPopup(auth, provider).then((_result) => {
            // Add user to the firestore database
            return createUser(_result.user);
        }).then(() => {
            // Return to home page if/when authentication is successful
            router.push('/');
        }).catch((err) => {
            console.error(err.message);
        });
    };

    return (
        <button className="google-btn">
            <Image
             onClick={continueWithGoogle}
             src="ctn_with_google_btn_neutral.svg"
             width="200"
             height="40"
             alt="Continue with Google">
            </Image>
        </button>
    );
}
