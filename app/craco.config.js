//const express  = require('express');
//const { spawn }= require( 'child_process');
//const process  = require('process');
//const fs = require( 'fs');


const cracoWasm = require("craco-wasm");
const webpack = require("webpack");
const path = require("path");
// // Assume we have the server origin current working directory
//const serverOrigin = process.cwd();

module.exports = {



  devServer: {

    proxy: [{
 
      context: ['/convertP8', '/upload'],
      target:  'http://localhost:5000/', // The port your Express server is running onserverOrigin +
      changeOrigin: true,
  
  
  }],
  

  },


  plugins: [
    cracoWasm(),
  ],
  eslint: {
    enable: false
  },
  babel: {
    plugins: [
      [
        'formatjs',
        {
          removeDefaultMessage: false,
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
          ast: true
        }
      ]
    ]
  },
  webpack: {
    configure: {
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        fallback: {
          buffer: require.resolve("buffer"),
          //fs: false, // Disable 'fs' on the client-side
        path: require.resolve("path-browserify"), // Polyfill for 'path' in the browser
       // child_process: false, // Disable 'child_process' on the client-side
        },
        alias: {
          '@ffmpeg/ffmpeg': path.resolve(__dirname, 'src/stub.js')
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ],
      ignoreWarnings: [/Failed to parse source map/],
      cache: false,
    },
  },
  }