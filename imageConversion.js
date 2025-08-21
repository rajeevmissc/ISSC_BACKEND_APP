const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Define correct input and output paths
const inputFolder = "C:\\Users\\rajeevm\\OneDrive - International Shared Support Centre\\ISSC-WEBAPP\\issc_new_webapp_frontent\\ISSC-NEW-WEBAPP\\src\\Assets\\Images";
const outputFolder = "C:\\Users\\rajeevm\\OneDrive - International Shared Support Centre\\ISSC-WEBAPP\\issc_new_webapp_frontent\\ISSC-NEW-WEBAPP\\public\\compressed-images";

// Ensure output directory exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

fs.readdirSync(inputFolder).forEach(file => {
  const inputPath = path.join(inputFolder, file);
  const outputPath = path.join(outputFolder, `${path.parse(file).name}.webp`);

  console.log(`Processing: ${inputPath} -> ${outputPath}`);

  sharp(inputPath)
    .webp({ quality: 80 }) // Convert to WebP with 80% quality
    .toFile(outputPath)
    .then(() => console.log(`✅ Converted: ${file}`))
    .catch(err => console.error(`❌ Error:`, err));
});
