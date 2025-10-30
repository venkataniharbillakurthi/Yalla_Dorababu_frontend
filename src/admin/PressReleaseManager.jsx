import React, { useState, useEffect } from 'react';
import secureApi from '../utils/secureApi';

const emptyMedia = () => ({
  id: '',
  titleEn: '',
  titleHi: '',
  descriptionEn: '',
  descriptionHi: '',
  type: 'press_release', // default to press_release
  date: new Date().toISOString().split('T')[0],
  imageUrl: '', // for press_release/photo
  videoUrl: '', // for interview
  thumbnail: '', // for all types
});

const PressReleaseManager = () => {
  const [media, setMedia] = useState([]);
  const [draft, setDraft] = useState(emptyMedia());
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all media items from backend
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await secureApi.get('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const startEdit = (item) => {
    setDraft({ ...emptyMedia(), ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const reset = () => {
    setDraft(emptyMedia());
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const itemData = { ...draft };
      if (editingId) {
        await secureApi.put(`/api/media/${editingId}`, itemData);
      } else {
        await secureApi.post('/api/media', itemData);
      }
      fetchMedia();
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        await secureApi.delete(`/api/media/${id}`);
        fetchMedia();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const CLOUDINARY_UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lorvens').trim();
  const CLOUDINARY_CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhzhuobu2').trim();

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
      setDraft({ ...draft, imageUrl: result.secure_url });
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
      setDraft({ ...draft, videoUrl: result.secure_url });
    } else {
      alert('Video upload failed.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Press Release Manager</h2>
        <button
          onClick={() => { reset(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Press Release
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title (EN)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {media.length > 0 ? (
              media.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.titleEn}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No press releases found. Click the "Add Press Release" button to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{editingId ? 'Edit' : 'Add New'} Press Release</h3>
              <button onClick={reset} className="text-gray-400 hover:text-gray-500 focus:outline-none">X</button>
            </div>
            <form
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto"
              onSubmit={e => { e.preventDefault(); handleSave(); }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={draft.type}
                  onChange={e => setDraft({ ...draft, type: e.target.value })}
                  required
                >
                  <option value="press_release">Press Release</option>
                  <option value="interview">Interview</option>
                  <option value="photo">Photo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Title *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={draft.titleEn}
                  onChange={e => setDraft({ ...draft, titleEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hindi Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={draft.titleHi}
                  onChange={e => setDraft({ ...draft, titleHi: e.target.value })}
                />
              </div>
              {(draft.type === 'press_release' || draft.type === 'interview') && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={draft.descriptionEn}
                      onChange={e => setDraft({ ...draft, descriptionEn: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (HI)</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={draft.descriptionHi}
                      onChange={e => setDraft({ ...draft, descriptionHi: e.target.value })}
                      rows={2}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={draft.date || ''}
                  onChange={e => setDraft({ ...draft, date: e.target.value })}
                />
              </div>
              {draft.type === 'press_release' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={draft.imageUrl}
                    onChange={e => setDraft({ ...draft, imageUrl: e.target.value })}
                    required
                  />
                  {/* Cloudinary image upload */}
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              {draft.type === 'interview' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={draft.videoUrl}
                    onChange={e => setDraft({ ...draft, videoUrl: e.target.value })}
                    required
                  />
                  {/* Cloudinary video upload */}
                  <input
                    type="file"
                    accept="video/*"
                    className="mt-2"
                    onChange={handleVideoUpload}
                  />
                </div>
              )}
              {draft.type === 'photo' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={draft.imageUrl}
                    onChange={e => setDraft({ ...draft, imageUrl: e.target.value })}
                    required
                  />
                  {/* Cloudinary image upload */}
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              {/* Thumbnail field for all types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={draft.thumbnail || ''}
                  onChange={e => setDraft({ ...draft, thumbnail: e.target.value })}
                />
                {/* Cloudinary thumbnail upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={async (e) => {
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
                      setDraft(draft => ({ ...draft, thumbnail: result.secure_url }));
                    } else {
                      alert('Thumbnail upload failed.');
                    }
                  }}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={reset}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
                  disabled={isLoading}
                >
                  {editingId ? 'Update' : 'Create'} Press Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressReleaseManager;
