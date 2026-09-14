import { useRef, type KeyboardEvent } from 'react'
import { AlertTriangle } from 'lucide-react'
import { JsonNode } from '@/components/json-node'

interface TreeViewProps {
  data: unknown
  hasError: boolean
  expandDepth: number
  overrides: Map<string, boolean>
  onToggle: (path: string, currentlyCollapsed: boolean) => void
  searchQuery: string
  onCopy: (text: string, label: string) => void
  lastCopied: string | null
}

/**
 * Hosts the recursive JSON tree plus roving arrow-key navigation between
 * expand/collapse toggles, so the diagram is fully operable without a mouse.
 */
export function TreeView({
  data,
  hasError,
  expandDepth,
  overrides,
  onToggle,
  searchQuery,
  onCopy,
  lastCopied,
}: TreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const container = containerRef.current
    if (!container) return

    const toggles = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-tree-toggle]'))
    const activeIndex = toggles.indexOf(document.activeElement as HTMLButtonElement)
    if (activeIndex === -1) return

    event.preventDefault()
    const nextIndex = event.key === 'ArrowDown' ? activeIndex + 1 : activeIndex - 1
    const next = toggles[Math.min(Math.max(nextIndex, 0), toggles.length - 1)]
    next?.focus()
  }

  if (data === null && !hasError) {
    return (
      <div className="tree-empty">
        <span className="tree-empty-mark" aria-hidden="true">
          {'{ }'}
        </span>
        <p>Nothing to diagram yet. Paste JSON on the left to begin.</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="tree-empty tree-empty-error">
        <AlertTriangle size={28} strokeWidth={1.5} aria-hidden="true" />
        <p>Unable to render the diagram — fix the syntax error in the source panel.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="tree-root"
      role="group"
      aria-label="JSON structure"
      onKeyDown={handleKeyDown}
    >
      <JsonNode
        keyName={null}
        value={data}
        path="$"
        depth={0}
        expandDepth={expandDepth}
        overrides={overrides}
        onToggle={onToggle}
        searchQuery={searchQuery}
        onCopy={onCopy}
        lastCopied={lastCopied}
      />
    </div>
  )
}
