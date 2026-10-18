import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Switch 1.0 Youth Empowerment Platform',
    short_name: 'Switch 1.0',
    description: 'Youth Tech & Vocational Empowerment Platform partnered with GYF',
    start_url: '/',
    display: 'standalone',
    background_color: '#071E26',
    theme_color: '#0C4A60',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logos/switch-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/logos/switch-logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/logos/switch-logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable',
      },
    ],
  };
}
