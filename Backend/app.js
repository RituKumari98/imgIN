const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

// Use CORS middleware
app.use(cors());

// Function to scrape images from a given URL
const scrapeImages = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const images = [];
        $('img').each((index, element) => {
            const imageUrl = $(element).attr('src');
            images.push(imageUrl);
        });
        return images;
    } catch (error) {
        console.error('Error scraping images:', error);
        return [];
    }
};

// Route to handle image scraping
app.get('/scrape-images', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }
    try {
        const images = await scrapeImages(url);
        res.json(images);
    } catch (error) {
        console.error('Error scraping images:', error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
