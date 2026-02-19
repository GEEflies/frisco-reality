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
    // Load logo using fs (Node.js runtime)
    const logoPath = join(process.cwd(), 'public', 'frisco-logo-opt.png');
    const logoSrc = readFileSync(logoPath);

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
                    {/* @ts-ignore */}
                    <img
                        src={logoSrc.buffer as any}
                        width="500"
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
