import re
import os

os.chdir('/Users/carly/GITHUB REPOS/frisco/slovak-luxury-living-next/src/components')

files = ['Footer.tsx', 'HeroActionWidget.tsx', 'HeroDecisions.tsx', 'HeroDesktop.tsx', 
         'HeroMobile.tsx', 'HeroSearch.tsx', 'MainListings.tsx', 'NavLink.tsx', 
         'PropertiesSection.tsx', 'ScrollToTop.tsx', 'ListingCard.tsx', 'TopBar.tsx']

replacements = [
    (r"import \{ Link \} from 'react-router-dom';", "import Link from 'next/link';"),
    (r"import \{ Link, useNavigate \} from 'react-router-dom';", "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';"),
    (r"import \{ useLocation, useNavigate \} from 'react-router-dom';", "import { usePathname, useRouter } from 'next/navigation';"),
    (r"import \{ useLocation \} from 'react-router-dom';", "import { usePathname } from 'next/navigation';"),
    (r"import \{ useNavigate \} from 'react-router-dom';", "import { useRouter } from 'next/navigation';"),
    (r'<Link to=', '<Link href='),
    (r'useLocation\(\)', 'usePathname()'),
    (r'location\.pathname', 'pathname'),
    (r'const navigate = useNavigate\(\);', 'const router = useRouter();'),
    (r'navigate\(', 'router.push('),
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        with open(f, 'w') as file:
            file.write(content)
        print(f"Updated: {f}")
    else:
        print(f"Not found: {f}")

print("Done!")
