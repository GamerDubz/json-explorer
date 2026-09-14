import type { ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { displayPath } from '@/lib/json-tree'

export interface JsonNodeProps {
  keyName: string | number | null
  value: unknown
  path: string
  depth: number
  expandDepth: number
  overrides: Map<string, boolean>
  onToggle: (path: string, currentlyCollapsed: boolean) => void
  searchQuery: string
  onCopy: (text: string, label: string) => void
  lastCopied: string | null
}

function isContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === 'object'
}

function resolveCollapsed(path: string, depth: number, expandDepth: number, overrides: Map<string, boolean>) {
  const defaultCollapsed = depth >= expandDepth
  return overrides.has(path) ? overrides.get(path)! : defaultCollapsed
}

function CopyAction({ label, text, onCopy, lastCopied }: {
  label: string
  text: string
  onCopy: (text: string, label: string) => void
  lastCopied: string | null
}) {
  const copied = lastCopied === `${label}:${text}`
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onCopy(text, label)
      }}
      className="node-action"
      aria-label={`Copy ${label.toLowerCase()} ${copied ? '(copied)' : ''}`.trim()}
    >
      {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
      <span>{label}</span>
    </button>
  )
}

export function JsonNode({
  keyName,
  value,
  path,
  depth,
  expandDepth,
  overrides,
  onToggle,
  searchQuery,
  onCopy,
  lastCopied,
}: JsonNodeProps) {
  const isArray = Array.isArray(value)
  const container = isContainer(value)
  const collapsed = container && resolveCollapsed(path, depth, expandDepth, overrides)

  const q = searchQuery.trim().toLowerCase()
  const keyMatches = q.length > 0 && keyName !== null && String(keyName).toLowerCase().includes(q)
  const valueMatches = q.length > 0 && !container && String(value).toLowerCase().includes(q)
  const cleanPath = displayPath(path)

  if (container) {
    const entries = Object.keys(value as object)
    const count = entries.length
    const bracketOpen = isArray ? '[' : '{'
    const bracketClose = isArray ? ']' : '}'

    return (
      <div className="tree-node">
        <div className="tree-row group">
          <button
            type="button"
            data-tree-toggle
            aria-expanded={!collapsed}
            aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${keyName === null ? 'root' : String(keyName)}`}
            onClick={() => onToggle(path, collapsed ?? false)}
            className="tree-toggle"
          >
            <span aria-hidden="true">{collapsed ? '+' : '−'}</span>
          </button>

          {keyName !== null && (
            <span className={`json-key ${keyMatches ? 'match' : ''}`}>&quot;{keyName}&quot;</span>
          )}
          {keyName !== null && <span className="json-punct">:</span>}

          <span className="json-punct node-clickable" onClick={() => onToggle(path, collapsed ?? false)}>
            {isArray ? `Array(${count})` : `Object`} {bracketOpen}
            {collapsed && <span className="tree-ellipsis"> … {bracketClose}</span>}
          </span>

          <div className="node-actions">
            <CopyAction label="Path" text={cleanPath} onCopy={onCopy} lastCopied={lastCopied} />
            <CopyAction
              label="Value"
              text={JSON.stringify(value, null, 2)}
              onCopy={onCopy}
              lastCopied={lastCopied}
            />
          </div>
        </div>

        {!collapsed && (
          <div className="tree-children">
            {entries.map((key) => {
              const childPath = isArray ? `${path}[${key}]` : `${path}.${key}`
              return (
                <JsonNode
                  key={childPath}
                  keyName={isArray ? Number(key) : key}
                  value={(value as Record<string, unknown>)[key]}
                  path={childPath}
                  depth={depth + 1}
                  expandDepth={expandDepth}
                  overrides={overrides}
                  onToggle={onToggle}
                  searchQuery={searchQuery}
                  onCopy={onCopy}
                  lastCopied={lastCopied}
                />
              )
            })}
            <div className="json-punct tree-close">{bracketClose}</div>
          </div>
        )}
      </div>
    )
  }

  let valueNode: ReactNode
  let valueClass = 'json-string'
  if (typeof value === 'string') {
    valueClass = 'json-string'
    valueNode = <>&quot;{value}&quot;</>
  } else if (typeof value === 'number') {
    valueClass = 'json-number'
    valueNode = value
  } else if (typeof value === 'boolean') {
    valueClass = 'json-boolean'
    valueNode = String(value)
  } else if (value === null) {
    valueClass = 'json-null'
    valueNode = 'null'
  } else {
    valueClass = 'json-null'
    valueNode = String(value)
  }

  return (
    <div className="tree-row leaf group">
      <span className="tree-bullet" aria-hidden="true" />
      {keyName !== null && (
        <>
          <span className={`json-key ${keyMatches ? 'match' : ''}`}>&quot;{keyName}&quot;</span>
          <span className="json-punct">:</span>
        </>
      )}
      <span className={`${valueClass} ${valueMatches ? 'match' : ''}`}>{valueNode}</span>

      <div className="node-actions">
        <CopyAction label="Path" text={cleanPath} onCopy={onCopy} lastCopied={lastCopied} />
        <CopyAction label="Value" text={String(value)} onCopy={onCopy} lastCopied={lastCopied} />
      </div>
    </div>
  )
}
