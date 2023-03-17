import { defineConfig } from 'vite'
import { createVuePlugin as vue } from "vite-plugin-vue2";
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import { VitePWA } from 'vite-plugin-pwa'
import Components from 'unplugin-vue-components/vite';

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VitePWA({
            includeAssets: ['/favicon.svg'],
            registerType: 'prompt',
            manifest: {
                name: 'IoMBian Configurator',
                short_name: 'IoMBian Configurator',
                description: 'PWA for the IoMBian Configurator service',
                theme_color: '#233167',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            }
        }),
        vue(),
        Components({
            resolvers: [
                // Vuetify
                VuetifyResolver(),
            ],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})