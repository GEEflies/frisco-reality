import os
import re

os.chdir('/Users/carly/GITHUB REPOS/frisco/slovak-luxury-living-next/src/components')

# Find all tsx files
files = [f for f in os.listdir('.') if f.endswith('.tsx')]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    original = content
    
    # Remove all asset imports and replace with direct paths
    # Match: import varName from '@/assets/filename.ext';
    pattern = r"import\s+(\w+)\s+from\s+['\"]@/assets/([\w\.-]+)['\"];"
    
    def replacement(match):
        var_name = match.group(1)
        filename = match.group(2)
        # Instead of import, we'll set the path as a constant
        return f"const {var_name} = '/{filename}';"
    
    content = re.sub(pattern, replacement, content)
    
    if content != original:
        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed: {f}")

print("Done!")


