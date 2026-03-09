'use client';

import { LocaleLink } from './LocaleLink';
import { useRouter } from 'next/navigation';
import { localePath } from '@/i18n/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react';
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Home,
    Maximize,
    Calendar,
    Building2,
    Thermometer,
    Trees,
    Car,
    ChevronLeft,
    ChevronRight,
    X,
    Phone,
    Mail,
    Loader2,
    CheckCircle,
    Grid3X3,
    Copy,
    Check,
    Navigation
} from 'lucide-react';
import Image from 'next/image';
import listingImageLoader, { blurUrl, buildWeservUrl } from '@/lib/imageLoader';
import confetti from 'canvas-confetti';
import { Footer } from '@/components/Footer';
import { useListing, useAgent } from '@/hooks/useListings';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
    getLocalizedCategoryLabel,
    getLocalizedTransactionLabel,
    formatPrice,
    formatArea,
    getLocalizedRealEstateStateLabel,
    getLocalizedBuildingTypeLabel,
    getLocalizedHeatingLabel,
    getLocalizedEquipmentLabel,
    getLocalizedOwnershipLabel,
} from '@/api/mappings';
import { getBestImageUrl, shouldShowOverlay } from '@/api/listingsService';

const friscoLogo = '/frisco-logo-hq.png';

/**
 * Gallery image with shimmer skeleton + fade-in on load.
 * Wraps next/image; shows a pulsing navy/5 background until the image is
 * decoded, then fades it in over 400 ms.
 */
