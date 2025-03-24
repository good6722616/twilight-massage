export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
    facebook?: string
    instagram?: string
    twitter?: string
  }
  ogImage: string
}

export type ContactConfig = {
  email: string
  phone?: string
  address?: string
  businessHours?: {
    weekday: string
    weekend: string
    days: string
  }
}

export type Settings = {
  themeToggleEnabled: boolean
}

export type Layout = {
  heroHeader: string
  featureCards: string
  headers: {
    featureCards: string
    features: string
  }
}
