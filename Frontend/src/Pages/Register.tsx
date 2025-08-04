import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { registerUser } from '../Services/api';

type RegisterFormInputs = {
  email: string;
  password: string;
  username: string;
  phone: string;
  gender: string;
};

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await registerUser(data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <div>
    <label className="block text-sm font-medium">Username</label>
    <Input
      type="text"
      {...register('username', { required: 'Username is required' })}
    />
    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium">Phone</label>
    <Input
      type="text"
      {...register('phone', { required: 'Phone is required' })}
    />
    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium">Gender</label>
    <select {...register('gender', { required: 'Gender is required' })} className="w-full border p-2 rounded">
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
  </div>

  <div>
    <label className="block text-sm font-medium">Password</label>
    <Input
      type="password"
      {...register('password', {
        required: 'Password is required',
        minLength: { value: 6, message: 'Password must be at least 6 characters' },
      })}
    />
    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
  </div>

  <Button type="submit">Register</Button>
</form>

        </CardContent>
      </Card>
    </div>
  );
};

export default Register;