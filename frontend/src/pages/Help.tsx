import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();

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
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold">Help & Documentation</h1>
            <p className="text-muted-foreground">Everything you need to know about ThermoFusion Lab</p>
          </div>

          {/* FAQ */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                  <AccordionContent>
                    ThermoFusion supports common image formats including JPEG, PNG, TIFF, and BMP.
                    For best results, we recommend using uncompressed formats like PNG or TIFF.
                    Images should ideally be between 512x512 and 4096x4096 pixels.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I prepare my images?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>Ensure optical and thermal images are spatially aligned</li>
                      <li>Use high-quality source images for better results</li>
                      <li>Avoid heavily compressed or noisy images</li>
                      <li>Thermal images should be in grayscale or false-color format</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What do the quality metrics mean?</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      <li><strong>PSNR (Peak Signal-to-Noise Ratio):</strong> Higher values indicate better quality. Typically 30-50 dB.</li>
                      <li><strong>SSIM (Structural Similarity Index):</strong> Ranges from 0 to 1. Values closer to 1 indicate better structural preservation.</li>
                      <li><strong>RMSE (Root Mean Square Error):</strong> Lower values indicate less deviation from the reference.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How long does processing take?</AccordionTrigger>
                  <AccordionContent>
                    Processing time depends on image size and upscale factor:
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                      <li>2x upscaling: 1-3 minutes</li>
                      <li>4x upscaling: 3-7 minutes</li>
                      <li>8x upscaling: 7-15 minutes</li>
                    </ul>
                    Larger images and GPU availability can affect processing time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What if my job fails?</AccordionTrigger>
                  <AccordionContent>
                    Common reasons for job failures include:
                    <ul className="mt-2 list-disc space-y-1 pl-6">
                      <li>Image size mismatch between optical and thermal</li>
                      <li>Corrupted or invalid image files</li>
                      <li>Server processing limits exceeded</li>
                    </ul>
                    Check the error message and try again with properly formatted images. If issues persist, contact support.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <CardTitle>Need More Help?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Can't find what you're looking for? Our team is here to help.
              </p>
              <Button className="btn-glow">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• ISRO Challenge Documentation</li>
                <li>• Research Paper on Thermal Super-Resolution</li>
                <li>• Sample Dataset Download</li>
                <li>• API Documentation (Coming Soon)</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
