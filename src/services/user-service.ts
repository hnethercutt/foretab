import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export async function createUser(user: User) {
    // A new user doc is only created if one doesn't already exists with the given uid
    await setDoc(doc(db, 'users', user.uid), {
        accountId: user.uid,
        dateCreated: serverTimestamp(),
        displayName: user.displayName,
        email: user.email
    }, { merge: true });
}