/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude onnxruntime-web from server-side bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('onnxruntime-web');
    }
    // Allow .wasm files to be served
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

module.exports = nextConfig;
