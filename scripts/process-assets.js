/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawBase = 'C:\\Users\\musta\\Downloads\\Diamond fibre assets';
const logoDir = path.join(rawBase, 'logo');
const prodDir = path.join(rawBase, 'product images');

const projectPublic = path.resolve('public');
const imgDest = path.join(projectPublic, 'images');

// Ensure destination directories exist
const dirs = [
  path.join(imgDest, 'logo'),
  path.join(imgDest, 'hero'),
  path.join(imgDest, 'gaddas'),
  path.join(imgDest, 'mattresses'),
  path.join(imgDest, 'pillows'),
  path.join(imgDest, 'razais'),
  path.join(imgDest, 'blankets'),
  path.join(imgDest, 'wholesale'),
  path.join(imgDest, 'story')
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function processImage(srcFile, destSubdir, destName, cropOptions = {}) {
  const srcPath = path.isAbsolute(srcFile) ? srcFile : path.join(prodDir, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.error('Source file not found:', srcPath);
    return;
  }

  const outBase = path.join(imgDest, destSubdir, destName);

  // Load and auto-orient image
  let pipeline = sharp(srcPath).rotate();
  const meta = await pipeline.metadata();

  // If custom crop region specified: { leftPercent, topPercent, widthPercent, heightPercent }
  if (cropOptions.crop) {
    const left = Math.round(meta.width * cropOptions.crop.leftPercent);
    const top = Math.round(meta.height * cropOptions.crop.topPercent);
    const width = Math.round(meta.width * cropOptions.crop.widthPercent);
    const height = Math.round(meta.height * cropOptions.crop.heightPercent);
    pipeline = pipeline.extract({ left, top, width, height });
  }

  // 1. Full/Retina WebP (max 1440px wide, or max 1200px tall)
  await pipeline
    .clone()
    .resize(cropOptions.targetWidth || 1440, cropOptions.targetHeight || null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 85, effort: 5 })
    .toFile(`${outBase}.webp`);

  // 2. Mobile/Thumbnail WebP (max 720px)
  await pipeline
    .clone()
    .resize(cropOptions.thumbWidth || 720, cropOptions.thumbHeight || null, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 82, effort: 4 })
    .toFile(`${outBase}-thumb.webp`);

  console.log(`✓ Processed: ${destSubdir}/${destName}.webp`);
}

async function processLogos() {
  console.log('--- Processing Logos ---');

  // 1. Horizontal Brand Lockup
  const logoSrc = path.join(logoDir, 'Diamond Fibre Logo.png');
  await sharp(logoSrc)
    .resize(1086, 362, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(imgDest, 'logo', 'diamond-fibre-logo.webp'));

  await sharp(logoSrc)
    .resize(1086, 362, { fit: 'inside' })
    .png({ compressionLevel: 8 })
    .toFile(path.join(imgDest, 'logo', 'diamond-fibre-logo.png'));

  // 2. Square Emblem
  const emblemSrc = path.join(logoDir, 'only logo.png');
  await sharp(emblemSrc)
    .resize(600, 600, { fit: 'inside' })
    .webp({ quality: 90 })
    .toFile(path.join(imgDest, 'logo', 'diamond-fibre-emblem.webp'));

  await sharp(emblemSrc)
    .resize(600, 600, { fit: 'inside' })
    .png({ compressionLevel: 8 })
    .toFile(path.join(imgDest, 'logo', 'diamond-fibre-emblem.png'));

  // Favicon / App touch icon in public/
  await sharp(emblemSrc)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(projectPublic, 'icon.png'));

  await sharp(emblemSrc)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(projectPublic, 'favicon.png'));

  console.log('✓ Logos & Favicon processed successfully.');
}

