import React, { useState } from "react";
import UploadFile from "../../../services/media";
import { getUser } from "../../../services/auth";
import { CreateEvent } from "../../../services/events";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: ["", ""], // [startTime, endTime]
    latitude: 0,
    longitude: 0,
    address: ""
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
      // Optionally show error to user
    } finally {
      setUploading(prev => ({ ...prev, banner: false }));
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setGalleryFiles(files);
    setUploading(prev => ({ ...prev, gallery: true }));

    try {
      const uploadedIds = [];
      
      for (const file of files) {
        try {
          const result = await UploadFile(file);
          if (result && result.id) {
            uploadedIds.push(result.id);
            console.log("Uploaded gallery file ID:", result.id); // Log each uploaded file ID
          }
        } catch (error) {
          console.error("Error uploading gallery file:", error);
          // Continue with other files even if one fails
        }
      }
      
      setGalleryIds(uploadedIds);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUser();
      if (!user || !user.id) {
        throw new Error("User not found. Please log in.");
      }

      // Prepare event data
      const eventData = {
        host_id: user.id, 
        title: formData.title,
        description: formData.description,
        time: formData.time, // Changed from [formData.time] to formData.time
        banner_id: bannerId,
        gallery: galleryIds,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        address: formData.address
      };

      // Create event
      const response = await CreateEvent(eventData);
      console.log('Response:', response); // Add this for debugging

      // Reset form after successful submission
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

    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
          />
        </div>

        {/* Time */}
        <div className="form-group">
          <label>Event Time *</label>
          <div className="time-inputs">
            <input
              type="datetime-local"
              value={formData.time[0]}
              onChange={(e) => handleTimeChange(0, e.target.value)}
              required
              placeholder="Start Time"
            />
            <input
              type="datetime-local"
              value={formData.time[1]}
              onChange={(e) => handleTimeChange(1, e.target.value)}
              required
              placeholder="End Time"
            />
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Coordinates */}
        <div className="form-group coordinates">
          <div>
            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="any"
              value={formData.latitude}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="any"
              value={formData.longitude}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Banner Upload */}
        <div className="form-group">
          <label htmlFor="banner">Banner Image</label>
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={handleBannerChange}
            disabled={uploading.banner}
          />
          {uploading.banner && <span className="upload-status">Uploading banner...</span>}
          {bannerId && !uploading.banner && <span className="upload-status success">Banner uploaded successfully!</span>}
          {bannerFile && (
            <div className="file-preview">
              <span>Selected: {bannerFile.name}</span>
            </div>
          )}
        </div>

        {/* Gallery Upload */}
        <div className="form-group">
          <label htmlFor="gallery">Gallery Images</label>
          <input
            type="file"
            id="gallery"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            disabled={uploading.gallery}
          />
          {uploading.gallery && <span className="upload-status">Uploading gallery images...</span>}
          {galleryIds.length > 0 && !uploading.gallery && (
            <span className="upload-status success">{galleryIds.length} image(s) uploaded successfully!</span>
          )}
          
          {/* Gallery files preview */}
          {galleryFiles.length > 0 && (
            <div className="gallery-preview">
              <h4>Gallery Files:</h4>
              {galleryFiles.map((file, index) => (
                <div key={index} className="gallery-file-item">
                  <span>{file.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeGalleryFile(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading || uploading.banner || uploading.gallery} 
          className="submit-btn"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>

      <style jsx>{`
        .add-event-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .event-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .time-inputs {
          display: flex;
          gap: 10px;
        }
        
        .time-inputs input {
          flex: 1;
        }
        
        .coordinates {
          flex-direction: row;
          gap: 15px;
        }
        
        .coordinates > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .upload-status {
          font-size: 14px;
          font-style: italic;
        }
        
        .upload-status.success {
          color: #28a745;
        }
        
        .file-preview {
          margin-top: 5px;
          font-size: 14px;
          color: #666;
        }
        
        .gallery-preview {
          margin-top: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
        }
        
        .gallery-file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        
        .gallery-file-item:last-child {
          border-bottom: none;
        }
        
        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .remove-btn:hover {
          background: #c82333;
        }
        
        .submit-btn {
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .submit-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .submit-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AddEvent;