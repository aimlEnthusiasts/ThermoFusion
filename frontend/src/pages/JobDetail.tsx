import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { ArrowLeft, Download, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobData {
  id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  created_at: string;
  optical_url?: string;
  thermal_url?: string;
  result_url?: string;
  error_message?: string;
  metrics?: {
    psnr: number;
    ssim: number;
    rmse: number;
  };
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
    
    // Poll for updates if job is running
    let interval: NodeJS.Timeout;
    if (job?.status === 'running' || job?.status === 'queued') {
      interval = setInterval(loadJob, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, job?.status]);

  const loadJob = async () => {
    try {
      const response = await api.getJob(id!);
      setJob(response.data);
    } catch (error) {
      toast({
        title: 'Error loading job',
        description: 'Could not fetch job details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await api.getFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download file',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = () => {
    if (!job) return null;
    switch (job.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="shadow-lg text-center">
            <CardContent className="py-12">
              <h2 className="mb-2 text-2xl font-bold">Job Not Found</h2>
              <p className="mb-4 text-muted-foreground">The requested job could not be found</p>
              <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Logo className="ml-4" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="mb-2 text-2xl">Job #{job.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(job.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                    {getStatusIcon()}
                    <span className="font-bold">{job.status.toUpperCase()}</span>
                  </Badge>
                  {job.status === 'completed' && (
                    <Button className="btn-glow" onClick={() => handleDownload(job.result_url!, 'enhanced.png')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Processing Status */}
          {(job.status === 'running' || job.status === 'queued') && (
            <Card className="shadow-lg border-primary">
              <CardContent className="flex items-center justify-center gap-4 py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div>
                  <p className="text-lg font-bold">Processing your images...</p>
                  <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {job.status === 'failed' && (
            <Card className="shadow-lg border-destructive">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 shrink-0 text-destructive" />
                  <div>
                    <p className="mb-2 font-bold">Processing Failed</p>
                    <p className="text-sm text-muted-foreground">{job.error_message || 'An unknown error occurred'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Viewer */}
          {job.status === 'completed' && (
            <>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Image Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="optical" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="optical">Optical</TabsTrigger>
                      <TabsTrigger value="thermal">Thermal</TabsTrigger>
                      <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value="optical" className="mt-6">
                      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={job.optical_url}
                          alt="Optical"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="thermal" className="mt-6">
                      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={job.thermal_url}
                          alt="Thermal"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="enhanced" className="mt-6">
                      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                          src={job.result_url}
                          alt="Enhanced"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Metrics */}
              {job.metrics && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
                        <p className="mb-1 text-sm text-muted-foreground">PSNR</p>
                        <p className="text-3xl font-bold text-primary">{job.metrics.psnr.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">dB</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
                        <p className="mb-1 text-sm text-muted-foreground">SSIM</p>
                        <p className="text-3xl font-bold text-primary">{job.metrics.ssim.toFixed(4)}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
                        <p className="mb-1 text-sm text-muted-foreground">RMSE</p>
                        <p className="text-3xl font-bold text-primary">{job.metrics.rmse.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
