import axios from 'axios';

/**
 * Verifies session with backend, updates store, and optionally shows a toast.
 * @param {object} store - The global reactive store.
 * @param {Function} toast - The global toast function.
 * @param {boolean} showToastOnExpire - Show toast when session is expired.
 * @param {boolean} appLoad - If true, do not show toast on session expiration.
 */
export async function checkSession(store, toast, showToastOnExpire = true, appLoad = false) {
    try {
        const res = await axios.get(`${store.server_domain}/api/auth/session`, {
            withCredentials: true
        });

        if (res.status === 200 && res.data?.username) {
            store.username = res.data.username;
            localStorage.setItem('username', res.data.username);
            return true;
        } else {
            store.logout();
            return false;
        }
    } catch (err) {
        store.logout();
        if (err.response?.status === 401 && showToastOnExpire) {
            toast('Session Expired', 'Please log in again.', 'danger');
        }
        else if (err.response?.status === 401 && appLoad) {
            console.warn('User is not logged in, but app is loading.');
        }
        else {
            console.error('Unexpected session check error:', err);
        }

        return false;
    }
}
