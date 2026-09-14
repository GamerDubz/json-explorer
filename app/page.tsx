'use client'

import { useState, useMemo, useRef } from 'react'

const SAMPLES = {
  github: {
    id: 1024883,
    login: 'octocat',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco, CA',
    bio: 'GitHub mascot and developer advocate.',
    public_repos: 8,
    public_gists: 4,
    followers: 9420,
    following: 9,
    created_at: '2011-01-25T18:44:36Z',
    site_admin: false,
    hireable: null,
    plan: {
      name: 'enterprise_cloud',
      space: 976562499,
      collaborators: 0,
      private_repos: 9999,
    },
    repositories: [
      {
        id: 1296269,
        name: 'Hello-World',
        full_name: 'octocat/Hello-World',
        private: false,
        stars: 2840,
        forks: 2190,
        topics: ['octocat', 'git', 'sample'],
      },
      {
        id: 1826182,
        name: 'Spoon-Knife',
        full_name: 'octocat/Spoon-Knife',
        private: false,
        stars: 12450,
        forks: 139200,
        topics: ['forking', 'practice'],
      },
    ],
  },
  ecommerce: {
    order_id: 'ord_9281740912',
    currency: 'USD',
    subtotal: 189.5,
    tax: 15.16,
    total: 204.66,
    is_gift: false,
    customer: {
      id: 'cust_84920',
      email: 'alex.vance@example.com',
      tier: 'VIP',
      verified: true,
      tags: ['electronics', 'early_adopter'],
    },
    shipping_address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postal_code: '97477',
      country: 'USA',
    },
    items: [
      {
        sku: 'DEV-MECH-KB-01',
        title: 'Wireless Mechanical Keyboard',
        qty: 1,
        unit_price: 149.0,
        switches: 'Gateron Brown',
        in_stock: true,
      },
      {
        sku: 'DEV-CBL-USB-03',
        title: 'Coiled Aviator Cable (Black)',
        qty: 1,
        unit_price: 40.5,
        in_stock: true,
      },
    ],
  },
  geojson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
        },
        properties: {
          city: 'San Francisco',
          elevation_meters: 16,
          active_nodes: 42,
          monitored: true,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-74.006, 40.7128],
        },
        properties: {
          city: 'New York City',
          elevation_meters: 10,
          active_nodes: 88,
          monitored: true,
        },
      },
    ],
  },
}

