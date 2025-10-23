import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// TypeScript declaration for the Tiff.js library loaded from CDN
declare const Tiff: any;

interface TiffFile {
    id: string;
    name: string;
    url: string;
}

const TIFF_FILES: TiffFile[] = [

    {
        id: '1',
        name: 'LC08_035034_20190824',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761223674/all_bands_p0fb0n.tiff'
    },
    {
        id: '2',
        name: 'LC08_043034_20190816',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761223795/all_bands_bjubne.tiff'
    },
    {
        id: '3',
        name: 'LC08_019033_20190824',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761223833/all_bands_azyecc.tiff'
    },
    {
        id: '4',
        name: 'LC08_038033_20190813',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761223864/all_bands_kgupxt.tiff'
    },
    {
        id: '5',
        name: 'LC08_032033_20190718',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761223904/all_bands_jtdeex.tiff'
    },
    {
        id: '6',
        name: 'LC08_032033_20193418',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761224015/all_bands_zdyefy.tiff'
    },
    {
        id: '7',
        name: 'LC08_032053_20193438',
        url: 'https://res.cloudinary.com/dmgjftmqa/image/upload/v1761224081/all_bands_cz0qzo.tiff'
    }
];

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="text-lg text-muted-foreground">Loading TIFF image...</p>
        <p className="text-sm text-muted-foreground">This might take a moment.</p>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded-lg relative max-w-full" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline break-words">{message}</span>
    </div>
);

const TiffViewer = () => {
    const [selectedFile, setSelectedFile] = useState<TiffFile>(TIFF_FILES[0]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const handleDownload = async (file: TiffFile) => {
        try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.toLowerCase().replace(/\s+/g, '_')}.tiff`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
        }
    };

    useEffect(() => {
        const loadTiffImage = async () => {
            setLoading(true);
            setError(null);

            if (typeof Tiff === 'undefined') {
                setError("Tiff.js library not loaded. Cannot display image.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(selectedFile.url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch image. Status: ${response.status} ${response.statusText}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const tiff = new Tiff({ buffer: arrayBuffer });
                const canvas = tiff.toCanvas();

                if (canvasContainerRef.current) {
                    canvasContainerRef.current.innerHTML = '';
                    canvas.classList.add('max-w-full', 'h-auto', 'rounded-lg', 'shadow-glow');
                    canvasContainerRef.current.appendChild(canvas);
                } else {
                    throw new Error("Canvas container is not available in the DOM.");
                }
            } catch (err) {
                console.error("Error loading TIFF image:", err);
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(`Failed to load or process TIFF image. ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        loadTiffImage();
    }, [selectedFile]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-6xl">
                <Link to="/">
                    <Button variant="ghost" className="mb-4 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>

                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                        Input TIFF Data
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Contains the TIFF files with dataset details
                    </p>
                </header>

                {/* File Selection */}
                {TIFF_FILES.length > 1 && (
                    <div className="mb-6 flex flex-wrap gap-3 justify-center">
                        {TIFF_FILES.map((file) => (
                            <Button
                                key={file.id}
                                onClick={() => setSelectedFile(file)}
                                variant={selectedFile.id === file.id ? "default" : "secondary"}
                                className="card-shadow"
                            >
                                {file.name}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Main Viewer Card */}
                <div className="bg-card rounded-2xl card-shadow-lg p-6 sm:p-8 border border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-card-foreground">
                            {selectedFile.name}
                        </h2>
                        <Button
                            onClick={() => handleDownload(selectedFile)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>

                    <main className="flex items-center justify-center min-h-[500px] bg-secondary/50 p-4 rounded-xl border border-border">
                        {loading && <LoadingSpinner />}
                        {error && !loading && <ErrorDisplay message={error} />}
                        <div ref={canvasContainerRef} className="flex justify-center items-center">
                            {/* The canvas will be appended here by the useEffect hook */}
                        </div>
                    </main>

                </div>

                {/* Problem Statement and Spectral Band Information */}
                <div className="mt-8 bg-card rounded-2xl card-shadow-lg p-6 sm:p-8 border border-border">
                    <h2 className="text-2xl font-bold mb-4 text-accent">Dataset Details</h2>
                    <h3 className="text-xl font-semibold mb-2">Optical-Guided Super-Resolution for Thermal IR Imagery</h3>
                    <h4 className="text-l font-semibold mb-2">These TIFF Files contains all bands listed below. </h4>

                    <div className="mb-6">
                        <p className="text-muted-foreground mb-2">
                            <strong>Dataset:</strong>{' '}
                            <a
                                href="https://huggingface.co/datasets/torchgeo/ssl4eo_l_benchmark/resolve/main/ssl4eo_l_oli_tirs_toa_benchmark.tar.gz?download=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline break-all"
                            >
                                SSL4EO-L Benchmark Dataset
                            </a>
                        </p>
                        <p className="text-muted-foreground">
                            Contains 11 bands of Landsat 8: 9 OLI sensor bands and 2 TIRS sensor bands for Thermal Infrared
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-accent">OLI Spectral Bands</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 px-2">Band</th>
                                            <th className="text-left py-2 px-2">Description</th>
                                            <th className="text-left py-2 px-2">Wavelength</th>
                                            <th className="text-left py-2 px-2">Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 1</td>
                                            <td className="py-2 px-2">Coastal Aerosol</td>
                                            <td className="py-2 px-2">0.43 - 0.45 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 2</td>
                                            <td className="py-2 px-2">Blue</td>
                                            <td className="py-2 px-2">0.450 - 0.51 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 3</td>
                                            <td className="py-2 px-2">Green</td>
                                            <td className="py-2 px-2">0.53 - 0.59 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 4</td>
                                            <td className="py-2 px-2">Red</td>
                                            <td className="py-2 px-2">0.64 - 0.67 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 5</td>
                                            <td className="py-2 px-2">Near-Infrared</td>
                                            <td className="py-2 px-2">0.85 - 0.88 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 6</td>
                                            <td className="py-2 px-2">SWIR 1</td>
                                            <td className="py-2 px-2">1.57 - 1.65 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 7</td>
                                            <td className="py-2 px-2">SWIR 2</td>
                                            <td className="py-2 px-2">2.11 - 2.29 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 8</td>
                                            <td className="py-2 px-2">Panchromatic (PAN)</td>
                                            <td className="py-2 px-2">0.50 - 0.68 μm</td>
                                            <td className="py-2 px-2">15 m</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-2">Band 9</td>
                                            <td className="py-2 px-2">Cirrus</td>
                                            <td className="py-2 px-2">1.36 - 1.38 μm</td>
                                            <td className="py-2 px-2">30 m</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-3 text-accent">TIRS Spectral Bands</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-2 px-2">Band</th>
                                            <th className="text-left py-2 px-2">Description</th>
                                            <th className="text-left py-2 px-2">Wavelength</th>
                                            <th className="text-left py-2 px-2">Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-2 px-2">Band 10</td>
                                            <td className="py-2 px-2">Thermal infrared 1</td>
                                            <td className="py-2 px-2">10.60 – 11.19 μm</td>
                                            <td className="py-2 px-2">100 m</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-2">Band 11</td>
                                            <td className="py-2 px-2">Thermal infrared 2</td>
                                            <td className="py-2 px-2">11.50 – 12.51 μm</td>
                                            <td className="py-2 px-2">100 m</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TiffViewer;
