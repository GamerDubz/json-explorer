'use client'

import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle, Maximize2, Minimize2, Sparkles } from 'lucide-react'
import { Toolbar } from '@/components/toolbar'
import { TreeView } from '@/components/tree-view'
import { collectContainerPaths, formatBytes, parseJsonSource } from '@/lib/json-tree'
import { SAMPLES, type SampleKey } from '@/lib/samples'

export default function JsonExplorerPage() {
  const [rawJson, setRawJson] = useState<string>(JSON.stringify(SAMPLES.github, null, 2))
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [lastCopied, setLastCopied] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Map<string, boolean>>(new Map())
  const expandDepth = 3

  const { data, error, metrics } = useMemo(() => parseJsonSource(rawJson), [rawJson])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 1800)
  }, [])

  const copyText = useCallback(
    (text: string, label: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setLastCopied(`${label}:${text}`)
          showToast(`Copied ${label.toLowerCase()}`)
          window.setTimeout(() => setLastCopied(null), 1200)
        })
        .catch(() => {
          showToast(`Could not copy ${label.toLowerCase()} — clipboard unavailable`)
        })
    },
    [showToast]
  )

  const handleToggle = useCallback((path: string, currentlyCollapsed: boolean) => {
    setOverrides((prev) => {
      const next = new Map(prev)
      next.set(path, !currentlyCollapsed)
      return next
    })
  }, [])

  const expandAll = useCallback(() => {
    setOverrides(() => {
      const next = new Map<string, boolean>()
      collectContainerPaths(data).forEach((path) => next.set(path, false))
      return next
    })
  }, [data])

  const collapseAll = useCallback(() => {
    setOverrides(() => {
      const next = new Map<string, boolean>()
      collectContainerPaths(data).forEach((path) => next.set(path, true))
      return next
    })
  }, [data])

  const prettify = useCallback(() => {
    try {
      const parsed = JSON.parse(rawJson)
      setRawJson(JSON.stringify(parsed, null, 2))
    } catch {
      // Leave the invalid source untouched; the error banner already explains why.
    }
  }, [rawJson])

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(rawJson)
      setRawJson(JSON.stringify(parsed))
    } catch {
      // Leave the invalid source untouched; the error banner already explains why.
    }
  }, [rawJson])

  const loadSample = useCallback((key: SampleKey) => {
    setRawJson(JSON.stringify(SAMPLES[key], null, 2))
    setOverrides(new Map())
    setSearchQuery('')
  }, [])

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setRawJson(content)
        setOverrides(new Map())
      }
    }
    reader.readAsText(file)
  }, [])

  const downloadJson = useCallback(() => {
    const blob = new Blob([rawJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `data-${Date.now()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }, [rawJson])

  return (
    <div className="app-shell">
      <Toolbar
        onLoadSample={loadSample}
        onFileUpload={handleFileUpload}
        onDownload={downloadJson}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {toast && (
        <div className="toast" role="status">
          <Sparkles size={14} aria-hidden="true" />
          {toast}
        </div>
      )}

      <main className="workspace">
        <section className="panel" aria-label="Raw JSON source">
          <div className="panel-header">
            <span className="panel-label">Source</span>
            <div className="panel-header-actions">
              <button type="button" onClick={prettify} className="btn btn-ghost btn-sm">
                Prettify
              </button>
              <button type="button" onClick={minify} className="btn btn-ghost btn-sm">
                Minify
              </button>
              <button
                type="button"
                onClick={() => copyText(rawJson, 'Source')}
                className="btn btn-ghost btn-sm"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="editor-wrap">
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              placeholder="Paste JSON here…"
              spellCheck={false}
              aria-label="Raw JSON source"
              aria-invalid={error !== null}
            />
          </div>

          {error && (
            <div className="editor-error" role="alert">
              <div className="editor-error-title">
                <AlertTriangle size={14} aria-hidden="true" />
                Syntax error
              </div>
              {error}
            </div>
          )}
        </section>

        <section className="panel" aria-label="JSON structure diagram">
          <div className="metrics-rail">
            <span>
              Size <strong>{formatBytes(metrics.bytes)}</strong>
            </span>
            <span>
              Keys <strong>{metrics.totalKeys}</strong>
            </span>
            <span>
              Depth <strong>{metrics.maxDepth}</strong>
            </span>
            <div className="metrics-rail-actions">
              <button type="button" onClick={expandAll} className="btn btn-ghost btn-sm">
                <Maximize2 size={12} aria-hidden="true" />
                Expand all
              </button>
              <button type="button" onClick={collapseAll} className="btn btn-ghost btn-sm">
                <Minimize2 size={12} aria-hidden="true" />
                Collapse all
              </button>
            </div>
          </div>

          <div className="tree-scroll">
            <TreeView
              data={data}
              hasError={error !== null}
              expandDepth={expandDepth}
              overrides={overrides}
              onToggle={handleToggle}
              searchQuery={searchQuery}
              onCopy={copyText}
              lastCopied={lastCopied}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
