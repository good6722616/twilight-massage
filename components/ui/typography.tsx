import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      listItem: "leading-7",
      table: "w-full overflow-y-auto",
      tableHeader:
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
      tableCell:
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
      tableRow: "even:bg-muted m-0 border-t p-0",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "p",
    size: "base",
    weight: "normal",
    align: "left",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    { className, variant, size, weight, align, as, children, ...props },
    ref
  ) => {
    const Component = as || getDefaultElement(variant || "p")

    return (
      <Component
        className={cn(
          typographyVariants({ variant, size, weight, align, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Typography.displayName = "Typography"

function getDefaultElement(variant: string): React.ElementType {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "h5":
      return "h5"
    case "h6":
      return "h6"
    case "blockquote":
      return "blockquote"
    case "code":
      return "code"
    case "lead":
      return "p"
    case "large":
      return "div"
    case "small":
      return "small"
    case "muted":
      return "p"
    case "list":
      return "ul"
    case "listItem":
      return "li"
    case "table":
      return "table"
    case "tableHeader":
      return "th"
    case "tableCell":
      return "td"
    case "tableRow":
      return "tr"
    default:
      return "p"
  }
}

// Convenience components for common use cases
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h1" {...props} />)
H1.displayName = "H1"

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h2" {...props} />)
H2.displayName = "H2"

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h3" {...props} />)
H3.displayName = "H3"

export const H4 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h4" {...props} />)
H4.displayName = "H4"

export const H5 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h5" {...props} />)
H5.displayName = "H5"

export const H6 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="h6" {...props} />)
H6.displayName = "H6"

export const P = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="p" {...props} />)
P.displayName = "P"

export const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="blockquote" {...props} />)
Blockquote.displayName = "Blockquote"

export const Code = React.forwardRef<
  HTMLElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="code" {...props} />)
Code.displayName = "Code"

export const Lead = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="lead" {...props} />)
Lead.displayName = "Lead"

export const Large = React.forwardRef<
  HTMLDivElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="large" {...props} />)
Large.displayName = "Large"

export const Small = React.forwardRef<
  HTMLElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="small" {...props} />)
Small.displayName = "Small"

export const Muted = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="muted" {...props} />)
Muted.displayName = "Muted"

export const List = React.forwardRef<
  HTMLUListElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="list" {...props} />)
List.displayName = "List"

export const ListItem = React.forwardRef<
  HTMLLIElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="listItem" {...props} />)
ListItem.displayName = "ListItem"

export const Table = React.forwardRef<
  HTMLTableElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="table" {...props} />)
Table.displayName = "Table"

export const TableHeader = React.forwardRef<
  HTMLTableCellElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="tableHeader" {...props} />)
TableHeader.displayName = "TableHeader"

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="tableCell" {...props} />)
TableCell.displayName = "TableCell"

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  Omit<TypographyProps, "variant">
>((props, ref) => <Typography ref={ref} variant="tableRow" {...props} />)
TableRow.displayName = "TableRow"

export { Typography, typographyVariants }
