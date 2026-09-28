import { Hind_Siliguri } from 'next/font/google';
import './globals.css';

const font = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata = {
  title: 'Smart Solution | Bangladesh Digital Center OS',
  description: 'Client-side digital-center workspace for Bangladesh computer shops, printing presses and citizens.',
  keywords: ['passport photo cropper', 'invoice generator', 'VAT calculator Bangladesh', 'image compressor', 'পাসপোর্ট ছবি', 'ভ্যাট ক্যালকুলেটর'],
  openGraph: { title: 'Smart Solution', description: 'Smart digital solutions by MSR Technologies', type: 'website', locale: 'bn_BD' },
  other: {
    'google-adsense-account': 'ca-pub-6608561249557105',
  },
};

const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Smart Solution', creator: { '@type': 'Organization', name: 'MSR Technologies' }, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' } };

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6608561249557105"
          crossOrigin="anonymous"
        />
      </head>
      <body className={font.className} style={{"--font-bangla": font.style.fontFamily}}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
