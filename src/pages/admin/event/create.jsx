import React, { useState, useEffect } from "react";
import { FileText, MapPin, Image, Ticket, Loader2, Check, X, Plus } from "lucide-react";
import UploadFile from "../../../services/media";
import { getUser } from "../../../services/auth";
import { CreateEvent } from "../../../services/events";
import { CreateTickets } from "../../../services/tickets";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: ["", ""],
    latitude: 0,
    longitude: 0,
    address: ""
  });
  
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState({ 
    name: "", 
    cost: "",
    quantity: "",
    currency: "NGN"
  });
  
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerId, setBannerId] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryIds, setGalleryIds] = useState([]);
  const [uploading, setUploading] = useState({
    banner: false,
    gallery: false
  });
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || map) return;

    const L = window.L;
    const mapInstance = L.map('event-map').setView([7.3775, 3.9470], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance);

    mapInstance.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng]).addTo(mapInstance);
        setMarker(newMarker);
      }

      setFormData(prev => ({
        ...prev,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6))
      }));

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name
            }));
          }
        })
        .catch(err => console.error('Geocoding error:', err));
    });

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (index, value) => {
    const newTime = [...formData.time];
    newTime[index] = value;
    setFormData(prev => ({
      ...prev,
      time: newTime
    }));
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerFile(file);
    setUploading(prev => ({ ...prev, banner: true }));

    try {
      const result = await UploadFile(file);
      if (result && result.id) {
        setBannerId(result.id);
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
    } finally {
      setUploading(prev => ({ ...prev, banner: false }));
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setGalleryFiles(prev => [...prev, ...files]);
    setUploading(prev => ({ ...prev, gallery: true }));

    try {
      const uploadedIds = [];
      
      for (const file of files) {
        try {
          const result = await UploadFile(file);
          if (result && result.id) {
            uploadedIds.push(result.id);
          }
        } catch (error) {
          console.error("Error uploading gallery file:", error);
        }
      }
      
      setGalleryIds(prev => [...prev, ...uploadedIds]);
    } finally {
      setUploading(prev => ({ ...prev, gallery: false }));
    }
  };

  const removeGalleryFile = (index) => {
    const newFiles = [...galleryFiles];
    const newIds = [...galleryIds];
    
    newFiles.splice(index, 1);
    newIds.splice(index, 1);
    
    setGalleryFiles(newFiles);
    setGalleryIds(newIds);
  };

  const addTicket = () => {
    if (currentTicket.name && currentTicket.cost) {
      setTickets([...tickets, { ...currentTicket }]);
      setCurrentTicket({ name: "", cost: "", quantity: "", currency: "NGN" });
    }
  };

  const removeTicket = (index) => {
    const newTickets = [...tickets];
    newTickets.splice(index, 1);
    setTickets(newTickets);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    try {
      const user = await getUser();
      if (!user || !user.id) {
        throw new Error("User not found. Please log in.");
      }

      const eventData = {
        host_id: user.id, 
        title: formData.title,
        description: formData.description,
        time: formData.time,
        banner_id: bannerId,
        gallery: galleryIds,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        address: formData.address
      };

      const eventResponse = await CreateEvent(eventData);
      console.log('Event created:', eventResponse);

      if (tickets.length > 0 && eventResponse && eventResponse.id) {
        const ticketData = {
          event_id: eventResponse.id,
          tickets: tickets.map(ticket => ({
            name: ticket.name,
            cost: parseFloat(ticket.cost),
            quantity: parseInt(ticket.quantity) || 0,
            currency: ticket.currency || "NGN"
          }))
        };

        try {
          const ticketResponse = await CreateTickets(ticketData);
          console.log('Tickets created:', ticketResponse);
          alert('Event and tickets created successfully!');
        } catch (ticketError) {
          console.error("Error creating tickets:", ticketError);
          alert('Event created successfully, but there was an error creating tickets. Please add tickets manually.');
        }
      } else {
        alert('Event created successfully!');
      }

      setFormData({
        title: "",
        description: "",
        time: ["", ""],
        latitude: 0,
        longitude: 0,
        address: ""
      });
      setBannerFile(null);
      setBannerId(null);
      setGalleryFiles([]);
      setGalleryIds([]);
      setTickets([]);
      
      if (marker) {
        marker.remove();
        setMarker(null);
      }

    } catch (error) {
      console.error("Error creating event:", error);
      alert('Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Create New Event
          </h1>
          <p className="text-gray-400">Fill in the details below to create your event and set up ticketing</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Event Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-blue-400" size={24} />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                    placeholder="Describe your event"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.time[0]}
                      onChange={(e) => handleTimeChange(0, e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.time[1]}
                      onChange={(e) => handleTimeChange(1, e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-blue-400" size={24} />
                Location
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Event address (or click on map)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Click on map to select location *
                  </label>
                  <div 
                    id="event-map" 
                    className="w-full h-80 rounded-lg border border-gray-600 bg-gray-700 overflow-hidden"
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Image className="text-blue-400" size={24} />
                Media
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    disabled={uploading.banner}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer text-sm transition-all"
                  />
                  {uploading.banner && (
                    <p className="text-sm text-blue-400 mt-2 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Uploading banner...
                    </p>
                  )}
                  {bannerId && !uploading.banner && (
                    <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                      <Check size={16} /> Banner uploaded successfully!
                    </p>
                  )}
                  {bannerFile && (
                    <p className="text-sm text-gray-400 mt-2 truncate">Selected: {bannerFile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Gallery Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    disabled={uploading.gallery}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer text-sm transition-all"
                  />
                  {uploading.gallery && (
                    <p className="text-sm text-blue-400 mt-2 flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Uploading gallery images...
                    </p>
                  )}
                  {galleryIds.length > 0 && !uploading.gallery && (
                    <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                      <Check size={16} /> {galleryIds.length} image(s) uploaded successfully!
                    </p>
                  )}
                </div>

                {galleryFiles.length > 0 && (
                  <div className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                    <h4 className="font-semibold text-gray-300 mb-3 text-sm">Gallery Files:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {galleryFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded-lg">
                          <span className="text-xs text-gray-300 truncate flex-1 mr-2">{file.name}</span>
                          <button 
                            type="button" 
                            onClick={() => removeGalleryFile(index)}
                            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Tickets */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-blue-400" size={24} />
                Tickets
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    value={currentTicket.name}
                    onChange={(e) => setCurrentTicket({...currentTicket, name: e.target.value})}
                    placeholder="e.g., VIP, Regular"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Cost (₦)
                    </label>
                    <input
                      type="number"
                      value={currentTicket.cost}
                      onChange={(e) => setCurrentTicket({...currentTicket, cost: e.target.value})}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={currentTicket.quantity}
                      onChange={(e) => setCurrentTicket({...currentTicket, quantity: e.target.value})}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addTicket}
                  disabled={!currentTicket.name || !currentTicket.cost}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Ticket
                </button>
              </div>

              {tickets.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-gray-300 mb-3 text-sm">Added Tickets ({tickets.length}):</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tickets.map((ticket, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-white text-sm">{ticket.name}</p>
                          <button 
                            type="button" 
                            onClick={() => removeTicket(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Cost: ₦{parseFloat(ticket.cost).toFixed(2)}</p>
                          <p>Qty: {ticket.quantity || 0} | {ticket.currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button 
            onClick={handleSubmit}
            disabled={loading || uploading.banner || uploading.gallery} 
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Creating Event...
              </>
            ) : (
              <>
                <Check size={24} />
                Create Event{tickets.length > 0 ? ` with ${tickets.length} Ticket${tickets.length > 1 ? 's' : ''}` : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;