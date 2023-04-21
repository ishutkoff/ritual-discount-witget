import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	plugins: [react(), svgr()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
			plugins: [
				{
					name: 'wrap-in-iife',
					generateBundle(outputOptions, bundle) {
						Object.keys(bundle).forEach(fileName => {
							const file = bundle[fileName]
							if (fileName.slice(-3) === '.js' && 'code' in file) {
								file.code = `(() => {\n${file.code}})()`
							}
						})
					},
				},
			],
		},
	},
})
