/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',        // Static export — no server-side execution on Vercel
  images: { unoptimized: true },
  trailingSlash: true,
};
