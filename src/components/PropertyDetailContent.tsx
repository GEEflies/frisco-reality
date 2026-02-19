'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import confetti from 'canvas-confetti';
import { Footer } from '@/components/Footer';
import { useListing } from '@/hooks/useListings';
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
import { getBestImageUrl } from '@/api/listingsService';

const friscoLogo = '/frisco-logo.svg';

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
            whyFrisco: 'Prečo Frisco?',
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
            whyFrisco: 'Why Frisco?',
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
            whyFrisco: 'Warum Frisco?',
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

    // Fetch listing data
    const { data: listing, isLoading, error } = useListing(id);

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
        const body = encodeURIComponent(`${copy.interestBody}${listing?.title}${copy.interestBodyId}${listing?.uc_source_id || listing?.id}${copy.interestBodyUrl}${window.location.href}${copy.interestBodyEnd}`);
        window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    };

    // Image navigation
    const nextImage = () => {
        if (!listing) return;
        setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    };

    const prevImage = () => {
        if (!listing) return;
        setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    };

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
                    onClick={() => router.push('/ponuka')}
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

    const currentImage = images[currentImageIndex] || '';

    // Format price
    const isRent = listing.transaction_id === 123 || listing.transaction_id === 124;
    const priceDisplay = isRent
        ? `${formatPrice(listing.price)}${copy.perMonth}`
        : formatPrice(listing.price);

    // Build features list
    const features = [];
    if (listing.usable_area) features.push({ icon: Maximize, label: copy.usableArea, value: formatArea(listing.usable_area) });
    if (listing.building_area) features.push({ icon: Building2, label: copy.builtUpArea, value: formatArea(listing.building_area) });
    if (listing.land_area) features.push({ icon: Trees, label: copy.landArea, value: formatArea(listing.land_area) });
    if (listing.rooms_count) features.push({ icon: Home, label: copy.roomCount, value: `${listing.rooms_count}` });
    if (listing.floor) features.push({ icon: Building2, label: copy.floor, value: `${listing.floor}.` });
    if (listing.year_of_construction) features.push({ icon: Calendar, label: copy.yearBuilt, value: `${listing.year_of_construction}` });

    // Build amenities list
    const amenities: string[] = [];
    if (listing.estate_equipment) {
        listing.estate_equipment.forEach(id => {
            const equipment = getLocalizedEquipmentLabel(id, language);
            if (equipment) amenities.push(equipment);
        });
    }
    if (listing.heating_system) {
        listing.heating_system.forEach(id => {
            const heating = getLocalizedHeatingLabel(id, language);
            if (heating) amenities.push(`${copy.heatingPrefix}${heating}`);
        });
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
                        <Link href="/" className="flex-shrink-0 mr-4">
                            <img src={friscoLogo} alt="FRISCO" className="h-12 w-auto" />
                        </Link>
                        <Link href="/" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.home}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>

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
                                            <Link
                                                href="/ponuka"
                                                className="block px-5 py-3.5 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-charcoal/[0.02] transition-colors border-b border-charcoal/5 whitespace-nowrap text-center"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                {copy.lookingForProperty}
                                            </Link>
                                            <Link
                                                href="/predaj-a-prenajom"
                                                className="block px-5 py-3.5 text-sm font-sans font-medium tracking-[0.1em] text-charcoal/70 hover:text-navy hover:bg-charcoal/[0.02] transition-colors whitespace-nowrap text-center"
                                                onClick={() => setIsPonukaHovered(false)}
                                            >
                                                {copy.wantSellRent}
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/preco-frisco" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.whyFrisco}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>

                        <Link href="/kontakt" className="text-sm font-sans font-medium text-charcoal/70 hover:text-navy transition-colors relative group py-2 tracking-[0.2em] uppercase">
                            {copy.contact}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>
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
                            <img
                                src={images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Smaller Images */}
                        {images.slice(1, 5).map((img, idx) => (
                            <div
                                key={idx}
                                className="relative cursor-pointer overflow-hidden first:rounded-tr-xl last:rounded-br-xl" // Added corner rounding
                                onClick={() => { setCurrentImageIndex(idx + 1); setShowLightbox(true); }}
                            >
                                <img
                                    src={img}
                                    alt={`${listing.title} - ${idx + 2}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                                <span className="text-black/10 font-serif text-3xl italic">Frisco</span>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Single Image with Swipe */}
                    <div className="md:hidden relative h-[50vh]">
                        <motion.img
                            key={currentImageIndex}
                            src={currentImage}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setShowLightbox(true)}
                        />

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
                                    {getLocalizedTransactionLabel(listing.transaction_id, language) || copy.forSaleFallback}
                                </span>
                                {listing.real_estate_state && (
                                    <span className="px-3 py-1 bg-accent-red text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                        {getLocalizedRealEstateStateLabel(listing.real_estate_state, language)}
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
                                    <span className="font-medium">{getLocalizedCategoryLabel(listing.category_id, language)}</span>
                                </div>
                                {listing.ownership && (
                                    <div className="flex justify-between py-3 border-b border-black/5">
                                        <span className="text-charcoal/60">{copy.ownership}</span>
                                        <span className="font-medium">{getLocalizedOwnershipLabel(listing.ownership, language)}</span>
                                    </div>
                                )}
                                {listing.building_type && listing.building_type[0] && (
                                    <div className="flex justify-between py-3 border-b border-black/5">
                                        <span className="text-charcoal/60">{copy.buildingType}</span>
                                        <span className="font-medium">{getLocalizedBuildingTypeLabel(listing.building_type[0], language)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Map */}
                        {listing.geo_lat && listing.geo_lon && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-navy mb-4">{copy.location}</h2>
                                <div className="rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                                    <div className="relative w-full aspect-[16/10] md:aspect-[16/9]">
                                        <iframe
                                            src={`https://www.google.com/maps?q=${listing.geo_lat},${listing.geo_lon}&z=15&output=embed`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="absolute inset-0 w-full h-full"
                                            title={copy.mapTitle}
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
                        )}
                    </div>

                    {/* Sidebar - Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-3xl p-8 border border-black/5 shadow-xl shadow-black/5">
                            {/* Changed font for "Kontaktujte nás" - using sans instead of serif */}
                            <h3 className="text-xl font-sans font-bold text-navy mb-6 tracking-tight">{copy.contactUs}</h3>

                            {/* Agent Photo Placeholder - Increased Size */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-black/5">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy to-navy/70 flex items-center justify-center overflow-hidden shrink-0">
                                    {/* Placeholder - ready for agent photo */}
                                    <span className="text-white text-2xl font-bold">RK</span>
                                    {/* When you have the photo, replace with:
                  <img src="/agent-photo.jpg" alt="Realitný maklér" className="w-full h-full object-cover" />
                  */}
                                </div>
                                <div>
                                    <p className="font-bold text-navy text-lg">FRISCO Reality</p>
                                    <p className="text-sm text-charcoal/60">{copy.yourPartner}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <a
                                    href={`tel:${CONTACT.phoneRaw}`}
                                    className="flex items-center gap-4 p-4 bg-cream rounded-2xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-charcoal/60">{copy.phone}</p>
                                        <p className="font-bold text-navy truncate">{CONTACT.phone}</p>
                                    </div>
                                </a>

                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    className="flex items-center gap-4 p-4 bg-cream rounded-2xl hover:bg-cream-dark transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-accent-red flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-charcoal/60">{copy.email}</p>
                                        <p className="font-bold text-navy truncate">{CONTACT.email}</p>
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
                                ID: {listing.uc_source_id || listing.id}
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
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                        onClick={() => setShowLightbox(false)}
                    >
                        <button
                            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                            onClick={() => setShowLightbox(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <img
                            src={currentImage}
                            alt={listing.title}
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>

                                {/* Thumbnail Strip */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* All Photos Modal */}
            <AnimatePresence>
                {showAllPhotos && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between z-10">
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
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentImageIndex(idx); setShowAllPhotos(false); setShowLightbox(true); }}
                                    className="aspect-[4/3] rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
                                >
                                    <img src={img} alt={`${copy.photo} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
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
