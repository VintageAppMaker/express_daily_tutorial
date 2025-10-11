const $list = document.getElementById('list');
const $form = document.getElementById('createForm');

async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || res.statusText);
    }
    return res.status === 204 ? null : res.json();
}

async function loadPosts() {
    $list.innerHTML = '로딩 중...';
    try {
        const posts = await fetchJSON('/posts');
        if (!posts.length) { $list.innerHTML = '<p>등록된 글이 없습니다.</p>'; return; }
        $list.innerHTML = posts.map(renderCard).join('');
        bindCardEvents();
    } catch (e) {
        $list.innerHTML = `<p style="color:red">불러오기 실패: ${e.message}</p>`;
    }
}

function renderCard(p) {
    return `
  <div class="card" data-id="${p.id}">
    <strong>#${p.id}. ${escapeHtml(p.title)}</strong>
    <div class="meta">by ${escapeHtml(p.author || 'Anonymous')} · ${p.created_at || ''}</div>
    <p>${escapeHtml(p.content)}</p>
    <div class="row">
      <button class="ghost btn-edit">수정</button>
      <button class="ghost btn-delete">삭제</button>
    </div>
  </div>`;
}

function bindCardEvents() {
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async (e) => {
            const id = e.target.closest('.card').dataset.id;
            if (!confirm(`#${id} 글을 삭제할까요?`)) return;
            try { await fetchJSON(`/posts/${id}`, { method: 'DELETE' }); await loadPosts(); }
            catch (err) { alert(`삭제 실패: ${err.message}`); }
        };
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.onclick = async (e) => {
            const card = e.target.closest('.card');
            const id = card.dataset.id;
            try {
                const post = await fetchJSON(`/posts/${id}`);
                const title = prompt('제목 수정', post.title);
                if (title === null) return;
                const content = prompt('내용 수정', post.content);
                if (content === null) return;
                const author = prompt('작성자 수정(선택)', post.author || '');
                await fetchJSON(`/posts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, author })
                });
                await loadPosts();
            } catch (err) {
                alert(`수정 실패: ${err.message}`);
            }
        };
    });
}

$form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData($form);
    const payload = Object.fromEntries(fd.entries());
    try {
        await fetchJSON('/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        $form.reset();
        await loadPosts();
    } catch (err) {
        alert(`등록 실패: ${err.message}`);
    }
});

function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, m =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

loadPosts();