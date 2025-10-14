// client/src/App.jsx
import { useEffect, useState } from 'react'
import { PostsAPI } from './api'
import './app.css'
import {
  Container, Card, CardContent, CardActions,
  Typography, Stack, TextField, Button, Divider, Box
} from '@mui/material'

export default function App() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ title: '', content: '', author: '' })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await PostsAPI.list()
      setPosts(data)
    } catch (e) {
      alert('불러오기 실패: ' + e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await PostsAPI.create(form)
      setForm({ title: '', content: '', author: '' })
      await load()
    } catch (e) {
      alert('등록 실패: ' + e.message)
    }
  }

  const onDelete = async (id) => {
    if (!confirm(`#${id} 글을 삭제할까요?`)) return
    try { await PostsAPI.remove(id); await load() }
    catch (e) { alert('삭제 실패: ' + e.message) }
  }

  const onEdit = async (id) => {
    try {
      const post = await PostsAPI.detail(id)
      const title = prompt('제목 수정', post.title); if (title === null) return
      const content = prompt('내용 수정', post.content); if (content === null) return
      const author = prompt('작성자(선택)', post.author || '')
      await PostsAPI.update(id, { title, content, author })
      await load()
    } catch (e) {
      alert('수정 실패: ' + e.message)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        블로그 CRUD — React + Material UI
      </Typography>

      {/* 입력 폼: 세로(Stack) 배치 */}
      <Card component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>새 글 작성</Typography>
          <Stack spacing={2}>
            <TextField
              label="제목"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="내용"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              required
              fullWidth
              multiline
              minRows={4}
            />
            <TextField
              label="작성자 (선택)"
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              fullWidth
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button type="submit" variant="contained">등록</Button>
          <Button
            variant="outlined"
            onClick={() => setForm({ title: '', content: '', author: '' })}
          >
            초기화
          </Button>
        </CardActions>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1.5 }}>게시글 목록</Typography>
      {loading ? (
        <Typography>로딩 중...</Typography>
      ) : posts.length ? (
        <Stack spacing={2}>
          {posts.map(p => (
            <Card key={p.id}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  #{p.id}. {p.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  by {p.author || 'Anonymous'} · {p.created_at}
                </Typography>
                <Box sx={{ whiteSpace: 'pre-wrap', mt: 1.25 }}>
                  {p.content}
                </Box>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button variant="outlined" onClick={() => onEdit(p.id)}>수정</Button>
                <Button variant="outlined" color="error" onClick={() => onDelete(p.id)}>삭제</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography>등록된 글이 없습니다.</Typography>
      )}
    </Container>
  )
}
