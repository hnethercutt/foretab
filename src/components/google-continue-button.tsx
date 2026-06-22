'use client'
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/services/user-service';
import Image from 'next/image';
import './google-continue-button.css';

export default function GoogleContinueButton() {
    const router = useRouter();

    const continueWithGoogle = async () => {
        signInWithGoogle().then(() => {
            router.push('/');
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
