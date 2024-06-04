const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

async function scrapeImages(query, numImages = 10, downloadFolder = 'images') {
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const searchUrl = `https://www.google.com/search?q=${query}&tbm=isch`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Scroll down to load more images
    await autoScroll(page);

    // Get the image URLs from the page
    const imageUrls = await page.evaluate(() => {
        const urls = [];
        const elements = document.querySelectorAll('img');
        elements.forEach(el => {
            if (el.src && el.src.startsWith('http')) {
                urls.push(el.src);
            }
        });
        return urls;
    });

    console.log(`Found ${imageUrls.length} images`);

    for (let i = 0; i < Math.min(numImages, imageUrls.length); i++) {
        let imageUrl = imageUrls[i];

        // Ensure the URL is valid and complete
        try {
            new URL(imageUrl);
        } catch (_) {
            console.log(`Invalid URL skipped: ${imageUrl}`);
            continue;
        }

        const imagePath = path.join(downloadFolder, `image_${i + 1}.jpg`);
        await downloadImage(imageUrl, imagePath);
        console.log(`Downloaded ${imagePath}`);
    }

    await browser.close();
}

async function downloadImage(url, savePath) {
    const file = fs.createWriteStream(savePath);
    https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log("The file was saved!");
        });
    }).on('error', err => {
        fs.unlink(savePath, () => {});
        console.log("Error downloading the file:", err.message);
    });
}

// Helper function to auto-scroll the page
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const query = "dogs";  // static example
scrapeImages(query, 10);
