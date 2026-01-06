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

interface Paper {
    _id: string;
    paperId: string;
    eventName: string;
    contacts: Contact[];
    eventMail: string;
    theme: string;
    tagline: string;
    topic: string;
    rules: string;
    date: string;
    time: string;
    deadline: string;
    teamSize: number;
    hall: string;
    closed: boolean;
    youtubeUrl?: string;
}

export default function PaperDetailPage() {
    const params = useParams();
    const router = useRouter();
    const paperId = params.id as string;

    const [paper, setPaper] = useState<Paper | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaper = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/events/papers/${paperId}`);
                if (response.data?.success && response.data?.paper) {
                    setPaper(response.data.paper);
                } else if (response.data?.paper) {
                    setPaper(response.data.paper);
                } else {
                    setError('Paper presentation not found');
                }
            } catch (err) {
                console.error('Error fetching paper:', err);
                setError('Failed to load paper presentation details');
            } finally {
                setLoading(false);
            }
        };

        if (paperId) {
            fetchPaper();
        }
    }, [paperId]);

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
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-theme-secondary">Loading paper presentation details...</p>
                </div>
            </div>
        );
    }

    if (error || !paper) {
        return (
            <div className="min-h-screen bg-gradient-main flex items-center justify-center">
                <div className="text-center surface-card rounded-xl p-8">
                    <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-theme-primary mb-3">Paper Presentation Not Found</h2>
                    <p className="text-theme-muted mb-6">{error || 'The paper presentation you are looking for does not exist.'}</p>
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
                    className="mb-6 flex items-center gap-2 text-theme-secondary hover:text-purple-400 transition-colors group"
                >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Events
                </button>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image Space */}
                    <div className="lg:col-span-1">
                        <div className="surface-card rounded-xl overflow-hidden sticky top-8">
                            {/* Paper Image Placeholder */}
                            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                                <div className="relative text-center p-6">
                                    <div className="w-24 h-24 mx-auto bg-purple-500/30 rounded-2xl flex items-center justify-center mb-4 border-2 border-purple-500/50">
                                        <span className="text-4xl">📄</span>
                                    </div>
                                    <p className="text-theme-muted text-sm">Paper Presentation</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Paper ID</span>
                                    <span className="text-purple-400 font-mono font-bold">{paper.paperId}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Team Size</span>
                                    <span className="text-theme-primary font-bold">{paper.teamSize} Members</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                                    <span className="text-theme-muted text-sm">Theme</span>
                                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold">
                                        {paper.theme}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-theme-muted text-sm">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paper.closed
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {paper.closed ? 'Closed' : 'Open'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Paper Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Paper Header Card */}
                        <div className="surface-card rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                                <p className="text-white/70 text-sm font-medium uppercase tracking-wide">Paper Presentation</p>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{paper.eventName}</h1>
                            </div>
                            <div className="p-6">
                                <p className="text-theme-secondary text-lg leading-relaxed italic">
                                    "{paper.tagline}"
                                </p>
                            </div>
                        </div>

                        {/* Topic */}
                        <div className="surface-card rounded-xl p-6">
                            <h2 className="text-xl font-bold text-theme-primary mb-4">Topic</h2>
                            <p className="text-theme-secondary leading-relaxed">
                                {paper.topic}
                            </p>
                        </div>

                        {/* Rules */}
                        {paper.rules && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Rules & Guidelines</h2>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                    <p className="text-theme-secondary leading-relaxed whitespace-pre-line">{paper.rules}</p>
                                </div>
                            </div>
                        )}

                        {/* Important Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Deadline */}
                            <div className="surface-card rounded-xl p-5 border-l-4 border-red-500">
                                <span className="text-red-400 text-sm font-medium">Submission Deadline</span>
                                <p className="text-theme-primary font-semibold mt-2">{formatDate(paper.deadline)}</p>
                            </div>

                            {/* Event Date */}
                            <div className="surface-card rounded-xl p-5 border-l-4 border-purple-500">
                                <span className="text-purple-400 text-sm font-medium">Presentation Date</span>
                                <p className="text-theme-primary font-semibold mt-2">{formatDate(paper.date)}</p>
                                <p className="text-theme-muted text-sm mt-1">{paper.time}</p>
                            </div>
                        </div>

                        {/* Venue & Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Venue */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Venue</span>
                                <p className="text-theme-primary font-semibold mt-2">{paper.hall}</p>
                            </div>

                            {/* Email */}
                            <div className="surface-card rounded-xl p-5">
                                <span className="text-theme-muted text-sm font-medium">Contact Email</span>
                                <a
                                    href={`mailto:${paper.eventMail}`}
                                    className="text-purple-400 font-semibold mt-2 block hover:underline"
                                >
                                    {paper.eventMail}
                                </a>
                            </div>
                        </div>

                        {/* Contacts */}
                        {paper.contacts && paper.contacts.length > 0 && (
                            <div className="surface-card rounded-xl p-6">
                                <h2 className="text-xl font-bold text-theme-primary mb-4">Coordinators</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {paper.contacts.map((contact) => (
                                        <div key={contact._id} className="bg-surface-secondary rounded-lg p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-purple-400 font-bold text-lg">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-theme-primary font-semibold">{contact.name}</p>
                                                <a
                                                    href={`tel:${contact.mobile}`}
                                                    className="text-purple-400 text-sm hover:underline"
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
                        {paper.youtubeUrl && (
                            <div className="surface-card rounded-xl p-6">
                                <a
                                    href={paper.youtubeUrl}
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
                        {!paper.closed && (
                            <div className="surface-card rounded-xl p-6 text-center">
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30">
                                    Submit Your Paper
                                </button>
                                <p className="text-theme-muted text-sm mt-3">
                                    Team up with {paper.teamSize - 1} other members to participate!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
