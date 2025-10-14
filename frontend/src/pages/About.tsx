import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Satellite, Zap, Target } from 'lucide-react';

export default function About() {
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
            <h1 className="mb-2 text-4xl font-bold">About ThermoFusion Lab</h1>
            <p className="text-muted-foreground">Advanced thermal super-resolution for Earth observation</p>
          </div>

          {/* Mission */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                ThermoFusion Lab is part of the ISRO Super-Resolution Initiative, aimed at advancing thermal 
                infrared imaging capabilities for Earth observation satellites. By leveraging optical guidance 
                and state-of-the-art deep learning techniques, we enable unprecedented detail in thermal imagery, 
                supporting applications in climate monitoring, agriculture, urban planning, and disaster response.
              </p>
            </CardContent>
          </Card>

          {/* Technology */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>The Technology</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Our super-resolution approach combines optical and thermal imagery through a fusion-based 
                deep learning architecture. The optical image provides high-frequency spatial details that 
                guide the enhancement of the lower-resolution thermal data.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <h3 className="mb-2 font-bold">Multi-Scale Fusion</h3>
                  <p className="text-sm text-muted-foreground">
                    Hierarchical feature extraction from both optical and thermal domains
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <h3 className="mb-2 font-bold">Attention Mechanisms</h3>
                  <p className="text-sm text-muted-foreground">
                    Adaptive weighting of spatial and channel-wise features
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <h3 className="mb-2 font-bold">Residual Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    Progressive refinement of thermal detail at multiple scales
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <h3 className="mb-2 font-bold">Perceptual Loss</h3>
                  <p className="text-sm text-muted-foreground">
                    Training objectives that preserve semantic structure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ISRO Partnership */}
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-primary" />
                <CardTitle>ISRO Partnership</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                This project is developed in collaboration with the Indian Space Research Organisation (ISRO) 
                as part of their ongoing efforts to enhance satellite imaging capabilities. The super-resolution 
                techniques developed here will contribute to ISRO's Earth observation missions, providing 
                scientists and researchers with higher-quality thermal data for critical applications.
              </p>
              <p className="text-sm text-muted-foreground">
                Special thanks to ISRO's Satellite Applications Centre and the Space Applications Centre 
                for their guidance and dataset contributions.
              </p>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Acknowledgements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This project was developed using modern web technologies including React, TypeScript, 
                TailwindCSS, and shadcn/ui for the frontend, with a FastAPI backend powered by PyTorch 
                for deep learning inference. Authentication and storage are managed through Firebase.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['React', 'TypeScript', 'FastAPI', 'PyTorch', 'Firebase', 'TailwindCSS'].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
