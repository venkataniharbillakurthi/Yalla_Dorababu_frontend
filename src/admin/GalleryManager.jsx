import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Image as ImageIcon, Save, Plus, Loader2 } from 'lucide-react';
import secureApi from '../utils/secureApi';

// Required .env variables:
// VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
// VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

// Categories that match the Gallery component
const CATEGORIES = [
  'official', 'events', 'public', 'media', 
  'infrastructure', 'education', 'speeches', 
  'interviews', 'documentaries'
];

// Empty item template
const emptyItem = (type = 'photo') => ({
  id: '',
  titleEn: '',
  titleHi: '',
  descriptionEn: '',
  descriptionHi: '',
  category: '',
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  url: '',
  thumbnail: '',
  type,
  ...(type === 'video' ? { duration: '00:00' } : {})
});

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState(emptyItem());
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('photos');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'lorvens').trim();
  const CLOUDINARY_CLOUD_NAME = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dhzhuobu2').trim();

  // Handler for image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setUploading(false);
      if (result.secure_url) {
        setDraft({ ...draft, url: result.secure_url });
      } else {
        alert('Image upload failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (err) {
      setUploading(false);
      alert('Image upload failed: ' + err.message);
    }
  };

  // Handler for video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setUploading(false);
      if (result.secure_url) {
        setDraft({ ...draft, url: result.secure_url });
      } else {
        alert('Video upload failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (err) {
      setUploading(false);
      alert('Video upload failed: ' + err.message);
    }
  };

  // Fetch all items from backend
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await secureApi.get('/gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const startEdit = (item) => {
    setDraft({ ...emptyItem(item.type), ...item });
    setEditingId(item.id);
    setShowForm(true);
  };

  const reset = () => {
    setDraft(emptyItem(activeTab === 'videos' ? 'video' : 'photo'));
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let itemData = { ...draft, type: activeTab === 'videos' ? 'video' : 'photo' };
      if (editingId) {
        await secureApi.put(`/gallery/${editingId}`, itemData);
      } else {
        // Assign sortOrder as the next highest for the current type
        const maxSortOrder = items
          .filter(item => item.type === itemData.type)
          .reduce((max, item) => Math.max(max, item.sortOrder || 0), 0);
        itemData = { ...itemData, sortOrder: maxSortOrder + 1 };
        await secureApi.post('/gallery', itemData);
      }
      fetchItems();
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        await secureApi.delete(`/gallery/${id}`);
        fetchItems();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter items based on type and sort by sortOrder
  const currentItems = (activeTab === 'photos'
    ? items.filter(item => item.type === 'photo')
    : items.filter(item => item.type === 'video'))
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  // Add this helper function inside the GalleryManager component
  const moveItem = (index, direction) => {
    const updatedItems = [...items];
    const filtered = updatedItems
      .map((item, idx) => ({ ...item, _originalIndex: idx }))
      .filter(item => item.type === (activeTab === 'photos' ? 'photo' : 'video'));
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    // Move the item in the filtered list
    const [moved] = filtered.splice(index, 1);
    filtered.splice(targetIndex, 0, moved);

    // Reassign sortOrder sequentially
    filtered.forEach((item, i) => {
      updatedItems[item._originalIndex].sortOrder = i + 1;
    });

    // Call backend to persist
    fetch('/api/gallery/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItems.map(({ id, sortOrder }) => ({ id, sortOrder }))),
    }).then(() => {
      fetchItems();
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery Manager</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              reset();
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add {activeTab === 'photos' ? 'Photo' : 'Highlight'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'photos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'videos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('videos')}
        >
          Highlights
        </button>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title (EN)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems?.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      {item.thumbnail || item.url ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.titleEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'><path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z'/><path d='M9 9h6v6H9z'/></svg>`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.titleEn || 'Untitled'}</div>
                    <div className="text-sm text-gray-500">{item.titleHi || 'बिना शीर्षक'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category || 'uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-orange-600"
                      title="Move Up"
                    >▲</button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === currentItems.length - 1}
                      className="text-gray-500 hover:text-orange-600"
                      title="Move Down"
                    >▼</button>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No {activeTab === 'photos' ? 'photos' : 'highlights'} found. Click the "Add {activeTab === 'photos' ? 'Photo' : 'Highlight'}" button to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingId ? 'Edit' : 'Add New'} {activeTab === 'photos' ? 'Photo' : 'Highlight'}
                </h3>
                <button 
                  onClick={reset} 
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  disabled={isLoading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <form
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto"
              onSubmit={e => { e.preventDefault(); handleSave(); }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Title </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.titleEn}
                  onChange={e => setDraft({ ...draft, titleEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hindi Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.titleHi}
                  onChange={e => setDraft({ ...draft, titleHi: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.descriptionEn}
                  onChange={e => setDraft({ ...draft, descriptionEn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hindi Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.descriptionHi}
                  onChange={e => setDraft({ ...draft, descriptionHi: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.category}
                  onChange={e => setDraft({ ...draft, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={draft.date || ''}
                  onChange={e => setDraft({ ...draft, date: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'photos' ? 'Image URL' : 'Highlight URL'} *
                </label>
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={`https://example.com/${activeTab === 'photos' ? 'image.jpg' : 'video.mp4'}`}
                  value={draft.url}
                  onChange={e => setDraft({ ...draft, url: e.target.value })}
                  required={activeTab === 'photos'}
                  readOnly={uploading}
                />
                {uploading && <span className="text-blue-600 ml-2">Uploading...</span>}
                {/* Cloudinary upload */}
                {activeTab === 'photos' ? (
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                ) : (
                  <input
                    type="file"
                    accept="video/*"
                    className="mt-2"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={draft.thumbnail}
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
                    setUploading(true);
                    const data = new FormData();
                    data.append('file', file);
                    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                    try {
                      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: 'POST',
                        body: data,
                      });
                      const result = await res.json();
                      setUploading(false);
                      if (result.secure_url) {
                        setDraft({ ...draft, thumbnail: result.secure_url });
                      } else {
                        alert('Thumbnail upload failed: ' + (result.error?.message || 'Unknown error'));
                      }
                    } catch (err) {
                      setUploading(false);
                      alert('Thumbnail upload failed: ' + err.message);
                    }
                  }}
                  disabled={uploading}
                />
              </div>
              {activeTab === 'videos' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="00:00"
                    value={draft.duration || ''}
                    onChange={e => setDraft({ ...draft, duration: e.target.value })}
                  />
                </div>
              )}
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
                  className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="animate-spin" size={18} />}
                  {editingId ? 'Update' : 'Create'} {activeTab === 'photos' ? 'Photo' : 'Highlight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
