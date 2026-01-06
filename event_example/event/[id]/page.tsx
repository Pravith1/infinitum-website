'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';

// Types
interface Round {
    title: string;
    description: string;
    _id: string;
}

interface Contact {
    name: string;
    mobile: string;
    _id: string;
}

interface Event {
    _id: string;
    eventId: string;
    eventName: string;
    category: string;
    oneLineDescription: string;
    description: string;
    club_id: string;
    rounds: Round[];
    contacts: Contact[];
    hall: string;
    eventRules: string;
    teamSize: number;
    date: string;
    closed: boolean;
    timing: string;
    youtubeUrl?: string;
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/events/${eventId}`);
                if (response.data?.success && response.data?.event) {
                    setEvent(response.data.event);
                } else if (response.data?.event) {
                    setEvent(response.data.event);
                } else {
                    setError('Event not found');
                }
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-main flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-theme-secondary">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gradient-main flex items-center justify-center">
                <div className="text-center surface-card rounded-xl p-8">
                    <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-theme-primary mb-3">Event Not Found</h2>
                    <p className="text-theme-muted mb-6">{error || 'The event you are looking for does not exist.'}</p>
                    <button
                        onClick={() => router.back()}
                        className="btn-primary px-6 py-3 rounded-lg font-semibold"
                    >
                        ← Return to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-main py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-theme-secondary hover:text-neon-pink transition-colors group"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Events
                </button>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image Space */}
                    <div className="lg:col-span-1">
                        <div className="surface-card rounded-xl overflow-hidden sticky top-8">
                            {/* Event Image Placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-neon-pink/20 to-purple-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                                <div className="relative text-center p-6">
                                    <div className="w-24 h-24 mx-auto bg-neon-pink/30 rounded-2xl flex items-center justify-center mb-4 neon-border">
                                        <span className="text-4xl">🎯</span>
                                    </div>
                                    <p className="text-theme-muted text-sm">Event Image</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Event ID</span>
                                    <span className="text-neon-pink font-mono font-bold">{event.eventId}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Team Size</span>
                                    <span className="text-theme-primary font-bold">{event.teamSize} Members</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Category</span>
                                    <span className="bg-neon-pink/20 text-neon-pink px-3 py-1 rounded-full text-xs font-semibold">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-theme-muted text-sm">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.closed
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {event.closed ? 'Closed' : 'Open'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Header Card */}
                        <div className="surface-card rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-neon-pink to-purple-600 px-6 py-4">
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">Event</p>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{event.eventName}</h1>
                            </div>
                            <div className="p-6">
                                <p className="text-theme-secondary text-lg leading-relaxed">
                                    {event.oneLineDescription}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="surface-card rounded-xl p-6">
                            <h2 className="text-xl font-bold text-theme-primary mb-4">About This Event</h2>
                            <p className="text-theme-secondary leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Rounds */}
                        {event.rounds && event.rounds.length > 0 && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-6">Rounds</h2>
                                <div className="space-y-4">
                                    {event.rounds.map((round, index) => (
                                        <div
                                            key={round._id}
                                            className="relative pl-8 pb-4 border-l-2 border-neon-pink/30 last:border-l-transparent last:pb-0"
                                        >
                                            {/* Round Number Badge */}
                                            <div className="absolute -left-4 top-0 w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-neon-pink/30">
                                                {index + 1}
                                            </div>
                                            <div className="bg-surface-secondary rounded-lg p-4 ml-4">
                                                <h3 className="text-lg font-bold text-theme-primary mb-2">{round.title}</h3>
                                                <p className="text-theme-secondary text-sm leading-relaxed">{round.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rules */}
                        {event.eventRules && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Rules</h2>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                    <p className="text-theme-secondary leading-relaxed">{event.eventRules}</p>
                                </div>
                            </div>
                        )}

                        {/* Event Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date & Time */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Date & Time</span>
                                <p className="text-theme-primary font-semibold mt-2">{formatDate(event.date)}</p>
                                <p className="text-neon-pink text-sm mt-1">{event.timing}</p>
                            </div>

                            {/* Venue */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Venue</span>
                                <p className="text-theme-primary font-semibold mt-2">{event.hall}</p>
                            </div>
                        </div>

                        {/* Contacts */}
                        {event.contacts && event.contacts.length > 0 && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Event Coordinators</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {event.contacts.map((contact) => (
                                        <div key={contact._id} className="bg-surface-secondary rounded-lg p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neon-pink/20 rounded-full flex items-center justify-center">
                                                <span className="text-neon-pink font-bold text-lg">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-theme-primary font-semibold">{contact.name}</p>
                                                <a
                                                    href={`tel:${contact.mobile}`}
                                                    className="text-neon-pink text-sm hover:underline"
                                                >
                                                    {contact.mobile}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Register Button */}
                        {!event.closed && (
                            <div className="surface-card rounded-xl p-6 text-center">
                                <button className="btn-primary px-8 py-4 rounded-xl font-bold text-lg neon-border hover:scale-105 transition-transform">
                                    Register Now
                                </button>
                                <p className="text-theme-muted text-sm mt-3">
                                    Team up with {event.teamSize - 1} other members to participate!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
