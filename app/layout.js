import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mavimaris.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Marmaris Boat Trip & Blue Route Experience | MAVIMARIS",
  description:
    "Discover Marmaris by sea with swim stops, clear bays, BBQ lunch and unlimited drinks. Contact MAVIMARIS directly on WhatsApp.",
  keywords: [
    "Marmaris boat trip",
    "Marmaris boat tour",
    "Marmaris blue cruise",
    "Marmaris swim stops",
    "Marmaris BBQ boat trip",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "MAVIMARIS",
    title: "MAVIMARIS | Marmaris Boat Experience",
    description:
      "A full day shaped by crystal-clear bays, swim stops, BBQ lunch and the rhythm of the sea.",
    images: [
      {
        url: "/images/cove-boat.webp",
        width: 1200,
        height: 900,
        alt: "A boat resting in a turquoise bay near Marmaris",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ru_RU", "it_IT", "tr_TR"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAVIMARIS | Marmaris Boat Experience",
    description:
      "A timeless full-day boat experience along Marmaris' blue route.",
    images: ["/images/cove-boat.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "MAVIMARIS Marmaris Boat Experience",
  description:
    "A seven-hour Marmaris boat experience with scenic bays, swim stops, BBQ lunch and unlimited drinks.",
  image: [
    `${siteUrl}/images/cove-boat.webp`,
    `${siteUrl}/images/crystal-bay.webp`,
  ],
  touristType: ["Families", "Couples", "Groups"],
  itinerary: {
    "@type": "ItemList",
    itemListElement: [
      "Marmaris Harbour",
      "Aquarium Bay",
      "Phosphorous Cave",
      "Amos and Kumlubuk Bay",
      "Turunc",
      "Green Sea Bay",
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  },
  provider: {
    "@type": "LocalBusiness",
    name: "MAVIMARIS",
    telephone: "+90 544 270 11 57",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marmaris",
      addressRegion: "Mugla",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90 544 270 11 57",
      contactType: "reservations",
      availableLanguage: ["English", "Russian", "Italian", "Turkish"],
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable}`}
    >
      <body className={poppins.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
