'use client'

import React, { useRef } from 'react'
import { Button } from './ui/button'

export default function FilePickerButton({
  onFilesSelected,
}: {
  onFilesSelected: (files: FileList) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files)
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple // If only one file is needed, remove
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button onClick={handleClick}>📁 Select File</Button>
    </div>
  )
}
