"use client"
import { useState } from 'react'

export default function Uploader({ adminPassword, onUnauthorized, onDone }: { adminPassword: string; onUnauthorized: () => void; onDone: () => void }) {
  const [status, setStatus] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  async function handleUpload() {
    if (!files.length) return
    setStatus('Uploading...')
    const fd = new FormData()
    fd.set('password', adminPassword)
    for (const f of files) fd.append('files', f)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, cache: 'no-store' })
    if (res.status === 401) { setStatus('Unauthorized; falling back to local'); onUnauthorized(); return }
    if (!res.ok) { setStatus('Upload failed'); return }
    setStatus('Uploaded')
    onDone()
  }
  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files ?? []))} />
      <div className="text-xs text-neutral-500">{status || 'Select images and upload'}</div>
      <button className="btn btn-primary" onClick={handleUpload} disabled={!files.length}>Upload</button>
    </div>
  )
}

