
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { authApi } from '@/utils/api';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.register(values.name, values.email, values.password);
      
      if (response.success) {
        toast.success('Registration successful!');
        
        // Redirect to papers page
        navigate('/papers');
      } else {
        // Handle different types of errors
        if (response.error?.includes('duplicate') || response.error?.includes('already registered')) {
          toast.error('This email is already registered. Try signing in.');
        } else if (response.error?.includes('invalid email')) {
          toast.error('Please enter a valid email address.');
        } else if (response.error?.includes('weak password')) {
          toast.error('Password is too weak. Please use a stronger password.');
        } else {
          toast.error(response.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with an error (e.g., validation error)
        toast.error(error.response.data?.message || 'Server error. Please try again.');
      } else if (error.request) {
        // Request was made but no response received (Network issue)
        toast.error('Network error. Please check your connection.');
      } else {
        // Other unexpected errors
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-[#FAFBF6]">
        <Card className="w-full max-w-md bg-white rounded-2xl border border-[#E3E9E2] shadow-sm hover:shadow-md px-6 md:px-8 py-8 md:py-10">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center text-[#384B47]">Register</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Create your free account to access JEE Mains practice papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#384B47] font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="rounded-lg border border-[#E3E9E2] bg-[#F7FAF7] text-[#1A2B2E] placeholder-gray-400 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#384B47] font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="rounded-lg border border-[#E3E9E2] bg-[#F7FAF7] text-[#1A2B2E] placeholder-gray-400 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#384B47] font-medium">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="rounded-lg border border-[#E3E9E2] bg-[#F7FAF7] text-[#1A2B2E] placeholder-gray-400 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#384B47] font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="rounded-lg border border-[#E3E9E2] bg-[#F7FAF7] text-[#1A2B2E] placeholder-gray-400 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-[#5BB98C] text-white rounded-lg hover:bg-[#4CA97A] font-semibold text-lg py-3 transition" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                      Registering...
                    </span>
                  ) : (
                    'Register'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#5BB98C] hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
