'use client'

import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface FlowerProps {
    position: [number, number, number]
    growth: number
    onClick: () => void
    isWatering: boolean
}

interface FlowerState {
    position: [number, number, number]
    growth: number
}

const Sunflower: React.FC<FlowerProps> = ({
    position,
    growth = 0,
    onClick,
    isWatering,
}) => {
    const meshRef = useRef<THREE.Group>(null)
    const waterParticlesRef = useRef<THREE.Points>(null)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y =
                Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
            meshRef.current.position.y =
                position[1] + Math.sin(state.clock.getElapsedTime()) * 0.05
        }
        if (waterParticlesRef.current && isWatering) {
            const particles = waterParticlesRef.current.geometry.attributes
                .position.array as Float32Array
            for (let i = 0; i < particles.length; i += 3) {
                particles[i + 1] -= 0.1
                if (particles[i + 1] < -2) {
                    particles[i + 1] = 2
                }
            }
            waterParticlesRef.current.geometry.attributes.position.needsUpdate =
                true
        }
    })

    const petalGeometry = useMemo(() => {
        const shape = new THREE.Shape()
        shape.moveTo(0, 0)
        shape.bezierCurveTo(0.5, 0.5, 1, 1, 0, 2)
        shape.bezierCurveTo(-1, 1, -0.5, 0.5, 0, 0)
        return new THREE.ShapeGeometry(shape, 32)
    }, [])

    const stemHeight = 3 * growth
    const flowerHeadPosition = stemHeight
    const flowerScale = Math.min(Math.max(growth, 0), 1) * 1.5

    const waterParticles = useMemo(() => {
        const particleCount = 100
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.5
            positions[i * 3 + 1] = Math.random() * 4
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
        }
        return positions
    }, [])

    return (
        <group position={position} ref={meshRef} onClick={onClick}>
            {/* Stem */}
            <mesh position={[0, stemHeight / 2, 0]}>
                <cylinderGeometry args={[0.1, 0.1, stemHeight, 8]} />
                <meshStandardMaterial color="green" />
            </mesh>

            {/* Petals */}
            {[...Array(24)].map((_, i) => (
                <mesh
                    key={i}
                    position={[0, flowerHeadPosition, 0]}
                    rotation={[0, 0, (Math.PI / 12) * i]}
                    scale={[flowerScale, flowerScale, flowerScale]}
                >
                    <bufferGeometry attach="geometry" {...petalGeometry} />
                    <meshStandardMaterial
                        color="#FFD700" // Color amarillo brillante
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* Center */}
            <mesh
                position={[0, flowerHeadPosition, 0]}
                scale={[flowerScale, flowerScale, flowerScale]}
            >
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Leaves */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(
                (rotation, index) => (
                    <mesh
                        key={index}
                        position={[0, (stemHeight * (index + 1)) / 5, 0]}
                        rotation={[0, rotation, 0]}
                        scale={[growth, growth, growth]}
                    >
                        <coneGeometry args={[0.2, 1, 8]} />
                        <meshStandardMaterial color="green" />
                    </mesh>
                )
            )}

            {/* Water particles */}
            {isWatering && (
                <points ref={waterParticlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={waterParticles.length / 3}
                            array={waterParticles}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        color="#4FC3F7"
                        size={0.05}
                        transparent
                        opacity={0.8}
                    />
                </points>
            )}
        </group>
    )
}

import { ThreeEvent } from '@react-three/fiber'

interface GroundProps {
    onPlant: (event: ThreeEvent<MouseEvent>) => void
}

const Ground: React.FC<GroundProps> = ({ onPlant }) => {
    const texture = useTexture('/images/soil.webp')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            onClick={onPlant}
        >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

const GardenScene: React.FC = () => {
    const [flowers, setFlowers] = useState<FlowerState[]>([])
    const [wateringFlower, setWateringFlower] = useState<number | null>(null)
    const [wateringCan, setWateringCan] = useState({ x: 0, y: 0 })
    const plantFlower = (event: ThreeEvent<MouseEvent>) => {
        if (flowers.length < 10) {
            const { point } = event
            setFlowers([
                ...flowers,
                { position: [point.x, -0.9, point.z], growth: 0.1 },
            ])
        }
    }

    const waterFlower = (index: number) => {
        setWateringFlower(index)
        setTimeout(() => {
            setWateringFlower(null)
            setFlowers(
                flowers.map((flower, i) =>
                    i === index
                        ? {
                              ...flower,
                              growth: Math.min(flower.growth + 0.2, 1),
                          }
                        : flower
                )
            )
        }, 2000)
    }

    const { camera } = useThree()

    useFrame(() => {
        const vector = new THREE.Vector3()
        camera.getWorldDirection(vector)
        setWateringCan({
            x: camera.position.x + vector.x * 2,
            y: camera.position.y + vector.y * 2 - 0.5,
        })
    })

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Ground onPlant={plantFlower} />
            {flowers.map((flower, index) => (
                <Sunflower
                    key={index}
                    position={flower.position}
                    growth={flower.growth}
                    onClick={() => waterFlower(index)}
                    isWatering={wateringFlower === index}
                />
            ))}
            <Text
                position={[wateringCan.x, wateringCan.y, camera.position.z - 2]}
                fontSize={0.2}
                color="blue"
            >
                🚿
            </Text>
            <OrbitControls
                enablePan={false}
                maxPolarAngle={Math.PI / 2 - 0.1}
            />
        </>
    )
}

const VirtualGarden: React.FC = () => {
    return (
        <div className="w-full h-screen relative">
            <Canvas camera={{ position: [0, 5, 5] }}>
                <GardenScene />
            </Canvas>
            <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-4 rounded-lg">
                <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: '#8B4513' }}
                >
                    Jardín Virtual
                </h2>
                <p style={{ color: '#8B4513' }}>
                    Haz clic en el suelo para plantar (máx. 7 girasoles)
                </p>
                <p style={{ color: '#8B4513' }}>
                    Haz clic en un girasol para regarlo y hacerlo crecer
                </p>
            </div>
        </div>
    )
}

export default VirtualGarden
