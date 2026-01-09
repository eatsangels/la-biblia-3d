import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'La Biblia 3D',
        short_name: 'Biblia 3D',
        description: 'Una experiencia inmersiva de las Sagradas Escrituras.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#FFD700',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
