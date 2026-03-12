'use client';

import { LocaleLink } from './LocaleLink';
import { useRouter, usePathname } from 'next/navigation';
import { localePath, DEFAULT_LANGUAGE, type LanguageCode } from '@/i18n/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef, type ComponentType, type SVGProps, type CSSProperties } from 'react';
import {
    ArrowLeft,
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
    Navigation,
    Search,
    Key,
    Globe,
} from 'lucide-react';
import { DE, GB, SK } from 'country-flag-icons/react/3x2';
import Image from 'next/image';
import listingImageLoader, { blurUrl, buildWeservUrl } from '@/lib/imageLoader';
import { Footer } from '@/components/Footer';
import { useListing, useAgent } from '@/hooks/useListings';
import { useLanguage } from '@/i18n/LanguageProvider';
import { ConfirmActionDialog } from './ConfirmActionDialog';
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

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

const LANGUAGES: { code: LanguageCode; label: string; Flag: FlagComponent }[] = [
    { code: 'sk', label: 'Slovenčina', Flag: SK as FlagComponent },
    { code: 'en', label: 'English', Flag: GB as FlagComponent },
    { code: 'de', label: 'Deutsch', Flag: DE as FlagComponent },
];

const stripLanguagePrefix = (path: string) => {
    const stripped = path.replace(/^\/(sk|en|de)(?=\/|$)/, '');
    return stripped.length > 0 ? stripped : '/';
};

