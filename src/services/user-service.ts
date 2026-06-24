import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, provider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, User } from 'firebase/auth';
import { SignupFormData } from '@/types/auth';
import { FirebaseError } from 'firebase/app';

// Adds the user to firestore database
export async function createUserDoc(user: User) {
    return setDoc(doc(db, 'users', user.uid), {
        accountId: user.uid,
        dateCreated: serverTimestamp(),
        displayName: user.displayName,
        email: user.email
    }, { merge: true });
}

// Displays googles login page in a pop up and handles the result
export async function signInWithGoogle(): Promise<{ success: boolean; message: string; }> {
    return signInWithPopup(auth, provider).then(async(_result) => {
        await createUserDoc(_result.user);
        return { success: true, message: 'Sign in with Google successful. '};
    }).catch(() => {
        return { success: false, message: 'Google sign in failed. Please try again.' };
    });
}

export async function createUserWithSignupForm(data: SignupFormData): Promise<{ success: boolean; message: string; }> {
    return createUserWithEmailAndPassword(auth, data.email, data.password).then(async(_result) => {
        await createUserDoc(_result.user);
        return { success: true, message: 'User successfully created.' };
    }).catch((err: FirebaseError) => {
        // This is the only error that won't be checked until the user submits the signup form
        if(err.code === 'auth/email-already-in-use') {
            return { success: false, message: 'The email address is already in use by another account.' };
        }
        return { success: false, message: err.code };
    });
}