/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { FaPlay, FaPause } from 'react-icons/fa'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Image from 'next/image'
import { motion } from 'framer-motion'

extend({ OrbitControls })

interface SunflowerProps {
    position: [number, number, number]
    openFlower: boolean
}

function Sunflower({ position, openFlower }: SunflowerProps) {
    const flowerRef = useRef<THREE.Group>(null!)
    const { clock } = useThree()

    const petalGeometry = useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.bezierCurveTo(0.5, 0.5, 1, 1, 0, 2)
        shape.bezierCurveTo(-1, 1, -0.5, 0.5, 0, 0)
        return new THREE.ShapeGeometry(shape, 32)
    }, [])

    const petalMaterial = useMemo(() => {
        return new THREE.MeshPhongMaterial({
            color: 0xffd700, // Color amarillo dorado
            emissive: 0xffff00, // Emisivo amarillo para darle más vida
            emissiveIntensity: 0.3, // Ajusta la intensidad del brillo
            shininess: 200, // Aumentar el brillo especular para mayor reflejo
            side: THREE.DoubleSide,
        })
    }, [])

    const centerGeometry = useMemo(() => {
        return new THREE.SphereGeometry(0.4, 32, 32)
    }, [])

    const centerMaterial = useMemo(() => {
        return new THREE.MeshPhongMaterial({
            color: 0x8b4513,
            shininess: 70,
        })
    }, [])

    const stemGeometry = useMemo(() => {
        return new THREE.CylinderGeometry(0.1, 0.1, 5, 32)
    }, [])

    const stemMaterial = useMemo(() => {
        return new THREE.MeshPhongMaterial({
            color: 0x228b22,
        })
    }, [])

    useFrame(() => {
        if (flowerRef.current) {
            flowerRef.current.rotation.y += 0.005
            flowerRef.current.scale.setScalar(
                openFlower
                    ? 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1
                    : 0.8
            )
        }
    })

    return (
        <group ref={flowerRef} position={position}>
            <mesh
                geometry={stemGeometry}
                material={stemMaterial}
                position={[0, -3, 0]}
            />
            {[...Array(24)].map((_, i) => (
                <mesh
                    key={i}
                    geometry={petalGeometry}
                    material={petalMaterial}
                    position={[0, 0, 0.01]}
                    rotation={[0, 0, (Math.PI / 12) * i]}
                    scale={[0.7, openFlower ? 1 : 0.2, 0.7]}
                />
            ))}
            <mesh geometry={centerGeometry} material={centerMaterial} />
        </group>
    )
}

// Cada girasol con su propio ramo separado
function SunflowerWithBouquet({
    position,
}: {
    position: [number, number, number]
}) {
    const wrapGeometry = useMemo(() => {
        return new THREE.ConeGeometry(1.5, 3, 16)
    }, [])

    const wrapMaterial = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color: 0xc4a484,
            side: THREE.DoubleSide,
        })
    }, [])

    return (
        <group position={position}>
            <mesh
                geometry={wrapGeometry}
                material={wrapMaterial}
                position={[0, -1.5, 0]}
                rotation={[0, 0, Math.PI]}
            />
            <Sunflower position={[0, 0.5, 0]} openFlower={true} />
        </group>
    )
}

function CameraController() {
    const { camera, gl } = useThree()
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement)
        controls.minDistance = 3
        controls.maxDistance = 20
        return () => {
            controls.dispose()
        }
    }, [camera, gl])
    return null
}

export default function SunflowerMusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [openFlower, setOpenFlower] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = new Audio('/music/flores.mp3')
        audioRef.current.loop = true

        audioRef.current.addEventListener('canplaythrough', () => {
            console.log('Audio cargado y listo para reproducir')
        })

        audioRef.current.addEventListener('error', (e) => {
            console.error('Error al cargar el archivo de audio', e)
        })

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause()
        } else {
            audioRef.current?.play()
        }
        setIsPlaying(!isPlaying)
        setOpenFlower(!openFlower)
    }

    return (
        <div className="w-full h-screen relative bg-[#F7F7F7] flex flex-col items-center justify-center">
            {openFlower && (
                <motion.div
                    className="absolute top-10 w-full text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-2xl font-bold text-[#FFD700] mb-2">
                        "Donde florecen los sueños, siempre brilla el sol."
                    </p>
                </motion.div>
            )}

            <div className="flex flex-col items-center justify-between h-full">
                <div className="flex-grow flex justify-center items-center h-1/3">
                    <Canvas
                        className="w-full h-full"
                        camera={{ position: [0, 0, 8] }}
                    >
                        <CameraController />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />

                        {/* Tres ramos separados */}
                        <SunflowerWithBouquet position={[-3, 0, 0]} />
                        <SunflowerWithBouquet position={[0, 0, 0]} />
                        <SunflowerWithBouquet position={[3, 0, 0]} />

                        <EffectComposer>
                            <Bloom
                                luminanceThreshold={0}
                                luminanceSmoothing={0.9}
                                height={300}
                            />
                        </EffectComposer>
                    </Canvas>
                </div>

                <motion.div
                    className="w-64 bg-white bg-opacity-80 rounded-lg p-4 shadow-lg"
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/images/portada.avif"
                        width={250}
                        height={250}
                        alt="Sunflower"
                    />
                    <p className="text-center font-semibold mb-2 text-[#FFD700]">
                        Floricienta - Canción del momento
                    </p>

                    <button
                        onClick={togglePlay}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white w-full py-2 rounded-full flex items-center justify-center transition-colors"
                    >
                        {isPlaying ? (
                            <FaPause className="mr-2" />
                        ) : (
                            <FaPlay className="mr-2" />
                        )}
                        {isPlaying ? 'Pause' : 'Play'} Floricienta
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
