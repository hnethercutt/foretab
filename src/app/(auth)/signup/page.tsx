'use client';
import styles from '../auth.module.css';
import Form from 'next/form';
import GoogleContinueButton from '@/components/google-continue-button';
import { useState } from 'react';

export default function Signup() {
  interface SignupForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  type SignUpFormField = keyof SignupForm;

  const [signUpFormData, setSignUpFormData] = useState<SignupForm>({
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

  // Update the data for the selected form whenever a user clicks out of it
  const updateFormData = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Writes over the data stored at previous entered key for the specific form
    setSignUpFormData((prevSignUpFormData) => ({
      ...prevSignUpFormData,
      [name] : value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name] : ''
    }));
  };

  // For  validating email is in the correct format and password meets the requirements
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,16}$/;

  // Used to determine what the error message (if any) should be for each form
  const formValidators: Record<SignUpFormField, string> = {
    firstName: signUpFormData.firstName === '' ? 'First name is required' : '',
    lastName: signUpFormData.lastName === '' ? 'Last name is required' : '',
    email: signUpFormData.email === '' ? 'Email is required' : (!emailRegex.test(signUpFormData.email) ? 'Please enter a valid email address' : ''),
    password: signUpFormData.password === '' ? 'Password is required' : (!passwordRegex.test(signUpFormData.password) ?
    'Password must be between 8 and 16 characters long and contain at least one uppercase letter, one digit and one special character with no whitespace' : ''),
    confirmPassword: signUpFormData.password !== signUpFormData.confirmPassword ? 'Passwords do not match' : ''
  };

  const validateForm = async(e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.target.name as SignUpFormField;

     setErrors((prevErrors) => ({
      ...prevErrors,
      // Check for an error for this specific form
      [name] : formValidators[name]
    }));
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
              value={signUpFormData.firstName}
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
              value={signUpFormData.lastName}
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
              value={signUpFormData.email}
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
              value={signUpFormData.password}
              autoComplete="new-password"
              onChange={updateFormData}
              onBlur={validateForm}
            ></input>
          </div>
          {errors.password && <div>{errors.password}</div>}
          <div>
            <label>Confirm Password*</label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              value={signUpFormData.confirmPassword}
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
