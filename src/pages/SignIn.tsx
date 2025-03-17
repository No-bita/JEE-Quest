
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
import { authApi, useMockApi, mockStorageApi } from '@/utils/api';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const useMock = useMockApi();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      let response;
      
      if (useMock) {
        // Use mock implementation for development
        response = await mockStorageApi.login(values.email, values.password);
      } else {
        // Use real API for production
        response = await authApi.login(values.email, values.password);
      }
      
      if (response.success) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
          toast.success('Logged in as admin');
        } else {
          toast.success('Logged in successfully');
        }
        
        // Redirect to papers page
        navigate('/papers');
      } else {
        toast.error(response.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Admin demo credentials: admin@example.com / admin123
            </div>
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default SignIn;
