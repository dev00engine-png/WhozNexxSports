"use client";
import { motion } from 'framer-motion';
import CoachSignupForm from './CoachSignupForm';

const images = ['/coach1.jpg','/coach2.jpg','/coach3.jpg','/coach4.jpg','/coach5.jpg','/coach6.jpg'];

export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-black/90 to-black flex items-center justify-center py-12 px-4">
			<div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
				{/* Left rolling collage */}
				<div className="hidden lg:block">
					<motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="h-[720px] overflow-hidden rounded-2xl">
						<motion.div animate={{ y: [0, -360, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="space-y-4 p-2">
							{images.concat(images).map((src, i) => (
								<img key={`l-${i}`} src={src} alt="" className="w-40 h-28 object-cover rounded-xl shadow-xl mx-auto" />
							))}
						</motion.div>
					</motion.div>
				</div>

				{/* Center form */}
			<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="col-span-3 w-full">
				</motion.div>

				{/* Right rolling collage */}
				<div className="hidden lg:block">
					<motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="h-[720px] overflow-hidden rounded-2xl">
						<motion.div animate={{ y: [0, -360, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="space-y-4 p-2">
							{images.slice().reverse().concat(images.slice().reverse()).map((src, i) => (
								<img key={`r-${i}`} src={src} alt="" className="w-40 h-28 object-cover rounded-xl shadow-xl mx-auto" />
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
