import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: '/character-app',
        define: {
            'process.env.REACT_APP_API_BASE_URL': JSON.stringify(
                env.REACT_APP_API_BASE_URL
            ),
            'process.env.MARVEL_API_KEY': JSON.stringify(env.MARVEL_API_KEY),
        },
        plugins: [react()],
    }
})
