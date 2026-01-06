'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

// Types
interface Event {
    _id: string;
    eventId: string;
    eventName: string;
    category: string;
    oneLineDescription?: string;
    hall: string;
    teamSize: number;
    date: string;
    closed: boolean;
    timing?: string;
}

interface Workshop {
    _id: string;
    workshopId: string;
    workshopName?: string;
    name?: string;
    club: string;
    hall?: string;
    venue?: string;
    date: string;
    oneLineDescription?: string;
    description?: string;
}

interface Paper {
    _id: string;
    paperId: string;
    eventName?: string;
    name?: string;
    theme: string;
    hall?: string;
    venue?: string;
    date: string;
    oneLineDescription?: string;
    description?: string;
}

type TabType = 'events' | 'workshops' | 'papers';

// Card Component
function EventCard({ item, type, onClick }: { item: Event | Workshop | Paper; type: TabType; onClick: () => void }) {
    // Helper to get the item name (different field names across types)
    const getName = () => {
        if (type === 'events') return (item as Event).eventName;
        if (type === 'workshops') return (item as Workshop).workshopName || (item as Workshop).name || 'Untitled Workshop';
        return (item as Paper).eventName || (item as Paper).name || 'Untitled Paper';
    };

    const getSubtitle = () => {
        if (type === 'events') return (item as Event).category;
        if (type === 'workshops') return (item as Workshop).club;
        return (item as Paper).theme;
    };

    // Helper to get venue/hall (different field names across types)
    const getVenue = () => {
        if (type === 'events') return (item as Event).hall;
        const workshopOrPaper = item as Workshop | Paper;
        return workshopOrPaper.hall || workshopOrPaper.venue || 'TBA';
    };

    // Helper to get description
    const getDescription = () => {
        if (type === 'events') return (item as Event).oneLineDescription;
        const workshopOrPaper = item as Workshop | Paper;
        return workshopOrPaper.oneLineDescription || workshopOrPaper.description;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeColor = () => {
        switch (type) {
            case 'events': return 'bg-neon-pink';
            case 'workshops': return 'bg-blue-500';
            case 'papers': return 'bg-purple-500';
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'events':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'workshops':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                );
            case 'papers':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    const description = getDescription();

    return (
        <div
            onClick={onClick}
            className="surface-card rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-neon-pink/20 group"
        >
            {/* Card Header */}
            <div className={`${getTypeColor()} px-4 py-3 flex items-center gap-2`}>
                <span className="text-white">{getTypeIcon()}</span>
                <span className="text-white text-sm font-semibold uppercase tracking-wide">
                    {type === 'papers' ? 'Paper Presentation' : type.slice(0, -1)}
                </span>
                {type === 'events' && (item as Event).teamSize && (
                    <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-xs text-white">
                        Team of {(item as Event).teamSize}
                    </span>
                )}
            </div>

            {/* Card Body */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-theme-primary mb-2 group-hover:text-neon-pink transition-colors">
                    {getName()}
                </h3>
                <p className="text-theme-accent text-sm font-medium mb-3">
                    {getSubtitle()}
                </p>

                {description && (
                    <p className="text-theme-muted text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-theme-secondary">
                        <svg className="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{getVenue()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-theme-secondary">
                        <svg className="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDate(item.date)}</span>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 pb-4">
                <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                    <span className="text-theme-accent text-sm font-medium group-hover:text-neon-pink transition-colors">
                        View Details →
                    </span>
                    {type === 'events' && (item as Event).closed && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">
                            Closed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton
function CardSkeleton() {
    return (
        <div className="surface-card rounded-xl overflow-hidden animate-pulse">
            <div className="h-12 bg-surface-secondary"></div>
            <div className="p-5 space-y-3">
                <div className="h-6 bg-surface-secondary rounded w-3/4"></div>
                <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
                <div className="h-16 bg-surface-secondary rounded"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-surface-secondary rounded w-2/3"></div>
                    <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
}

// Tab Button Component
function TabButton({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count: number }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${active
                ? 'btn-primary neon-border'
                : 'btn-secondary hover:border-neon-pink/50'
                }`}
        >
            {children}
            <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20 text-white' : 'bg-surface-tertiary text-theme-muted'
                }`}>
                {count}
            </span>
        </button>
    );
}

// Main Page Component
export default function EventsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('events');
    const [events, setEvents] = useState<Event[]>([]);
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAllData();
    }, []);

    // Helper function to safely extract array from API response
    const extractArray = (response: any, fallbackKeys: string[] = []): any[] => {
        const data = response?.data;

        // If data is already an array, return it
        if (Array.isArray(data)) return data;

        // If data is an object, try to find an array property
        if (data && typeof data === 'object') {
            // Try common keys first
            for (const key of ['data', 'events', 'workshops', 'papers', 'items', 'results', ...fallbackKeys]) {
                if (Array.isArray(data[key])) return data[key];
            }

            // If it's an object but no array found, wrap it if it looks like a single item
            if (data._id) return [data];
        }

        // Return empty array as fallback
        return [];
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [eventsRes, workshopsRes, papersRes] = await Promise.all([
                api.get('/api/events', { params: { limit: 50 } }),
                api.get('/api/events/workshops', { params: { limit: 50 } }),
                api.get('/api/events/papers', { params: { limit: 50 } })
            ]);

            console.log('Events response:', eventsRes.data);
            console.log('Workshops response:', workshopsRes.data);
            console.log('Papers response:', papersRes.data);

            setEvents(extractArray(eventsRes, ['events']));
            setWorkshops(extractArray(workshopsRes, ['workshops']));
            setPapers(extractArray(papersRes, ['papers']));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (type: TabType, item: Event | Workshop | Paper) => {
        const basePath = type === 'papers' ? 'paper' : type.slice(0, -1);
        let id: string;
        switch (type) {
            case 'events':
                id = (item as Event).eventId;
                break;
            case 'workshops':
                id = (item as Workshop).workshopId;
                break;
            case 'papers':
                id = (item as Paper).paperId;
                break;
        }
        router.push(`/portal/event/${basePath}/${id}`);
    };

    const getFilteredItems = () => {
        const query = searchQuery.toLowerCase();
        switch (activeTab) {
            case 'events':
                return events.filter(e =>
                    e.eventName?.toLowerCase().includes(query) ||
                    e.category?.toLowerCase().includes(query)
                );
            case 'workshops':
                return workshops.filter(w =>
                    (w.workshopName || w.name || '')?.toLowerCase().includes(query) ||
                    w.club?.toLowerCase().includes(query)
                );
            case 'papers':
                return papers.filter(p =>
                    (p.eventName || p.name || '')?.toLowerCase().includes(query) ||
                    p.theme?.toLowerCase().includes(query)
                );
        }
    };

    const filteredItems = getFilteredItems();

    return (
        <div className="min-h-screen bg-gradient-main py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-3">
                        <span className="neon-text">Infinitum</span> 2026
                    </h1>
                    <p className="text-theme-secondary text-lg">
                        Explore our exciting lineup of events, workshops, and paper presentations
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-8">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search events, workshops, papers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 input-field rounded-xl text-lg"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <TabButton
                        active={activeTab === 'events'}
                        onClick={() => setActiveTab('events')}
                        count={events.length}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Events
                    </TabButton>
                    <TabButton
                        active={activeTab === 'workshops'}
                        onClick={() => setActiveTab('workshops')}
                        count={workshops.length}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Workshops
                    </TabButton>
                    <TabButton
                        active={activeTab === 'papers'}
                        onClick={() => setActiveTab('papers')}
                        count={papers.length}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Papers
                    </TabButton>
                </div>

                {/* Error State */}
                {error && (
                    <div className="alert-error rounded-lg p-4 text-center mb-8">
                        <p>{error}</p>
                        <button
                            onClick={fetchAllData}
                            className="mt-2 btn-primary px-4 py-2 rounded-lg text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <EventCard
                                key={item._id}
                                item={item}
                                type={activeTab}
                                onClick={() => handleCardClick(activeTab, item)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <svg
                                className="w-16 h-16 mx-auto text-theme-muted mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-theme-muted text-lg">
                                {searchQuery
                                    ? `No ${activeTab} found matching "${searchQuery}"`
                                    : `No ${activeTab} available yet`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
