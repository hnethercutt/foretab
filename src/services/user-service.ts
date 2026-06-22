import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, provider } from '@/lib/firebase';
import { signInWithPopup, User } from 'firebase/auth';

// Adds the user to firestore database
export async function createUser(user: User) {
    // A new user doc is only created if one doesn't already exists with the given uid
    await setDoc(doc(db, 'users', user.uid), {
        accountId: user.uid,
        dateCreated: serverTimestamp(),
        displayName: user.displayName,
        email: user.email
    }, { merge: true });
}

/*
* Displays googles login page in a pop up and handles the result
* It runs the same for a sign up, so we only need one function for this
*/
export async function signInWithGoogle() {
    signInWithPopup(auth, provider).then((_result) => {
        return createUser(_result.user);
    }).catch((err) => {
        console.error(err.message);
    });
}