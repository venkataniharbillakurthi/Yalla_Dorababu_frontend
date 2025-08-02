// api.js
// Central API utility with robust fetch wrapper and env-backed base URL

const API_BASE_URL = import.meta.env.VITE_API_URL || (() => {
  console.warn(
    'VITE_API_URL not set; falling back to default tunnel. This may be incorrect in production.'
  );
  return 'https://incentive-warned-limited-wealth.trycloudflare.com';
})();

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!res.ok) {
    console.error('API error', res.status, text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (!contentType.includes('application/json')) {
    console.warn('Expected JSON but got:', contentType, 'body:', text.slice(0, 200));
    throw new Error('Invalid response format (not JSON)');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('JSON parse failed:', text);
    throw err;
  }
}

// Message endpoints
export async function submitContactMessage({ name, email, message }) {
  return safeFetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
}

export async function fetchContactMessages() {
  return safeFetch(`${API_BASE_URL}/api/messages`);
}

export async function deleteContactMessage(id) {
  await safeFetch(`${API_BASE_URL}/api/messages/${id}`, {
    method: 'DELETE',
  });
  return true;
}

// Speeches
export async function fetchSpeeches() {
  return safeFetch(`${API_BASE_URL}/api/speeches`);
}

export async function fetchSpeechesByCategory(category) {
  return safeFetch(`${API_BASE_URL}/api/speeches/category/${encodeURIComponent(category)}`);
}

export async function searchSpeeches(query) {
  return safeFetch(`${API_BASE_URL}/api/speeches/search?q=${encodeURIComponent(query)}`);
}

export async function fetchSpeechById(id) {
  return safeFetch(`${API_BASE_URL}/api/speeches/${id}`);
}

export async function fetchSpeechCategories() {
  return safeFetch(`${API_BASE_URL}/api/speeches/categories`);
}

// Gallery
export async function fetchGalleryPhotos() {
  return safeFetch(`${API_BASE_URL}/api/gallery`);
}

export async function fetchGalleryPhotosByCategory(category) {
  return safeFetch(`${API_BASE_URL}/api/gallery/category/${encodeURIComponent(category)}`);
}

export async function fetchFeaturedGalleryPhotos() {
  return safeFetch(`${API_BASE_URL}/api/gallery/featured`);
}

export async function searchGalleryPhotos(query) {
  return safeFetch(`${API_BASE_URL}/api/gallery/search?q=${encodeURIComponent(query)}`);
}

export async function fetchGalleryPhotoById(id) {
  return safeFetch(`${API_BASE_URL}/api/gallery/${id}`);
}

export async function fetchGalleryCategories() {
  return safeFetch(`${API_BASE_URL}/api/gallery/categories`);
}

// Media
export async function fetchMedia() {
  return safeFetch(`${API_BASE_URL}/api/media`);
}

export async function fetchMediaByType(type) {
  return safeFetch(`${API_BASE_URL}/api/media/type/${encodeURIComponent(type)}`);
}

export async function fetchMediaByCategory(category) {
  return safeFetch(`${API_BASE_URL}/api/media/category/${encodeURIComponent(category)}`);
}

export async function fetchFeaturedMedia() {
  return safeFetch(`${API_BASE_URL}/api/media/featured`);
}

export async function fetchMediaWithVideo() {
  return safeFetch(`${API_BASE_URL}/api/media/video`);
}

export async function fetchMediaWithAudio() {
  return safeFetch(`${API_BASE_URL}/api/media/audio`);
}

export async function searchMedia(query) {
  return safeFetch(`${API_BASE_URL}/api/media/search?q=${encodeURIComponent(query)}`);
}

export async function fetchMediaById(id) {
  return safeFetch(`${API_BASE_URL}/api/media/${id}`);
}

export async function fetchMediaTypes() {
  return safeFetch(`${API_BASE_URL}/api/media/types`);
}

export async function fetchMediaCategories() {
  return safeFetch(`${API_BASE_URL}/api/media/categories`);
}

// Journey
export async function fetchJourneyEvents() {
  return safeFetch(`${API_BASE_URL}/api/journey-events`);
}

export async function fetchJourneyEventsByCategory(category) {
  return safeFetch(`${API_BASE_URL}/api/journey-events/category/${encodeURIComponent(category)}`);
}

export async function fetchMilestoneEvents() {
  return safeFetch(`${API_BASE_URL}/api/journey-events/milestones`);
}

export async function fetchJourneyEventsByYear(year) {
  return safeFetch(`${API_BASE_URL}/api/journey-events/year/${encodeURIComponent(year)}`);
}

export async function fetchJourneyEventsByYearRange(startYear, endYear) {
  return safeFetch(
    `${API_BASE_URL}/api/journey-events/year-range?startYear=${encodeURIComponent(
      startYear
    )}&endYear=${encodeURIComponent(endYear)}`
  );
}

export async function searchJourneyEvents(query) {
  return safeFetch(`${API_BASE_URL}/api/journey-events/search?q=${encodeURIComponent(query)}`);
}

export async function fetchJourneyEventById(id) {
  return safeFetch(`${API_BASE_URL}/api/journey-events/${id}`);
}

export async function fetchJourneyCategories() {
  return safeFetch(`${API_BASE_URL}/api/journey-events/categories`);
}

export async function fetchJourneyYears() {
  return safeFetch(`${API_BASE_URL}/api/journey-events/years`);
}
