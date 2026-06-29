const PROD_API_ORIGIN = 'https://centuries.mypaperlessoffice.org';

export const API_ORIGIN = import.meta.env.PROD ? PROD_API_ORIGIN : '';

export function apiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_ORIGIN}${normalizedPath}`;
}
