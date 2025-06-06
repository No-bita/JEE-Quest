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
import Lottie from 'lottie-react';
import loadAnimationData from '../load.json';

// Define API types for better type safety
interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;

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
      return { error: 'Please check your email or password' };
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
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-[#FAFBF6] dark:bg-gray-950">
        <Card className="w-full max-w-md bg-white dark:bg-[#23272F] rounded-2xl border border-[#E3E9E2] dark:border-gray-700 shadow-sm dark:shadow-2xl hover:shadow-md px-6 md:px-8 py-8 md:py-10">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center text-[#384B47] dark:text-gray-100">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
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
                      <FormLabel className="text-[#384B47] dark:text-gray-200 font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} className="rounded-lg border border-[#E3E9E2] dark:border-gray-700 bg-[#F7FAF7] dark:bg-gray-900 text-[#1A2B2E] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
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
                      <FormLabel className="text-[#384B47] dark:text-gray-200 font-medium">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="rounded-lg border border-[#E3E9E2] dark:border-gray-700 bg-[#F7FAF7] dark:bg-gray-900 text-[#1A2B2E] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#5BB98C] focus:border-[#5BB98C]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-[#5BB98C] dark:text-green-400 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full bg-[#5BB98C] dark:bg-green-500 text-white dark:text-gray-900 rounded-lg hover:bg-[#4CA97A] dark:hover:bg-green-400 font-semibold text-lg py-3 transition" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2 h-6 w-6">
                        <Lottie animationData={loadAnimationData} loop={true} style={{height: 24, width: 24}} />
                      </span>
                      <span className="text-sm">{loadingMessage}</span>
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 mt-4 border-t border-[#E3E9E2] dark:border-gray-700 pt-4">
            <div className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#5BB98C] dark:text-green-400 hover:underline font-medium">
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