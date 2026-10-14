import React, { useState } from 'react';
import { AuthUser, GalleryImage } from '../types';
import { dataStore } from '../services/storage';
import { useAppContent } from '../context/ContentContext';
import { compressImage } from '../utils/imageCompressor';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Eye, 
  Calendar, 
  X, 
  Filter, 
  Edit3, 
  Maximize2 
} from 'lucide-react';

interface GalleryViewProps {
  currentUser: AuthUser | null;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ currentUser }) => {
  const { content } = useAppContent();
  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  const [selectedEvent, setSelectedEvent] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryImage | null>(null);

  // Admin add / edit modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-10');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const images = dataStore.getGallery(!isAdmin);

  // Distinct events for filter
  const eventNames = Array.from(new Set(images.map(img => img.eventName))).filter(Boolean);

  const filteredImages = images.filter(img => {
    if (selectedEvent === 'All') return true;
    return img.eventName === selectedEvent;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setCaption('');
    setEventName('');
    setEventDate('2026-10-10');
    setImageUrl('');
    setIsPublished(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setTitle(img.title);
    setCaption(img.caption);
    setEventName(img.eventName);
    setEventDate(img.eventDate);
    setImageUrl(img.imageUrl);
    setIsPublished(img.isPublished);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this photograph from the gallery?')) {
      dataStore.deleteGalleryImage(id);
    }
  };

  const handleTogglePublish = (img: GalleryImage) => {
    dataStore.updateGalleryImage(img.id, { isPublished: !img.isPublished });
  };

  const handleLocalImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
      compressImage(file, 800, 800, 0.75)
        .then((compressedUrl) => {
          setImageUrl(compressedUrl);
        })
        .catch((err) => {
          console.error('Failed to compress gallery image:', err);
        });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Title and Image are required.');
      return;
    }

    if (editingId) {
      dataStore.updateGalleryImage(editingId, {
        title: title.trim(),
        caption: caption.trim(),
        eventName: eventName.trim() || 'Classroom Event',
        eventDate,
        imageUrl: imageUrl.trim(),
        isPublished
      });
    } else {
      dataStore.addGalleryImage({
        title: title.trim(),
        caption: caption.trim(),
        eventName: eventName.trim() || 'Classroom Event',
        eventDate,
        imageUrl: imageUrl.trim(),
        isPublished
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{content.materialsAndClasses?.galleryTitle || 'Activity Gallery'}</h1>
          <p className="text-sm text-slate-600">
            {content.materialsAndClasses?.gallerySubtitle || 'Moments of learning, science experiments, celebrations, and academic achievements'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            {content.materialsAndClasses?.addPhotoButton || 'Upload Photograph'}
          </button>
        )}
      </div>

      {/* Event Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
        <span className="text-slate-400 uppercase text-[10px] font-bold">Event:</span>
        <button
          onClick={() => setSelectedEvent('All')}
          className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
            selectedEvent === 'All'
              ? 'bg-slate-900 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Activities
        </button>
        {eventNames.map(ev => (
          <button
            key={ev}
            onClick={() => setSelectedEvent(ev)}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              selectedEvent === ev
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {ev}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center text-slate-500 text-sm">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No photographs found</p>
          <p className="text-xs text-slate-400 mt-1">
            Check back later for newly published event photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map(img => (
            <div
              key={img.id}
              className={`bg-white rounded-2xl overflow-hidden border transition group flex flex-col justify-between ${
                !img.isPublished 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : 'border-slate-200 hover:shadow-md hover:border-sky-300'
              }`}
            >
              {/* Image preview with click to lightbox */}
              <div 
                onClick={() => setActiveLightboxImage(img)}
                className="relative aspect-16/10 bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                
                {/* Overlay hover icon */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <div className="p-2 rounded-full bg-slate-900/60 backdrop-blur-xs flex items-center gap-1.5 text-xs font-semibold">
                    <Maximize2 className="w-4 h-4" />
                    <span>View Larger</span>
                  </div>
                </div>

                {/* Event tag badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold">
                  {img.eventName}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {img.eventDate}
                    </span>

                    {isAdmin && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        img.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {img.isPublished ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => setActiveLightboxImage(img)}
                    className="font-bold text-sm text-slate-900 cursor-pointer hover:text-sky-600 transition line-clamp-1"
                  >
                    {img.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {img.caption}
                  </p>
                </div>

                {/* Admin controls footer */}
                {isAdmin && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => handleTogglePublish(img)}
                      className="text-sky-600 font-semibold hover:underline"
                    >
                      {img.isPublished ? 'Unpublish' : 'Publish to Students'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(img)}
                        className="p-1 rounded text-slate-400 hover:text-slate-800"
                        title="Edit caption"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxImage && (
        <div 
          onClick={() => setActiveLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Top Bar */}
            <div className="p-4 bg-slate-950/60 flex items-center justify-between text-white border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm truncate">{activeLightboxImage.title}</h3>
                <p className="text-xs text-sky-400">{activeLightboxImage.eventName} • {activeLightboxImage.eventDate}</p>
              </div>
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeLightboxImage.imageUrl}
                alt={activeLightboxImage.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption Footer */}
            <div className="p-4 bg-slate-900 text-slate-200 text-xs sm:text-sm border-t border-slate-800">
              <p className="leading-relaxed">{activeLightboxImage.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Photo Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingId ? 'Edit Photograph' : 'Upload Activity Photograph'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Science Lab Experiment Workshop"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Event / Category Name
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    placeholder="e.g. Science Experiment Workshop"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Select Local Photo or Paste URL
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageSelect}
                  className="w-full mb-2 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700"
                />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or auto-filled"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Caption / Description
                </label>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Explain the academic event or activity..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubPhoto"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pubPhoto" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Publish to student gallery
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
