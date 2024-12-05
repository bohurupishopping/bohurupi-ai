import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
    isSticky?: boolean
  }
>(({ className, isSticky, ...props }, ref) => (
  <nav 
    ref={ref} 
    aria-label="breadcrumb" 
    className={cn(
      "relative z-20 mb-4 px-3 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl",
      "border border-gray-100/80 dark:border-gray-700/80 shadow-sm",
      "transition-all duration-200 ease-in-out",
      isSticky && "sticky top-0 animate-in fade-in-50 slide-in-from-top-5",
      className
    )}
    {...props} 
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
    isHome?: boolean
  }
>(({ asChild, className, children, isHome, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1",
        "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
        "hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
        "transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
    >
      {isHome && <Home className="h-3.5 w-3.5" />}
      {children}
    </Comp>
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(
      "inline-flex items-center rounded-md px-2 py-1",
      "font-medium text-gray-900 dark:text-white",
      "bg-gray-100/50 dark:bg-gray-700/50",
      className
    )}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5 text-gray-400 dark:text-gray-500", className)}
    {...props}
  >
    {children ?? <ChevronRight className="opacity-50" />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex items-center justify-center h-8 w-8 rounded-md",
      "text-gray-400 dark:text-gray-500",
      "hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
      "transition-all duration-200",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