const withLanguagePrefix = (path: string, lang: LanguageCode) => {
    if (lang === DEFAULT_LANGUAGE) return path;
    if (path === '/') return `/${lang}`;
    return `/${lang}${path}`;
};

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
    quality = 85,
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
                    className="absolute bottom-0 right-0 w-[20%] min-w-[70px] h-auto pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] z-20 select-none"
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
            currentOffer: 'Aktuálna ponuka',
            sell: 'Chcem predať',
            rent: 'Chcem prenajať',
            callUs: 'Zavolajte nám',
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
            currentOffer: 'Current listings',
            sell: 'I want to sell',
            rent: 'I want to rent',
            callUs: 'Call us',
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
            currentOffer: 'Aktuelle Angebote',
            sell: 'Ich möchte verkaufen',
            rent: 'Ich möchte vermieten',
            callUs: 'Rufen Sie uns an',
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
    const pathname = usePathname();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showLightbox, setShowLightbox] = useState(false);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [isPonukaHovered, setIsPonukaHovered] = useState(false);
    const [agentPhotoError, setAgentPhotoError] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; actionType: 'call' | 'email' }>({ isOpen: false, actionType: 'call' });
    const languageMenuRef = useRef<HTMLDivElement | null>(null);
    const activeLanguage = LANGUAGES.find((o) => o.code === language) ?? LANGUAGES[0];

    // Close language menu on outside click / escape
    useEffect(() => {
        const onPointerDown = (e: MouseEvent | TouchEvent) => {
            if (!languageMenuRef.current?.contains(e.target as Node)) {
                setIsLanguageOpen(false);
            }
        };
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsLanguageOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);
        document.addEventListener('keydown', onEscape);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
            document.removeEventListener('keydown', onEscape);
        };
    }, []);

    const handleLanguageSelect = (code: LanguageCode) => {
        if (code === language) {
            setIsLanguageOpen(false);
            return;
        }
        setIsLanguageOpen(false);
        setIsLanguageSwitching(true);
        document.cookie = `frisco-language=${code}; path=/; max-age=31536000; samesite=lax`;
        try { localStorage.setItem('frisco-language', code); } catch { /* noop */ }
        const bare = stripLanguagePrefix(pathname ?? '/');
        const nextPathname = withLanguagePrefix(bare, code);
        const params = new URLSearchParams(window.location.search);
        params.delete('lang');
        const qs = params.toString();
        const hash = window.location.hash;
        const nextUrl = `${nextPathname}${qs ? `?${qs}` : ''}${hash}`;
        setTimeout(() => { window.location.href = nextUrl; }, 450);
    };

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

    // Handle "Mám záujem" button — navigate to contact page & scroll to form
    const handleInterest = () => {
        const contactPath = localePath('/kontakt', language) + '#kontaktny-formular';
        router.push(contactPath);
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

        // Request high-res images — at least 1200px wide even on mobile
        // so the lightbox looks sharp (mobile screens are 2-3x DPR)
        const displayWidth = Math.max(1200, Math.min(typeof window !== 'undefined' ? Math.round(window.innerWidth * window.devicePixelRatio) : 1200, 1920));

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
            {/* Language Switch Overlay */}
            <div
                className={`fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${isLanguageSwitching ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            >
                <div className="flex flex-col items-center">
                    <img src={friscoLogo} alt="FRISCO" className="h-12 md:h-14 mb-6" />
                    <div className="w-40 h-[2px] bg-navy/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-navy rounded-full transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${isLanguageSwitching ? 'w-full duration-1000' : 'w-0 duration-0'}`} />
                    </div>
                </div>
            </div>

            {/* Custom Header for Detail Page — Desktop */}
            <div className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-black/5 hidden xl:block">
                <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-navy hover:text-accent-red transition-colors flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">{copy.back}</span>
                    </button>

                    {/* Desktop Navigation Links - Centered */}
                    <nav className="flex items-center gap-6 2xl:gap-8">
                        <LocaleLink href="/" className="flex-shrink-0 mr-2">
                            <img src={friscoLogo} alt="FRISCO" className="h-12 w-auto" />
                        </LocaleLink>
                        <LocaleLink href="/" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap">
                            {copy.home}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>

                        {/* Ponuka Dropdown — 3 items with icons */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsPonukaHovered(true)}
                            onMouseLeave={() => setIsPonukaHovered(false)}
                        >
                            <div className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                                {copy.offer}
                                <svg
                                    className={`w-3 h-3 transition-transform duration-200 ${isPonukaHovered ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className="absolute bottom-0 left-0 right-4 h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                            </div>

                            <AnimatePresence>
                                {isPonukaHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, x: '-50%', scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                                        exit={{ opacity: 0, y: -8, x: '-50%', scale: 0.96 }}
                                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute top-full left-1/2 pt-1"
                                        role="menu"
                                    >
                                        <div className="bg-white shadow-lg border border-charcoal/5 min-w-[280px] rounded-xl overflow-hidden">
                                            <LocaleLink
                                                href="/ponuka"
                                                className="flex items-center gap-3.5 px-6 py-4 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group"
                                                role="menuitem"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                                                    <Search size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                                                </div>
                                                {copy.currentOffer}
                                            </LocaleLink>
                                            <LocaleLink
                                                href="/chcem-predat"
                                                className="flex items-center gap-3.5 px-6 py-4 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 border-b border-charcoal/5 whitespace-normal group"
                                                role="menuitem"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                                                    <Home size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                                                </div>
                                                {copy.sell}
                                            </LocaleLink>
                                            <LocaleLink
                                                href="/chcem-prenajat"
                                                className="flex items-center gap-3.5 px-6 py-4 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-navy/[0.03] transition-all duration-200 whitespace-normal group"
                                                role="menuitem"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-red group-hover:text-white transition-colors duration-200">
                                                    <Key size={16} className="text-navy/60 group-hover:text-white transition-colors duration-200" />
                                                </div>
                                                {copy.rent}
                                            </LocaleLink>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <LocaleLink href="/preco-frisco" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap">
                            {copy.whyFrisco}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>

                        <LocaleLink href="/kontakt" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase whitespace-nowrap">
                            {copy.contact}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </LocaleLink>
                    </nav>

                    {/* CTA + Social + Language + Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Phone CTA */}
                        <a href="tel:+421905447220" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-[0.15em] bg-accent-red text-white hover:scale-105 hover:shadow-xl hover:shadow-accent-red/30 shadow-lg shadow-accent-red/20 transition-all duration-300 whitespace-nowrap flex-shrink-0">
                            <Phone size={14} className="flex-shrink-0" />
                            <span>0905 447 220</span>
                        </a>
                        {/* Email CTA */}
                        <a href="mailto:info@frisco.sk" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-[0.15em] border bg-white/50 border-accent-red text-accent-red hover:bg-accent-red hover:text-white group shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap flex-shrink-0">
                            <Mail size={14} className="flex-shrink-0 group-hover:text-white transition-colors" />
                            <span>info@frisco.sk</span>
                        </a>

                        {/* Language Switcher */}
                        <div ref={languageMenuRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsLanguageOpen((prev) => !prev)}
                                className="w-9 h-9 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/70 hover:bg-accent-red hover:text-white hover:border-accent-red transition-all duration-300"
                                aria-label="Change language"
                                aria-expanded={isLanguageOpen}
                            >
                                <activeLanguage.Flag className="h-3.5 w-5 rounded-[2px] object-cover shadow-sm" />
                            </button>
                            <AnimatePresence>
                                {isLanguageOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute top-full right-0 z-[100] pt-2"
                                    >
                                        <div className="bg-white shadow-xl border border-charcoal/8 rounded-xl overflow-hidden py-1.5 min-w-[180px] flex flex-col">
                                            {LANGUAGES.map((opt) => (
                                                <button
                                                    key={opt.code}
                                                    type="button"
                                                    className={`px-4 py-2.5 text-left text-sm font-sans font-medium hover:bg-navy/5 hover:text-navy transition-colors flex items-center gap-3 ${language === opt.code ? 'text-navy font-bold bg-navy/[0.03]' : 'text-charcoal/70'}`}
                                                    onClick={() => handleLanguageSelect(opt.code)}
                                                >
                                                    <opt.Flag className="h-4 w-6 rounded-[2px] object-cover shadow-sm" />
                                                    {opt.label}
                                                    {language === opt.code && (
                                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-red" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Header for Detail Page — Mobile */}
            <header className="fixed top-0 left-0 right-0 z-[100] xl:hidden bg-white border-b border-black/5">
                <div className="flex items-center justify-between px-4 h-[64px]">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-navy hover:text-accent-red transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">{copy.back}</span>
                    </button>

                    <LocaleLink href="/" className="absolute left-1/2 -translate-x-1/2">
                        <img src={friscoLogo} alt="FRISCO" className="h-10 w-auto" />
                    </LocaleLink>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setConfirmDialog({ isOpen: true, actionType: 'email' })}
                            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 bg-navy/5 text-navy hover:bg-navy/10"
                            aria-label="Email"
                        >
                            <Mail size={18} />
                        </button>
                        <button
                            onClick={() => setConfirmDialog({ isOpen: true, actionType: 'call' })}
                            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 bg-accent-red text-white hover:bg-accent-red/90 shadow-md shadow-accent-red/20"
                            aria-label="Call"
                        >
                            <Phone size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Ponuka Backdrop */}
            <AnimatePresence>
                {isPonukaHovered && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/20 z-40 hidden xl:block" />
                )}
            </AnimatePresence>

            {/* Confirm Action Dialog for mobile email/phone */}
            <ConfirmActionDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                actionType={confirmDialog.actionType}
            />

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
                                quality={88}
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
                                    quality={85}
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
                                    quality={88}
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
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
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
                        <div className="sticky top-24 bg-white rounded-2xl p-6 border border-black/5 shadow-lg shadow-black/5">
                            <h3 className="text-lg font-sans font-bold text-navy mb-4 tracking-tight">{copy.contactUs}</h3>

                            {/* Agent Photo & Name */}
                            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-black/5">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy to-navy/70 flex items-center justify-center overflow-hidden shrink-0">
                                    {agentPhotoUrl && !agentPhotoError ? (
                                        <img
                                            src={agentPhotoUrl}
                                            alt={agentName}
                                            width={80}
                                            height={80}
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

                            <div className="space-y-3 mb-6">
                                <a
                                    href={`tel:${agentPhone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 p-3 bg-cream rounded-xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-charcoal/60">{copy.phone}</p>
                                        <p className="font-bold text-navy text-sm truncate">{agentPhone}</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${agentEmail}`}
                                    className="flex items-center gap-3 p-3 bg-cream rounded-xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-accent-red flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-charcoal/60">{copy.email}</p>
                                        <p className="font-bold text-navy text-sm truncate">{agentEmail}</p>
                                    </div>
                                </a>
                            </div>

                            <button
                                onClick={handleInterest}
                                className="w-full py-3.5 bg-gradient-to-r from-accent-red to-accent-red/85 text-white font-bold rounded-full hover:from-accent-red/90 hover:to-accent-red/75 transition-all shadow-md shadow-accent-red/20 hover:shadow-lg hover:shadow-accent-red/30 uppercase tracking-widest text-sm"
                            >
                                {copy.interested}
                            </button>

                            <p className="text-center text-xs text-charcoal/50 mt-3">
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
                        className="fixed inset-0 z-[150] bg-black/95 select-none"
                        onClick={() => setShowLightbox(false)}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Images layer — fills entire viewport */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {images.map((img, idx) => {
                                const shouldMount =
                                    Math.abs(idx - currentImageIndex) <= 2 ||
                                    (currentImageIndex <= 1 && idx >= images.length - 2) ||
                                    (currentImageIndex >= images.length - 2 && idx <= 1) ||
                                    loadedImages.has(idx);

                                if (!shouldMount) return (
                                    <div key={idx} className="absolute inset-0 opacity-0" />
                                );

                                const imgSrc = img.startsWith('/') || img.startsWith('data:')
                                    ? img
                                    : buildWeservUrl(img, Math.max(1600, Math.min(typeof window !== 'undefined' ? Math.round(window.innerWidth * window.devicePixelRatio) : 1600, 2560)), 92);

                                return (
                                    <div
                                        key={idx}
                                        className={`absolute inset-0 flex items-center justify-center px-2 md:px-16 transition-opacity duration-200 ease-out ${
                                            idx === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="relative inline-block max-w-full max-h-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={imgSrc}
                                                alt={listing.title}
                                                className="block max-w-full object-contain"
                                                style={{ maxHeight: 'calc(100vh - 120px)' }}
                                                draggable={false}
                                            />
                                            {/* FRISCO watermark — positioned ON the image */}
                                            {overlayUrls.has(img) && (
                                                <img
                                                    src={friscoLogo}
                                                    alt=""
                                                    className="absolute bottom-0 right-0 w-[30%] min-w-[80px] h-auto pointer-events-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] select-none"
                                                    draggable={false}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Shimmer */}
                            {!loadedImages.has(currentImageIndex) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Close button — top right, always above images */}
                        <button
                            className="absolute top-3 right-3 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white active:bg-white/40 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Counter — top left */}
                        <div
                            className="absolute top-3 left-3 z-50 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium tabular-nums px-3 py-2 rounded-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {currentImageIndex + 1} / {images.length}
                        </div>

                        {/* Navigation arrows — overlaid on image sides, always visible */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/40 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft className="w-7 h-7" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 active:bg-white/40 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight className="w-7 h-7" />
                                </button>
                            </>
                        )}

                        {/* Thumbnail Strip — bottom */}
                        {images.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 z-50 py-3 px-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
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
                                    <GalleryImage src={img} alt={`${copy.photo} ${idx + 1}`} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" quality={85} showOverlay={overlayUrls.has(img)} className="object-cover" />
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
