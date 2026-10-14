import React, { useState } from 'react';
import { AuthUser, ContactSettings } from '../types';
import { dataStore } from '../services/storage';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Globe, 
  Clock, 
  ExternalLink, 
  Edit3, 
  CheckCircle2, 
  X,
  Compass,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles
} from 'lucide-react';

interface ContactViewProps {
  currentUser: AuthUser | null;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentUser }) => {
  const isAdmin = currentUser?.role === 'admin';
  const contact = dataStore.getContactSettings();

  // Edit contact modal state for Admin
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState<ContactSettings>(contact);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Logo upload state for Admin
  const [logoInputUrl, setLogoInputUrl] = useState<string>(contact.logoUrl || '');

  const handleOpenEdit = () => {
    setFormData(dataStore.getContactSettings());
    setIsEditOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.updateContactSettings(formData);
    setIsEditOpen(false);
    setSuccessToast('Contact details successfully updated!');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoInputUrl(reader.result);
          dataStore.updateLogo(reader.result);
          setSuccessToast('Official PhiMatiCs Classes logo successfully uploaded and applied!');
          setTimeout(() => setSuccessToast(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogoUrl = () => {
    if (logoInputUrl.trim()) {
      dataStore.updateLogo(logoInputUrl.trim());
      setSuccessToast('Official PhiMatiCs Classes logo successfully applied!');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleRemoveLogo = () => {
    if (confirm('Remove the custom uploaded logo and revert to clean text typography?')) {
      dataStore.removeLogo();
      setLogoInputUrl('');
      setSuccessToast('Reverted to clean text typography.');
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, '');
  const waUrl = contact.whatsapp 
    ? `https://wa.me/${cleanPhone(contact.whatsapp)}?text=Hello%20PhiMatiCs%20Classes,%20I%20would%20like%20to%20inquire%20about%20classes.`
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'Contact and App Settings' : 'Contact Information'}
          </h1>
          <p className="text-sm text-slate-600">
            Get in touch with PhiMatiCs Classes • Academic counseling and admissions.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenEdit}
            className="py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-sky-400" />
            Edit Contact Details
          </button>
        )}
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Official Logo Management Setting (Administrator Only) */}
      {isAdmin && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Official Institution Logo Setting
                </h3>
                <p className="text-xs text-slate-500">
                  Upload your exact official PhiMatiCs Classes logo (preserves original colors, aspect ratio, and transparency).
                </p>
              </div>
            </div>

            {contact.logoUrl && (
              <button
                onClick={handleRemoveLogo}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Logo
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden shadow-xs shrink-0">
                <img
                  src={contact.logoUrl || "/phimatics-logo.svg"}
                  alt="PhiMatiCs Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {contact.logoUrl ? 'Custom Logo Uploaded' : 'Official PhiMatiCs Emblem Active'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {contact.logoUrl 
                    ? 'Your uploaded logo is active in the navigation header and all screens.' 
                    : 'Official emblem image is active: "PhiMatiCs Classes / The Learning App".'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <label className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo File</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Institution Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-4">
          {contact.logoUrl ? (
            <img 
              src={contact.logoUrl} 
              alt="PhiMatiCs Classes" 
              className="max-h-16 w-auto object-contain rounded-xl"
            />
          ) : (
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Phi<span className="text-sky-400">MatiCs</span> Classes
            </div>
          )}
        </div>
        <p className="text-sm text-sky-200 mt-2 font-medium">
          {contact.tagline}
        </p>

        {/* Action Buttons Row */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contact.phone && (
            <a
              href={`tel:${cleanPhone(contact.phone)}`}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition flex flex-col items-center justify-center gap-1.5 text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center group-hover:scale-105 transition">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">Call Us</span>
              <span className="text-[10px] text-slate-300 truncate w-full">{contact.phone}</span>
            </a>
          )}

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-white transition flex flex-col items-center justify-center gap-1.5 text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-300">WhatsApp</span>
              <span className="text-[10px] text-emerald-100">Direct Chat</span>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition flex flex-col items-center justify-center gap-1.5 text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center group-hover:scale-105 transition">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">Email</span>
              <span className="text-[10px] text-slate-300 truncate w-full">{contact.email}</span>
            </a>
          )}

          {contact.mapsUrl && (
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition flex flex-col items-center justify-center gap-1.5 text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-105 transition">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">Directions</span>
              <span className="text-[10px] text-slate-300">Google Maps</span>
            </a>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Centre Address</h3>
              <p className="text-xs text-slate-500">Main physical classroom premises</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {contact.address}
          </p>

          {contact.mapsUrl && (
            <a
              href={contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline"
            >
              <span>Open in Google Maps / Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Operating Hours & Website */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Operating Timings</h3>
              <p className="text-xs text-slate-500">Student counseling and academic sessions</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm text-slate-700 font-medium space-y-1">
            <p>{contact.workingHours}</p>
          </div>

          {contact.website && (
            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>Official Website:</span>
              </div>
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-600 hover:underline"
              >
                {contact.website.replace('https://', '')}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Contact Details</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={e => setFormData({ ...formData, institutionName: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Centre Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Google Maps Location Link
                </label>
                <input
                  type="text"
                  value={formData.mapsUrl}
                  onChange={e => setFormData({ ...formData, mapsUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Operating Timings
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
