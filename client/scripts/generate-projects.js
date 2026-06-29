const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '../public/projects');
const OUTPUT = path.join(__dirname, '../public/projects.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);

const CATEGORY_MAP = {
  'Al-Barsha villa':                    'Villa',
  'Arabian Ranches':                    'Villa',
  'Dubai Hills- golf palace villa':     'Villa',
  'Jumaira villa':                      'Villa',
  'Jumerah park villa':                 'Villa',
  'lootah palm view':                   'Villa',
  'Madinat Hind Villa':                 'Villa',
  'Wadi El Amardi Villa':               'Villa',
  'nad Al-Shiba villa':                 'Villa',
  'JBR Apartment':                      'Apartment',
  'Damac Hills 2':                      'Apartment',
  'DTC':                                'Apartment',
  'AL-KEFAF TOWER':                     'Tower',
  'Manazil tower 5':                    'Tower',
  'Al-Fanar School':                    'Commercial',
  'Bussines pay office - Alsalam tower':'Commercial',
  'Land Scape':                         'Landscape',
};

function collectFiles(dir, baseUrl) {
  const images = [];
  const videos = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return { images, videos }; }

  for (const entry of entries) {
    const ext = path.extname(entry.name).toLowerCase();
    if (entry.isDirectory()) {
      const sub = collectFiles(
        path.join(dir, entry.name),
        baseUrl + '/' + encodeURIComponent(entry.name)
      );
      images.push(...sub.images);
      videos.push(...sub.videos);
    } else if (IMAGE_EXTS.has(ext)) {
      images.push(baseUrl + '/' + encodeURIComponent(entry.name));
    } else if (VIDEO_EXTS.has(ext)) {
      videos.push(baseUrl + '/' + encodeURIComponent(entry.name));
    }
  }
  return { images, videos };
}

const folders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

const projects = folders.map((folder, i) => {
  const baseUrl = '/projects/' + encodeURIComponent(folder);
  const { images, videos } = collectFiles(path.join(PROJECTS_DIR, folder), baseUrl);

  let category = CATEGORY_MAP[folder] || 'Other';
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, folder, '.meta.json'), 'utf8'));
    if (meta.category) category = meta.category;
  } catch {}

  return { id: i + 1, title: folder, category, thumbnail: images[0] || null, images, videos };
});

fs.writeFileSync(OUTPUT, JSON.stringify(projects, null, 2));
console.log(`✅ Generated projects.json — ${projects.length} projects, ${projects.reduce((s,p)=>s+p.images.length,0)} images`);
