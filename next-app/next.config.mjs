/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    // Godot Web exports may require SharedArrayBuffer (threads).
    // Cross-origin isolation is enabled for the game route and exported assets.
    // If you embed third-party iframes/scripts elsewhere and hit issues, we can
    // narrow this further.
    const crossOriginIsolationHeaders = [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
    ];

    return [
      {
        source: '/godot/:path*',
        headers: crossOriginIsolationHeaders,
      },
      {
        source: '/game',
        headers: crossOriginIsolationHeaders,
      },
    ];
  },
};


export default nextConfig;
