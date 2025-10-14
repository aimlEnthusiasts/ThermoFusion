import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { ArrowLeft, Upload as UploadIcon, FileImage, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIResult {
  psnr: number;
  ssim: number;
  rmse: number;
  confidence: number;
  visualization: string;
}

export default function Upload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tifFile, setTifFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (file && (file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff'))) {
      setTifFile(file);
      
      // For TIF files, we'll show a placeholder since browsers can't display them directly
      // The actual preview will be shown after AI processing
      setPreviewUrl(null);
      
      toast({
        title: 'File selected',
        description: `${file.name} is ready for processing`,
      });
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please select a TIF or TIFF file',
        variant: 'destructive',
      });
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setTifFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tifFile) {
      toast({
        title: 'Missing file',
        description: 'Please select a TIF file to process',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setProgress(20);

    try {
      setProgress(50);

      const response = await api.inferTif(tifFile);
      
      setProgress(100);
      setAiResult(response.data);
      
      toast({
        title: 'Processing complete!',
        description: 'Your TIF file has been processed successfully.',
      });
      
      setTimeout(() => {
        navigate('/dashboard', { state: { aiResult: response.data, tifFile: tifFile.name } });
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Processing failed',
        description: error.response?.data?.error || 'Failed to process TIF file. Please try again.',
        variant: 'destructive',
      });
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

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
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold">Process TIF File</h1>
            <p className="text-muted-foreground">Upload your TIF file for AI-powered thermal super-resolution processing</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>TIF File Upload</CardTitle>
              <CardDescription>Upload a TIF file to process with our AI model</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* TIF File Upload with Drag & Drop */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    TIF File Upload
                  </Label>
                  
                  {/* Drag and Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".tif,.tiff"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {tifFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <FileImage className="h-8 w-8 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">{tifFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(tifFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* File Preview Placeholder */}
                        <div className="mt-4">
                          <div className="h-32 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                            <div className="text-center">
                              <FileImage className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                TIF file selected
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Preview will be shown after AI processing
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">
                            Drop your TIF file here
                          </p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse files
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: .tif, .tiff files
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="space-y-2">
                    <Label>Processing Progress</Label>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI model is processing your file...
                    </div>
                  </div>
                )}

                {/* AI Results Preview */}
                {aiResult && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold">Processing Results:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">PSNR:</span> {aiResult.psnr}
                      </div>
                      <div>
                        <span className="font-medium">SSIM:</span> {aiResult.ssim}
                      </div>
                      <div>
                        <span className="font-medium">RMSE:</span> {aiResult.rmse}
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span> {(aiResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-glow"
                  disabled={uploading || !tifFile}
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-5 w-5" />
                      Process TIF File
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
