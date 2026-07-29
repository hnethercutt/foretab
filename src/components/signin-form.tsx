'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Tooltip } from '@mui/material';
import { SigninFormData } from '@/types/auth';
import { userSignin } from '@/services/user-service';
import { useLoading } from '@/hooks/use-loading';
import _ from 'lodash';

export default function SignupForm() {
  const router = useRouter();
  const { withLoading } = useLoading();

  const [signinFormData, setSigninFormData] = useState<SigninFormData>({
    email: '',
    password: ''
  });

  const [signinFormError, setSigninFormError] = useState('');

  // Display the correct show/hide password icon
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const togglePasswordVisibility = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordIsVisible(!passwordIsVisible);
  };

  // Update the data for the selected form whenever a user clicks out of it
  const updateFormData = async(e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Writes over the data stored at previous entered key for the specific form
    setSigninFormData((prevSigninFormData) => ({
      ...prevSigninFormData,
      [name]: value,
    }));

    // Resets the show/hide password button if user erases all of their input
    if (name === 'password' && value === '') {
      setPasswordIsVisible(false);
    }
  };

  const continueBtnClicked = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    let result = await withLoading(() => userSignin(signinFormData));
    if(result.success) {
      router.push('/');
    } else {
      setSigninFormError(result.message);
    }
  };

  return (
    <div>
      {signinFormError && <div>{signinFormError}</div>}
      <form onSubmit={continueBtnClicked}>
        <div>
          <label>Email*</label>
          <input
            name="email"
            id="email"
            value={signinFormData.email}
            autoComplete="email"
            onChange={updateFormData}
          ></input>
        </div>
        <div>
          <label>Password*</label>
          <input
            name="password"
            id="password"
            value={signinFormData.password}
            type={passwordIsVisible ? 'input' : 'password'}
            autoComplete="new-password"
            onChange={updateFormData}
          ></input>
          {signinFormData.password && (
            <Tooltip
              title={passwordIsVisible ? 'Hide Password' : 'Show Password'}
            >
              <button onClick={togglePasswordVisibility} tabIndex={-1}>
                {passwordIsVisible ? <EyeOff /> : <Eye />}
              </button>
            </Tooltip>
          )}
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
