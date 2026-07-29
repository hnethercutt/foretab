'use client';

import Form from 'next/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Tooltip } from '@mui/material';
import { validateAllSignupForms } from '@/validators/signup-validator';
import { SignupFormData } from '@/types/auth';
import { createUserWithSignupForm } from '@/services/user-service';
import _ from 'lodash';

export default function SignupForm() {
  const router = useRouter();

  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [signupFormErrors, setSignupFormErrors] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Display the correct show/hide password icon
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const togglePasswordVisibility = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordIsVisible(!passwordIsVisible);
  };

  // Update the data for the selected form whenever a user clicks out of it
  const updateFormData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Writes over the data stored at previous entered key for the specific form
    setSignupFormData((prevSignupFormData) => ({
      ...prevSignupFormData,
      [name]: value,
    }));

    setSignupFormErrors((prevSignupFormErrors) => ({
      ...prevSignupFormErrors,
      [name]: '',
    }));

    // Resets the show/hide password button if user erases all of their input
    if (name === 'password' && value === '') {
      setPasswordIsVisible(false);
    }
  };

  // Check for an error for a form field when a user clicks off of it.
  const validateForm = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    let name = e.target.name as keyof SignupFormData;

    // Prevents displaying errors when simply clicking the show/hide password button
    if (!e.relatedTarget || !e.relatedTarget.ariaLabel ||
       (e.relatedTarget.ariaLabel && !e.relatedTarget.ariaLabel.toLowerCase().includes('password'))) {
      let errors = validateAllSignupForms(signupFormData);
      /*
       * Validator returns errors for all forms, but we only want to display the error message for this specific field
       * Prevents error messages from displaying prematurely and also prevents them from disappearing when a user starts typing in a different field
       */
      setSignupFormErrors((prevSignupFormErrors) => ({
        ...prevSignupFormErrors,
        [name]: errors[name],
      }));
    }
  };

  // Check for errors for all form fields when a user submits the form
  function validateAllForms() {
    let errors = validateAllSignupForms(signupFormData);

    _.forEach(signupFormData, (value, key) => {
      // Ensures if a user clicks the continue button without ever typing in a field, ALL errors will display on submit
      if (value === '') {
        let name = key as keyof SignupFormData;
        setSignupFormErrors((prevSignupFormErrors) => ({
          ...prevSignupFormErrors,
          [name]: errors[name],
        }));
      }
    });
  }

  const continueBtnClicked = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateAllForms();
    let allFormsValid = _.every(signupFormErrors, (value) => value === '');

    if (allFormsValid) {
      createUserWithSignupForm(signupFormData).then(function (_result) {
        if (!_result.success && _result.message.startsWith('The email')) {
          setSignupFormErrors((prevSignupFormErrors) => ({
            ...prevSignupFormErrors,
            email: _result.message,
          }));
        } else {
          router.push('/');
        }
      });
    }
  };

  return (
    <div>
      <form onSubmit={continueBtnClicked}>
        <div>
          <label>First Name*</label>
          <input
            name="firstName"
            id="firstName"
            value={signupFormData.firstName}
            onChange={updateFormData}
            onBlur={validateForm}
          ></input>
        </div>
        {signupFormErrors.firstName && <div>{signupFormErrors.firstName}</div>}
        <div>
          <label>Last Name*</label>
          <input
            name="lastName"
            id="lastName"
            value={signupFormData.lastName}
            onChange={updateFormData}
            onBlur={validateForm}
          ></input>
        </div>
        {signupFormErrors.lastName && <div>{signupFormErrors.lastName}</div>}
        <div>
          <label>Email*</label>
          <input
            name="email"
            id="email"
            value={signupFormData.email}
            onChange={updateFormData}
            onBlur={validateForm}
          ></input>
        </div>
        {signupFormErrors.email && <div>{signupFormErrors.email}</div>}
        <div>
          <label>Password*</label>
          <input
            name="password"
            id="password"
            value={signupFormData.password}
            type={passwordIsVisible ? 'input' : 'password'}
            autoComplete="new-password"
            onChange={updateFormData}
            onBlur={validateForm}
          ></input>
          {signupFormData.password && (
            <Tooltip
              title={passwordIsVisible ? 'Hide Password' : 'Show Password'}
            >
              <button onClick={togglePasswordVisibility} tabIndex={-1}>
                {passwordIsVisible ? <EyeOff /> : <Eye />}
              </button>
            </Tooltip>
          )}
        </div>
        {signupFormErrors.password && <div>{signupFormErrors.password}</div>}
        <div>
          <label>Confirm Password*</label>
          <input
            name="confirmPassword"
            id="confirmPassword"
            value={signupFormData.confirmPassword}
            type="password"
            onChange={updateFormData}
            onBlur={validateForm}
          ></input>
        </div>
        {signupFormErrors.confirmPassword && (
          <div>{signupFormErrors.confirmPassword}</div>
        )}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
