export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { query, location } = req.body
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Google Places API key not configured' })
  if (!query || !location) return res.status(400).json({ error: 'Category and location required' })

  // Clean business name - remove junk suffixes, encoding artifacts, franchise noise
  function cleanName(name) {
    if (!name) return null
    return name
      .replace(/\s*[-–|]\s*(Pty Ltd|Pty\. Ltd\.|PTY LTD|LLC|Inc\.|Ltd\.?)$/i, '')
      .replace(/&#\d+;/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  // Validate Australian address - must contain an Australian state or postcode
  function isAustralianAddress(addr) {
    if (!addr) return false
    const au = /\b(NSW|VIC|QLD|SA|WA|TAS|NT|ACT|New South Wales|Victoria|Queensland|South Australia|Western Australia|Tasmania|Northern Territory|Australian Capital Territory|Australia)\b/i
    return au.test(addr)
  }

  // Validate and format Australian phone
  function cleanPhone(phone) {
    if (!phone) return null
    const digits = phone.replace(/[^\d+]/g, '')
    const isAU = (
      /^(\+?61|0)[2-9]\d{8}$/.test(digits) ||
      /^04\d{8}$/.test(digits) ||
      /^1[38]00\d{6}$/.test(digits) ||
      /^\+614\d{8}$/.test(digits)
    )
    if (!isAU) return null
    if (digits.startsWith('614')) return '+' + digits
    if (digits.startsWith('61')) return '+' + digits
    if (digits.length === 10 && digits.startsWith('04'))
      return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
    if (digits.length === 10 && digits.startsWith('0'))
      return '(' + digits.slice(0,2) + ') ' + digits.slice(2,6) + ' ' + digits.slice(6)
    if (/^1[38]00/.test(digits))
      return digits.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
    return null
  }

  // Validate email - basic check + filter obvious non-contacts
  function cleanEmail(email) {
    if (!email) return null
    const lower = email.toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
    const junk = ['noreply','no-reply','donotreply','example.','sentry.','wixpress.',
                  'schema.org','w3.org','@2x','wordpress.','shopify.','squarespace.']
    if (junk.some(j => lower.includes(j))) return null
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.js')) return null
    return email
  }

  try {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' ' + location + ', Australia')}&region=au&language=en-AU&key=${apiKey}`
    )
    const searchData = await searchRes.json()
    if (!searchData.results?.length) return res.status(200).json({ leads: [] })

    const leads = await Promise.all(
      searchData.results.slice(0, 20).map(async (place) => {
        try {
          const detailRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,rating,user_ratings_total,business_status,types&key=${apiKey}`
          )
          const { result: d } = await detailRes.json()

          const name = cleanName(d.name || place.name)
          if (!name) return null

          const address = d.formatted_address || place.formatted_address || ''

          // Skip results that aren't actually in Australia
          if (!isAustralianAddress(address)) return null

          const phone = cleanPhone(d.formatted_phone_number)

          let score = 50, websiteSignal = 'No website', tier = 'Cold'
          if (!d.website) {
            score += 40; websiteSignal = 'No website'
          } else {
            const url = d.website.toLowerCase()
            if (url.includes('facebook') || url.includes('instagram')) { score += 25; websiteSignal = 'Social only' }
            else if (url.includes('wix') || url.includes('squarespace') || url.includes('weebly') || url.includes('wordpress.com')) { score += 15; websiteSignal = 'Basic builder' }
            else { score += 5; websiteSignal = 'Has website' }
          }
          if (d.rating && d.rating < 4.0) score += 5
          if (!d.user_ratings_total || d.user_ratings_total < 20) score += 5
          score = Math.min(99, score)
          if (score >= 75) tier = 'Hot'
          else if (score >= 50) tier = 'Warm'

          return {
            id: place.place_id,
            name,
            phone,
            website: d.website || null,
            address,
            rating: d.rating || null,
            reviewCount: d.user_ratings_total || 0,
            websiteSignal, score, tier,
            types: d.types || [],
            email: null,
            category: query
          }
        } catch { return null }
      })
    )
    return res.status(200).json({ leads: leads.filter(Boolean).sort((a,b) => b.score - a.score) })
  } catch (err) {
    return res.status(500).json({ error: 'Search failed' })
  }
}
