/** @type {import('next').NextConfig} */
module.exports = {
  images: { unoptimized: true },
  // NOTE: output: 'export' removed — was causing Vercel 500 FUNCTION_INVOCATION_FAILED
  // App uses 'use client' so it renders client-side anyway
};
