const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Pārbauda, vai ImageMagick ir instalēts
function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('❌ ImageMagick nav instalēts. Lūdzu instalējiet to ar:');
    console.log('   brew install imagemagick');
    return false;
  }
}

// Pārveido attēlu uz WebP, saglabājot kvalitāti
function convertToWebp(inputPath, outputPath) {
  try {
    const command = `magick "${inputPath}" -quality 80 "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    
    const stats = fs.statSync(outputPath);
    if (stats.size > 0) {
      console.log(`✅ Konvertēts: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
      return true;
    } else {
      console.log(`❌ Kļūda konvertējot: ${path.basename(inputPath)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Kļūda konvertējot ${path.basename(inputPath)}: ${error.message}`);
    return false;
  }
}

// Galvenā funkcija
function main() {
  console.log('🚀 Sākam attēlu konvertēšanu uz WebP\n');
  
  const convertDir = path.join(__dirname, 'public', 'convert');
  
  if (!fs.existsSync(convertDir)) {
    console.log('❌ Mape public/convert nav atrasta!');
    return;
  }
  
  const files = fs.readdirSync(convertDir);
  const imageFiles = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
  
  if (imageFiles.length === 0) {
    console.log('❌ Attēlu faili nav atrasti mapē public/convert/');
    return;
  }
  
  console.log(`📁 Atrasti ${imageFiles.length} attēlu faili:\n`);
  
  const hasImageMagick = checkImageMagick();
  if (!hasImageMagick) {
    return;
  }
  console.log('');
  
  let successCount = 0;
  let skippedCount = 0;
  
  imageFiles.forEach(file => {
    const inputPath = path.join(convertDir, file);
    const outputPath = path.join(convertDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    const stats = fs.statSync(inputPath);
    if (stats.size === 0) {
      console.log(`⚠️  Izlaists tukšs fails: ${file}`);
      skippedCount++;
      return;
    }
    
    if (fs.existsSync(outputPath)) {
      console.log(`⚠️  WebP jau eksistē: ${path.basename(outputPath)} - izlaists`);
      skippedCount++;
      return;
    }
    
    const success = convertToWebp(inputPath, outputPath);
    if (success) {
      successCount++;
    }
  });
  
  console.log(`\n📊 Rezultāts:`);
  console.log(`   ✅ Veiksmīgi konvertēti: ${successCount}`);
  console.log(`   ⚠️  Izlaisti: ${skippedCount}`);
  console.log(`   ❌ Neizdevās: ${imageFiles.length - successCount - skippedCount}`);
  
  if (successCount > 0) {
    console.log(`\n🎉 Attēli ir pieejami mapē: public/convert/`);
  }
}

main();