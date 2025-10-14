import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, LogOut, Download, FileImage, BarChart3, Zap, ZoomIn, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserProfileMenu from '@/components/UserProfileMenu';

interface AIResult {
  psnr: number;
  ssim: number;
  rmse: number;
  confidence: number;
  visualization: string;
  final_output?: string;
  individual_visualizations?: {
    predicted_vs_gt: string;
    residual_maps: string;
    edge_analysis: string;
    statistical_analysis: string;
  };
  input_preview?: string; // legacy
  thermal_rgb?: string;
  optical_true_color?: string;
  optical_false_color?: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [tifFileName, setTifFileName] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ src: string, title: string } | null>(null);

  useEffect(() => {
    // Check if we have AI results from upload
    if (location.state?.aiResult) {
      console.log('AI Result received:', location.state.aiResult);
      setAiResult(location.state.aiResult);
      setTifFileName(location.state.tifFile || '');
      setShowResults(true);
    } else {
      console.log('No AI results found in location state');
    }
  }, [location.state]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename;
    link.click();
  };

  const zoomImage = (base64Data: string, title: string) => {
    setZoomedImage({ src: `data:image/png;base64,${base64Data}`, title });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-4">
            <UserProfileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Process TIF files with AI-powered thermal super-resolution</p>
          </div>
          <Link to="/upload">
            <Button size="lg" className="btn-glow">
              <Plus className="mr-2 h-5 w-5" />
              Process TIF File
            </Button>
          </Link>
        </div>

        {/* AI Results Section */}
        {showResults && aiResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Processing Results
                </CardTitle>
                <CardDescription>
                  Results for {tifFileName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Final Output */}
                {aiResult.final_output && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Final Super-Resolved Output
                    </h3>
                    <div className="relative group">
                      <img
                        src={`data:image/png;base64,${aiResult.final_output}`}
                        alt="Final Super-Resolved Output"
                        className="max-w-full h-auto rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => zoomImage(aiResult.final_output!, "Final Super-Resolved Output")}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => zoomImage(aiResult.final_output!, "Final Super-Resolved Output")}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(aiResult.final_output!, `${tifFileName.replace('.tif', '')}_final_output.png`)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Final Output
                      </Button>
                    </div>
                  </div>
                )}

                {/* Input Image Preview */}
                {aiResult.input_preview && !aiResult.optical_true_color && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Input Image Preview
                    </h3>
                    <div className="relative group">
                      <img
                        src={`data:image/png;base64,${aiResult.input_preview}`}
                        alt="Input Image Preview"
                        className="max-w-full h-auto rounded-lg border shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => zoomImage(aiResult.input_preview!, "Input Image Preview")}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => zoomImage(aiResult.input_preview!, "Input Image Preview")}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(aiResult.input_preview!, `${tifFileName.replace('.tif', '')}_input_preview.png`)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Input Preview
                      </Button>
                    </div>
                  </div>
                )}

                {/* New Input Previews: Thermal RGB + Two Optical Images */}
                {(aiResult.thermal_rgb || aiResult.optical_true_color || aiResult.optical_false_color) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Input Previews
                    </h3>
                    <div className="grid gap-6 md:grid-cols-3">
                      {aiResult.thermal_rgb && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Thermal (Pseudo RGB)</CardTitle>
                            <CardDescription>Composed from predicted thermal bands</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="relative group">
                              <img
                                src={`data:image/png;base64,${aiResult.thermal_rgb}`}
                                alt="Thermal RGB"
                                className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => zoomImage(aiResult.thermal_rgb!, "Thermal (Pseudo RGB)")}
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => zoomImage(aiResult.thermal_rgb!, "Thermal (Pseudo RGB)")}>
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => downloadImage(aiResult.thermal_rgb!, `${tifFileName.replace('.tif', '')}_thermal_rgb.png`)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      )}

                      {aiResult.optical_true_color && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Optical True Color</CardTitle>
                            <CardDescription>Bands 4-3-2 (RGB)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="relative group">
                              <img
                                src={`data:image/png;base64,${aiResult.optical_true_color}`}
                                alt="Optical True Color"
                                className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => zoomImage(aiResult.optical_true_color!, "Optical True Color")}
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => zoomImage(aiResult.optical_true_color!, "Optical True Color")}>
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => downloadImage(aiResult.optical_true_color!, `${tifFileName.replace('.tif', '')}_optical_true_color.png`)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      )}

                      {aiResult.optical_false_color && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Optical False Color</CardTitle>
                            <CardDescription>NIR-Red-Green composite</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="relative group">
                              <img
                                src={`data:image/png;base64,${aiResult.optical_false_color}`}
                                alt="Optical False Color"
                                className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => zoomImage(aiResult.optical_false_color!, "Optical False Color")}
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={() => zoomImage(aiResult.optical_false_color!, "Optical False Color")}>
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => downloadImage(aiResult.optical_false_color!, `${tifFileName.replace('.tif', '')}_optical_false_color.png`)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                {/* Individual Visualizations */}
                {aiResult.individual_visualizations && (
                  <div className="space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Detailed Analysis Views
                    </h3>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Predicted vs Ground Truth */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Predicted vs Ground Truth</CardTitle>
                          <CardDescription>Comparison of AI prediction with actual thermal data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative group">
                            <img
                              src={`data:image/png;base64,${aiResult.individual_visualizations.predicted_vs_gt}`}
                              alt="Predicted vs Ground Truth"
                              className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => zoomImage(aiResult.individual_visualizations.predicted_vs_gt, "Predicted vs Ground Truth")}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => zoomImage(aiResult.individual_visualizations.predicted_vs_gt, "Predicted vs Ground Truth")}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => downloadImage(aiResult.individual_visualizations.predicted_vs_gt, `${tifFileName.replace('.tif', '')}_predicted_vs_gt.png`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Residual Maps */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Residual Maps</CardTitle>
                          <CardDescription>Error analysis showing prediction accuracy</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative group">
                            <img
                              src={`data:image/png;base64,${aiResult.individual_visualizations.residual_maps}`}
                              alt="Residual Maps"
                              className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => zoomImage(aiResult.individual_visualizations.residual_maps, "Residual Maps")}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => zoomImage(aiResult.individual_visualizations.residual_maps, "Residual Maps")}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => downloadImage(aiResult.individual_visualizations.residual_maps, `${tifFileName.replace('.tif', '')}_residual_maps.png`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Edge Analysis */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Edge Analysis</CardTitle>
                          <CardDescription>Edge detection and overlay analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative group">
                            <img
                              src={`data:image/png;base64,${aiResult.individual_visualizations.edge_analysis}`}
                              alt="Edge Analysis"
                              className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => zoomImage(aiResult.individual_visualizations.edge_analysis, "Edge Analysis")}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => zoomImage(aiResult.individual_visualizations.edge_analysis, "Edge Analysis")}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => downloadImage(aiResult.individual_visualizations.edge_analysis, `${tifFileName.replace('.tif', '')}_edge_analysis.png`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Statistical Analysis */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Statistical Analysis</CardTitle>
                          <CardDescription>Histogram and scatter plot analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative group">
                            <img
                              src={`data:image/png;base64,${aiResult.individual_visualizations.statistical_analysis}`}
                              alt="Statistical Analysis"
                              className="w-full h-auto rounded border cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => zoomImage(aiResult.individual_visualizations.statistical_analysis, "Statistical Analysis")}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => zoomImage(aiResult.individual_visualizations.statistical_analysis, "Statistical Analysis")}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => downloadImage(aiResult.individual_visualizations.statistical_analysis, `${tifFileName.replace('.tif', '')}_statistical_analysis.png`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Quality Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{aiResult.psnr}</div>
                      <div className="text-sm text-muted-foreground">PSNR</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{aiResult.ssim}</div>
                      <div className="text-sm text-muted-foreground">SSIM</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{aiResult.rmse}</div>
                      <div className="text-sm text-muted-foreground">RMSE</div>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{(aiResult.confidence * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${aiResult.visualization}`;
                      link.download = `${tifFileName.replace('.tif', '')}_processed.png`;
                      link.click();
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Result
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowResults(false)}
                  >
                    Close Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!showResults && (
          <Card className="shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <Plus className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Ready to Process TIF Files</h3>
              <p className="mb-6 text-muted-foreground text-center max-w-md">
                Upload your TIF file to start AI-powered thermal super-resolution processing.
                Our advanced model will enhance your thermal imagery with high-quality results.
              </p>
              <Link to="/upload">
                <Button className="btn-glow" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Process TIF File
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

      </main>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={() => setZoomedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="bg-white rounded-lg p-4 max-h-[90vh] overflow-auto">
              <h3 className="text-lg font-semibold mb-4">{zoomedImage.title}</h3>
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
