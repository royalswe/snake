//import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';

import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({ postcss: true }),

	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: '200.html',
			precompress: false,
			strict: true
		}),
		//adapter: adapter(),
		alias: {
			$src: path.resolve('./src'),
			$routes: path.resolve('./src/routes'),
		}
	}
};

export default config;
