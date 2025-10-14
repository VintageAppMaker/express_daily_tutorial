export async function request(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    const parse = () => (text ? JSON.parse(text) : null);
    if (!res.ok) {
        let msg = text;
        try { msg = JSON.parse(text).error || msg; } catch { }
        throw new Error(msg || res.statusText);
    }
    return parse();
}

export const PostsAPI = {
    list: () => request('/api/posts'),
    detail: (id) => request(`/api/posts/${id}`),
    create: (body) => request('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }),
    update: (id, body) => request(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }),
    remove: (id) => request(`/api/posts/${id}`, { method: 'DELETE' })
};