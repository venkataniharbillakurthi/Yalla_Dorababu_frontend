import React, { useState, useEffect } from 'react';
import secureApi from '../utils/secureApi';

const empty = { year: '', titleEn: '', titleHi: '', descriptionEn: '', descriptionHi: '', image: '' };

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lorvens';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhzhuobu2';

const JourneyManager = () => {
  const [journey, setJourney] = useState([]);
  const [draft, setDraft] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all journey events from backend
  const fetchJourney = async () => {
    setIsLoading(true);
    try {
      const response = await secureApi.get('/journey-events');
      if (response.ok) {
        let data = await response.json();
        // Sort so newest (by id) is last
        data = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        setJourney(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  const startEdit = (item) => {
    setDraft({ ...empty, ...item });
    setEditingId(item.id);
  };

  const reset = () => {
    setDraft(empty);
    setEditingId(null);
  };

  const save = async () => {
    setIsLoading(true);
    try {
      if (editingId) {
        await secureApi.put(`/journey-events/${editingId}`, draft);
      } else {
        await secureApi.post('/journey-events', draft);
      }
      fetchJourney();
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        await secureApi.delete(`/journey-events/${id}`);
        fetchJourney();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Add this handler for file uploads
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    if (result.secure_url) {
      setDraft({ ...draft, image: result.secure_url });
    } else {
      alert('Image upload failed.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Life Journey</h2>
      {/* Table */}
      <table className="w-full text-left text-sm mb-6">
        <thead><tr><th>Year</th><th>Title (EN)</th><th /></tr></thead>
        <tbody>
          {journey.map((j) => (
            <tr key={j.id} className="border-b">
              <td className="py-1">{j.year}</td>
              <td>{j.titleEn}</td>
              <td className="text-right">
                <button
                  className="inline-block px-3 py-1 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                  onClick={() => startEdit(j)}
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button
                  className="inline-block px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                  onClick={() => handleDelete(j.id)}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Year"
              value={draft.year}
              onChange={e => setDraft({ ...draft, year: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN) *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Title in English"
              value={draft.titleEn}
              onChange={e => setDraft({ ...draft, titleEn: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (HI)</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Title in Hindi"
              value={draft.titleHi}
              onChange={e => setDraft({ ...draft, titleHi: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Image URL"
              value={draft.image}
              onChange={e => setDraft({ ...draft, image: e.target.value })}
            />
            {/* Cloudinary file upload */}
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={handleFileChange}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Description in English"
              value={draft.descriptionEn}
              onChange={e => setDraft({ ...draft, descriptionEn: e.target.value })}
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (HI)</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Description in Hindi"
              value={draft.descriptionHi}
              onChange={e => setDraft({ ...draft, descriptionHi: e.target.value })}
              rows={2}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={save}
            disabled={isLoading}
          >
            {editingId ? 'Save' : 'Add'}
          </button>
          {editingId && (
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={reset}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default JourneyManager;
