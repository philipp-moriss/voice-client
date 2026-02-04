import fs from 'fs';
import path from 'path';

const src = 'src/assets/fav';
const dest = 'public/fav';

if (!fs.existsSync(src)) {
  console.warn('copy-fav: src/assets/fav not found, skip');
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  const srcPath = path.join(src, name);
  const destPath = path.join(dest, name);
  fs.cpSync(srcPath, destPath, { recursive: true });
}
console.log('copy-fav: synced src/assets/fav → public/fav');
