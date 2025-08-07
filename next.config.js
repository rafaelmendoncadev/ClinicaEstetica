/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações básicas
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true 
  },
  
  // Configurações de desenvolvimento para evitar erros
  experimental: {
    // Reduzir problemas de worker
    workerThreads: false,
    cpus: 1,
  },
  
  // Webpack simplificado
  webpack: (config, { dev, isServer }) => {
    // Resolver problemas de módulos em desenvolvimento
    if (dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Reduzir paralelização que causa problemas
    if (dev) {
      config.parallelism = 1
    }
    
    return config
  },
  
  // Configurações de build
  swcMinify: true,
  
  // Headers para desenvolvimento
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
