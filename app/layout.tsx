import './globals.css';

export const metadata = {
  title: 'EWL Hyperdrive OS',
  description: 'EPOXY WILL CHANGE YOUR LIFE admin command center'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
