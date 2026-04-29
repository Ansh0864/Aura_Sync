import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Music, ShieldCheck, Heart } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Emotion Classes', value: '7' },
    { label: 'Processing Speed', value: '< 200ms' },
    { label: 'API Accuracy', value: '86%' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500 pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
            About AuraSync
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            AuraSync is an experimental platform designed to harmonize human emotion with digital audio environments using Convolutional Neural Networks (CNN).
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-center">
              <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Detailed Info */}
        <div className="space-y-8">
          <div className="flex gap-6 items-start p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Brain</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Utilizing a custom Sequential Neural Network built on Keras and TensorFlow. Our model analyzes facial geometry and micro-expressions to classify emotional states in real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We believe that music is the ultimate emotional regulator. By syncing your current mood with curated trending frequencies, we aim to enhance focus, joy, and emotional equilibrium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}