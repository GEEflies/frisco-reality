import os

os.chdir('/Users/carly/GITHUB REPOS/frisco/slovak-luxury-living-next/src/components')

files = [
    'ContactSection.tsx', 'FilterBar.tsx', 'HeroActionWidget.tsx', 
    'HeroDecisions.tsx', 'HeroSearch.tsx', 'ListingCard.tsx', 
    'MainListings.tsx', 'PagePreloader.tsx', 'Preloader.tsx', 
    'ProcessSection.tsx', 'RotatingWord.tsx', 'SectionLoader.tsx', 
    'StatsSection.tsx', 'TeamSection.tsx', 'TestimonialsSection.tsx',
    'Footer.tsx', 'HeroMobile.tsx', 'HeroSection.tsx', 'AboutSection.tsx',
    'TopBar.tsx', 'GoogleReviewsBadge.tsx', 'ServicesSection.tsx'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        if not content.startswith("'use client'"):
            content = "'use client';\n\n" + content
            with open(f, 'w') as file:
                file.write(content)
            print(f"Added 'use client' to: {f}")
        else:
            print(f"Already has 'use client': {f}")
    else:
        print(f"Not found: {f}")

print("Done!")
