'use client';
import styles from '../auth.module.css';
import Form from 'next/form';
import GoogleContinueButton from '@/components/google-continue-button';
import { useState } from 'react';

export default function Signup() {
  const [signUpFormData, setSignUpFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Update the data for the selected form whenever a user clicks out of it
  const updateFormData = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Writes over the data stored at previous entered key for the specific form
    setSignUpFormData((prevSignUpFormData) => ({
      ...prevSignUpFormData,
      [name] : value
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
            ></input>
          </div>
          <div>
            <label>Last Name*</label>
            <input
              name="lastName"
              id="lastName"
              value={signUpFormData.lastName}
              onChange={updateFormData}
            ></input>
          </div>
          <div>
            <label>Email*</label>
            <input
              name="email"
              id="email"
              value={signUpFormData.email}
              onChange={updateFormData}
            ></input>
          </div>
          <div>
            <label>Password*</label>
            <input
              name="password"
              id="password"
              value={signUpFormData.password}
              autoComplete="new-password"
              onChange={updateFormData}
            ></input>
          </div>
          <div>
            <label>Confirm Password*</label>
            <input
              name="confirmPassword"
              id="confirmPassword"
              value={signUpFormData.confirmPassword}
              onChange={updateFormData}
            ></input>
          </div>
          <button type="submit">
            Continue
          </button>
        </Form>
      </div>
    </div>
  );
}