const GalleryImage = ({
    src,
    alt,
    fill = true,
    sizes,
    quality = 75,
    priority = false,
    className = '',
    style,
    showOverlay = false,
}: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    quality?: number;
    priority?: boolean;
    className?: string;
    style?: CSSProperties;
    showOverlay?: boolean;
}) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {/* Shimmer skeleton shown while image loads */}
            {!loaded && (
                <div className="absolute inset-0 bg-navy/5 animate-pulse" />
            )}
            <Image
                loader={listingImageLoader}
                src={src}
                alt={alt}
                fill={fill}
                sizes={sizes}
                quality={quality}
                priority={priority}
                placeholder={!priority && src && !src.startsWith('/') ? 'blur' : 'empty'}
                blurDataURL={!priority && src && !src.startsWith('/') ? blurUrl(src) : undefined}
                className={`transition-[opacity,transform] duration-500 ease-out will-change-[opacity,transform] ${
                    loaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                style={style}
                onLoad={() => setLoaded(true)}
            />
            {/* FRISCO watermark — only when no baked-in logo detected */}
            {showOverlay && (
                <img
                    src={friscoLogo}
                    alt=""
                    className="absolute bottom-3 right-0 h-[32px] w-auto pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] z-20 select-none"
                    draggable={false}
                />
            )}
        </>
    );
};

// Company contact info - synced with TopBar
const CONTACT = {
    phone: '0905 447 220',
    phoneRaw: '+421905447220',
    email: 'info@frisco.sk',
    address: 'Námestie Slobody 1185/30, 926 01 Sereď',
};

interface PropertyDetailProps {
    id: string;
}

const PropertyDetailContent = ({ id }: PropertyDetailProps) => {
    const { language } = useLanguage();
    const copy = {
        sk: {
            propertyFallback: 'Nehnuteľnosť',
            interestSubject: 'Záujem o:',
            interestBody: 'Dobrý deň,\n\nmám záujem o nehnuteľnosť: ',
            interestBodyId: '\nID: ',
            interestBodyUrl: '\nURL: ',
            interestBodyEnd: '\n\nProsím kontaktujte ma.\n\nS pozdravom',
            notFoundTitle: 'Nehnuteľnosť nenájdená',
            notFoundText: 'Ľutujeme, táto nehnuteľnosť neexistuje alebo bola odstránená.',
            backToOffer: 'Späť na ponuku',
            back: 'Späť',
            home: 'Domov',
            offer: 'Ponuka',
            lookingForProperty: 'Hľadám nehnuteľnosť',
            wantSellRent: 'Chcem predať/prenajať',
            whyFrisco: 'Prečo FRISCO?',
            contact: 'Kontakt',
            allPhotos: 'Všetky fotky',
            forSaleFallback: 'Na predaj',
            perMonth: '/mesiac',
            usableArea: 'Úžitková plocha',
            builtUpArea: 'Zastavaná plocha',
            landArea: 'Plocha pozemku',
            roomCount: 'Počet izieb',
            floor: 'Poschodie',
            yearBuilt: 'Rok výstavby',
            heatingPrefix: 'Kúrenie: ',
            description: 'Popis',
            equipment: 'Vybavenie',
            additionalInfo: 'Ďalšie informácie',
            category: 'Kategória',
            ownership: 'Vlastníctvo',
            buildingType: 'Typ budovy',
            location: 'Poloha',
            mapTitle: 'Mapa nehnuteľnosti',
            showOnMap: 'Zobraziť na mape',
            navigate: 'Navigovať',
            contactUs: 'Kontaktujte nás',
            yourPartner: 'Váš realitný partner',
            phone: 'Telefón',
            email: 'Email',
            interested: 'Mám záujem',
            photo: 'Fotka',
        },
        en: {
            propertyFallback: 'Property',
            interestSubject: 'Interest in:',
            interestBody: 'Hello,\n\nI am interested in the property: ',
            interestBodyId: '\nID: ',
            interestBodyUrl: '\nURL: ',
            interestBodyEnd: '\n\nPlease contact me.\n\nBest regards',
            notFoundTitle: 'Property not found',
            notFoundText: 'Sorry, this property does not exist or has been removed.',
            backToOffer: 'Back to offer',
            back: 'Back',
            home: 'Home',
            offer: 'Offer',
            lookingForProperty: 'Looking for a property',
            wantSellRent: 'I want to sell/rent',
            whyFrisco: 'Why FRISCO?',
            contact: 'Contact',
            allPhotos: 'All photos',
            forSaleFallback: 'For sale',
            perMonth: '/month',
            usableArea: 'Usable area',
            builtUpArea: 'Built-up area',
            landArea: 'Land area',
            roomCount: 'Rooms',
            floor: 'Floor',
            yearBuilt: 'Year built',
            heatingPrefix: 'Heating: ',
            description: 'Description',
            equipment: 'Amenities',
            additionalInfo: 'Additional information',
            category: 'Category',
            ownership: 'Ownership',
            buildingType: 'Building type',
            location: 'Location',
            mapTitle: 'Property map',
            showOnMap: 'Show on map',
            navigate: 'Navigate',
            contactUs: 'Contact us',
            yourPartner: 'Your real estate partner',
            phone: 'Phone',
            email: 'Email',
            interested: 'I am interested',
            photo: 'Photo',
        },
        de: {
            propertyFallback: 'Immobilie',
            interestSubject: 'Interesse an:',
            interestBody: 'Guten Tag,\n\nich interessiere mich für die Immobilie: ',
            interestBodyId: '\nID: ',
            interestBodyUrl: '\nURL: ',
            interestBodyEnd: '\n\nBitte kontaktieren Sie mich.\n\nMit freundlichen Grüßen',
            notFoundTitle: 'Immobilie nicht gefunden',
            notFoundText: 'Leider existiert diese Immobilie nicht oder wurde entfernt.',
            backToOffer: 'Zurück zum Angebot',
            back: 'Zurück',
            home: 'Startseite',
            offer: 'Angebot',
            lookingForProperty: 'Ich suche eine Immobilie',
            wantSellRent: 'Ich möchte verkaufen/vermieten',
            whyFrisco: 'Warum FRISCO?',
            contact: 'Kontakt',
            allPhotos: 'Alle Fotos',
            forSaleFallback: 'Zu verkaufen',
            perMonth: '/Monat',
            usableArea: 'Nutzfläche',
            builtUpArea: 'Bebaute Fläche',
            landArea: 'Grundstücksfläche',
            roomCount: 'Zimmeranzahl',
            floor: 'Etage',
            yearBuilt: 'Baujahr',
            heatingPrefix: 'Heizung: ',
            description: 'Beschreibung',
            equipment: 'Ausstattung',
            additionalInfo: 'Weitere Informationen',
            category: 'Kategorie',
            ownership: 'Eigentum',
            buildingType: 'Gebäudetyp',
            location: 'Lage',
            mapTitle: 'Immobilienkarte',
            showOnMap: 'Auf Karte anzeigen',
            navigate: 'Navigieren',
            contactUs: 'Kontaktieren Sie uns',
            yourPartner: 'Ihr Immobilienpartner',
            phone: 'Telefon',
            email: 'E-Mail',
            interested: 'Ich habe Interesse',
            photo: 'Foto',
        },
    }[language];

    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [isPonukaHovered, setIsPonukaHovered] = useState(false);
    const [agentPhotoError, setAgentPhotoError] = useState(false);

    // Fetch listing data
    const { data: listing, isLoading, error } = useListing(id);

    // Fetch assigned agent (for photo & contact info)
    const { data: agent } = useAgent(listing?.agent_id);

    // Derive agent display values (agent table > listing fields > fallback)
    const agentName = agent?.full_name || listing?.agent_name || 'FRISCO Reality';
    const agentPhone = agent?.phone || listing?.agent_phone || CONTACT.phoneRaw;
    const agentEmail = agent?.email || listing?.agent_email || CONTACT.email;

    // Use local static images matching the contact page instead of external UC Export URLs.
    // Match by normalized first-name substring to handle all name format variations
    // (e.g. "Bc. Peter Križo" vs "Peter Križo", NFC/NFD unicode, trailing whitespace).
    const normName = agentName.normalize('NFC').trim().toLowerCase();
    const localPhoto = normName.includes('denisa')
        ? { src: '/pani-krizova.jpeg', objectFit: 'object-cover object-top' }
        : normName.includes('peter')
            ? { src: '/frisco-favicon.png', objectFit: 'object-contain' }
            : null;
    const agentPhotoUrl = localPhoto?.src || agent?.photo_url || null;
    const agentPhotoFit = localPhoto?.objectFit || 'object-cover object-top';

    const agentInitials = agentName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'RK';

    // Handle like
    const handleLike = () => {
        const newState = !isLiked;
        setIsLiked(newState);
        if (newState) {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { x: 0.9, y: 0.1 },
                colors: ['#F472B6', '#EC4899', '#DB2777'],
            });
        }
    };

    // Handle share
    const handleShare = async () => {
        const url = window.location.href;
        const title = listing?.title || copy.propertyFallback;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    // Handle "Mám záujem" button
    const handleInterest = () => {
        const subject = encodeURIComponent(`${copy.interestSubject} ${listing?.title || copy.propertyFallback}`);
        const body = encodeURIComponent(`${copy.interestBody}${listing?.title}${copy.interestBodyId}${listing?.uc_object_id || listing?.id}${copy.interestBodyUrl}${window.location.href}${copy.interestBodyEnd}`);
        window.location.href = `mailto:${agentEmail}?subject=${subject}&body=${body}`;
    };

    // Image navigation — use the derived `images` length (works for both real & fallback)
    const totalImages = useRef(0);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % (totalImages.current || 1));
    }, []);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + (totalImages.current || 1)) % (totalImages.current || 1));
    }, []);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!showLightbox) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowLightbox(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll while lightbox is open
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [showLightbox, nextImage, prevImage]);

    // Touch swipe support for lightbox
    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { // 50px minimum swipe
            if (diff > 0) nextImage();
            else prevImage();
        }
    };

    // Preload ALL gallery images at display size when lightbox opens.
    // Uses native Image() to hit the exact same weserv.nl URL that next/image will request,
    // so the browser cache is warm and arrow navigation is instant.
    // Zero Vercel cost — everything goes through weserv.nl CDN.
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const preloadedRef = useRef(false);

    useEffect(() => {
        if (!showLightbox || preloadedRef.current) return;
        preloadedRef.current = true;

        // Estimate display width: ~90vw for the lightbox
        const displayWidth = Math.min(typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.9) : 1200, 1920);

        images.forEach((imgSrc, idx) => {
            if (!imgSrc || imgSrc.startsWith('/') || imgSrc.startsWith('data:')) return;
            const img = new window.Image();
            img.onload = () => {
                setLoadedImages(prev => {
                    const next = new Set(prev);
                    next.add(idx);
                    return next;
                });
            };
            img.src = buildWeservUrl(imgSrc, displayWidth, 85);
        });
    }, [showLightbox]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset preload flag when images change (different listing)
    useEffect(() => {
        preloadedRef.current = false;
        setLoadedImages(new Set());
    }, [listing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-cream flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-navy" />
            </main>
        );
    }

    // Error or not found
    if (error || !listing) {
        return (
            <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-serif font-bold text-navy mb-4">{copy.notFoundTitle}</h1>
                <p className="text-charcoal/60 mb-8">{copy.notFoundText}</p>
                <button
                    onClick={() => router.push(localePath('/ponuka', language))}
                    className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-full hover:bg-navy/90 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {copy.backToOffer}
                </button>
            </main>
        );
    }

    // Get images - add more mock images for demo
    const images = listing.images.length > 0
        ? listing.images.map(img => getBestImageUrl(img))
        : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200',
        ];
    // Build a Set of image URLs that should show the CSS overlay
    // (no baked-in FRISCO logo detected by the Python scanner)
    const overlayUrls = new Set(
        listing.images
            .filter(img => shouldShowOverlay(img))
            .map(img => getBestImageUrl(img))
    );
    totalImages.current = images.length;

    const currentImage = images[currentImageIndex] || '';

    // Format price
    const isRent = listing.action === 3;
    const priceDisplay = isRent
        ? `${formatPrice(listing.price)}${copy.perMonth}`
        : formatPrice(listing.price);

    // Build features list
    const features = [];
    if (listing.usable_area) features.push({ icon: Maximize, label: copy.usableArea, value: formatArea(listing.usable_area) });
    if (listing.building_area) features.push({ icon: Building2, label: copy.builtUpArea, value: formatArea(listing.building_area) });
    if (listing.plot_area) features.push({ icon: Trees, label: copy.landArea, value: formatArea(listing.plot_area) });
    if (listing.rooms_count) features.push({ icon: Home, label: copy.roomCount, value: `${listing.rooms_count}` });
    if (listing.floor) features.push({ icon: Building2, label: copy.floor, value: `${listing.floor}.` });
    if (listing.age) features.push({ icon: Calendar, label: copy.yearBuilt, value: `${listing.age}` });

    // Build amenities from extra_data boolean fields
    const amenities: string[] = [];
    if (listing.extra_data) {
        // Equipment/features
        const featureKeys: Record<string, Record<string, string>> = {
            balcony: { sk: 'Balkón', en: 'Balcony', de: 'Balkon' },
            loggia: { sk: 'Lodžia', en: 'Loggia', de: 'Loggia' },
            terrace: { sk: 'Terasa', en: 'Terrace', de: 'Terrasse' },
            garage: { sk: 'Garáž', en: 'Garage', de: 'Garage' },
            cellar_place: { sk: 'Pivnica', en: 'Cellar', de: 'Keller' },
            storage_place: { sk: 'Komora', en: 'Storage', de: 'Abstellraum' },
            lift: { sk: 'Výťah', en: 'Elevator', de: 'Aufzug' },
            adv_pool: { sk: 'Bazén', en: 'Pool', de: 'Schwimmbad' },
            adv_sauna: { sk: 'Sauna', en: 'Sauna', de: 'Sauna' },
            adv_fire: { sk: 'Krb', en: 'Fireplace', de: 'Kamin' },
            access_klima: { sk: 'Klimatizácia', en: 'Air conditioning', de: 'Klimaanlage' },
        };
        for (const [key, labels] of Object.entries(featureKeys)) {
            if (listing.extra_data[key] && listing.extra_data[key] !== 0) {
                amenities.push(labels[language] || labels['sk']);
            }
        }
        // Heating
        const heatingKeys: Record<string, Record<string, string>> = {
            heating_central: { sk: 'Ústredné kúrenie', en: 'Central heating', de: 'Zentralheizung' },
            heating_floor: { sk: 'Podlahové kúrenie', en: 'Underfloor heating', de: 'Fußbodenheizung' },
            heating_local: { sk: 'Lokálne kúrenie', en: 'Local heating', de: 'Lokalheizung' },
            heating_fire: { sk: 'Krbové kúrenie', en: 'Fireplace heating', de: 'Kaminheizung' },
            heating_heat: { sk: 'Tepelné čerpadlo', en: 'Heat pump', de: 'Wärmepumpe' },
        };
        for (const [key, labels] of Object.entries(heatingKeys)) {
            if (listing.extra_data[key] && listing.extra_data[key] !== 0) {
                amenities.push(labels[language] || labels['sk']);
            }
        }
    }

    return (
        <main className="min-h-screen bg-cream">
            {/* Custom Header for Detail Page */}
            <div className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-black/5">
                <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-navy hover:text-accent-red transition-colors min-w-[100px]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">{copy.back}</span>
                    </button>

                    {/* Desktop Navigation Links - Centered */}
                    <nav className="hidden md:flex items-center gap-8">
                        <LocaleLink href="/" className="flex-shrink-0 mr-4">
                            <img src={friscoLogo} alt="FRISCO" className="h-12 w-auto" />
                        </LocaleLink>
                        <LocaleLink href="/" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.home}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>

                        <div
                            className="relative"
                            onMouseEnter={() => setIsPonukaHovered(true)}
                            onMouseLeave={() => setIsPonukaHovered(false)}
                        >
                            <div className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase cursor-pointer flex items-center gap-1">
                                {copy.offer}
                                <svg
                                    className={`w-3 h-3 transition-transform duration-200 ${isPonukaHovered ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className="absolute bottom-0 left-0 right-4 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                            </div>

                            <AnimatePresence>
                                {isPonukaHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-1"
                                    >
                                        <div className="bg-white shadow-lg border border-charcoal/5 min-w-[260px] rounded-lg overflow-hidden">
                                            <LocaleLink
                                                href="/ponuka"
                                                className="block px-5 py-3.5 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-charcoal/[0.02] transition-colors border-b border-charcoal/5 whitespace-nowrap text-center"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                {copy.lookingForProperty}
                                            </LocaleLink>
                                            <LocaleLink
                                                href="/predaj-a-prenajom"
                                                className="block px-5 py-3.5 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-charcoal/[0.02] transition-colors whitespace-nowrap text-center"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                {copy.wantSellRent}
                                            </LocaleLink>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <LocaleLink href="/preco-frisco" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.whyFrisco}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>

                        <LocaleLink href="/kontakt" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.contact}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>
                    </nav>

                    <div className="flex items-center gap-3 min-w-[100px] justify-end">
                        <button
                            onClick={handleLike}
                            className={`p-3 rounded-full border transition-all ${isLiked ? 'bg-pink-50 border-pink-200 text-pink-500' : 'bg-white border-black/10 text-black/60 hover:border-black/20'}`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-pink-500' : ''}`} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-full border border-black/10 bg-white text-black/60 hover:border-black/20 transition-all relative"
                        >
                            {linkCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Gallery - Collage Style */}
            <section className="pt-20">
                <div className="relative">
                    {/* Desktop Collage Grid */}
                    <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 h-[75vh] max-h-[700px]">
                        {/* Main Large Image */}
                        <div
                            className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden rounded-r-xl md:rounded-r-none md:rounded-l-none"
                            onClick={() => { setCurrentImageIndex(0); setShowLightbox(true); }}
                        >
                            <GalleryImage
                                src={images[0]}
                                alt={listing.title}
                                priority
                                sizes="50vw"
                                quality={80}
                                showOverlay={overlayUrls.has(images[0])}
                                className="object-cover hover:scale-[1.03] duration-900 ease-smooth-zoom"
                            />
                        </div>

                        {/* Smaller Images */}
                        {images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                className="relative cursor-pointer overflow-hidden first:rounded-tr-xl last:rounded-br-xl"
                                onClick={() => { setCurrentImageIndex(idx + 1); setShowLightbox(true); }}
                            >
                                <GalleryImage
                                    src={img}
                                    alt={`${listing.title} - ${idx + 2}`}
                                    priority={idx === 0}
                                    sizes="25vw"
                                    quality={75}
                                    showOverlay={overlayUrls.has(img)}
                                    className="object-cover hover:scale-[1.03] duration-900 ease-smooth-zoom"
                                />
                                {/* "All Photos" Button on last image */}
                                {idx === 3 && images.length > 5 && (
                                    <div
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true); }}
                                    >
                                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg font-medium">
                                            <Grid3X3 className="w-5 h-5" />
                                                {copy.allPhotos} ({images.length})
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Fill empty slots if less than 5 images */}
                        {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="bg-cream-dark flex items-center justify-center">
                                <span className="text-black/10 font-serif text-3xl italic">FRISCO</span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Single Image with Swipe — stacked crossfade (no white flash) */}
                    <div className="md:hidden relative h-[50vh]">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                                    idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                                onClick={() => setShowLightbox(true)}
                            >
                                <GalleryImage
                                    src={img}
                                    alt={listing.title}
                                    priority={idx === 0}
                                    sizes="100vw"
                                    quality={80}
                                    showOverlay={overlayUrls.has(img)}
                                    className="object-cover"
                                />
                            </div>
                        ))}

                        {/* Mobile Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                                    <Grid3X3 className="w-4 h-4" />
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Title & Price */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                    {getLocalizedTransactionLabel(listing.action, language) || copy.forSaleFallback}
                                </span>
                                {listing.condition && (
                                    <span className="px-3 py-1 bg-accent-red text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                        {getLocalizedRealEstateStateLabel(listing.condition, language)}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-navy mb-4">
                                {listing.title}
                            </h1>
                            <div className="flex items-center gap-2 text-charcoal/60 mb-6">
                                <MapPin className="w-5 h-5 text-accent-red" />
                                <span className="text-lg">
                                    {[listing.street, listing.location_city, listing.location_district].filter(Boolean).join(', ')}
                                </span>
                            </div>
                            <p className="text-4xl md:text-5xl font-bold text-accent-red">
                                {priceDisplay}
                            </p>
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {features.map((feature, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-5 border border-black/5">
                                    <feature.icon className="w-6 h-6 text-navy/50 mb-2" />
                                    <p className="text-sm text-charcoal/60 mb-1">{feature.label}</p>
                                    <p className="text-xl font-bold text-navy">{feature.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-navy mb-4">{copy.description}</h2>
                                <p className="text-charcoal/80 leading-relaxed text-lg whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </div>
                        )}

                        {/* Amenities */}
                        {amenities.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-navy mb-4">{copy.equipment}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-charcoal/80">
                                            <CheckCircle className="w-5 h-5 text-accent-red flex-shrink-0" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-navy mb-4">{copy.additionalInfo}</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between py-3 border-b border-black/5">
                                    <span className="text-charcoal/60">{copy.category}</span>
                                    <span className="font-medium">{getLocalizedCategoryLabel(listing.category, language)}</span>
                                </div>
                                {listing.ownership && (
                                    <div className="flex justify-between py-3 border-b border-black/5">
                                        <span className="text-charcoal/60">{copy.ownership}</span>
                                        <span className="font-medium">{getLocalizedOwnershipLabel(listing.ownership, language)}</span>
                                    </div>
                                )}
                                {listing.building_type && (
                                    <div className="flex justify-between py-3 border-b border-black/5">
                                        <span className="text-charcoal/60">{copy.buildingType}</span>
                                        <span className="font-medium">{getLocalizedBuildingTypeLabel(listing.building_type, language)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Map — cookie-free OpenStreetMap embed */}
                        {listing.geo_lat && listing.geo_lon && (() => {
                            const delta = 0.008;
                            const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${listing.geo_lon - delta},${listing.geo_lat - delta},${listing.geo_lon + delta},${listing.geo_lat + delta}&layer=mapnik&marker=${listing.geo_lat},${listing.geo_lon}`;
                            return (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-navy mb-4">{copy.location}</h2>
                                    <div className="rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                                        <div className="w-full aspect-[16/10] md:aspect-[16/9] relative">
                                            <iframe
                                                src={osmSrc}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        </div>
                                        <div className="bg-white p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-charcoal/70">
                                                <MapPin className="w-4 h-4 text-accent-red" />
                                                <span className="text-sm font-medium">
                                                    {[listing.street, listing.location_city, listing.location_district].filter(Boolean).join(', ') || copy.showOnMap}
                                                </span>
                                            </div>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${listing.geo_lat},${listing.geo_lon}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-accent-red transition-colors"
                                            >
                                                <Navigation className="w-3.5 h-3.5" />
                                                {copy.navigate}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Sidebar - Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-3xl p-8 border border-black/5 shadow-xl shadow-black/5">
                            <h3 className="text-xl font-sans font-bold text-navy mb-6 tracking-tight">{copy.contactUs}</h3>

                            {/* Agent Photo & Name */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy to-navy/70 flex items-center justify-center overflow-hidden shrink-0">
                                    {agentPhotoUrl && !agentPhotoError ? (
                                        <img
                                            src={agentPhotoUrl}
                                            alt={agentName}
                                            width={96}
                                            height={96}
                                            loading="lazy"
                                            decoding="async"
                                            className={`w-full h-full ${agentPhotoFit}`}
                                            onError={() => setAgentPhotoError(true)}
                                        />
                                    ) : (
                                        <span className="text-white text-2xl font-bold">{agentInitials}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-navy text-lg">{agentName}</p>
                                    <p className="text-sm text-charcoal/60">{copy.yourPartner}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <a
                                    href={`tel:${agentPhone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-4 p-4 bg-cream rounded-2xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-charcoal/60">{copy.phone}</p>
                                        <p className="font-bold text-navy truncate">{agentPhone}</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${agentEmail}`}
                                    className="flex items-center gap-4 p-4 bg-cream rounded-2xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-accent-red flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-charcoal/60">{copy.email}</p>
                                        <p className="font-bold text-navy truncate">{agentEmail}</p>
                                    </div>
                                </a>
                            </div>

                            <button
                                onClick={handleInterest}
                                className="w-full py-4 bg-navy text-white font-bold rounded-full hover:bg-navy/90 transition-colors uppercase tracking-widest text-sm"
                            >
                                {copy.interested}
                            </button>

                            <p className="text-center text-xs text-charcoal/50 mt-4">
                                ID: {listing.uc_object_id || listing.id}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col select-none"
                        onClick={() => setShowLightbox(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Top bar: counter + close */}
                        <div className="flex items-center justify-between px-4 py-3 z-10" onClick={(e) => e.stopPropagation()}>
                            <span className="text-white/80 text-sm font-medium tabular-nums">
                                {currentImageIndex + 1} / {images.length}
                            </span>
                            <button
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                onClick={() => setShowLightbox(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main image area — crossfade with watermark ON the image */}
                        <div className="flex-1 relative flex items-center justify-center min-h-0 px-4 md:px-16">
                            <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
                                {/* Stacked images: only the current is visible. Uses plain <img>
                                    with natural sizing so the watermark container matches the image,
                                    not the black viewport margins. */}
                                {images.map((img, idx) => {
                                    const shouldMount =
                                        Math.abs(idx - currentImageIndex) <= 2 ||
                                        (currentImageIndex <= 1 && idx >= images.length - 2) ||
                                        (currentImageIndex >= images.length - 2 && idx <= 1) ||
                                        loadedImages.has(idx);

                                    if (!shouldMount) return (
                                        <div key={idx} className="absolute inset-0 opacity-0 z-0" />
                                    );

                                    const imgSrc = img.startsWith('/') || img.startsWith('data:')
                                        ? img
                                        : buildWeservUrl(img, Math.min(typeof window !== 'undefined' ? Math.round(window.innerWidth * 0.9) : 1200, 1920), 85);

                                    return (
                                        <div
                                            key={idx}
                                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${
                                                idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                            }`}
                                        >
                                            <div className="relative inline-block max-w-full max-h-full">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imgSrc}
                                                    alt={listing.title}
                                                    className="block max-w-full object-contain"
                                                    style={{ maxHeight: 'calc(100vh - 140px)' }}
                                                    draggable={false}
                                                />
                                                {/* FRISCO watermark — positioned ON the image */}
                                                {overlayUrls.has(img) && (
                                                    <img
                                                        src={friscoLogo}
                                                        alt=""
                                                        className="absolute bottom-3 right-0 h-[32px] w-auto pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-30 select-none"
                                                        draggable={false}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Shimmer overlay if current image hasn't preloaded yet */}
                                {!loadedImages.has(currentImageIndex) && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronLeft className="w-7 h-7" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronRight className="w-7 h-7" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="py-3 px-4 flex justify-center z-10" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-1.5 max-w-[90vw] overflow-x-auto scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-14 h-10 md:w-16 md:h-12 rounded-md overflow-hidden border-2 transition-all duration-200 relative ${idx === currentImageIndex ? 'border-white scale-105' : 'border-transparent opacity-40 hover:opacity-80'}`}
                                        >
                                            <Image loader={listingImageLoader} src={img} alt="" fill sizes="64px" quality={40} className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* All Photos Modal */}
            <AnimatePresence>
                {showAllPhotos && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-[100] bg-white overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-black/5 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold">{copy.allPhotos} ({images.length})</h2>
                            <button
                                onClick={() => setShowAllPhotos(false)}
                                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                                    onClick={() => { setCurrentImageIndex(idx); setShowAllPhotos(false); setShowLightbox(true); }}
                                    className="aspect-[4/3] rounded-xl overflow-hidden hover:opacity-90 transition-opacity relative"
                                >
                                    <GalleryImage src={img} alt={`${copy.photo} ${idx + 1}`} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" quality={75} showOverlay={overlayUrls.has(img)} className="object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
};

export default PropertyDetailContent;
