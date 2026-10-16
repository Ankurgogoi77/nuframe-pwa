"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Search, ExternalLink, Compass, Check, Sparkles } from "lucide-react";

export interface LocationData {
  name: string;
  formatted_address: string;
  location_badge: string;
  latitude?: number;
  longitude?: number;
  maps_url?: string;
  embed_url?: string;
}

interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (location: LocationData) => void;
  initialQuery?: string;
  initialLat?: number;
  initialLon?: number;
}

const PRESET_HOTSPOTS: LocationData[] = [
  {
    name: "French Quarter (White Town)",
    formatted_address: "White Town, Puducherry, 605001, India",
    location_badge: "Pondicherry · French Quarter",
    latitude: 11.9341,
    longitude: 79.8354,
    maps_url: "https://www.google.com/maps/search/?api=1&query=11.9341,79.8354",
    embed_url: "https://maps.google.com/maps?q=11.9341,79.8354&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Fontainhas Latin Quarter",
    formatted_address: "Altinho, Panaji, Goa 403001, India",
    location_badge: "Goa · Fontainhas",
    latitude: 15.4989,
    longitude: 73.8311,
    maps_url: "https://www.google.com/maps/search/?api=1&query=15.4989,73.8311",
    embed_url: "https://maps.google.com/maps?q=15.4989,73.8311&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Charminar & Laad Bazaar",
    formatted_address: "Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002, India",
    location_badge: "Hyderabad · Old City",
    latitude: 17.3616,
    longitude: 78.4747,
    maps_url: "https://www.google.com/maps/search/?api=1&query=17.3616,78.4747",
    embed_url: "https://maps.google.com/maps?q=17.3616,78.4747&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Marine Drive Promenade",
    formatted_address: "Netaji Subhash Chandra Bose Road, Mumbai, Maharashtra 400020, India",
    location_badge: "Mumbai · Marine Drive",
    latitude: 18.9432,
    longitude: 72.8230,
    maps_url: "https://www.google.com/maps/search/?api=1&query=18.9432,72.8230",
    embed_url: "https://maps.google.com/maps?q=18.9432,72.8230&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Hawa Mahal & Old Pink City",
    formatted_address: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002, India",
    location_badge: "Jaipur · Pink City",
    latitude: 26.9239,
    longitude: 75.8267,
    maps_url: "https://www.google.com/maps/search/?api=1&query=26.9239,75.8267",
    embed_url: "https://maps.google.com/maps?q=26.9239,75.8267&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    name: "Fort Kochi Coastline",
    formatted_address: "Kochi, Kerala 682001, India",
    location_badge: "Kochi · Fort Kochi",
    latitude: 9.9658,
    longitude: 76.2421,
    maps_url: "https://www.google.com/maps/search/?api=1&query=9.9658,76.2421",
    embed_url: "https://maps.google.com/maps?q=9.9658,76.2421&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
];

export default function GoogleMapsModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialQuery = "Pondicherry, India",
  initialLat,
  initialLon,
}: GoogleMapsModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedPlace, setSelectedPlace] = useState<LocationData>(PRESET_HOTSPOTS[0]);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "hotspots">("hotspots");

  // Sync initial query when modal opens
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      // Check if matches a preset
      const match = PRESET_HOTSPOTS.find(
        (p) =>
          p.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
          p.location_badge.toLowerCase().includes(initialQuery.toLowerCase()) ||
          p.formatted_address.toLowerCase().includes(initialQuery.toLowerCase())
      );
      if (match) {
        setSelectedPlace(match);
      } else {
        setSelectedPlace({
          name: initialQuery,
          formatted_address: initialQuery,
          location_badge: initialQuery,
          latitude: initialLat,
          longitude: initialLon,
          maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(initialQuery)}`,
          embed_url: initialLat && initialLon
            ? `https://maps.google.com/maps?q=${initialLat},${initialLon}&t=&z=15&ie=UTF8&iwloc=&output=embed`
            : `https://maps.google.com/maps?q=${encodeURIComponent(initialQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
        });
      }
    }
  }, [initialQuery, initialLat, initialLon, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    setActiveTab("search");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      const res = await fetch(`${apiUrl}/api/location/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          setSearchResults(data.places);
          setSelectedPlace(data.places[0]);
          setIsSearching(false);
          return;
        }
      }
    } catch {
      // Fallback local search among presets
    }

    // Fallback: create dynamic place from input
    const dynamicPlace: LocationData = {
      name: searchQuery.trim(),
      formatted_address: searchQuery.trim(),
      location_badge: searchQuery.trim(),
      maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery.trim())}`,
      embed_url: `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery.trim())}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    };
    setSearchResults([dynamicPlace]);
    setSelectedPlace(dynamicPlace);
    setIsSearching(false);
  };

  const handleSelect = (place: LocationData) => {
    setSelectedPlace(place);
  };

  const handleApplyLocation = () => {
    if (onSelectLocation && selectedPlace) {
      onSelectLocation(selectedPlace);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F7F4EE] border border-[#DBD2C7] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-[#171717] flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#DBD2C7] bg-[#EDE8DE]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#DBD2C7] flex items-center justify-center shadow-xs text-[#EA4335]">
              <MapPin className="w-5 h-5 fill-[#EA4335] text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-[#171717]">
                  Google Maps Location
                </h2>
                <span className="text-[10px] bg-white text-[#6F6A62] font-semibold px-2 py-0.5 rounded-full border border-[#DBD2C7]">
                  Verified Coordinates
                </span>
              </div>
              <p className="text-xs text-[#6F6A62]">
                Pin photos, tag carousel frames & explore creator hotspots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#E5DFD4] flex items-center justify-center text-[#6F6A62] hover:text-[#171717] transition-colors cursor-pointer border border-[#DBD2C7]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6A62]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, venue, landmark or street on Google Maps..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DBD2C7] rounded-2xl text-xs sm:text-sm text-[#171717] focus:outline-hidden focus:border-[#C96B4B] shadow-2xs"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#171717] hover:bg-[#333] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {isSearching ? "Searching..." : "Search Maps"}
            </button>
          </form>

          {/* Quick Hotspot / Preset Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6A62] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Popular Creator Locations
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("hotspots")}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                    activeTab === "hotspots" ? "bg-[#C96B4B] text-white" : "bg-[#EDE8DE] text-[#6F6A62]"
                  }`}
                >
                  Hotspots
                </button>
                {searchResults.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("search")}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors ${
                      activeTab === "search" ? "bg-[#C96B4B] text-white" : "bg-[#EDE8DE] text-[#6F6A62]"
                    }`}
                  >
                    Search Results ({searchResults.length})
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(activeTab === "hotspots" ? PRESET_HOTSPOTS : searchResults).map((place) => {
                const isSelected = selectedPlace.name === place.name;
                return (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => handleSelect(place)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#C96B4B] text-white border-[#C96B4B] shadow-xs"
                        : "bg-white text-[#171717] border-[#DBD2C7] hover:bg-[#EDE8DE]"
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? "text-white" : "text-[#EA4335]"}`} />
                    <span>{place.location_badge || place.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Google Map Embed Frame */}
          <div className="rounded-2xl overflow-hidden border border-[#DBD2C7] bg-[#EDE8DE] relative shadow-inner aspect-video sm:aspect-21/9 min-h-[220px]">
            <iframe
              title={`Google Map for ${selectedPlace.name}`}
              src={
                selectedPlace.embed_url ||
                `https://maps.google.com/maps?q=${encodeURIComponent(
                  selectedPlace.latitude && selectedPlace.longitude
                    ? `${selectedPlace.latitude},${selectedPlace.longitude}`
                    : selectedPlace.formatted_address || selectedPlace.name
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            
            {/* Live Location Stamp Badge Overlay */}
            <div className="absolute top-3 left-3 bg-[#171717]/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs border border-white/20 shadow-lg flex items-center gap-2 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
              <span className="font-serif font-semibold tracking-wide">
                {selectedPlace.location_badge || selectedPlace.name}
              </span>
              {selectedPlace.latitude && selectedPlace.longitude && (
                <span className="text-[10px] text-white/70 font-mono hidden sm:inline">
                  · {selectedPlace.latitude.toFixed(4)}°, {selectedPlace.longitude.toFixed(4)}°
                </span>
              )}
            </div>
          </div>

          {/* Location Details Card */}
          <div className="bg-white rounded-2xl border border-[#DBD2C7] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-[#171717] text-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                {selectedPlace.name}
              </div>
              <p className="text-[#6F6A62] text-xs line-clamp-1">
                {selectedPlace.formatted_address}
              </p>
            </div>

            <a
              href={
                selectedPlace.maps_url ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#4285F4] hover:underline font-medium shrink-0 cursor-pointer"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#DBD2C7] bg-[#EDE8DE]/40 flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#6F6A62] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C96B4B]" />
            <span>Applies aesthetic stamp to your active carousel or vault file</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6F6A62] hover:text-[#171717] rounded-xl hover:bg-[#E5DFD4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLocation}
              className="inline-flex items-center gap-1.5 bg-[#C96B4B] hover:bg-[#B55B3D] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use This Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
