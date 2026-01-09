import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const book = searchParams.get('book') || 'Génesis';
        const chapter = searchParams.get('chapter') || '1';
        const verse = searchParams.get('verse') || '1';
        const text = searchParams.get('text') || 'En el principio creó Dios los cielos y la tierra.';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
                        color: '#fff',
                        fontFamily: 'serif',
                        padding: '40px 80px',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Border */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            right: '20px',
                            bottom: '20px',
                            border: '2px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '20px',
                        }}
                    />

                    {/* Title / Reference */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <span
                            style={{
                                color: '#FFD700', // Gold
                                fontSize: 24,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                            }}
                        >
                            La Biblia 3D
                        </span>
                    </div>

                    {/* Verse Text */}
                    <div
                        style={{
                            display: 'flex',
                            textAlign: 'center',
                            fontSize: 48,
                            lineHeight: 1.4,
                            color: '#e5e5e5',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            maxWidth: '900px',
                        }}
                    >
                        "{text}"
                    </div>

                    {/* Reference Footer */}
                    <div
                        style={{
                            marginTop: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                height: '1px',
                                width: '50px',
                                background: '#FFD700',
                            }}
                        />
                        <span
                            style={{
                                color: '#FFD700',
                                fontSize: 32,
                                fontStyle: 'italic',
                            }}
                        >
                            {book} {chapter}:{verse}
                        </span>
                        <div
                            style={{
                                height: '1px',
                                width: '50px',
                                background: '#FFD700',
                            }}
                        />
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
