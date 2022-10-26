import type { LoadEvent } from '@sveltejs/kit';
import type { UrlParams } from '$models/urlParams'

// TODO: validate params
export async function load({ params, url }: LoadEvent) {
	const obj: UrlParams = { room: params.slug };
	const board = url.searchParams.get('board');
	if (board) {
		obj.width = +board?.split(':')[0];
		obj.height = +board?.split(':')[1];
	}

	return obj;
}
