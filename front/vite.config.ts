import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from "vite-plugin-svgr"
import path from "path"
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr({include: "**/*.svg?react"}), react()],
  envDir: '../',
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    host: true,
    
    port: +process.env.PORTA_FRONT
  }
})
