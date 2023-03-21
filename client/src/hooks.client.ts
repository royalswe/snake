export default document.cookie = "cookiename=value";
import { state } from '$lib/stores/state';

// check with server if user is logged in, if so, set user in state;
fetch('https://localhost:5300/api/authenticate', {
    method: 'POST',
    credentials: 'include'
})
    .then(res => {
        if (res.ok) {
            return res.text();
        }
        else {
            return Promise.reject(res);
        }
    })
    .then(res => {
        state.update((state) => ({ ...state, you: res }));
        console.log('username:', res);
    })
    .catch(err => {
        console.log('could not fetch user', err);
    });

