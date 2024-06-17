let gs = document.getElementById("googleSearch");

const googlesearch = () => {
    let searchValue = gs.value;
    if (searchValue === "") {
        // Optional: Add some feedback if the search input is empty
    } else {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = 900; 
        const windowHeight = 500; 
        
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;

        window.open(`https://www.google.com/search?tbm=isch&q=${searchValue}`, 'ExampleWindow', `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
    }
}



// 


document.addEventListener("DOMContentLoaded", function() {
    let searchInput = "";
    let page = 1;
    let data = [];

    const accessKey = "KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk";

    async function searchImgs() {
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${searchInput}&client_id=${accessKey}`;
        const searchApi = await fetch(url);
        const apiResponse = await searchApi.json();

        if (!apiResponse.error) {
            if (page === 1) {
                data = apiResponse.results;
            } else {
                data = data.concat(apiResponse.results);
            }
            displayImgs();
        }
    }

    function displayImgs() {
        const inputResults = document.getElementById("inputResults");
        inputResults.innerHTML = "";

        if (data.length === 0) {
            inputResults.innerHTML = "<p class='text-center fw-bold'>No results found.</p>";
        } else {
            data.forEach(image => {
                const card = document.createElement("div");
                card.classList.add("card");

                const cardImgDiv = document.createElement("div");
                cardImgDiv.id = "cardImg";

                const img = document.createElement("img");
                img.src = image.urls.small;
                img.alt = image.alt_description;
                cardImgDiv.appendChild(img);

                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                const link = document.createElement("a");
                link.href = image.links.html;
                link.classList.add("card-text");
                link.target = "_blank";
                link.rel = "noopener";
                link.textContent = image.alt_description;

                cardBody.appendChild(link);
                card.appendChild(cardImgDiv);
                card.appendChild(cardBody);
                inputResults.appendChild(card);
            });
        }

        const showMoreBtn = document.getElementById("showMoreBtn");
        if (data.length > 0) {
            showMoreBtn.classList.remove("d-none");
        } else {
            showMoreBtn.classList.add("d-none");
        }
    }

    function performSearch() {
        searchInput = document.getElementById("searchInput").value;
        searchImgs();
    }

    document.getElementById("searchInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            page = 1;
            performSearch();
        }
    });

    document.getElementById("searchBtn").addEventListener("click", function() {
        page = 1;
        performSearch();
    });

    document.getElementById("showMoreBtn").addEventListener("click", function() {
        page++;
        if (searchInput === document.getElementById("searchInput").value) {
            performSearch();
        } else {
            searchImgs();
        }
    });

    document.getElementById("inputResults").addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("card-text")) {
            const imgLink = event.target.href;
            window.open(imgLink, "_blank");
        }
    });
});