async function run() {
  await processLogos();

  console.log('--- Processing Product Photographs ---');

  // 1. GADDAS
  // Hero: #17 - Sage green botanical leaf tufted gadda stack showing thick boxed piped border
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.06 PM.jpeg',
    'gaddas',
    'hero-gadda-sage-botanical',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Alternate: #37 - Charcoal & pink roses floral tufted gadda profile
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.39.49 PM.jpeg',
    'gaddas',
    'gadda-rose-tufted-profile',
    { crop: { leftPercent: 0.05, topPercent: 0.15, widthPercent: 0.9, heightPercent: 0.8 } }
  );

  // Seasonal Gallery 1: #2 - Gray/beige geometric starburst gadda
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.33.50 PM.jpeg',
    'gaddas',
    'gadda-starburst-geo',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 2: #4 - Red tartan plaid profile
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.33.52 PM.jpeg',
    'gaddas',
    'gadda-red-tartan-profile',
    { crop: { leftPercent: 0.02, topPercent: 0.1, widthPercent: 0.96, heightPercent: 0.8 } }
  );

  // Seasonal Gallery 3: #55 - Dusty rose diamond tufted corner
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.20 PM.jpeg',
    'gaddas',
    'gadda-dusty-rose-corner',
    { crop: { leftPercent: 0.02, topPercent: 0.05, widthPercent: 0.96, heightPercent: 0.9 } }
  );

  // 2. MATTRESSES
  // Hero: #8 - Laid-out thick maroon floral boxed mattress
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.01 PM.jpeg',
    'mattresses',
    'hero-mattress-maroon-boxed',
    { crop: { leftPercent: 0.02, topPercent: 0.1, widthPercent: 0.96, heightPercent: 0.85 } }
  );

  // Seasonal Gallery 1: #6 - Stacked maroon boxed-edge mattresses
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.33.56 PM.jpeg',
    'mattresses',
    'mattress-stacked-boxed',
    { crop: { leftPercent: 0.02, topPercent: 0.05, widthPercent: 0.95, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 2: #35 - Dual stacked mattresses in room
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.39.29 PM.jpeg',
    'mattresses',
    'mattress-room-stacked',
    { crop: { leftPercent: 0.1, topPercent: 0.2, widthPercent: 0.85, heightPercent: 0.7 } }
  );

  // Seasonal Gallery 3: #41 - Mint/sage tufted mattress front perspective
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.39.56 PM.jpeg',
    'mattresses',
    'mattress-mint-perspective',
    { crop: { leftPercent: 0.05, topPercent: 0.15, widthPercent: 0.9, heightPercent: 0.75 } }
  );

  // Seasonal Gallery 4: #72 - Assorted batch stack
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.38 PM (1).jpeg',
    'mattresses',
    'mattress-assorted-stack',
    { crop: { leftPercent: 0.02, topPercent: 0.05, widthPercent: 0.96, heightPercent: 0.9 } }
  );

  // 3. PILLOWS
  // Hero: #83 - Single packaged floral pillow in sleeve
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.42 PM (1).jpeg',
    'pillows',
    'hero-pillow-retail-floral',
    { crop: { leftPercent: 0.1, topPercent: 0.1, widthPercent: 0.8, heightPercent: 0.8 } }
  );

  // Wholesale pack: #14 - 4-pillow bundled wholesale set
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.05 PM (2).jpeg',
    'pillows',
    'pillow-wholesale-bundle-purple',
    { crop: { leftPercent: 0.05, topPercent: 0.08, widthPercent: 0.85, heightPercent: 0.84 } }
  );

  // Seasonal Gallery 1: #75 - Single packaged polka dot pillow (Crop out feet)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.39 PM (1).jpeg',
    'pillows',
    'pillow-polka-dot-packaged',
    { crop: { leftPercent: 0.1, topPercent: 0.05, widthPercent: 0.8, heightPercent: 0.82 } }
  );

  // Seasonal Gallery 2: #77 - Mint botanical single in sleeve (Crop out feet at bottom/sides)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.39 PM.jpeg',
    'pillows',
    'pillow-botanical-packaged',
    { crop: { leftPercent: 0.15, topPercent: 0.15, widthPercent: 0.65, heightPercent: 0.7 } }
  );

  // Seasonal Gallery 3: #78 - Commercial strapped 4-pack bundle (Crop out feet at top)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.40 PM (1).jpeg',
    'pillows',
    'pillow-commercial-strapped-bundle',
    { crop: { leftPercent: 0.1, topPercent: 0.25, widthPercent: 0.8, heightPercent: 0.7 } }
  );

  // 4. RAZAIS
  // Hero: #28 - Earthy terracotta & olive geometric patchwork quilt
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.39 PM.jpeg',
    'razais',
    'hero-razai-patchwork-terracotta',
    { crop: { leftPercent: 0.02, topPercent: 0.05, widthPercent: 0.96, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 1: #12 - Gold bridal brocade (Crop out foot at top right)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.04 PM.jpeg',
    'razais',
    'razai-gold-bridal-brocade',
    { crop: { leftPercent: 0.05, topPercent: 0.1, widthPercent: 0.85, heightPercent: 0.85 } }
  );

  // Seasonal Gallery 2: #24 - Blue plaid fold
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.38 PM (2).jpeg',
    'razais',
    'razai-blue-plaid-fold',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 3: #30 - Blue diamond ikat
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.40 PM (2).jpeg',
    'razais',
    'razai-blue-diamond-ikat',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 4: #42 - Crimson red floral paisley
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.39.58 PM.jpeg',
    'razais',
    'razai-crimson-paisley',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 5: #69 - Royal purple floral stack
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.37 PM (1).jpeg',
    'razais',
    'razai-purple-floral-stack',
    { crop: { leftPercent: 0.05, topPercent: 0.1, widthPercent: 0.9, heightPercent: 0.85 } }
  );

  // 5. BLANKETS
  // Hero: #46 - Deep wine floral embossed mink blanket, plush corner fold
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.04 PM.jpeg',
    'blankets',
    'hero-blanket-wine-mink-embossed',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.9 } }
  );

  // Seasonal Gallery 1: #10 - Vibrant pink floral (Crop out feet at bottom)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.03 PM.jpeg',
    'blankets',
    'blanket-pink-floral-plush',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.8 } }
  );

  // Seasonal Gallery 2: #44 - Wine floral spread (Crop out feet at bottom)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.01 PM.jpeg',
    'blankets',
    'blanket-wine-floral-spread',
    { crop: { leftPercent: 0.05, topPercent: 0.05, widthPercent: 0.9, heightPercent: 0.8 } }
  );

  // Seasonal Gallery 3: #49 - Folded square of wine mink blanket (Crop out feet at bottom)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.09 PM.jpeg',
    'blankets',
    'blanket-wine-folded-square',
    { crop: { leftPercent: 0.05, topPercent: 0.08, widthPercent: 0.9, heightPercent: 0.78 } }
  );

  // Seasonal Gallery 4: #15 - Lavender/purple fleece (Crop out feet at top-left)
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.34.05 PM (3).jpeg',
    'blankets',
    'blanket-lavender-fleece',
    { crop: { leftPercent: 0.15, topPercent: 0.05, widthPercent: 0.85, heightPercent: 0.9 } }
  );

  // 6. WHOLESALE & BULK INVENTORY
  // #74 - Ceiling-height showroom inventory stack
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.38 PM.jpeg',
    'wholesale',
    'wholesale-mattress-inventory-stack',
    { crop: { leftPercent: 0.05, topPercent: 0.02, widthPercent: 0.9, heightPercent: 0.95 } }
  );

  // #72 - Stack of 6+ thick boxed mattresses showing assorted prints
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.38 PM (1).jpeg',
    'wholesale',
    'wholesale-assorted-batch-stack',
    { crop: { leftPercent: 0.02, topPercent: 0.05, widthPercent: 0.96, heightPercent: 0.9 } }
  );

  // #81 - Commercial 4-pillow strapped packs for distributor dispatch
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.41 PM (1).jpeg',
    'wholesale',
    'wholesale-pillow-packs-strapped',
    { crop: { leftPercent: 0.1, topPercent: 0.1, widthPercent: 0.8, heightPercent: 0.8 } }
  );

  // 7. OUR STORY & CRAFT DETAILS
  // #88 - Macro diagonal quilting stitch detail
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.40.43 PM.jpeg',
    'story',
    'craft-quilting-macro-stitch',
    { crop: { leftPercent: 0.1, topPercent: 0.1, widthPercent: 0.8, heightPercent: 0.8 } }
  );

  // #37 - Edge piping & multi-layer tufting construction detail
  await processImage(
    'WhatsApp Image 2026-10-21 at 3.39.49 PM.jpeg',
    'story',
    'craft-tufting-piped-border',
    { crop: { leftPercent: 0.05, topPercent: 0.2, widthPercent: 0.9, heightPercent: 0.75 } }
  );

  console.log('--- All Assets Successfully Processed & Optimized ---');
}

run().catch(console.error);
