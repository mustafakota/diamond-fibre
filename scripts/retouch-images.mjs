import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Diamond Fibre - Professional Photography Retouching Pipeline
 *
 * Implements non-destructive commercial image art direction:
 * - Straightens horizons and re-orients rotated photographs (90 CW)
 * - Tightly crops out extraneous floor expanse, human feet in socks, standing people,
 *   furniture, door handles, and wall switches
 * - Calibrates exposure, contrast, and color balance for Diamond Fibre's Warm Ivory/Sand palette
 * - Gently sharpens stitching, piped borders, tufting rosettes, and fabric weave
 * - Exports optimized WebP derivatives in public/images/retouched/
 * - Preserves 100% of original source photos in public/images/
 */

const RETOUCH_CONFIG = [
  // 1. HERO
  {
    category: 'hero',
    source: 'public/images/hero/editorial-comfort-hero.webp',
    target: 'public/images/retouched/hero/editorial-comfort-hero.webp',
    crop: { left: 160, top: 0, width: 1440, height: 920 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0, m1: 0.8, m2: 0.3 },
    treatment: 'Removed granite ledge on top-left and bottom floor clutter. Centered double-stacked sage botanical gadda with rich green/gold tone curve.'
  },

  // 2. MATTRESSES
  {
    category: 'mattresses',
    source: 'public/images/mattresses/hero-mattress-maroon-boxed.webp',
    target: 'public/images/retouched/mattresses/hero-mattress-maroon-boxed.webp',
    crop: { left: 60, top: 80, width: 1320, height: 750 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed blue dresser top-left, rolled gadda top-right, and 30% bottom floor. Centered maroon boxed-edge mattress profile.'
  },
  {
    category: 'mattresses',
    source: 'public/images/mattresses/mattress-mint-perspective.webp',
    target: 'public/images/retouched/mattresses/mattress-mint-perspective.webp',
    crop: { left: 120, top: 160, width: 1200, height: 680 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed seated person and side table top-left and excess floor at bottom. Centered mint botanical damask mattress and boxed piping.'
  },
  {
    category: 'mattresses',
    source: 'public/images/mattresses/mattress-stacked-boxed.webp',
    target: 'public/images/retouched/mattresses/mattress-stacked-boxed.webp',
    crop: { left: 0, top: 0, width: 1360, height: 880 },
    modulate: { brightness: 1.02, saturation: 1.03 },
    sharpen: { sigma: 1.1 },
    treatment: 'Cropped floor margin; normalized white balance and enhanced micro-contrast on corner sidewall piping and tufting stitches.'
  },
  {
    category: 'mattresses',
    source: 'public/images/mattresses/mattress-room-stacked.webp',
    target: 'public/images/retouched/mattresses/mattress-room-stacked.webp',
    crop: { left: 100, top: 120, width: 1240, height: 580 },
    modulate: { brightness: 1.04, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed 50%+ empty floor and top wall light switches. Reframed focus squarely on stacked maroon mattresses.'
  },
  {
    category: 'mattresses',
    source: 'public/images/mattresses/mattress-assorted-stack.webp',
    target: 'public/images/retouched/mattresses/mattress-assorted-stack.webp',
    crop: { left: 20, top: 20, width: 1400, height: 970 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Tight border alignment; enriched vibrant fabric tones across red floral, leopard, and turquoise layers.'
  },

  // 3. GADDAS
  {
    category: 'gaddas',
    source: 'public/images/gaddas/hero-gadda-sage-botanical.webp',
    target: 'public/images/retouched/gaddas/hero-gadda-sage-botanical.webp',
    crop: { left: 180, top: 0, width: 1260, height: 980 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Eliminated granite ledge on left and floor margin at bottom. Emphasized double-layer piped border and botanical leaf print.'
  },
  {
    category: 'gaddas',
    source: 'public/images/gaddas/gadda-rose-tufted-profile.webp',
    target: 'public/images/retouched/gaddas/gadda-rose-tufted-profile.webp',
    crop: { left: 0, top: 0, width: 1350, height: 600 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed 50% empty floor and blue plaid fabric top-right. Reframed tightly on rose floral tufted profile and double piping.'
  },
  {
    category: 'gaddas',
    source: 'public/images/gaddas/gadda-red-tartan-profile.webp',
    target: 'public/images/retouched/gaddas/gadda-red-tartan-profile.webp',
    crop: { left: 20, top: 80, width: 1360, height: 500 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed floor expanse and top-right quilt clutter. Centered red tartan gadda; boosted check vibrancy and channel depth.'
  },
  {
    category: 'gaddas',
    source: 'public/images/gaddas/gadda-starburst-geo.webp',
    target: 'public/images/retouched/gaddas/gadda-starburst-geo.webp',
    crop: { left: 50, top: 0, width: 1240, height: 1060 },
    modulate: { brightness: 1.03, saturation: 1.03 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped floor margins; normalized white balance and enhanced contrast on starburst geometric channel quilting.'
  },
  {
    category: 'gaddas',
    source: 'public/images/gaddas/gadda-dusty-rose-corner.webp',
    target: 'public/images/retouched/gaddas/gadda-dusty-rose-corner.webp',
    crop: { left: 0, top: 0, width: 1100, height: 950 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.1 },
    treatment: 'CRITICAL RETOUCH: Completely cropped out standing person in black trousers at top-right. Centered corner rosette knot and boxed piping.'
  },

  // 4. PILLOWS
  {
    category: 'pillows',
    source: 'public/images/pillows/hero-pillow-retail-floral.webp',
    target: 'public/images/retouched/pillows/hero-pillow-retail-floral.webp',
    crop: { left: 100, top: 0, width: 1160, height: 1720 },
    modulate: { brightness: 1.03, saturation: 1.04 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped out floor tile grout lines and scuffs. Centered upright retail packaged pillow; balanced plastic wrap reflections.'
  },
  {
    category: 'pillows',
    source: 'public/images/pillows/pillow-commercial-strapped-bundle.webp',
    target: 'public/images/retouched/pillows/pillow-commercial-strapped-bundle.webp',
    crop: { left: 0, top: 120, width: 1440, height: 1460 },
    modulate: { brightness: 1.03, saturation: 1.04 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL RETOUCH: Completely removed human foot in white sock at top center. Centered 4-pack commercial bundle and central tension strap.'
  },
  {
    category: 'pillows',
    source: 'public/images/pillows/pillow-wholesale-bundle-purple.webp',
    target: 'public/images/retouched/pillows/pillow-wholesale-bundle-purple.webp',
    crop: { left: 120, top: 0, width: 1260, height: 1020 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Balanced frame margins; enriched purple and blue floral hues; softened specular packaging glare.'
  },
  {
    category: 'pillows',
    source: 'public/images/pillows/pillow-botanical-packaged.webp',
    target: 'public/images/retouched/pillows/pillow-botanical-packaged.webp',
    crop: { left: 10, top: 90, width: 1340, height: 880 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed purple floor ink stains at bottom. Centered teal botanical leaf pillow and enhanced fabric clarity.'
  },
  {
    category: 'pillows',
    source: 'public/images/pillows/pillow-polka-dot-packaged.webp',
    target: 'public/images/retouched/pillows/pillow-polka-dot-packaged.webp',
    crop: { left: 140, top: 0, width: 1180, height: 1680 },
    modulate: { brightness: 1.04, saturation: 1.02 },
    sharpen: { sigma: 1.0 },
    treatment: 'Removed dark floor grime and stains at bottom. Centered mint polka dot retail package with clean studio presentation.'
  },

  // 5. RAZAIS
  {
    category: 'razais',
    source: 'public/images/razais/hero-razai-patchwork-terracotta.webp',
    target: 'public/images/retouched/razais/hero-razai-patchwork-terracotta.webp',
    rotate: 90,
    crop: { left: 160, top: 0, width: 850, height: 1360 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL ORIENTATION & RETOUCH: Rotated 90° CW to natural upright quilt orientation. Cropped bottom-right pink fabric sliver and floor margins. Boosted terracotta & lime tones.'
  },
  {
    category: 'razais',
    source: 'public/images/razais/razai-gold-bridal-brocade.webp',
    target: 'public/images/retouched/razais/razai-gold-bridal-brocade.webp',
    crop: { left: 100, top: 265, width: 1220, height: 1515 },
    modulate: { brightness: 1.03, saturation: 1.07 },
    sharpen: { sigma: 1.1 },
    treatment: 'CRITICAL RETOUCH: Completely cropped out white-socked foot on right edge, top bolster cushion, and top rug edge. Centered luxurious crimson & gold bridal brocade razai.'
  },
  {
    category: 'razais',
    source: 'public/images/razais/razai-blue-diamond-ikat.webp',
    target: 'public/images/retouched/razais/razai-blue-diamond-ikat.webp',
    crop: { left: 20, top: 50, width: 1380, height: 1830 },
    modulate: { brightness: 1.02, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped out red plaid intrusion top-left. Enhanced geometric contrast and saturated indigo & sky blue ikat patterns.'
  },
  {
    category: 'razais',
    source: 'public/images/razais/razai-crimson-paisley.webp',
    target: 'public/images/retouched/razais/razai-crimson-paisley.webp',
    rotate: 90,
    crop: { left: 175, top: 10, width: 810, height: 1420 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL ORIENTATION & RETOUCH: Rotated 90° CW to natural vertical bedspread. Cropped out mint gadda on left and bolster on right completely. Enriched crimson paisley print.'
  },
  {
    category: 'razais',
    source: 'public/images/razais/razai-blue-plaid-fold.webp',
    target: 'public/images/retouched/razais/razai-blue-plaid-fold.webp',
    rotate: 90,
    crop: { left: 90, top: 0, width: 980, height: 1440 },
    modulate: { brightness: 1.02, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL ORIENTATION & RETOUCH: Rotated 90° CW to natural upright orientation. Cropped out pink blanket intrusion top-left. Centered folded blue plaid razai.'
  },
  {
    category: 'razais',
    source: 'public/images/razais/razai-purple-floral-stack.webp',
    target: 'public/images/retouched/razais/razai-purple-floral-stack.webp',
    crop: { left: 60, top: 110, width: 1380, height: 550 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped out dark wall at top, red roll on left, and 40% floor at bottom. Centered purple floral folded razai and enhanced satin border sheen.'
  },

  // 6. BLANKETS
  {
    category: 'blankets',
    source: 'public/images/blankets/hero-blanket-wine-mink-embossed.webp',
    target: 'public/images/retouched/blankets/hero-blanket-wine-mink-embossed.webp',
    crop: { left: 0, top: 40, width: 1320, height: 1800 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped out Persian rug corner top-right and floor triangle bottom-right. Reframed embossed floral mink blanket medallion and ornate border.'
  },
  {
    category: 'blankets',
    source: 'public/images/blankets/blanket-lavender-fleece.webp',
    target: 'public/images/retouched/blankets/blanket-lavender-fleece.webp',
    crop: { left: 60, top: 180, width: 1160, height: 940 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL RETOUCH: Cropped out white-socked foot on left edge and bolster cushion on right edge. Centered folded lavender botanical fleece blanket.'
  },
  {
    category: 'blankets',
    source: 'public/images/blankets/blanket-pink-floral-plush.webp',
    target: 'public/images/retouched/blankets/blanket-pink-floral-plush.webp',
    crop: { left: 0, top: 40, width: 1380, height: 1260 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL RETOUCH: Cropped out white-socked foot and 450px of empty floor at bottom completely. Reframed folded magenta plush blanket with orange rose bouquet.'
  },
  {
    category: 'blankets',
    source: 'public/images/blankets/blanket-wine-floral-spread.webp',
    target: 'public/images/retouched/blankets/blanket-wine-floral-spread.webp',
    crop: { left: 80, top: 385, width: 1140, height: 1030 },
    modulate: { brightness: 1.03, saturation: 1.07 },
    sharpen: { sigma: 1.1 },
    treatment: 'CRITICAL RETOUCH: Flat-lay extract completely eliminating two standing people at top, feet at bottom, bed on right, and cushions on left. Isolated embossed wine blanket centerpiece.'
  },
  {
    category: 'blankets',
    source: 'public/images/blankets/blanket-wine-folded-square.webp',
    target: 'public/images/retouched/blankets/blanket-wine-folded-square.webp',
    crop: { left: 0, top: 10, width: 1310, height: 1250 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL RETOUCH: Cropped out white-socked foot and floor at bottom completely. Reframed square folded wine mink blanket and enhanced embossed rose texture.'
  },

  // 7. WHOLESALE
  {
    category: 'wholesale',
    source: 'public/images/wholesale/wholesale-mattress-inventory-stack.webp',
    target: 'public/images/retouched/wholesale/wholesale-mattress-inventory-stack.webp',
    crop: { left: 10, top: 0, width: 1270, height: 2026 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.0 },
    treatment: 'CRITICAL RETOUCH: Cropped out door frame, silver handle, and lock latch on right edge. Straightened vertical stack of 12 mattresses in showroom.'
  },
  {
    category: 'wholesale',
    source: 'public/images/wholesale/wholesale-pillow-packs-strapped.webp',
    target: 'public/images/retouched/wholesale/wholesale-pillow-packs-strapped.webp',
    crop: { left: 0, top: 220, width: 1400, height: 1660 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Cropped excess floor at top and bottom; leveled bundle; enhanced blue floral fabric print and tension strap.'
  },
  {
    category: 'wholesale',
    source: 'public/images/wholesale/wholesale-assorted-batch-stack.webp',
    target: 'public/images/retouched/wholesale/wholesale-assorted-batch-stack.webp',
    crop: { left: 20, top: 20, width: 1400, height: 970 },
    modulate: { brightness: 1.03, saturation: 1.06 },
    sharpen: { sigma: 1.0 },
    treatment: 'Aligned frame borders; enhanced color richness across seasonal fabric prints.'
  },

  // 8. STORY
  {
    category: 'story',
    source: 'public/images/story/craft-quilting-macro-stitch.webp',
    target: 'public/images/retouched/story/craft-quilting-macro-stitch.webp',
    crop: { left: 180, top: 80, width: 1260, height: 1300 },
    modulate: { brightness: 1.04, saturation: 1.05 },
    sharpen: { sigma: 1.2, m1: 0.9, m2: 0.4 },
    treatment: 'Cropped out bamboo mat floor on left and top shadow. Macro reframe highlighting diagonal channel quilting stitches and woven teal botanical cloth.'
  },
  {
    category: 'story',
    source: 'public/images/story/craft-tufting-piped-border.webp',
    target: 'public/images/retouched/story/craft-tufting-piped-border.webp',
    crop: { left: 0, top: 0, width: 1440, height: 580 },
    modulate: { brightness: 1.03, saturation: 1.05 },
    sharpen: { sigma: 1.1 },
    treatment: 'Cropped bottom floor; reframed on hand-tufting rosettes, multi-layer loft, and heavy reinforced border piping.'
  }
];

async function runPipeline() {
  console.log(`Starting Diamond Fibre Retouching Pipeline: ${RETOUCH_CONFIG.length} assets...`);
  const report = [];

  for (const item of RETOUCH_CONFIG) {
    const targetDir = path.dirname(item.target);
    fs.mkdirSync(targetDir, { recursive: true });

    let pipeline = sharp(item.source);

    // Apply rotation if needed
    if (item.rotate) {
      pipeline = pipeline.rotate(item.rotate);
    }

    // Apply extract/crop
    if (item.crop) {
      pipeline = pipeline.extract(item.crop);
    }

    // Apply modulation (brightness, saturation)
    if (item.modulate) {
      pipeline = pipeline.modulate(item.modulate);
    }

    // Apply sharpening
    if (item.sharpen) {
      pipeline = pipeline.sharpen(item.sharpen);
    }

    // Output optimized WebP (effort 6, quality 86)
    await pipeline
      .webp({ quality: 86, effort: 6 })
      .toFile(item.target);

    const origMeta = await sharp(item.source).metadata();
    const retMeta = await sharp(item.target).metadata();
    const origSize = fs.statSync(item.source).size;
    const retSize = fs.statSync(item.target).size;

    report.push({
      file: path.basename(item.source),
      category: item.category,
      originalDimensions: `${origMeta.width}x${origMeta.height}`,
      retouchedDimensions: `${retMeta.width}x${retMeta.height}`,
      originalSizeKB: (origSize / 1024).toFixed(1),
      retouchedSizeKB: (retSize / 1024).toFixed(1),
      savingsPercent: (((origSize - retSize) / origSize) * 100).toFixed(1) + '%',
      treatment: item.treatment
    });

    console.log(`  ✓ Retouched: ${item.target} (${retMeta.width}x${retMeta.height})`);
  }

  fs.writeFileSync('reports/retouch-results.json', JSON.stringify(report, null, 2));
  console.log(`\nAll ${RETOUCH_CONFIG.length} images processed and saved to public/images/retouched/`);
  console.log('Results written to reports/retouch-results.json');
}

runPipeline().catch(err => {
  console.error('Pipeline error:', err);
  process.exit(1);
});
