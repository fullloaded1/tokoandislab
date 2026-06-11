const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');

const API_KEY = 'hdX8mFtk3rnnRf5C4SA3WMg8';
const templatePath = 'C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\cf893a34-3112-471b-94ed-072462e18850\\template_option_3_with_logo_1780632554249.png';
const productsDir = path.join(__dirname, 'public', 'images', 'products');

async function removeBackground(imagePath) {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(imagePath));

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': API_KEY,
            },
        });
        return Buffer.from(response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error from remove.bg:', error.response.status, error.response.data.toString());
        } else {
            console.error('Error removing background:', error.message);
        }
        return null;
    }
}

async function processImages() {
    const files = fs.readdirSync(productsDir);
    const rawFiles = files.filter(f => !f.includes('_framed') && !f.endsWith('.json') && !f.endsWith('.txt'));

    console.log(`Found ${rawFiles.length} raw images to process.`);

    for (const file of rawFiles) {
        console.log(`Processing: ${file}`);
        const rawPath = path.join(productsDir, file);
        const nameWithoutExt = path.parse(file).name;
        const finalPath = path.join(productsDir, `${nameWithoutExt}_framed.png`);

        console.log('  -> Removing background...');
        const bgRemovedBuffer = await removeBackground(rawPath);
        
        if (!bgRemovedBuffer) {
            console.log('  -> Failed to remove background. Using original image to frame.');
        }

        const inputBuffer = bgRemovedBuffer || fs.readFileSync(rawPath);

        console.log('  -> Framing image...');
        try {
            const productBuffer = await sharp(inputBuffer)
                .resize({
                    width: 550,
                    height: 550,
                    fit: 'inside',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .toBuffer();
                
            const outputBuffer = await sharp(templatePath)
                .composite([
                    {
                        input: productBuffer,
                        gravity: 'center'
                    }
                ])
                .png()
                .toBuffer();

            fs.writeFileSync(finalPath, outputBuffer);
            console.log(`  -> Saved: ${finalPath}`);
        } catch (err) {
            console.error(`  -> Error framing ${file}:`, err);
        }
    }
    console.log('Done!');
}

processImages().catch(console.error);
