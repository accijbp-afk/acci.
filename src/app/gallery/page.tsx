'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { galleryService } from '@/services/appwrite/gallery';
import { GalleryAlbum } from '@/types';
import { Images, Calendar, MapPin, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  // Active event for viewing pictures modal
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);

  // Active individual photo viewer inside the event gallery modal
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    galleryService.getAlbums().then((data) => {
      setAlbums(data);
      setLoading(false);
    });
  }, []);

  const openEventGallery = (album: GalleryAlbum) => {
    setActiveAlbum(album);
    setSelectedPhotoIndex(null);
  };

  const closeEventGallery = () => {
    setActiveAlbum(null);
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    if (!activeAlbum || !activeAlbum.photos || selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! > 0 ? prev! - 1 : activeAlbum.photos!.length - 1
    );
  };

  const handleNextPhoto = () => {
    if (!activeAlbum || !activeAlbum.photos || selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev! < activeAlbum.photos!.length - 1 ? prev! + 1 : 0
    );
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      {/* Header */}
      <section className="bg-[#07174a] text-white py-14 border-b-4 border-amber-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
            Chamber Archives &amp; Memories
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-white">
            Concluded Events &amp; Gallery
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Explore photo records, visual archives, and key memories from conclaves, trade expos, and community gatherings organized by ACCI Jabalpur.
          </p>
        </div>
      </section>

      {/* Events Gallery Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1540a8] border-r-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading concluded events gallery…</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-sm">
            <Images className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif-heading text-lg font-bold text-[#07174a]">
              No Event Archives Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Concluded events and photographs will be published here by the secretariat.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {albums.map((album) => {
              const allPhotos = album.photos && album.photos.length > 0 ? album.photos : [album.coverUrl];
              const displayCount = album.photoCount || allPhotos.length;

              return (
                <section
                  key={album.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Event Details */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                            {album.category}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                            Concluded
                          </span>
                        </div>

                        <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a] leading-snug">
                          {album.title}
                        </h2>

                        <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>{album.date}</span>
                          </div>
                          {album.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>{album.venue}</span>
                            </div>
                          )}
                        </div>

                        <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {album.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          📸 <strong>{displayCount}</strong> Pictures in Album
                        </span>
                        <button
                          onClick={() => openEventGallery(album)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#1540a8] hover:bg-[#07174a] text-white px-5 py-2.5 text-xs font-bold transition-all shadow cursor-pointer hover:scale-102"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Pictures</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Photo Preview Showcase */}
                    <div className="lg:col-span-7">
                      <div
                        onClick={() => openEventGallery(album)}
                        className="group relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200 shadow-inner"
                      >
                        <Image
                          src={album.coverUrl}
                          alt={album.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold text-[#07174a] shadow-lg backdrop-blur opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                            <Images className="h-4 w-4 text-[#1540a8]" />
                            <span>Click to View All {displayCount} Photos</span>
                          </span>
                        </div>

                        {/* Thumbnails row at bottom of preview card */}
                        {allPhotos.length > 1 && (
                          <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto pb-1">
                            {allPhotos.slice(0, 4).map((imgUrl, i) => (
                              <div
                                key={i}
                                className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-white/60 shadow-sm"
                              >
                                <Image src={imgUrl} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                              </div>
                            ))}
                            {allPhotos.length > 4 && (
                              <div className="h-12 w-16 shrink-0 rounded-lg bg-black/70 backdrop-blur border border-white/60 text-white flex items-center justify-center text-xs font-bold">
                                +{allPhotos.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL: EVENT PICTURES GALLERY ────────────────────────── */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-[#07174a] text-white border border-amber-400/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:px-8 border-b border-white/10 bg-[#051136]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  {activeAlbum.category} • {activeAlbum.date}
                </span>
                <h3 className="font-serif-heading text-lg sm:text-2xl font-bold text-white mt-0.5">
                  {activeAlbum.title}
                </h3>
              </div>
              <button
                onClick={closeEventGallery}
                className="rounded-full p-2 text-slate-300 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Gallery"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body: Photo Grid or Single Enlarged Viewer */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8">
              {selectedPhotoIndex !== null ? (
                /* Focused Lightbox Viewer */
                <div className="flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-300">
                    <button
                      onClick={() => setSelectedPhotoIndex(null)}
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
                    >
                      ← Back to All Pictures
                    </button>
                    <span>
                      Photo {selectedPhotoIndex + 1} of{' '}
                      {(activeAlbum.photos && activeAlbum.photos.length) || 1}
                    </span>
                  </div>

                  <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black/60 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
                    <Image
                      src={activeAlbum.photos![selectedPhotoIndex]}
                      alt={`${activeAlbum.title} Photo ${selectedPhotoIndex + 1}`}
                      fill
                      className="object-contain"
                    />

                    {/* Navigation buttons */}
                    {activeAlbum.photos && activeAlbum.photos.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevPhoto}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white hover:bg-black/90 transition-all cursor-pointer"
                          aria-label="Previous Photo"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={handleNextPhoto}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white hover:bg-black/90 transition-all cursor-pointer"
                          aria-label="Next Photo"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Grid of All Photos for this Event */
                <div>
                  <p className="text-xs text-slate-300 mb-6 max-w-3xl leading-relaxed">
                    {activeAlbum.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(activeAlbum.photos && activeAlbum.photos.length > 0
                      ? activeAlbum.photos
                      : [activeAlbum.coverUrl]
                    ).map((photoUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className="group relative h-40 sm:h-48 rounded-xl overflow-hidden cursor-pointer bg-black/40 border border-white/10 hover:border-amber-400 transition-all shadow-md"
                      >
                        <Image
                          src={photoUrl}
                          alt={`${activeAlbum.title} - Photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-8 border-t border-white/10 bg-[#051136] flex items-center justify-between text-xs text-slate-400">
              <span>Agrawal Chamber of Commerce &amp; Industries (ACCI) Jabalpur Photo Archive</span>
              <button
                onClick={closeEventGallery}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-1.5 text-white font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
