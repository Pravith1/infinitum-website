'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';

// Types
interface Contact {
    name: string;
    mobile: string;
    _id: string;
}

interface AgendaItem {
    time: string;
    description: string;
    _id: string;
}

interface Workshop {
    _id: string;
    workshopId: string;
    workshopName: string;
    alteredFee: number;
    actualFee: number;
    club_id: string;
    date: string;
    tagline: string;
    hall: string;
    time: string;
    contacts: Contact[];
    maxCount: number;
    description: string;
    agenda: AgendaItem[];
    earlyBirdActive: boolean;
    closed: boolean;
    prerequisites: string;
    youtubeUrl?: string;
}

export default function WorkshopDetailPage() {
    const params = useParams();
    const router = useRouter();
    const workshopId = params.id as string;

    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/events/workshops/${workshopId}`);
                if (response.data?.success && response.data?.workshop) {
                    setWorkshop(response.data.workshop);
                } else if (response.data?.workshop) {
                    setWorkshop(response.data.workshop);
                } else {
                    setError('Workshop not found');
                }
            } catch (err) {
                console.error('Error fetching workshop:', err);
                setError('Failed to load workshop details');
            } finally {
                setLoading(false);
            }
        };

        if (workshopId) {
            fetchWorkshop();
        }
    }, [workshopId]);

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
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-theme-secondary">Loading workshop details...</p>
                </div>
            </div>
        );
    }

    if (error || !workshop) {
        return (
            <div className="min-h-screen bg-gradient-main flex items-center justify-center">
                <div className="text-center surface-card rounded-xl p-8">
                    <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-theme-primary mb-3">Workshop Not Found</h2>
                    <p className="text-theme-muted mb-6">{error || 'The workshop you are looking for does not exist.'}</p>
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
                    className="mb-6 flex items-center gap-2 text-theme-secondary hover:text-blue-400 transition-colors group"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Events
                </button>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image Space */}
                    <div className="lg:col-span-1">
                        <div className="surface-card rounded-xl overflow-hidden sticky top-8">
                            {/* Workshop Image Placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                                <div className="relative text-center p-6">
                                    <div className="w-24 h-24 mx-auto bg-blue-500/30 rounded-2xl flex items-center justify-center mb-4 border-2 border-blue-500/50">
                                        <span className="text-4xl">🔧</span>
                                    </div>
                                    <p className="text-theme-muted text-sm">Workshop</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Workshop ID</span>
                                    <span className="text-blue-400 font-mono font-bold">{workshop.workshopId}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Max Capacity</span>
                                    <span className="text-theme-primary font-bold">{workshop.maxCount} Seats</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Fee</span>
                                    <div className="text-right">
                                        {workshop.earlyBirdActive ? (
                                            <>
                                                <span className="text-green-400 font-bold">₹{workshop.alteredFee}</span>
                                                <span className="text-theme-muted text-xs line-through ml-2">₹{workshop.actualFee}</span>
                                            </>
                                        ) : (
                                            <span className="text-theme-primary font-bold">₹{workshop.actualFee}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-theme-muted text-sm">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${workshop.closed
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {workshop.closed ? 'Closed' : 'Open'}
                                    </span>
                                </div>
                            </div>

                            {/* Early Bird Badge */}
                            {workshop.earlyBirdActive && !workshop.closed && (
                                <div className="mx-4 mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3 text-center">
                                    <span className="text-green-400 font-semibold text-sm">🎉 Early Bird Offer Active!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Workshop Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Workshop Header Card */}
                        <div className="surface-card rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">Workshop</p>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{workshop.workshopName}</h1>
                            </div>
                            <div className="p-6">
                                <p className="text-theme-secondary text-lg leading-relaxed italic">
                                    "{workshop.tagline}"
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="surface-card rounded-xl p-6">
                            <h2 className="text-xl font-bold text-theme-primary mb-4">About This Workshop</h2>
                            <p className="text-theme-secondary leading-relaxed">
                                {workshop.description}
                            </p>
                        </div>

                        {/* Prerequisites */}
                        {workshop.prerequisites && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Prerequisites</h2>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-theme-secondary leading-relaxed">{workshop.prerequisites}</p>
                                </div>
                            </div>
                        )}

                        {/* Agenda */}
                        {workshop.agenda && workshop.agenda.length > 0 && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-6">Agenda</h2>
                                <div className="space-y-4">
                                    {workshop.agenda.map((item, index) => (
                                        <div
                                            key={item._id}
                                            className="relative pl-8 pb-4 border-l-2 border-blue-500/30 last:border-l-transparent last:pb-0"
                                        >
                                            {/* Time Badge */}
                                            <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                                                {index + 1}
                                            </div>
                                            <div className="bg-surface-secondary rounded-lg p-4 ml-4">
                                                <span className="text-blue-400 text-sm font-semibold">{item.time}</span>
                                                <p className="text-theme-primary font-medium mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Date, Time & Venue */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date & Time */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Date & Time</span>
                                <p className="text-theme-primary font-semibold mt-2">{formatDate(workshop.date)}</p>
                                <p className="text-blue-400 text-sm mt-1">{workshop.time}</p>
                            </div>

                            {/* Venue */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Venue</span>
                                <p className="text-theme-primary font-semibold mt-2">{workshop.hall}</p>
                            </div>
                        </div>

                        {/* Contacts */}
                        {workshop.contacts && workshop.contacts.length > 0 && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Coordinators</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {workshop.contacts.map((contact) => (
                                        <div key={contact._id} className="bg-surface-secondary rounded-lg p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-blue-400 font-bold text-lg">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-theme-primary font-semibold">{contact.name}</p>
                                                <a
                                                    href={`tel:${contact.mobile}`}
                                                    className="text-blue-400 text-sm hover:underline"
                                                >
                                                    {contact.mobile}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* YouTube Link */}
                        {workshop.youtubeUrl && (
                            <div className="surface-card rounded-xl p-6">
                                <a
                                    href={workshop.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <span className="text-2xl">▶️</span>
                                    <span className="font-semibold">Watch Introduction Video</span>
                                </a>
                            </div>
                        )}

                        {/* Register Button */}
                        {!workshop.closed && (
                            <div className="surface-card rounded-xl p-6 text-center">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
                                    Register Now - ₹{workshop.earlyBirdActive ? workshop.alteredFee : workshop.actualFee}
                                </button>
                                <p className="text-theme-muted text-sm mt-3">
                                    {workshop.maxCount} seats available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
