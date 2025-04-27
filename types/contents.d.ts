import { IconKeys } from "@/components/icons"

export type HeroHeader = {
  header: string
  subheader: string
  image: string
}

export type Content = {
  text: string
  subtext: string
  duration?: string
  icon?: IconKeys
  price?: string
  image?: string
  bookingLink?: string
  benefits?: string[]
}

export type ContentSection = {
  header: string
  subheader: string
  image?: string
  content: Array<Content>
  price?: string
}
