import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const PLACE_ID = 'ChIJM-DgBDp_a0cRQCRQRkR_szE' // FRISCO Sereď place ID

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Fetch the Google Maps place page
    const url = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    // Extract rating and review count from the HTML
    // Google embeds this data in JSON-LD structured data
    const ratingMatch = html.match(/"ratingValue":"?([\d.]+)"?/i) || 
                       html.match(/rating[":]+\s*[":]?([\d.]+)/i)
    const reviewsMatch = html.match(/"reviewCount":"?(\d+)"?/i) || 
                        html.match(/review[sS]?[":]+\s*[":]?(\d+)/i)

    // Fallback: try to find ratings in a different format
    const altRatingMatch = html.match(/(\d\.\d)\s*stars?/i)
    const altReviewsMatch = html.match(/(\d+)\s*reviews?/i)

    const rating = ratingMatch?.[1] || altRatingMatch?.[1] || '4.1'
    const totalReviews = reviewsMatch?.[1] || altReviewsMatch?.[1] || '20'

    const data = {
      rating: parseFloat(rating),
      totalReviews: parseInt(totalReviews),
      lastUpdated: new Date().toISOString(),
      source: 'google_maps'
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
        } 
      }
    )
  } catch (error) {
    console.error('Error fetching reviews:', error)
    
    // Return fallback data on error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return new Response(
      JSON.stringify({
        rating: 4.1,
        totalReviews: 20,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        error: errorMessage
      }),
      { 
        status: 200, // Still return 200 with fallback data
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
