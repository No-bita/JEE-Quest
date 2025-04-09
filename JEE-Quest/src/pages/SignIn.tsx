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

// Define API types for better type safety
interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    paid: boolean;
  };
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: 'Failed to login' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error' };
  }
};

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

// Witty loading messages
const loadingMessages = [
  "Brewing your digital identity...",
  "Convincing the server you're awesome...",
  "Patience is a virtue. Loading is a necessity.",
  "Warming up the welcome committee...",
  "Time flies when you're watching loading spinners...",
  "Making digital magic happen...",
  "Your request is important to us. No, really!",
  "Connecting the dots and crossing the t's...",
];

const SignIn: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    // Set a random witty message
    setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    
    try {
      const response = await loginUser(values.email, values.password);
      
      if (response.token && response.user) {
        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        localStorage.setItem('userName', response.user.name);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userId', response.user.id);
        
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        if (response.user.role === 'admin') {
          toast.success('Logged in as admin');
          localStorage.setItem('isAdmin', 'true');
        } else {
          toast.success('Logged in successfully');
          localStorage.setItem('isAdmin', 'false');
        }

        if (response.user.paid) {
          localStorage.setItem('hasSubscription', 'true');
        } else {
          localStorage.setItem('hasSubscription', 'false');
        }
        
        navigate("/papers");   
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
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                      <span>{loadingMessage}</span>
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
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