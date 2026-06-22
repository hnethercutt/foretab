'use client';
import styles from '../auth.module.css';
import Form from 'next/form';
import GoogleContinueButton from '@/components/google-continue-button';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Tooltip } from '@mui/material';

export default function Signup() {
  interface SignupForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  type SignupFormField = keyof SignupForm;

  const [signupFormData, setSignupFormData] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Display the correct show/hide password icon
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const togglePasswordVisibility = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPasswordIsVisible(!passwordIsVisible);
  };

  // Update the data for the selected form whenever a user clicks out of it
  const updateFormData = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Writes over the data stored at previous entered key for the specific form
    setSignupFormData((prevSignupFormData) => ({
      ...prevSignupFormData,
      [name] : value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name] : ''
    }));

    // Resets the show/hide password button if user erases all of their input
    if(name === 'password' && value === '') {
      setPasswordIsVisible(false);
    }
  };

  // For  validating email is in the correct format and password meets the requirements
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,16}$/;

  // Used to determine what the error message (if any) should be for each form
  const formValidators: Record<SignupFormField, string> = {
    firstName: signupFormData.firstName === '' ? 'First name is required' : '',
    lastName: signupFormData.lastName === '' ? 'Last name is required' : '',
    email: signupFormData.email === '' ? 'Email is required' : (!emailRegex.test(signupFormData.email) ? 'Please enter a valid email address' : ''),
    password: signupFormData.password === '' ? 'Password is required' : (!passwordRegex.test(signupFormData.password) ?
    'Password must be between 8 and 16 characters long and contain at least one uppercase letter, one digit and one special character with no whitespace' : ''),
    confirmPassword: signupFormData.password !== signupFormData.confirmPassword ? 'Passwords do not match' : ''
  };

  const validateForm = async(e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.target.name as SignupFormField;

     // Prevents displaying errors when simply clicking the show/hide password button
    if(!e.relatedTarget || !e.relatedTarget.ariaLabel || (e.relatedTarget.ariaLabel && !e.relatedTarget.ariaLabel.toLowerCase().includes('password')) ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        // Check for an error for this specific form
        [name] : formValidators[name]
      }));
    }
  };

  return (
    <div>
      <GoogleContinueButton />
      <div>
        <Form action="">
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
          {errors.firstName && <div>{errors.firstName}</div>}
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
          {errors.lastName && <div>{errors.lastName}</div>}
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
          {errors.email && <div>{errors.email}</div>}
          <div>
            <label>Password*</label>
            <input
              name="password"
              id="password"
              value={signupFormData.password}
              type={passwordIsVisible ? ("input") : ("password")}
              autoComplete="new-password"
              onChange={updateFormData}
              onBlur={validateForm}
            ></input>
            {signupFormData.password &&
            <Tooltip title={passwordIsVisible ? "Hide Password" : "Show Password"}>
              <button onClick={togglePasswordVisibility} tabIndex={-1}>
                {passwordIsVisible ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>
            </Tooltip>}
          </div>
          {errors.password && <div>{errors.password}</div>}
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
          {errors.confirmPassword && <div>{errors.confirmPassword}</div>}
          <button type="submit">
            Continue
          </button>
        </Form>
      </div>
    </div>
  );
}
