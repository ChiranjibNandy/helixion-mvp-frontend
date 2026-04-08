import type { Metadata } from 'next';
import './globals.css'
import React from 'react';

export const metadata: Metadata = {
  title: 'Helixion — Enterprise Multi-Role Platform',
  description: 'Sign in or create your Helixion workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 p-0 bg-bgMain font-sans">{children}</body>
    </html>
  );
}