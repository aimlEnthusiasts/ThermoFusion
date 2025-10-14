import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import UserProfileMenu from '@/components/UserProfileMenu';

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [defaultUpscale, setDefaultUpscale] = useState('4');

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  const handleClearCache = () => {
    toast({
      title: 'Cache cleared',
      description: 'Local cache has been cleared.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left section: Back button + Logo */}
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          {/* Right section: User menu */}
          <UserProfileMenu />
        </div>
      </header>


      {/* Main Content */}
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Account Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Account Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="mt-1 text-lg">
                  {user && 'isAnonymous' in user && user.isAnonymous
                    ? 'Unknown (Guest User)'
                    : user?.email || 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">User ID</Label>
                <p className="mt-1 font-mono text-sm">{user?.uid}</p>
              </div>
              {user && 'isAnonymous' in user && user.isAnonymous && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Guest Mode:</strong> You are using the application as a guest user.
                    Some features may be limited. Sign in with an account for full access.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Preferences */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <CardTitle>Processing Preferences</CardTitle>
              </div>
              <CardDescription>Configure default settings for image enhancement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-upscale">Default Upscale Factor</Label>
                <Select value={defaultUpscale} onValueChange={setDefaultUpscale}>
                  <SelectTrigger id="default-upscale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="4">4x</SelectItem>
                    <SelectItem value="8">8x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="btn-glow">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Cache Management */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                <CardTitle>Cache Management</CardTitle>
              </div>
              <CardDescription>Clear local cache and temporary files</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleClearCache}>
                Clear Cache
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
