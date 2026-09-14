import { useRef } from 'react'
import { Download, Search, Upload, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import type { SampleKey } from '@/lib/samples'

interface ToolbarProps {
  onLoadSample: (key: SampleKey) => void
  onFileUpload: (file: File) => void
  onDownload: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

const SAMPLE_LABELS: Record<SampleKey, string> = {
  github: 'GitHub user',
  ecommerce: 'Order & cart',
  geojson: 'GeoJSON',
}

export function Toolbar({ onLoadSample, onFileUpload, onDownload, searchQuery, onSearchChange }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <Logo size={22} className="toolbar-logo" title="JSON Explorer" />
        <div className="toolbar-title">
          <span className="toolbar-name">JSON Explorer</span>
          <span className="toolbar-tag">structural inspector</span>
        </div>
      </div>

      <div className="toolbar-search">
        <Search size={15} aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search keys, values, or paths…"
          aria-label="Search keys, values, or paths"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="toolbar-search-clear"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="toolbar-actions">
        <label className="toolbar-select">
          <span className="sr-only">Load sample data</span>
          <select
            defaultValue=""
            onChange={(e) => {
              const key = e.target.value as SampleKey
              if (key) onLoadSample(key)
              e.target.value = ''
            }}
            aria-label="Load sample data"
          >
            <option value="" disabled>
              Load sample…
            </option>
            {(Object.keys(SAMPLE_LABELS) as SampleKey[]).map((key) => (
              <option key={key} value={key}>
                {SAMPLE_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileUpload(file)
            e.target.value = ''
          }}
          accept=".json,application/json"
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-ghost"
        >
          <Upload size={15} aria-hidden="true" />
          Upload
        </button>
        <button type="button" onClick={onDownload} className="btn btn-solid">
          <Download size={15} aria-hidden="true" />
          Export
        </button>
      </div>
    </header>
  )
}
