/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file for the Gunay Beauty website.
 * Run this script periodically or as part of your build process to keep the sitemap updated.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://gunaybeauty.az'; // Updated for Gunay Beauty
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static pages that should always be in the sitemap
const staticPages = [
  {
    url: '',
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/brands',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/products',
    changefreq: 'daily',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/categories',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Generate XML sitemap
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Note: In a production environment, you would fetch products and categories
  // from your API and add them dynamically here.

  xml += `</urlset>`;

  return xml;
}

// Write sitemap to file
try {
  const sitemap = generateSitemap();
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`);
  console.log(`📄 Total URLs: ${staticPages.length}`);
  console.log(`\n💡 Tip: For production, fetch products and categories from your API to generate a complete sitemap.`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

