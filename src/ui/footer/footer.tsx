'use client'

import { FaGithub } from 'react-icons/fa'
import { GiSunflower } from 'react-icons/gi'

export default function Footer() {
    return (
        <footer className="w-full bg-[#F7F7F7] text-gray-600 flex justify-center items-center py-4 mt-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <p className="text-center">
                    © 2024 Todos los derechos reservados{' '}
                    <a
                        href="https://github.com/kaikrmen"
                        className="font-semibold text-[#FFD700]"
                    >
                        Kaikrmen
                    </a>
                </p>

                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/kaikrmen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#FFD700] flex items-center gap-2"
                    >
                        <FaGithub className="text-2xl" /> <span>GitHub</span>
                    </a>

                    <GiSunflower className="text-[#FFD700] text-3xl" />
                </div>
            </div>
        </footer>
    )
}
