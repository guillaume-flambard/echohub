import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Initialize CSRF protection for Sanctum
axios.get('/sanctum/csrf-cookie').catch(() => {
    // Silently fail if CSRF cookie endpoint is not available
});

export default axios;
