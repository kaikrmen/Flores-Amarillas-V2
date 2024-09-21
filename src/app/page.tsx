'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaSun, FaMusic } from 'react-icons/fa'
import { GiSunflower, GiFlowerPot } from 'react-icons/gi'

export default function Page() {
    return (
        <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-8 overflow-hidden relative">
            {/* Título */}
            <motion.h1
                className="text-4xl md:text-6xl font-bold text-[#FFD700] mb-8 text-center"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                ¡Feliz Primavera! 🌻
            </motion.h1>

            {/* Flores animadas */}
            <motion.div
                className="flex flex-wrap justify-center gap-8 mb-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-24 h-24 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                    >
                        <GiSunflower className="text-4xl text-[#5C4033]" />{' '}
                        {/* Marrón oscuro para el centro del girasol */}
                    </motion.div>
                ))}
            </motion.div>

            {/* Sección de información */}
            <motion.div
                className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <h2 className="text-3xl font-semibold text-[#FFD700] mb-4">
                    Floricienta y la Magia de la Primavera
                </h2>
                <p className="text-gray-600 mb-4">
                    La primavera trae consigo la magia de Floricienta, con sus
                    canciones alegres y su espíritu lleno de color. Como los
                    girasoles que siguen al sol, nuestros corazones siguen la
                    melodía de la vida y la alegría. Gracias por estar a mi
                    lado, por ser mi sol y mi primavera.
                    <br />
                    ¡Vamos a disfrutar de la música y a cultivar flores juntxs!
                    <br />
                    ¡Feliz Primavera!
                    <br />
                    🌻🌻🌻
                </p>
                <div className="flex justify-center gap-4">
                    <motion.button
                        className="bg-[#FFD700] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-yellow-500 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/playmusic"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <FaMusic /> Escuchar Canción
                        </Link>
                    </motion.button>
                    <motion.button
                        className="bg-[#A8D5BA] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-green-600 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/virtualgarden"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <GiFlowerPot /> Cultivar Flores
                        </Link>
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                className="absolute top-4 right-4 text-6xl text-[#FFD700]"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
                <FaSun />
            </motion.div>

            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-[#B0B0B0]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 25 + 10}px`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                >
                    ✿
                </motion.div>
            ))}
        </div>
    )
}
