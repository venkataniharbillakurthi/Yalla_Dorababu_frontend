import React, { useState, useEffect } from 'react';
import secureApi from '../utils/secureApi';

// Required .env variables:
// VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
// VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
const empty = {
  titleEn: '',
  titleHi: '',
  date: '',
  locationEn: '',
  locationHi: '',
  category: '',
  descriptionEn: '',
  descriptionHi: '',
  thumbnail: '',
  url: '', // for videoUrl
  duration: ''
};
const SpeechesManager = () => {
  const [speeches, setSpeeches] = useState([]);
  const [draft, setDraft] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all speeches from backend
  const fetchSpeeches = async () => {
    setIsLoading(true);
    try {
      const response = await secureApi.get('/speeches');
      if (response.ok) {
        let data = await response.json();
        // Sort so newest (by id) is last
        data = data.sort((a, b) => (a.id || 0) - (b.id || 0));
        setSpeeches(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeeches();
  }, []);

  const startEdit = (item) => {
    setDraft({
      ...empty,
      ...item,
      date: item.date ? item.date : '',
      url: item.videoUrl || ''
    });
    setEditingId(item.id);
  };
  const reset = () => { setDraft(empty); setEditingId(null); };
  const save = async () => {
    if (!draft.category) {
      alert('Category is required.');
      return;
    }
    setIsLoading(true);
    try {
      // Prepare payload for backend
      const payload = {
        titleEn: draft.titleEn,
        titleHi: draft.titleHi,
        date: draft.date,
        locationEn: draft.locationEn,
        locationHi: draft.locationHi,
        category: draft.category,
        descriptionEn: draft.descriptionEn,
        descriptionHi: draft.descriptionHi,
        thumbnail: draft.thumbnail,
        videoUrl: draft.url,
        duration: draft.duration
      };
      if (editingId) {
        await secureApi.put(`/speeches/${editingId}`, payload);
      } else {
        await secureApi.post('/speeches', payload);
      }
      fetchSpeeches();
      reset();
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        await secureApi.delete(`/speeches/${id}`);
        fetchSpeeches();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lorvens';
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhzhuobu2';

  // Handler for image upload
  const handleImageUpload = async (e) => {
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
      setDraft({ ...draft, thumbnail: result.secure_url });
    } else {
      alert('Image upload failed.');
    }
  };
  // Handler for video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    if (result.secure_url) {
      // Get video duration using a temporary video element
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = result.secure_url;
      tempVideo.onloadedmetadata = function() {
        window.URL.revokeObjectURL(tempVideo.src);
        const seconds = tempVideo.duration;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        setDraft(prev => ({ ...prev, url: result.secure_url, duration: formatted }));
      };
    } else {
      alert('Video upload failed.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Speeches & Addresses</h2>
      <table className="w-full text-left text-sm mb-6"><thead><tr><th>Title (EN)</th><th /></tr></thead><tbody>
        {speeches.map((s) => (
          <tr key={s.id} className="border-b"><td className="py-1">{s.titleEn}</td><td className="text-right">
            <button className="btn-sm" onClick={() => startEdit(s)} disabled={isLoading}>Edit</button>
            <button className="btn-sm text-red-600 ml-2" onClick={() => handleDelete(s.id)} disabled={isLoading}>Delete</button>
          </td></tr>
        ))}
      </tbody></table>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <input
          placeholder="Title (EN)"
          className="input"
          value={draft.titleEn || ''}
          onChange={e => setDraft({ ...draft, titleEn: e.target.value })}
          required
        />
        <input
          placeholder="Title (HI)"
          className="input"
          value={draft.titleHi || ''}
          onChange={e => setDraft({ ...draft, titleHi: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date"
          className="input"
          value={draft.date || ''}
          onChange={e => setDraft({ ...draft, date: e.target.value })}
          required
        />
        <input
          placeholder="Location (EN)"
          className="input"
          value={draft.locationEn || ''}
          onChange={e => setDraft({ ...draft, locationEn: e.target.value })}
        />
        <input
          placeholder="Location (HI)"
          className="input"
          value={draft.locationHi || ''}
          onChange={e => setDraft({ ...draft, locationHi: e.target.value })}
        />
        <select
          className="input"
          value={draft.category || ''}
          onChange={e => setDraft({ ...draft, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="security">Security</option>
          <option value="defense">Defense</option>
          <option value="economy">Economy</option>
          <option value="education">Education</option>
          <option value="development">Development</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="agriculture">Agriculture</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="environment">Environment</option>
          <option value="foreign">Foreign Policy</option>
          <option value="employment">Employment</option>
          <option value="other">Other</option>
        </select>
        <input
          placeholder="Thumbnail URL"
          className="input"
          value={draft.thumbnail || ''}
          onChange={e => setDraft({ ...draft, thumbnail: e.target.value })}
        />
        {/* Cloudinary image upload */}
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={handleImageUpload}
        />
        <input
          placeholder="Video URL"
          className="input"
          value={draft.url || ''}
          onChange={e => setDraft({ ...draft, url: e.target.value })}
        />
        {/* Cloudinary video upload */}
        <input
          type="file"
          accept="video/*"
          className="mt-2"
          onChange={handleVideoUpload}
        />
        <input
          placeholder="Duration (e.g. 45:00)"
          className="input"
          value={draft.duration || ''}
          onChange={e => setDraft({ ...draft, duration: e.target.value })}
        />
        <textarea
          placeholder="Description (EN)"
          className="input col-span-2"
          value={draft.descriptionEn || ''}
          onChange={e => setDraft({ ...draft, descriptionEn: e.target.value })}
          rows={2}
        />
        <textarea
          placeholder="Description (HI)"
          className="input col-span-2"
          value={draft.descriptionHi || ''}
          onChange={e => setDraft({ ...draft, descriptionHi: e.target.value })}
          rows={2}
        />
      </div>
      <button className="btn-primary mt-4" onClick={save} disabled={isLoading}>{editingId?'Save':'Add'}</button>
      {editingId && <button className="btn ml-2" onClick={reset} disabled={isLoading}>Cancel</button>}
    </div>
  );
};
export default SpeechesManager;
