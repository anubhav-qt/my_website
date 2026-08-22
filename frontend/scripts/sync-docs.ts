import fs from 'node:fs';
import path from 'node:path';

interface ManifestDoc {
  id: string;
  title: string;
  sourcePath: string;
  category?: string;
  summary?: string;
  adrNumber?: number;
  status?: string;
  date?: string;
}

interface Manifest {
  spoin: {
    architecture: ManifestDoc[];
    adrs: ManifestDoc[];
  };
  continuum: {
    docs: ManifestDoc[];
  };
}

function sanitizeContent(raw: string): string {
  // Rewrite relative ADR links: e.g., (../adr/0028-key-model-quota-ladder.md) or (0028-key-model-quota-ladder.md)
  let content = raw.replace(/\(\.\.\/adr\/(\d{4})-[^)]+\.md\)/g, '(/work/spoin#adr-$1)');
  content = content.replace(/\((\d{4})-[^)]+\.md\)/g, '(/work/spoin#adr-$1)');
  content = content.replace(/\(\.\.\/architecture\/([^)]+)\.md\)/g, '(/work/spoin#arch-$1)');
  content = content.replace(/\((overview|generation-pipeline|content-model)\.md\)/g, '(/work/spoin#arch-$1)');
  
  // Strip any environment variable dumps or secrets if present
  content = content.replace(/SPOIN_GEMINI_API_KEYS="[^"]*"/g, 'SPOIN_GEMINI_API_KEYS="key_0,key_1,..."');
  
  return content;
}

async function sync() {
  const manifestPath = path.join(process.cwd(), 'content', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Manifest not found at', manifestPath);
    return;
  }

  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const outputDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const processedData: {
    spoin: {
      architecture: Array<ManifestDoc & { content: string }>;
      adrs: Array<ManifestDoc & { content: string }>;
    };
    continuum: {
      docs: Array<ManifestDoc & { content: string }>;
    };
    syncedAt: string;
  } = {
    spoin: { architecture: [], adrs: [] },
    continuum: { docs: [] },
    syncedAt: new Date().toISOString(),
  };

  console.log('🔄 Syncing Spoin Architecture Docs...');
  for (const doc of manifest.spoin.architecture) {
    if (fs.existsSync(doc.sourcePath)) {
      const raw = fs.readFileSync(doc.sourcePath, 'utf8');
      const clean = sanitizeContent(raw);
      processedData.spoin.architecture.push({ ...doc, content: clean });
      console.log(`  ✓ Synced ${doc.id} (${raw.length} bytes)`);
    } else {
      console.warn(`  ⚠️ Source not found: ${doc.sourcePath}`);
    }
  }

  console.log('🔄 Syncing Spoin ADRs...');
  for (const adr of manifest.spoin.adrs) {
    if (fs.existsSync(adr.sourcePath)) {
      const raw = fs.readFileSync(adr.sourcePath, 'utf8');
      const clean = sanitizeContent(raw);
      processedData.spoin.adrs.push({ ...adr, content: clean });
      console.log(`  ✓ Synced ADR-${adr.adrNumber} (${raw.length} bytes)`);
    } else {
      console.warn(`  ⚠️ Source not found: ${adr.sourcePath}`);
    }
  }

  console.log('🔄 Syncing Continuum Docs...');
  for (const doc of manifest.continuum.docs) {
    if (fs.existsSync(doc.sourcePath)) {
      const raw = fs.readFileSync(doc.sourcePath, 'utf8');
      const clean = sanitizeContent(raw);
      processedData.continuum.docs.push({ ...doc, content: clean });
      console.log(`  ✓ Synced ${doc.id} (${raw.length} bytes)`);
    } else {
      console.warn(`  ⚠️ Source not found: ${doc.sourcePath}`);
    }
  }

  const targetJson = path.join(outputDir, 'synced-docs.json');
  fs.writeFileSync(targetJson, JSON.stringify(processedData, null, 2), 'utf8');
  console.log(`✨ Successfully generated ${targetJson} with ${processedData.spoin.architecture.length + processedData.spoin.adrs.length + processedData.continuum.docs.length} curated docs.`);
}

sync().catch(console.error);
