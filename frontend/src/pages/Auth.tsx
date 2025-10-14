import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // COMMENTED OUT: Authentication logic disabled
  // const handleEmailAuth = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     if (isLogin) {
  //       await signIn(email, password);
  //       toast({ title: 'Welcome back!', description: 'Successfully signed in.' });
  //     } else {
  //       if (password !== confirmPassword) {
  //         toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
  //         return;
  //       }
  //       if (password.length < 6) {
  //         toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
  //         return;
  //       }
  //       await signUp(email, password);
  //       toast({ title: 'Account created!', description: 'Welcome to ThermoFusion Lab.' });
  //     }
  //     navigate('/dashboard');
  //   } catch (error: any) {
  //     toast({
  //       title: 'Authentication Error',
  //       description: error.message || 'An error occurred',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // COMMENTED OUT: Google authentication disabled
  // const handleGoogleAuth = async () => {
  //   setLoading(true);
  //   try {
  //     await signInWithGoogle();
  //     toast({ title: 'Success!', description: 'Signed in with Google.' });
  //     navigate('/dashboard');
  //   } catch (error: any) {
  //     toast({
  //       title: 'Google Sign-In Error',
  //       description: error.message || 'An error occurred',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <Logo className="mb-4 justify-center" />
          </div>

          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome</CardTitle>
              <CardDescription>Sign in to access your super-resolution workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  {/* COMMENTED OUT: Login form disabled */}
                  {/* <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full btn-glow" disabled={loading || !isFirebaseConfigured}>
                      <LogIn className="mr-2 h-4 w-4" />
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form> */}
                  <div className="text-center text-muted-foreground">
                    Login functionality is currently disabled
                  </div>
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  {/* COMMENTED OUT: Registration form disabled */}
                  {/* <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full btn-glow" disabled={loading || !isFirebaseConfigured}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form> */}
                  <div className="text-center text-muted-foreground">
                    Registration functionality is currently disabled
                  </div>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* COMMENTED OUT: Google sign-in button disabled */}
              {/* <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleAuth}
                disabled={loading || !isFirebaseConfigured}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button> */}
              <div className="text-center text-muted-foreground">
                Google sign-in is currently disabled
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
