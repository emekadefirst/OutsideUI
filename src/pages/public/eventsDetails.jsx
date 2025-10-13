import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Bookmark, Share2, ChevronLeft, ArrowLeft, Play, Pause } from 'lucide-react';
import { useEventsStore, useTicketsStore } from "../../stores";
import TicketPurchaseModal from '../../components/ui/TicketPurchaseModal';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { getEventById } = useEventsStore();
    const { getTicketsByEvent } = useTicketsStore();

    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [ticketError, setTicketError] = useState(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState({});
    
    // Refs for video elements and touch handling
    const mediaContainerRef = useRef(null);
    const videoRefs = useRef([]);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                setError(null);
                setTicketError(null);

                // Fetch event data
                const eventData = await getEventById(eventId);
                setEvent(eventData);

                // Try to fetch tickets, but handle 404 gracefully
                try {
                    const ticketsData = await getTicketsByEvent(eventId);
                    setTickets(ticketsData);
                } catch (ticketErr) {
                    if (ticketErr.response?.status === 404) {
                        setTicketError('No tickets available for this event');
                        setTickets([]);
                    } else {
                        setTicketError('Failed to load tickets');
                    }
                }
            } catch (err) {
                setError(err.message || "Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventData();
        }
    }, [eventId]);

    const allImages = event ? [event.banner, ...event.gallery] : [];

    // Initialize video refs array
    useEffect(() => {
        if (allImages.length > 0) {
            videoRefs.current = Array(allImages.length).fill().map((_, i) => videoRefs.current[i] || null);
        }
    }, [allImages.length]);

    // Handle video playback when active index changes
    useEffect(() => {
        // Pause all videos first
        videoRefs.current.forEach((video, index) => {
            if (video && index !== activeImageIndex) {
                video.pause();
                video.currentTime = 0;
                setVideoPlaying(prev => ({ ...prev, [index]: false }));
            }
        });

        // Play the active video if it's a video file
        const activeMedia = allImages[activeImageIndex];
        if (activeMedia && /\.(mp4|webm|ogg)$/i.test(activeMedia)) {
            const activeVideo = videoRefs.current[activeImageIndex];
            if (activeVideo) {
                const playPromise = activeVideo.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setVideoPlaying(prev => ({ ...prev, [activeImageIndex]: true }));
                    }).catch(error => {
                        console.log('Video autoplay failed:', error);
                        setVideoPlaying(prev => ({ ...prev, [activeImageIndex]: false }));
                    });
                }
            }
        }
    }, [activeImageIndex, allImages]);

    // Touch handlers for swipe gestures
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const diffX = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50; // Minimum distance for a swipe

        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - next media
                handleNext();
            } else {
                // Swipe right - previous media
                handlePrevious();
            }
        }

        // Reset values
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const handleNext = () => {
        setActiveImageIndex((prevIndex) => 
            prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevious = () => {
        setActiveImageIndex((prevIndex) => 
            prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
        );
    };

    // Toggle video play/pause
    const toggleVideoPlayback = (index) => {
        const video = videoRefs.current[index];
        if (video) {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setVideoPlaying(prev => ({ ...prev, [index]: true }));
                    }).catch(error => {
                        console.log('Video play failed:', error);
                    });
                }
            } else {
                video.pause();
                setVideoPlaying(prev => ({ ...prev, [index]: false }));
            }
        }
    };

    // Handle video ended
    const handleVideoEnded = (index) => {
        setVideoPlaying(prev => ({ ...prev, [index]: false }));
    };

    // Handle video play
    const handleVideoPlay = (index) => {
        setVideoPlaying(prev => ({ ...prev, [index]: true }));
    };

    // Handle video pause
    const handleVideoPause = (index) => {
        setVideoPlaying(prev => ({ ...prev, [index]: false }));
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                // Space bar to play/pause current video
                const activeMedia = allImages[activeImageIndex];
                if (activeMedia && /\.(mp4|webm|ogg)$/i.test(activeMedia)) {
                    e.preventDefault();
                    toggleVideoPlayback(activeImageIndex);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeImageIndex, allImages]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Generate Google Maps Static Image URL
    const getGoogleMapsImageUrl = () => {
        if (!event?.location?.latitude || !event?.location?.longitude) {
            return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event?.address || '')}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(event?.address || '')}&key=YOUR_GOOGLE_MAPS_API_KEY`;
        }
        return `https://maps.googleapis.com/maps/api/staticmap?center=${event.location.latitude},${event.location.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${event.location.latitude},${event.location.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`;
    };

    // Generate Google Maps URL for linking
    const getGoogleMapsUrl = () => {
        if (!event?.location?.latitude || !event?.location?.longitude) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.address || '')}`;
        }
        return `https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`;
    };

    // Share location function
    const shareLocation = async () => {
        const mapsUrl = getGoogleMapsUrl();
        const shareText = `Check out this event location: ${event.title} at ${event.address}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: shareText,
                    url: mapsUrl,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareText} - ${mapsUrl}`);
                alert('Location link copied to clipboard!');
            } catch (err) {
                window.open(mapsUrl, '_blank');
            }
        }
    };

    // Share event function
    const shareEvent = async () => {
        const shareData = {
            title: event.title,
            text: event.description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
                alert('Event link copied to clipboard!');
            } catch (err) {
                console.log('Error copying to clipboard:', err);
            }
        }
    };

    // Handle back button click
    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white/70 text-lg">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Failed to load event</h3>
                    <p className="text-white/70 mb-4">{error}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleBackClick}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors border border-white/10"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-white text-xl mb-4">Event not found</div>
                    <button
                        onClick={handleBackClick}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <div 
                ref={mediaContainerRef}
                className="relative h-96 sm:h-[500px] overflow-hidden rounded-2xl"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image or Video */}
                {allImages.length > 0 && (
                    <>
                        {/\.(mp4|webm|ogg)$/i.test(allImages[activeImageIndex]) ? (
                            <div className="relative w-full h-full">
                                <video
                                    ref={el => videoRefs.current[activeImageIndex] = el}
                                    key={activeImageIndex}
                                    src={allImages[activeImageIndex]}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    onEnded={() => handleVideoEnded(activeImageIndex)}
                                    onPlay={() => handleVideoPlay(activeImageIndex)}
                                    onPause={() => handleVideoPause(activeImageIndex)}
                                />
                                {/* Play/Pause Button Overlay */}
                                <button
                                    onClick={() => toggleVideoPlayback(activeImageIndex)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 group"
                                >
                                    <div className={`bg-black/60 rounded-full p-4 transform transition-all duration-300 group-hover:scale-110 ${videoPlaying[activeImageIndex] ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                        {videoPlaying[activeImageIndex] ? (
                                            <Pause className="w-8 h-8 text-white" />
                                        ) : (
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <img
                                key={activeImageIndex}
                                src={allImages[activeImageIndex]}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm rotate-180 z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Dots navigation */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImageIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === activeImageIndex
                                        ? "bg-white w-8"
                                        : "bg-white/50 w-2"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Back Button */}
            <div className="fixed top-20 left-4 z-50">
                <button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-white/20 hover:bg-black/90 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </div>

            {/* Hero Section */}
            <div className="pt-16 bg-black">
                {/* Event Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 bg-black">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-4xl sm:text-5xl font-bold mb-2">{event.title}</h1>
                                        <div className="flex items-center text-orange-400 text-sm">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>{formatTime(event.time[0])}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setIsSaved(!isSaved)}
                                            className={`p-3 rounded-full transition-all duration-300 ${isSaved
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
                                                }`}
                                        >
                                            <Bookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={shareEvent}
                                            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/10"
                                        >
                                            <Share2 className="w-5 h-5 text-white/70" />
                                        </button>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start">
                                        <Calendar className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/70 text-sm uppercase tracking-wide mb-1">Date</p>
                                            <p className="text-white font-medium">
                                                {formatDate(event.time[0])} - {formatDate(event.time[1])}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/70 text-sm uppercase tracking-wide mb-1">Location</p>
                                            <p className="text-white font-medium">{event.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-orange-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <p className="text-white/70 text-sm uppercase tracking-wide mb-1">Hosted By</p>
                                            <p className="text-white font-medium">{event.host.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="border-t border-white/10 pt-6">
                                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                    <p className="text-white/70 leading-relaxed">{event.description}</p>
                                </div>

                                {/* Map Section */}
                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold">Location</h2>
                                        <button
                                            onClick={shareLocation}
                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share Location
                                        </button>
                                    </div>
                                    <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                                        <a
                                            href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=15/${event.latitude}/${event.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block hover:opacity-90 transition-opacity"
                                        >
                                            {/* Map placeholder - you can add your map component here */}
                                            <div className="h-48 bg-gray-800 flex items-center justify-center">
                                                <MapPin className="w-8 h-8 text-orange-400" />
                                                <span className="ml-2 text-white">View on Map</span>
                                            </div>
                                        </a>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{event.address}</p>
                                                    <p className="text-white/70 text-sm">Click map to open in OpenStreetMap</p>
                                                </div>
                                                <MapPin className="w-5 h-5 text-orange-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-24">
                                <h2 className="text-2xl font-bold mb-6">Select Tickets</h2>

                                {ticketError ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                        <p className="text-white/70 mb-2">{ticketError}</p>
                                        <p className="text-sm text-white/50">Check back later for ticket availability</p>
                                    </div>
                                ) : tickets.length > 0 ? (
                                    <div className="space-y-4">
                                        {tickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                onClick={() => ticket.quantity > 0 && setSelectedTicket(ticket.id)}
                                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedTicket === ticket.id
                                                    ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                                                    : ticket.quantity === 0
                                                        ? 'border-red-500/30 bg-red-500/5 cursor-not-allowed'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-white">{ticket.name}</h3>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-orange-400">
                                                            {ticket.currency} {ticket.cost}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className={`text-sm ${ticket.quantity === 0
                                                    ? 'text-red-400 font-semibold'
                                                    : 'text-white/70'
                                                    }`}>
                                                    {ticket.quantity === 0
                                                        ? 'SOLD OUT'
                                                        : `${ticket.quantity.toLocaleString()} tickets available`
                                                    }
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                        </div>
                                        <p className="text-white/70">No tickets available</p>
                                    </div>
                                )}

                                <button
                                    disabled={!selectedTicket}
                                    onClick={() => selectedTicket && setShowPurchaseModal(true)}
                                    className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${selectedTicket
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                        }`}
                                >
                                    Get Tickets
                                </button>

                                <p className="text-xs text-white/50 text-center mt-4">
                                    Secure checkout powered by Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <TicketPurchaseModal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                ticket={tickets.find(t => t.id === selectedTicket)}
                event={event}
            />
        </div>
    );
};

export default EventDetailPage;