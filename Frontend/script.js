async function scrapeImages() {
    const url = document.getElementById('url').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/scrape-images?url=${encodeURIComponent(url)}`);
        const images = await response.json();
        displayImages(images);
    } catch (error) {
        console.error('Error scraping images:', error);
        alert('An error occurred while scraping images');
    }
}

function displayImages(images) {
    const container = document.getElementById('imageContainer');
    container.innerHTML = '';

    if (images.length === 0) {
        container.innerHTML = '<p>No images found.</p>';
        return;
    }

    images.forEach(imageUrl => {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        container.appendChild(imgElement);
    });
}
