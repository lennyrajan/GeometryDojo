import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon.png', 'og-image.png'],
            manifest: {
                name: 'Geometry Dojo',
                short_name: 'GeoDojo',
                description: 'Master the art of perfect shapes.',
                theme_color: '#312e81', // indigo-900 (matches app)
                background_color: '#09090b', // slate-950
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'icon.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
})
