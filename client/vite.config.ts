import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import dns from 'dns';
import mkcert from 'vite-plugin-mkcert';


dns.setDefaultResultOrder('verbatim');

const config: UserConfig = {
	plugins: [sveltekit(), mkcert()]
};

export default config;
