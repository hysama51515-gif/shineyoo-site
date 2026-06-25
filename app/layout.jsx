import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  metadataBase: new URL('https://shineyoo.shop'),
  title: 'ShineYOO | Modern Women’s Bags',
  description:
    'ShineYOO designs elegant, lightweight handbags for modern women across work, daily styling, travel, and evenings out.',
  openGraph: {
    title: 'ShineYOO | Modern Women’s Bags',
    description: 'Premium handbags with elegant structure, soft neutral tones, and daily versatility.',
    url: 'https://shineyoo.shop',
    siteName: 'ShineYOO',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
