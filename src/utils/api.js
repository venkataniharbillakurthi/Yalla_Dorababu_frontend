// API utility for backend communication
// Uses fetch; can be swapped for axios if preferred

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://must-selective-invention-haiti.trycloudflare.com';

// Submit a new contact message
export async function submitContactMessage({ name, email, message }) {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit message');
  }
  return response.json();
}

// Fetch all contact messages (admin)
export async function fetchContactMessages() {
  const response = await fetch(`${API_BASE_URL}/api/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

// Delete a contact message by ID (admin)
export async function deleteContactMessage(id) {
  const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
  return true;
}

// Speech API functions
export async function fetchSpeeches() {
  const response = await fetch(`${API_BASE_URL}/api/speeches`);
  if (!response.ok) {
    throw new Error('Failed to fetch speeches');
  }
  return response.json();
}

export async function fetchSpeechesByCategory(category) {
  const response = await fetch(`${API_BASE_URL}/api/speeches/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch speeches by category');
  }
  return response.json();
}

export async function searchSpeeches(query) {
  const response = await fetch(`${API_BASE_URL}/api/speeches/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search speeches');
  }
  return response.json();
}

export async function fetchSpeechById(id) {
  const response = await fetch(`${API_BASE_URL}/api/speeches/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch speech');
  }
  return response.json();
}

export async function fetchSpeechCategories() {
  const response = await fetch(`${API_BASE_URL}/api/speeches/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch speech categories');
  }
  return response.json();
}

// Gallery API functions
export async function fetchGalleryPhotos() {
  const response = await fetch(`${API_BASE_URL}/api/gallery`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery photos');
  }
  return response.json();
}

export async function fetchGalleryPhotosByCategory(category) {
  const response = await fetch(`${API_BASE_URL}/api/gallery/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery photos by category');
  }
  return response.json();
}

export async function fetchFeaturedGalleryPhotos() {
  const response = await fetch(`${API_BASE_URL}/api/gallery/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured gallery photos');
  }
  return response.json();
}

export async function searchGalleryPhotos(query) {
  const response = await fetch(`${API_BASE_URL}/api/gallery/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search gallery photos');
  }
  return response.json();
}

export async function fetchGalleryPhotoById(id) {
  const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery photo');
  }
  return response.json();
}

export async function fetchGalleryCategories() {
  const response = await fetch(`${API_BASE_URL}/api/gallery/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery categories');
  }
  return response.json();
}

// Media API functions
export async function fetchMedia() {
  const response = await fetch(`${API_BASE_URL}/api/media`);
  if (!response.ok) {
    throw new Error('Failed to fetch media');
  }
  return response.json();
}

export async function fetchMediaByType(type) {
  const response = await fetch(`${API_BASE_URL}/api/media/type/${type}`);
  if (!response.ok) {
    throw new Error('Failed to fetch media by type');
  }
  return response.json();
}

export async function fetchMediaByCategory(category) {
  const response = await fetch(`${API_BASE_URL}/api/media/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch media by category');
  }
  return response.json();
}

export async function fetchFeaturedMedia() {
  const response = await fetch(`${API_BASE_URL}/api/media/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured media');
  }
  return response.json();
}

export async function fetchMediaWithVideo() {
  const response = await fetch(`${API_BASE_URL}/api/media/video`);
  if (!response.ok) {
    throw new Error('Failed to fetch media with video');
  }
  return response.json();
}

export async function fetchMediaWithAudio() {
  const response = await fetch(`${API_BASE_URL}/api/media/audio`);
  if (!response.ok) {
    throw new Error('Failed to fetch media with audio');
  }
  return response.json();
}

export async function searchMedia(query) {
  const response = await fetch(`${API_BASE_URL}/api/media/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search media');
  }
  return response.json();
}

export async function fetchMediaById(id) {
  const response = await fetch(`${API_BASE_URL}/api/media/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch media');
  }
  return response.json();
}

export async function fetchMediaTypes() {
  const response = await fetch(`${API_BASE_URL}/api/media/types`);
  if (!response.ok) {
    throw new Error('Failed to fetch media types');
  }
  return response.json();
}

export async function fetchMediaCategories() {
  const response = await fetch(`${API_BASE_URL}/api/media/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch media categories');
  }
  return response.json();
}

// Journey API functions
export async function fetchJourneyEvents() {
  const response = await fetch(`${API_BASE_URL}/api/journey-events`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey events');
  }
  return response.json();
}

export async function fetchJourneyEventsByCategory(category) {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/category/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey events by category');
  }
  return response.json();
}

export async function fetchMilestoneEvents() {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/milestones`);
  if (!response.ok) {
    throw new Error('Failed to fetch milestone events');
  }
  return response.json();
}

export async function fetchJourneyEventsByYear(year) {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/year/${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey events by year');
  }
  return response.json();
}

export async function fetchJourneyEventsByYearRange(startYear, endYear) {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/year-range?startYear=${startYear}&endYear=${endYear}`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey events by year range');
  }
  return response.json();
}

export async function searchJourneyEvents(query) {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search journey events');
  }
  return response.json();
}

export async function fetchJourneyEventById(id) {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey event');
  }
  return response.json();
}

export async function fetchJourneyCategories() {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey categories');
  }
  return response.json();
}

export async function fetchJourneyYears() {
  const response = await fetch(`${API_BASE_URL}/api/journey-events/years`);
  if (!response.ok) {
    throw new Error('Failed to fetch journey years');
  }
  return response.json();
}

// Add more API functions as needed (e.g., fetchMediaById, fetchMediaByType, etc.)
