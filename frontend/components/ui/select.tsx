"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"
import { clsx } from "clsx"

// Select context
interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

// Select root component
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRef }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// Select trigger component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}

export function SelectTrigger({ 
  children, 
  className, 
  "aria-label": ariaLabel,
  ...props 
}: SelectTriggerProps) {
  const { open, setOpen, triggerRef } = useSelectContext()

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-label={ariaLabel}
      className={clsx(
        "neu-button flex h-10 w-full items-center justify-between rounded-md px-3 py-2 text-sm",
        "hover:shadow-neu-button-hover focus:outline-none focus:ring-2 focus:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

// Select value component
interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext()
  
  return (
    <span className={clsx(
      value ? "text-foreground" : "text-muted-foreground"
    )}>
      {value || placeholder}
    </span>
  )
}

// Select content component
interface SelectContentProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SelectContent({ children, className, style }: SelectContentProps) {
  const { open, setOpen, triggerRef } = useSelectContext()
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)

  const updatePosition = React.useCallback(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      // Use viewport coordinates for fixed positioning
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
    }
  }, [open])

  React.useEffect(() => {
    updatePosition()
  }, [open, updatePosition])

  React.useEffect(() => {
    const handleScroll = () => {
      if (open) {
        updatePosition()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      // Update position on scroll
      window.addEventListener("scroll", handleScroll, true)
      window.addEventListener("resize", updatePosition)
      document.addEventListener("mousedown", handleClickOutside)
      
      return () => {
        window.removeEventListener("scroll", handleScroll, true)
        window.removeEventListener("resize", updatePosition)
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [open, setOpen, updatePosition])

  if (!open) return null

  const content = (
    <div
      ref={contentRef}
      className={clsx(
        "neu-raised fixed z-[99999] min-w-[8rem] overflow-visible rounded-md border border-border",
        "bg-card text-card-foreground shadow-lg",
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        ...style
      }}
    >
      <div className="p-1 overflow-visible" style={{ backgroundColor: style?.backgroundColor || 'transparent' }}>
        {children}
      </div>
    </div>
  )

  // Render in portal so dropdown always appears above other content (avoids overlay/stacking issues)
  if (typeof document !== "undefined") {
    return createPortal(content, document.body)
  }
  return content
}

// Select item component
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ 
  value, 
  children, 
  className,
  ...props 
}: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext()

  const handleClick = () => {
    onValueChange(value)
    setOpen(false)
  }

  return (
    <div
      className={clsx(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "transition-all duration-200 ease-in-out border border-transparent",
        "hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md hover:z-10 hover:border-gray-400 hover:border-2",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selectedValue === value && "bg-accent text-accent-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}
