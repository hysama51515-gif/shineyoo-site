import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  metadataBase: new URL('https://shineyoo.shop'),
  title: 'ShineYOO | Modern Handbag House',
  description:
    'ShineYOO is a modern handbag house exploring timeless elegance through form, texture, and restraint.',
  openGraph: {
    title: 'ShineYOO | Modern Handbag House',
    description: 'A luxury visual presentation of modern handbags, crafted with quiet elegance.',
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
