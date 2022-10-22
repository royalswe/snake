import type { LoadEvent } from '@sveltejs/kit';

export async function load({ params, url }: LoadEvent) {
	return {
		roomName: params.slug,
		board: url.searchParams.get('board'),
		mode: url.searchParams.get('mode')
	};
}
