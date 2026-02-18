import os

os.chdir('/Users/carly/GITHUB REPOS/frisco/slovak-luxury-living-next/src/components')

files = [
    'KontaktContent.tsx', 'ONasContent.tsx', 'SluzbyContent.tsx',
    'PredajAPrenajomContent.tsx', 'ChcemPredatContent.tsx', 
    'ChcemPrenajatContent.tsx', 'PropertyDetailContent.tsx'
]

import re

replacements = [
    (r"import \{ Link \} from 'react-router-dom';", "import Link from 'next/link';"),
    (r"import \{ Link, useNavigate \} from 'react-router-dom';", "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';"),
    (r"import \{ useParams, useNavigate \} from 'react-router-dom';", "import { useRouter, useParams } from 'next/navigation';"),
    (r"import \{ useParams \} from 'react-router-dom';", "import { useParams } from 'next/navigation';"),
    (r"import \{ useNavigate \} from 'react-router-dom';", "import { useRouter } from 'next/navigation';"),
    (r'<Link to=', '<Link href='),
    (r'const navigate = useNavigate\(\);', 'const router = useRouter();'),
    (r'navigate\(', 'router.push('),
    (r"from '@/assets/", "from '/"),  # Fix asset imports
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        
        # Add 'use client' if not present
        if not content.startswith("'use client'"):
            content = "'use client';\n\n" + content
        
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        with open(f, 'w') as file:
            file.write(content)
        print(f"Updated: {f}")
    else:
        print(f"Not found: {f}")

print("Done!")
