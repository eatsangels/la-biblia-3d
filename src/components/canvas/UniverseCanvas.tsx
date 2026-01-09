'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Text, Sparkles, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Scripture } from '@/lib/types';
import { CreationShader } from './shaders';

// Horizontal Spacing for Map Layout
const VERSE_SPACING = 40;

interface UniverseProps {
    scrollProgress: number; // Keep for compatibility but might not drive camera directly anymore
    verses: Scripture[];
}

const CreationEffects = ({ isGenesis }: { isGenesis: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current && isGenesis) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            if (material.uniforms) {
                material.uniforms.uTime.value = state.clock.elapsedTime;
            }
            meshRef.current.rotation.z += 0.001;
        }
    });

    if (!isGenesis) return null;

    return (
        <group position={[-20, 0, -5]}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[30, 64, 64]} />
                <shaderMaterial
                    args={[CreationShader]}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

const VerseEntity = ({ verse, index, themeColor = '#FFD700' }: { verse: Scripture, index: number, themeColor?: string }) => {
    const xPos = index * VERSE_SPACING;

    return (
        <group position={[xPos, 0, 0]}>
            {/* Map Marker / Node */}
            <mesh position={[0, -4, 0]}>
                <circleGeometry args={[0.5, 32]} />
                <meshBasicMaterial color={themeColor} transparent opacity={0.8} />
            </mesh>

            {/* Connector Line */}
            <mesh position={[VERSE_SPACING / 2, -4, 0]} rotation={[0, 0, Math.PI / 2]}>
                <planeGeometry args={[0.2, VERSE_SPACING]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>

            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.5} floatingRange={[-0.5, 0.5]}>
                <group position={[0, 2, 0]}>
                    {/* Main Verse Text */}
                    <Text
                        fontSize={0.8}
                        maxWidth={22}
                        textAlign="center"
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        lineHeight={1.8}
                        letterSpacing={0.05}
                    >
                        {verse.content}
                    </Text>

                    {/* Reference */}
                    <Text
                        position={[0, -10, 0]}
                        fontSize={0.4}
                        color={themeColor}
                        anchorX="center"
                        anchorY="top"
                        letterSpacing={0.2}
                    >
                        {verse.book_name.toUpperCase()} {verse.chapter}:{verse.verse_number}
                    </Text>
                </group>
            </Float>
        </group>
    );
};

// Era Color Mapping
const getEraColor = (book: string): string => {
    const b = book.toLowerCase();
    if (['génesis', 'éxodo', 'levítico', 'números', 'deuteronomio'].includes(b)) return '#FFD700'; // Gold
    if (['mateo', 'marcos', 'lucas', 'juan'].includes(b)) return '#22d3ee'; // Cyan (Gospels)
    if (['apocalipsis'].includes(b)) return '#f472b6'; // Pink/Magical
    if (['salmos', 'proverbios'].includes(b)) return '#818cf8'; // Indigo (Poetry)
    return '#FFD700'; // Default Gold
};

const SceneContent = ({ verses, scrollProgress }: { verses: Scripture[], scrollProgress: number }) => {
    const firstBook = verses[0]?.book_name || 'Génesis';
    const primaryColor = getEraColor(firstBook);
    const isGenesis = firstBook === "Génesis";
    const { camera } = useThree();

    useFrame(() => {
        // Calculate target camera position based on scroll
        const totalDistance = verses.length * VERSE_SPACING;
        const targetX = scrollProgress * totalDistance;

        // Smooth camera movement (Lerp)
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 5, 0.05);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 30, 0.05);
    });

    return (
        <>
            <color attach="background" args={['#02040a']} />
            <fog attach="fog" args={['#02040a', 20, 100]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color={primaryColor} />

            {/* Celestial Atmosphere */}
            <Sparkles
                count={800}
                scale={[30, 30, 100]}
                size={3}
                speed={0.2}
                opacity={0.6}
                color={primaryColor}
            />
            <Sparkles
                count={400}
                scale={[20, 20, 50]}
                size={5}
                speed={0.1}
                opacity={0.3}
                color="#ffffff"
            />

            <CreationEffects isGenesis={isGenesis} />

            <group position={[0, 0, 0]}>
                {verses.map((v, i) => (
                    <VerseEntity key={v.id} verse={v} index={i} themeColor={primaryColor} />
                ))}
            </group>

            <EffectComposer>
                <Bloom luminanceThreshold={0.1} mipmapBlur intensity={0.8} radius={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
            </EffectComposer>
        </>
    );
};

export default function UniverseCanvas({ scrollProgress, verses }: UniverseProps) {
    return (
        <div className="fixed inset-0 z-0 bg-slate-950 cursor-move"> {/* cursor-move hint */}
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    toneMapping: THREE.ReinhardToneMapping,
                    toneMappingExposure: 1.0
                }}
            >
                <PerspectiveCamera makeDefault position={[0, 5, 30]} fov={50} />
                <Suspense fallback={null}>
                    <SceneContent verses={verses} scrollProgress={scrollProgress} />
                </Suspense>
            </Canvas>
        </div>
    );
}