export default function JsonExplorerPage() {
  const [rawJson, setRawJson] = useState<string>(JSON.stringify(SAMPLES.github, null, 2))
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedTooltip, setCopiedTooltip] = useState<string | null>(null)
  const [expandDepth, setExpandDepth] = useState<number>(3)
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set())

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parse JSON safely
  const { parsedData, parseError, metrics } = useMemo(() => {
    try {
      const data = JSON.parse(rawJson)

      let totalKeys = 0
      let maxDepth = 0

      const calculateMetrics = (val: unknown, depth = 1) => {
        maxDepth = Math.max(maxDepth, depth)
        if (val && typeof val === 'object') {
          const isArr = Array.isArray(val)
          const keys = Object.keys(val)
          totalKeys += keys.length
          keys.forEach((k) => {
            // @ts-expect-error key index
            calculateMetrics(val[k], depth + 1)
          })
        }
      }
      calculateMetrics(data)

      return {
        parsedData: data,
        parseError: null,
        metrics: {
          bytes: new Blob([rawJson]).size,
          totalKeys,
          maxDepth,
          isArr: Array.isArray(data),
          count: Array.isArray(data) ? data.length : Object.keys(data).length,
        },
      }
    } catch (err: unknown) {
      const message = (err as Error).message
      return {
        parsedData: null,
        parseError: message,
        metrics: {
          bytes: new Blob([rawJson]).size,
          totalKeys: 0,
          maxDepth: 0,
          isArr: false,
          count: 0,
        },
      }
    }
  }, [rawJson])

  // Copy helper
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTooltip(`Copied ${label}!`)
    setTimeout(() => setCopiedTooltip(null), 2000)
  }

  // Prettify
  const prettify = () => {
    try {
      const obj = JSON.parse(rawJson)
      setRawJson(JSON.stringify(obj, null, 2))
    } catch {
      // ignore
    }
  }

  // Minify
  const minify = () => {
    try {
      const obj = JSON.parse(rawJson)
      setRawJson(JSON.stringify(obj))
    } catch {
      // ignore
    }
  }

  // Load sample
  const loadSample = (key: keyof typeof SAMPLES) => {
    setRawJson(JSON.stringify(SAMPLES[key], null, 2))
    setCollapsedPaths(new Set())
    setSearchQuery('')
  }

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setRawJson(content)
      setCollapsedPaths(new Set())
    }
    reader.readAsText(file)
  }

  // Download JSON
  const downloadJson = () => {
    const blob = new Blob([rawJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleCollapse = (path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const expandAll = () => {
    setCollapsedPaths(new Set())
  }

  const collapseAll = () => {
    const allPaths = new Set<string>()
    const findPaths = (val: unknown, currentPath = '$') => {
      if (val && typeof val === 'object') {
        allPaths.add(currentPath)
        Object.keys(val).forEach((k) => {
          const next = Array.isArray(val) ? `${currentPath}[${k}]` : `${currentPath}.${k}`
          // @ts-expect-error key index
          findPaths(val[k], next)
        })
      }
    }
    findPaths(parsedData)
    setCollapsedPaths(allPaths)
  }

  // Tree Node Renderer Component
  const renderTreeNode = (
    keyName: string | number | null,
    value: unknown,
    currentPath: string,
    depth = 0
  ) => {
    const isObject = value !== null && typeof value === 'object'
    const isArray = Array.isArray(value)
    const isCollapsed =
      collapsedPaths.has(currentPath) || (depth >= expandDepth && !collapsedPaths.has(`expanded:${currentPath}`))

    // Search query match
    const q = searchQuery.toLowerCase()
    const keyMatches = q && String(keyName).toLowerCase().includes(q)
    const valueMatches = q && !isObject && String(value).toLowerCase().includes(q)
    const pathMatches = q && currentPath.toLowerCase().includes(q)

    if (isObject) {
      const keys = Object.keys(value as object)
      const count = keys.length

      return (
        <div key={currentPath} className="font-mono text-xs leading-relaxed">
          <div className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-neutral-850 group cursor-pointer">
            {/* Collapse toggle */}
            <button
              onClick={() => toggleCollapse(currentPath)}
              className="w-4 h-4 rounded flex items-center justify-center text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              {isCollapsed ? '+' : '−'}
            </button>

            {/* Key Name */}
            {keyName !== null && (
              <span
                onClick={() => copyText(currentPath.replace(/^\$\.?/, ''), 'path')}
                className={`text-cyan-400 hover:underline ${
                  keyMatches || pathMatches ? 'bg-cyan-500/20 text-cyan-200 px-1 rounded font-bold' : ''
                }`}
                title="Click to copy path"
              >
                &quot;{keyName}&quot;:
              </span>
            )}

            {/* Structure preview */}
            <span
              onClick={() => toggleCollapse(currentPath)}
              className="text-neutral-500 font-semibold"
            >
              {isArray ? `Array(${count}) [` : `Object {`}
            </span>

            {isCollapsed && (
              <span
                onClick={() => toggleCollapse(currentPath)}
                className="text-neutral-600 text-[11px] select-none hover:text-neutral-400"
              >
                ... {isArray ? ']' : '}'}
              </span>
            )}

            {/* Actions on hover */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 ml-auto text-[10px] text-neutral-500">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyText(currentPath.replace(/^\$\.?/, ''), 'path')
                }}
                className="hover:text-cyan-400 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
              >
                Path
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyText(JSON.stringify(value, null, 2), 'value')
                }}
                className="hover:text-cyan-400 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
              >
                Value
              </button>
            </div>
          </div>

          {/* Children nodes */}
          {!isCollapsed && (
            <div className="pl-5 border-l border-neutral-800/80 ml-2 my-0.5 space-y-0.5">
              {keys.map((k) => {
                const childPath = isArray ? `${currentPath}[${k}]` : `${currentPath}.${k}`
                // @ts-expect-error key index
                return renderTreeNode(isArray ? Number(k) : k, value[k], childPath, depth + 1)
              })}
              <div className="text-neutral-500">{isArray ? ']' : '}'}</div>
            </div>
          )}
        </div>
      )
    }

    // Primitive values rendering
    let valElement = null
    if (typeof value === 'string') {
      valElement = (
        <span
          className={`text-emerald-400 ${valueMatches ? 'bg-emerald-500/20 px-1 rounded font-bold' : ''}`}
        >
          &quot;{value}&quot;
        </span>
      )
    } else if (typeof value === 'number') {
      valElement = (
        <span
          className={`text-amber-400 font-semibold ${valueMatches ? 'bg-amber-500/20 px-1 rounded font-bold' : ''}`}
        >
          {value}
        </span>
      )
    } else if (typeof value === 'boolean') {
      valElement = (
        <span
          className={`text-purple-400 font-semibold ${valueMatches ? 'bg-purple-500/20 px-1 rounded font-bold' : ''}`}
        >
          {String(value)}
        </span>
      )
    } else if (value === null) {
      valElement = <span className="text-neutral-500 italic">null</span>
    } else {
      valElement = <span className="text-neutral-400">{String(value)}</span>
    }

    return (
      <div
        key={currentPath}
        className="font-mono text-xs py-0.5 px-1 pl-6 rounded hover:bg-neutral-850 flex items-center gap-1.5 group"
      >
        {keyName !== null && (
          <span
            onClick={() => copyText(currentPath.replace(/^\$\.?/, ''), 'path')}
            className={`text-neutral-400 cursor-pointer hover:text-cyan-400 ${
              keyMatches ? 'bg-cyan-500/20 text-cyan-200 px-1 rounded font-bold' : ''
            }`}
            title="Click to copy path"
          >
            &quot;{keyName}&quot;:
          </span>
        )}
        <span
          onClick={() => copyText(String(value), 'value')}
          className="cursor-pointer hover:opacity-80"
          title="Click to copy value"
        >
          {valElement}
        </span>

        {/* Quick action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 ml-auto text-[10px] text-neutral-500">
          <button
            onClick={() => copyText(currentPath.replace(/^\$\.?/, ''), 'path')}
            className="hover:text-cyan-400 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
          >
            Path
          </button>
          <button
            onClick={() => copyText(String(value), 'value')}
            className="hover:text-cyan-400 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800"
          >
            Value
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 font-mono text-sm">
            {'{;}'}
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none flex items-center gap-2">
              JSON Explorer
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                v2.0
              </span>
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">Interactive JSON Inspector &amp; Structure Navigator</p>
          </div>
        </div>

        {/* Action Header Items */}
        <div className="flex items-center gap-2">
          {/* Sample Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg text-xs">
            <span className="text-[11px] text-neutral-500 px-2">Samples:</span>
            <button
              onClick={() => loadSample('github')}
              className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              GitHub User
            </button>
            <button
              onClick={() => loadSample('ecommerce')}
              className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              Order &amp; Cart
            </button>
            <button
              onClick={() => loadSample('geojson')}
              className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              GeoJSON
            </button>
          </div>

          {/* Upload & Download */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-xs font-medium text-neutral-300 transition-colors"
          >
            Upload File
          </button>
          <button
            onClick={downloadJson}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all active:scale-98"
          >
            Export .json
          </button>
        </div>
      </header>

      {/* Copied notification toast */}
      {copiedTooltip && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-neutral-950 font-semibold px-4 py-2 rounded-xl shadow-xl border border-cyan-400 text-xs animate-bounce">
          {copiedTooltip}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Editor Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Raw JSON Input</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prettify}
                className="px-2 py-1 rounded text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                title="Format with 2 spaces"
              >
                Prettify
              </button>
              <button
                onClick={minify}
                className="px-2 py-1 rounded text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                title="Minify JSON"
              >
                Minify
              </button>
              <button
                onClick={() => copyText(rawJson, 'raw JSON')}
                className="px-2 py-1 rounded text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex flex-col">
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              className="flex-1 w-full bg-neutral-950 p-4 font-mono text-xs text-neutral-300 outline-none resize-none selection:bg-neutral-800 leading-relaxed border-none"
              placeholder="Paste valid or invalid JSON here..."
              spellCheck={false}
            />

            {/* Error banner if invalid */}
            {parseError && (
              <div className="bg-red-500/10 border-t border-red-500/30 p-3 text-xs text-red-400 font-mono">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span>✕ Syntax Error</span>
                </div>
                <div className="text-[11px] opacity-90">{parseError}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Tree & Metrics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
          {/* Metrics bar */}
          <div className="px-5 py-3 border-b border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-neutral-400">
                Size: <strong className="text-neutral-200">{(metrics.bytes / 1024).toFixed(1)} KB</strong>
              </span>
              <span className="text-neutral-400">
                Keys: <strong className="text-neutral-200">{metrics.totalKeys}</strong>
              </span>
              <span className="text-neutral-400">
                Depth: <strong className="text-neutral-200">{metrics.maxDepth}</strong>
              </span>
            </div>

            {/* Expand / Collapse Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={expandAll}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-medium"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-5 py-2.5 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search keys, values, or path (e.g. followers, true, plan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-200 placeholder-neutral-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-500 hover:text-neutral-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Tree View */}
          <div className="flex-1 overflow-y-auto p-5 bg-neutral-950/90">
            {parsedData !== null ? (
              renderTreeNode('$', parsedData, '$', 0)
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500 text-sm">
                <svg className="w-10 h-10 mb-2 opacity-30 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Unable to render tree. Please fix syntax errors in the left editor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
