import "./globals.css"
import { siteConfig, contactConfig } from "@/config/site"
import { Urbanist } from "next/font/google"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { settings } from "@/config/settings"
import { Toaster } from "sonner"
import { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"

const urbanist = Urbanist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url.base),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@twilightmassagespa",
  },
  verification: {
    google: "your-google-site-verification",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          href="/twilight_logo_black_wotext.png"
          type="image/png"
        />
      </head>
      <body
        className={`${urbanist.className} flex min-h-screen flex-col bg-background text-primary`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: siteConfig.name,
              description: siteConfig.description,
              image: siteConfig.ogImage,
              address: {
                "@type": "PostalAddress",
                streetAddress: contactConfig.address,
                addressLocality: "Lake Forest",
                addressRegion: "CA",
                postalCode: "92630",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "33.616570",
                longitude: "-117.705647",
              },
              telephone: contactConfig.phone,
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "10:00",
                  closes: "20:30",
                },
              ],
              sameAs: [
                siteConfig.url.facebook,
                siteConfig.url.instagram,
                siteConfig.url.twitter,
              ],
            }),
          }}
        />
        {settings.themeToggleEnabled ? (
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        ) : (
          <ThemeProvider attribute="class" forcedTheme="light" enableSystem>
            <Navbar />
            {children}
            <Footer />
          </ThemeProvider>
        )}
        <Toaster position="top-center" />
        <GoogleAnalytics gaId="G-G3MCW7WFM7" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16988843566"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16988843566');
            `,
          }}
        />
      </body>
    </html>
  )
}
