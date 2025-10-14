import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF, Center } from '@react-three/drei'
import { Suspense } from 'react'

// GLB Model Component
function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url)
    return <primitive object={scene} scale={1.5} />
}

// Main Scene
export default function ModelScene({ className }: { className?: string }) {
    return (
        <div className={className} style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <Center disableZ={false}>
                        <Model url="/model.glb" />
                    </Center>
                </Suspense>
                <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={8} />
                <Preload all />
            </Canvas>
        </div>
    )
}