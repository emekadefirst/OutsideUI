import React, { useState, useEffect } from "react";
import UploadFile from "../../../services/media";
import { getUser } from "../../../services/auth";
import { CreateEvent } from "../../../services/events";

const AddEvent = () => {
  const [activeTab, setActiveTab] = useState("event");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: ["", ""],
    latitude: 0,
    longitude: 0,
    address: ""
  });
  
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState({ name: "", amount: "" });
  
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
    if (currentTicket.name && currentTicket.amount) {
      setTickets([...tickets, { ...currentTicket }]);
      setCurrentTicket({ name: "", amount: "" });
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

      const response = await CreateEvent(eventData);
      console.log('Response:', response);

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

      alert('Event created successfully!');

    } catch (error) {
      console.error("Error creating event:", error);
      alert('Error creating event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Create New Event</h2>
        
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("event")}
            className={`px-4 md:px-8 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === "event"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Event Details
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-4 md:px-8 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === "tickets"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Tickets ({tickets.length})
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "event" && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 lg:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter event title"
                  />
                </div>

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
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Event address"
                  />
                </div>
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Event Time *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.time[0]}
                      onChange={(e) => handleTimeChange(0, e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.time[1]}
                      onChange={(e) => handleTimeChange(1, e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Location * (Click on map to select)
                  </label>
                  <div 
                    id="event-map" 
                    className="w-full h-64 md:h-80 lg:h-96 rounded-lg border border-gray-600 mb-4 bg-gray-700"
                  ></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Latitude</label>
                      <input
                        type="text"
                        value={formData.latitude}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Longitude</label>
                      <input
                        type="text"
                        value={formData.longitude}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
                      />
                    </div>
                  </div>
                </div>

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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer text-sm"
                    />
                    {uploading.banner && (
                      <p className="text-sm text-blue-400 mt-2">Uploading banner...</p>
                    )}
                    {bannerId && !uploading.banner && (
                      <p className="text-sm text-green-400 mt-2">✓ Banner uploaded successfully!</p>
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
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer text-sm"
                    />
                    {uploading.gallery && (
                      <p className="text-sm text-blue-400 mt-2">Uploading gallery images...</p>
                    )}
                    {galleryIds.length > 0 && !uploading.gallery && (
                      <p className="text-sm text-green-400 mt-2">
                        ✓ {galleryIds.length} image(s) uploaded successfully!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {galleryFiles.length > 0 && (
                <div className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                  <h4 className="font-semibold text-gray-300 mb-3">Gallery Files:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-300 truncate flex-1 mr-2">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeGalleryFile(index)}
                          className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors flex-shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-200">Ticket Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    value={currentTicket.name}
                    onChange={(e) => setCurrentTicket({...currentTicket, name: e.target.value})}
                    placeholder="e.g., VIP, Regular, Early Bird"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={currentTicket.amount}
                    onChange={(e) => setCurrentTicket({...currentTicket, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addTicket}
                disabled={!currentTicket.name || !currentTicket.amount}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Add Ticket
              </button>

              {tickets.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-300 mb-3">Added Tickets:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((ticket, index) => (
                      <div key={index} className="flex flex-col justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                        <div className="mb-3">
                          <p className="font-medium text-white text-lg">{ticket.name}</p>
                          <p className="text-sm text-gray-400 mt-1">₦{parseFloat(ticket.amount).toFixed(2)}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeTicket(index)}
                          className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={loading || uploading.banner || uploading.gallery} 
            className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;