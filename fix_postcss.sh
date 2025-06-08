#!/bin/bash

# Knowledge Cathedral PostCSS Fix Script
# This script specifically resolves the Tailwind CSS PostCSS plugin error.

set -e

echo "🔧 Fixing PostCSS Configuration..."
echo "==================================="
echo ""

# Step 1: Ensure @tailwindcss/postcss is installed (though it appears to be in your package.json)
echo "📦 Verifying Tailwind PostCSS dependency..."
npm install --save-dev @tailwindcss/postcss

# Step 2: Correct the PostCSS configuration file
# The error is because `tailwindcss: {}` is no longer the correct way to invoke the plugin.
# We must use the separate package '@tailwindcss/postcss'.
echo "⚙️  Updating postcss.config.mjs..."
cat > postcss.config.mjs << 'EOF'
/** @type {import('postcss').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
EOF

echo "✅ PostCSS configuration has been corrected."
echo ""

# Step 3: Clear the Next.js cache to remove old build artifacts
echo "🧹 Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared."
echo ""

echo "✨ Fix applied successfully!"
echo "You can now run 'npm run dev' to start the development server."
