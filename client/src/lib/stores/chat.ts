import { writable } from 'svelte/store';

type Message = {
	datetime?: string;
	user?: string;
	message: string;
};

const _message = writable<Message[]>([]);

export const chat = {
	subscribe: _message.subscribe,
	update: _message.update,
	set: _message.set,
	add: (value: Message) => _message.update((self) => [...self, value])
	//add: (value: Message) =>
	//	_message.update((self) => ({ ...self, messages: [value].concat(self.messages) }))
	//chat.update((msg) => ({ ...msg, messages: [data.msg].concat(msg.messages) }));

	// edit: (message) =>
	// 	_message.update((self: State) => {
	// 		self.type = 'edit';
	// 		self.message = message;
	// 		self.opened = true;
	// 		return self;
	// 	}),
	// delete: (message: message) =>
	// 	_message.update((self: rStore) => {
	// 		self.type = 'delete';
	// 		self.message = message;
	// 		self.opened = true;
	// 		return self;
	// 	})
};
