// next.config.js
import webpack from 'webpack';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build (similar to CRACO's eslint: { enable: false })
  eslint: {
    ignoreDuringBuilds: true,
    
  },


  // Custom Webpack configuration
  webpack: (config, { isServer, dev }) => {

    if (isServer) {
      // Alias any module that uses storage to a mock module
      config.resolve.alias['@storage'] = path.resolve('app/src/components/mockstorage.ts');
    } 
    
    // Resolve extensions and fallbacks (similar to CRACO's webpack.resolve)
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
      path: require.resolve('path-browserify'),
      // If you need to disable 'child_process' and 'fs' on the client-side:
      child_process: false,
    'node:child_process': false,
       
      
    };

    // Aliases (similar to CRACO's webpack.alias)
    config.resolve.alias['@ffmpeg/ffmpeg'] = false;

    // Plugins (similar to CRACO's webpack.plugins)
    config.plugins.push(
      new webpack.ProvidePlugin({
        
        Buffer: ['buffer', 'Buffer'],
      })
     
      
    );

    // Ignore specific warnings (similar to CRACO's webpack.ignoreWarnings)
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push(/Failed to parse source map/);

    // Disable caching if needed
    if (dev) {
      config.cache = false;
    }

    return config;
  },

//   // Rewrites for proxying API requests (similar to CRACO's devServer.proxy)
//   async rewrites() {
//     return [
//       {
//         source: '/convertP8/:path*',
//         destination: 'http://localhost:5000/convertP8/:path*', // Proxy to Backend
//       },
//       {
//         source: '/upload/:path*',
//         destination: 'http://localhost:5000/upload/:path*', // Proxy to Backend
//       },
//     ];
//   },
};

export default nextConfig;
