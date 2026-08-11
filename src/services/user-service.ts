import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db, provider } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, User, signOut } from 'firebase/auth';
import { SigninFormData, SignupFormData } from '@/types/auth';
import { UserAccount } from '@/types/user-account';
import { FirebaseError } from 'firebase/app';

// Adds the user to firestore database
async function createUser(user: User) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      accountId: user.uid,
      dateCreated: serverTimestamp(),
      displayName: user.displayName,
      email: user.email,
    },
    { merge: true }
  ).then(async () => {
    await setDoc(doc(db, 'backlog', user.uid), {
      taskCount: 0
    }).then(async () => {
      let backlogRef = doc(db, 'backlog', user.uid);
      let tasksRef = collection(backlogRef, 'tasks');
      await addDoc(tasksRef, {
        initialized: true,
        createdAt: serverTimestamp()
      });
    })
  }).then(async () => {
    await setDoc(doc(db, 'foretab', user.uid), {
      active: true,
      completeMethod: "check",
      durationWeeks: 3,
      taskCount: 0
    }).then(async () => {
      let foretabRef = doc(db, 'foretab', user.uid);
      let tasksRef = collection(foretabRef, 'tasks');
      await addDoc(tasksRef, {
        initialized: true,
        createdAt: serverTimestamp()
      });
    })
  }).then(async () => {
    await setDoc(doc(db, 'history', user.uid), {
      taskCount: 0
    }).then(async () => {
      let historyRef = doc(db, 'history', user.uid);
      let tasksRef = collection(historyRef, 'tasks');
      await addDoc(tasksRef, {
        initialized: true,
        createdAt: serverTimestamp()
      });
    })
  }).catch((err: FirebaseError) => {
    throw new Error(err.message);
  })
}

// Used to convert the firebase user object to a UserAccount
export async function getUserDoc(accountId: string): Promise<UserAccount> {
  let user = await getDoc(doc(db, 'users', accountId));
  return user.data() as UserAccount;
}

// Displays googles login page in a pop up and handles the result
export async function signInWithGoogle(): Promise<{
  success: boolean;
  message: string;
}> {
  return signInWithPopup(auth, provider)
    .then(async (_result) => {
      let userSnapshot = await getDoc(doc(db, 'users', _result.user.uid));
      if (!userSnapshot.exists()) {
        await createUser(_result.user);
      }
      return { success: true, message: 'Sign in with Google successful. ' };
    })
    .catch(() => {
      return {
        success: false,
        message: 'Google sign in failed. Please try again.',
      };
    });
}

export async function createUserWithSignupForm(data: SignupFormData): Promise<{ success: boolean; message: string }> {
  return createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (_result) => {
      let userSnapshot = await getDoc(doc(db, 'users', _result.user.uid));
      if (!userSnapshot.exists()) {
        await createUser(_result.user);
      }
      return { success: true, message: 'User successfully created.' };
    })
    .catch((err: FirebaseError) => {
      // This is the only error that won't be checked until the user submits the signup form
      if (err.code === 'auth/email-already-in-use') {
        return {
          success: false,
          message: 'The email address is already in use by another account.',
        };
      }
      return { success: false, message: err.code };
    });
}

export async function userSignin(data: SigninFormData): Promise<{ success: boolean; message: string }> {
  return signInWithEmailAndPassword(auth, data.email, data.password)
    .then(async (_result) => {
      return { success: true, message: 'User successfully signed in.' };
    })
    .catch((err: FirebaseError) => {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        return { success: false, message: 'Invalid email or password.' };
      }
      return { success: false, message: err.code };
    });
}

export async function userSignout(): Promise<Boolean> {
  try {
    await signOut(auth);
  } catch (err) {
    throw new Error(`Sign out error: ${err}`);
  }

  return true;
}
