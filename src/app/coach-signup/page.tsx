"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import CoachSignupForm from './CoachSignupForm';

export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-black/90 to-black flex items-center justify-center py-12 px-4">
			<div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hidden lg:block">
					<div className="relative rounded-3xl overflow-hidden shadow-2xl">
						<div className="grid grid-cols-2 gap-3 p-6 bg-black/40">
							<img src="/coach1.jpg" alt="" className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
							<img src="/coach2.jpg" alt="" className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
							<img src="/coach3.jpg" alt="" className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
							<img src="/coach4.jpg" alt="" className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
						</div>
						<div className="p-6 bg-gradient-to-t from-black/60 to-transparent">
							<h1 className="font-brand text-3xl font-bold text-white mb-2">Join WhozNexxSports</h1>
							<p className="text-gray-300">Bring your coaching experience and passion to our community. Help build champions on and off the field.</p>
							<div className="mt-4">
								<Link href="/admin" className="text-sm text-red-400 hover:underline">Admin Panel →</Link>
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full">
					<CoachSignupForm />
				</motion.div>
			</div>
		</div>
	);
}
