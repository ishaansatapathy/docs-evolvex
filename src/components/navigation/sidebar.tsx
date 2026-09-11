'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import type { NavigationNode, NavigationPresentation, NavigationSection, SidebarCollection } from '@/data/docs'
import { Icon } from '@/components/mdx/rich-content'
import { layout, typography } from '@/config/layout'
import { cn } from '@/lib/utils'
import { NavigationTree } from '@/components/navigation/navigation-tree'
import { CollectionSelector } from '@/components/navigation/collection-selector'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

interface SidebarProps {
  sections: Array<NavigationSection>
  title: string
  collections?: Array<SidebarCollection>
  activeCollectionId?: string
  onCollectionChange?: (id: string) => void
  navigationPresentation?: NavigationPresentation
  showGroupIcons?: boolean
  className?: string
}

export function Sidebar({
  sections,
  title,
  collections = [],
  activeCollectionId,
  onCollectionChange,
  navigationPresentation = { display: 'tabs' },
  showGroupIcons = true,
  className,
}: SidebarProps) {
  const pathname = usePathname()
  const asideRef = useRef<HTMLElement>(null)
  const [width, setWidth] = useState(232)
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!asideRef.current) return
      const rect = asideRef.current.getBoundingClientRect()
      const newWidth = Math.max(160, Math.min(380, e.clientX - rect.left))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const shouldShowSelector = navigationPresentation.display === 'dropdown'
    && collections.length >= 2
    && Boolean(activeCollectionId && onCollectionChange)

  return (
    <aside
      ref={asideRef}
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
      className={cn('thally-docs-sidebar relative hidden shrink-0 bg-background lg:block transition-[width] duration-150', className)}
    >
      {/* Draggable resizer edge — swipe / drag from the side to adjust */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsCollapsed(!isCollapsed)}
        title="Drag edge to resize, double-click to collapse"
        className={cn(
          "absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-30 group flex items-center justify-center transition-colors select-none",
          isResizing ? "bg-[#ef4444]/40" : "hover:bg-[#ef4444]/20"
        )}
      >
        <div className={cn(
          "w-[1.5px] h-8 rounded-full transition-colors",
          isResizing ? "bg-[#ef4444]" : "bg-border/60 group-hover:bg-[#ef4444]/80"
        )} />
      </div>

      {/* Stay in the shell's flow so optional site banners reserve their own
          space above the brand, then pin the navigation once they scroll away. */}
      <div
        style={{ width: isCollapsed ? '48px' : `${width}px` }}
        className={cn('sticky top-[var(--docs-header-height,60px)] flex h-[calc(100dvh-var(--docs-header-height,60px))] flex-col overflow-hidden', layout.sidebarPadding)}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center pt-2 gap-4">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar"
              className="p-2 rounded-lg border border-border/60 hover:border-[#ef4444]/40 hover:text-[#ef4444] bg-muted/30 transition-colors"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-1 pt-1 flex items-center justify-between gap-1">
              {shouldShowSelector ? (
                <CollectionSelector
                  collections={collections}
                  activeCollectionId={activeCollectionId!}
                  onCollectionChange={onCollectionChange!}
                />
              ) : (
                <p className="line-clamp-1 px-2 text-sm font-semibold leading-6 text-foreground flex-1">{title}</p>
              )}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar (gives more room to center columns)"
                className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
            <nav className="scrollbar-hide mt-2.5 min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-y-contain pb-5">
              {sections.map((section, index) => {
                const nodes: Array<NavigationNode> = section.nodes
                  ?? section.items.map((item) => ({ type: 'page' as const, item }))
                return (
                  <div key={section.id ?? `${section.title}-${index}`} className="thally-docs-sidebar-group space-y-2.5">
                    {section.title !== title ? (
                      <p className={cn(typography.meta, 'flex items-center gap-2 px-2 text-sm font-semibold normal-case leading-6 tracking-normal text-foreground')}>
                        {showGroupIcons && section.icon ? (
                          <Icon icon={section.icon} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : null}
                        <span className="truncate">{section.title}</span>
                      </p>
                    ) : null}
                    <div className="space-y-px">
                      <NavigationTree
                        nodes={nodes}
                        pathname={pathname}
                        showGroupIcons={showGroupIcons}
                      />
                    </div>
                  </div>
                )
              })}
            </nav>
          </>
        )}
      </div>
    </aside>
  )
}
