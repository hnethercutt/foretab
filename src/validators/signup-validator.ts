import { SignupFormData } from '@/types/auth';

export function validateAllSignupForms(data: SignupFormData) {
  // For validating email is in the correct format and password meets the requirements
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s])(?!.*\s).{8,16}$/;

  // Determine what the error message (if any) should be for each form
  return {
    firstName: data.firstName === '' ? 'First name is required' : '',
    lastName: data.lastName === '' ? 'Last name is required' : '',
    email:
      data.email === ''
        ? 'Email is required'
        : !emailRegex.test(data.email)
          ? 'Please enter a valid email address'
          : '',
    password:
      data.password === ''
        ? 'Password is required'
        : !passwordRegex.test(data.password)
          ? 'Password must be between 8 and 16 characters long and contain at least one uppercase letter, one digit and one special character with no whitespace'
          : '',
    confirmPassword:
      data.password !== data.confirmPassword ? 'Passwords do not match' : '',
  };
}
