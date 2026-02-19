import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Frisco Reality - Premium Real Estate';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
    // Font loading (optional, using system fonts for simplicity first, or fetching if needed)
    // For now, we'll just use a clean sans-serif stack and the logo image.

    // We need to fetch the logo. In Edge runtime, we can't use fs.
    // We'll use the deployed URL or a direct fetch if local, but for local dev `fetch` to localhost might be tricky in edge.
    // Actually, standard practice for static assets in `opengraph-image` is often just to embed them if small, or fetch them.
    // Since `frisco-logo.png` is in public, we can try to fetch it using the absolute URL if we had it, but `import` is better if we can.
    // However, importing images in Edge functions can be tricky with Webpack.
    // Let's try to just render the text "FRISCO REALITY" nicely first if image loading is complex, 
    // OR use an absolute URL if we know it. 
    // BETTER APPROACH: Use `img` tag with absolute URL if possible, OR just simple CSS shapes/text.
    // Given the user wants the LOGO, I should try to load it.
    // The reliable way in Next.js internal `opengraph-image` is to use `fetch(new URL('../../public/frisco-logo.png', import.meta.url))`.

    const logoSrc = await fetch(new URL('../../public/frisco-logo-opt.png', import.meta.url)).then(
        (res) => res.arrayBuffer()
    );

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
                    <img
                        src={logoSrc as any}
                        width="400"
                        height="143" // Aspect ratio of 310677 bytes image? Need to guess or check dimensions. 
                        // frisco-logo-opt.png is 310KB, might be large.
                        // Let's assume standard aspect ratio or just use width and allow height auto (but flex needs care).
                        // Safer to just use CSS styles for img.
                        style={{
                            width: '500px',
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
