const $list = document.getElementById('list');
const $form = document.getElementById('createForm');
const $prev = document.getElementById('prev');
const $next = document.getElementById('next');
const $pageInfo = document.getElementById('pageInfo');

let page = 1, limit = 5, total = 0;

async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    const txt = await res.text();
    if (!res.ok) throw new Error(tryMsg(txt) || res.statusText);
    return txt ? JSON.parse(txt) : null;
}
const tryMsg = (t) => { try { return JSON.parse(t).error; } catch { return t; } };

async function loadPosts() {
    $list.innerHTML = '로딩 중...';
    try {
        const data = await fetchJSON(`/api/posts?page=${page}&limit=${limit}`);
        total = data.total;
        $pageInfo.textContent = `페이지 ${data.page} / 총 ${Math.ceil(total / limit)} (전체 ${total})`;
        if (!data.items.length) { $list.innerHTML = '<p>등록된 글이 없습니다.</p>'; return; }
        $list.innerHTML = data.items.map(renderCard).join('');
        bindCardEvents();
        updatePager();
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
            try { await fetchJSON(`/api/posts/${id}`, { method: 'DELETE' }); await loadPosts(); }
            catch (err) { alert(`삭제 실패: ${err.message}`); }
        };
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.onclick = async (e) => {
            const card = e.target.closest('.card');
            const id = card.dataset.id;
            try {
                const post = await fetchJSON(`/api/posts/${id}`);
                const title = prompt('제목 수정', post.title); if (title === null) return;
                const content = prompt('내용 수정', post.content); if (content === null) return;
                const author = prompt('작성자 수정(선택)', post.author || '');
                await fetchJSON(`/api/posts/${id}`, {
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

function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, m =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function updatePager() {
    const maxPage = Math.max(1, Math.ceil(total / limit));
    $prev.disabled = page <= 1;
    $next.disabled = page >= maxPage;
}

$prev.onclick = () => { if (page > 1) { page--; loadPosts(); } };
$next.onclick = () => { const max = Math.ceil(total / limit); if (page < max) { page++; loadPosts(); } };

$form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData($form);
    const payload = Object.fromEntries(fd.entries());
    try {
        await fetchJSON('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        $form.reset();
        page = 1; // 첫 페이지로
        await loadPosts();
    } catch (err) {
        alert(`등록 실패: ${err.message}`);
    }
});

loadPosts();