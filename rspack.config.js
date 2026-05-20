const rspack = require('@rspack/core')
const refreshPlugin = require('@rspack/plugin-react-refresh')
const isDev = process.env.NODE_ENV === 'development'
const path = require('path');
require('dotenv').config();

const printCompilationMessage = require('./compilation.config.js');

const port = 8081;

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: './src/index.ts',
  },

  output: {
    publicPath: isDev ? `http://localhost:${port}/` : 'https://auth.leaf.monster/',
  },
  
  devServer: {
    port,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    }
  },

  resolve: {
    extensions: ['.js','.jsx','.ts','.tsx','.json']
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  tailwindcss: {},
                  autoprefixer: {},
                },
              },
            },
          },
        ],
        type: 'css',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  'chrome >= 87',
                  'edge >= 88',
                  'firefox >= 78',
                  'safari >= 14',
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.container.ModuleFederationPlugin({
      name: 'authMF',
      filename: 'remoteEntry.js',
      exposes: {
        "./LoginForm": "./src/components/LoginForm.tsx",
        "./SignupForm": "./src/components/SignupForm.tsx",
        "./ImageCarousel": "./src/components/ImageCarousel.tsx",
        "./EmailForm": "./src/components/EnterEmailForm.tsx",
        "./OtpForm": "./src/components/OtpForm.tsx",
        "./ResetPassword": "./src/components/ResetPassword.tsx"
      },
      remotes: {
        hostApp: `host@${process.env.REACT_APP_HOST_REMOTE}`
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
        },
        'react-router': {
          singleton: true,
          requiredVersion: '^7.1.1',
        },
        'react-hook-form': {
          singleton: true,
          requiredVersion: '^7.54.2',
        },
        'lucide-react': {
          singleton: true,
          requiredVersion: '^0.471.0',
        },
        "react-toastify": { 
          singleton: true, 
          eager: true 
        },
        "react-hot-toast": {
          singleton: true, 
          eager: true
        }
      },

    }),
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.REACT_APP_LEAF_BACKEND_URL': JSON.stringify(process.env.REACT_APP_LEAF_BACKEND_URL),
      'process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID),
      'process.env.REACT_APP_HOST_REMOTE': JSON.stringify(process.env.REACT_APP_HOST_REMOTE),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
}



