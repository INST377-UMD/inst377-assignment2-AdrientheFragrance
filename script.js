// Home Page

async function fetchQuote() {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      const quote = data[0].q;
      const author = data[0].a;

      document.getElementById('quote').textContent = `"${quote}"`;
      document.getElementById('author').textContent = `— ${author}`;
    } catch (error) {
      document.getElementById('quote').textContent = 'Failed to load quote.';
      console.error('Error fetching quote:', error);
    }
  }

  // Fetch quote on page load
  window.onload = fetchQuote;

// Stocks Page

const apiKey = "64zBN7D5tA5REqS3Kxt1LF5bevgfGUuY";
    let chart; 

    async function fetchStockData() {
        const ticker = document.getElementById("tickerInput").value.toUpperCase();
        const days = parseInt(document.getElementById("daysSelect").value);
        
        if (!ticker) {
            alert("Please enter a stock ticker!");
            return;
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                alert("No stock data found for this ticker and time range.");
                return;
            }

            const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
            const closingPrices = data.results.map(item => item.c);

            if (chart) {
                chart.destroy();
            }

            const ctx = document.getElementById('stockChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${ticker} Closing Prices`,
                        data: closingPrices,
                        borderColor: 'blue',
                        fill: false,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { display: true, title: { display: true, text: 'Date' }},
                        y: { display: true, title: { display: true, text: 'Price (USD)' }}
                    }
                }
            });

        } catch (error) {
            console.error(error);
            alert("Error fetching stock data.");
        }
    }

    // Load top 5 Reddit stocks
    async function loadRedditStocks() {
        const redditData = [
            {"no_of_comments":131,"sentiment":"Bullish","ticker":"GME"},
            {"no_of_comments":90,"sentiment":"Bullish","ticker":"AMC"},
            {"no_of_comments":25,"sentiment":"Bullish","ticker":"TSLA"},
            {"no_of_comments":21,"sentiment":"Bullish","ticker":"WISH"},
            {"no_of_comments":12,"sentiment":"Bearish","ticker":"QQQ"}
        ];

        const tableBody = document.getElementById("redditTableBody");
        redditData.forEach(stock => {
            const row = document.createElement("tr");
            const icon = stock.sentiment === "Bullish" ? "📈" : "📉";
            const sentimentClass = stock.sentiment === "Bullish" ? "bullish" : "bearish";

            row.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank"> ${stock.ticker} </a></td>
                <td>${stock.no_of_comments}</td>
                <td class="${sentimentClass}">${stock.sentiment} ${icon}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Initialize
    loadRedditStocks();

// Dogs Page
 // Load 10 random dog imageset slideIndex = 1;

 let slideIndex = 1;

 // Function to update slides
 function showSlides(n) {
   let i;
   const slides = document.getElementsByClassName("mySlides");
   const dots = document.getElementsByClassName("dot");
   if (n > slides.length) {slideIndex = 1}
   if (n < 1) {slideIndex = slides.length}
   for (i = 0; i < slides.length; i++) {
     slides[i].style.display = "none";
   }
   for (i = 0; i < dots.length; i++) {
     dots[i].className = dots[i].className.replace(" active", "");
   }
   if (slides.length > 0) {
     slides[slideIndex-1].style.display = "block";
     dots[slideIndex-1].className += " active";
   }
 }
 
 function plusSlides(n) {
   showSlides(slideIndex += n);
 }
 
 function currentSlide(n) {
   showSlides(slideIndex = n);
 }
 
 // Fetch dog images and build slides
 fetch('https://dog.ceo/api/breeds/image/random/10')
   .then(response => response.json())
   .then(data => {
     const imageUrls = data.message;
     const carouselContainer = document.getElementById('carousel-container');
     const dotsContainer = document.getElementById('dots-container');
 
     imageUrls.forEach((url, index) => {
       // Create slide div
       const slideDiv = document.createElement('div');
       slideDiv.classList.add('mySlides', 'fade');
 
       // Number text
       const numberText = document.createElement('div');
       numberText.classList.add('numbertext');
       numberText.textContent = `${index + 1} / ${imageUrls.length}`;
 
       // Image
       const img = document.createElement('img');
       img.src = url;
       img.style.width = '100%';
 
       // Caption (optional)
       const caption = document.createElement('div');
       caption.classList.add('text');
       caption.textContent = 'Cute Doggo!';
 
       // Append elements
       slideDiv.appendChild(numberText);
       slideDiv.appendChild(img);
       slideDiv.appendChild(caption);
 
       carouselContainer.insertBefore(slideDiv, carouselContainer.querySelector('.prev'));
 
       // Create dot
       const dot = document.createElement('span');
       dot.classList.add('dot');
       dot.onclick = () => currentSlide(index + 1);
       dotsContainer.appendChild(dot);
     });
 
     // Initialize first slide
     showSlides(slideIndex);
   })
   .catch(error => console.error('Error fetching dog images:', error));

// Load breeds and create buttons
async function loadBreeds() {
    try {
        let response = await fetch('https://dogapi.dog/api/v2/breeds');
        let data = await response.json();
        let breeds = data.data;
        let container = document.getElementById('breedsContainer');

        breeds.forEach(breed => {
            let btn = document.createElement('button');
            btn.classList.add('breed-btn');
            btn.textContent = breed.attributes.name;
            btn.setAttribute('data-id', breed.id);
            btn.addEventListener('click', () => showBreedInfo(breed));
            container.appendChild(btn);
        });
    } catch (err) {
        console.error('Error loading breeds:', err);
    }
}

// Show breed info in container
function showBreedInfo(breed) {
    document.getElementById('breedName').textContent = breed.attributes.name;
    document.getElementById('breedDesc').textContent = breed.attributes.description || 'No description available.';
    let lifeMin = breed.attributes.life.min || '?';
    let lifeMax = breed.attributes.life.max || '?';
    document.getElementById('breedLife').textContent = `${lifeMin} - ${lifeMax}`;
    document.getElementById('breedInfo').style.display = 'block';
    document.getElementById('breedInfo').scrollIntoView({ behavior: 'smooth' });
}


