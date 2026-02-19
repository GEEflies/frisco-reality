import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Route segment config
export const runtime = 'nodejs';

// Image metadata
export const alt = 'Frisco Reality - Premium Real Estate';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    let logoSrc: Buffer | null = null;

    try {
        // Load logo using fs (Node.js runtime)
        const logoPath = join(process.cwd(), 'public', 'frisco-logo-opt.png');
        logoSrc = readFileSync(logoPath);
    } catch (e) {
        console.error('Failed to load logo image:', e);
    }

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#1B3A5F',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Logo Container */}
                <div style={{ display: 'flex' }}>
                    {logoSrc ? (
                        /* @ts-ignore */
                        <img
                            src={logoSrc.buffer as any}
                            width="500"
                            style={{
                                objectFit: 'contain',
                            }}
                        />
                    ) : (
                        <div style={{
                            fontSize: 60,
                            color: 'white',
                            fontFamily: 'sans-serif',
                            fontWeight: 'bold',
                            letterSpacing: '-0.02em',
                        }}>
                            FRISCO REALITY
                        </div>
                    )}
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
