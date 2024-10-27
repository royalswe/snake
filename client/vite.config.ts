import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
//import dns from 'dns';

//dns.setDefaultResultOrder('verbatim');

const config: UserConfig = {
	plugins: [sveltekit(), mkcert()]
};

export default config;
