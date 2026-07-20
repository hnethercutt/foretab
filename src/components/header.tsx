'use client'
import { userSignout } from '@/services/user-service';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/hooks/use-loading';
import { useRouter } from 'next/navigation';

export default function Header() {
   const router = useRouter();
    const { withLoading } = useLoading();

    const currentUser = async() => {
      return await withLoading(async () => useAuth());
    }

  function handleLogout() {
    userSignout().then(function(_result) {
      if(_result) {
        // Router wasn't working here
        window.location.reload();
      }
    });
  }

  return (
    <div>
        <p>Foretab</p>
        {currentUser() !== null ? (
            <div><button onClick={handleLogout}>log out</button></div>
        ) : (
            <div>
                <button onClick={() => router.push('/signin')}>Sign in</button>
                <button onClick={() => router.push('/signup')}>Sign up</button>
            </div>
        )}
    </div>
  )
}