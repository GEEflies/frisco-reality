import { NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = 'ChIJl_Du-49na0cRlwm_v28NCKs'; // Frisco Sereď Place ID

export async function GET() {
    if (!GOOGLE_PLACES_API_KEY) {
        return NextResponse.json(
            { error: 'Missing Google Places API Key' },
            { status: 500 }
        );
    }

    try {
        // Use Text Search (New) to find the place dynamically and get fresh data
        const url = 'https://places.googleapis.com/v1/places:searchText';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                'X-Goog-FieldMask': 'places.rating,places.userRatingCount'
            },
            body: JSON.stringify({
                textQuery: 'FRISCO, s.r.o. Sereď'
            }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const place = data.places?.[0];

        if (!place) {
            throw new Error('Place not found');
        }

        return NextResponse.json({
            rating: place.rating,
            totalReviews: place.userRatingCount,
            lastUpdated: new Date().toISOString(),
            source: 'google-api'
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });

    } catch (error) {
        console.error('Error fetching Google Reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
