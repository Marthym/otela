const path = require('path');
const {defineConfig} = require('vite');

module.exports = defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'otela',
            formats: ['iife'],
            fileName: () => 'otela.js',
        },
    },
});
