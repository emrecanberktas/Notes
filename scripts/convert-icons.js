const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [16, 48, 128];
const inputFile = path.join(__dirname, "../public/icons/icon.svg");
const outputDir = path.join(__dirname, "../public/icons");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach((size) => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon${size}.png`))
    .then(() => console.log(`Created icon${size}.png`))
    .catch((err) => console.error(`Error creating icon${size}.png:`, err));
});
