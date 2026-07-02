import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksPath = path.join(__dirname, '../src/data/books.json');

async function scrapeAmazonProduct(asin) {
  try {
    const url = `https://www.amazon.in/dp/${asin}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    const html = await response.text();
    
    // Check if we got block/captcha page
    if (html.includes('api-services-support@amazon.com') || html.includes('captcha')) {
      console.log(` -> Amazon blocked request for ASIN ${asin} (Captcha/Bot block).`);
      return null;
    }

    const data = {};

    // 1. Parse Price
    // Try apexPriceToPay or generic a-price-whole
    const priceRegex = /class="apexPriceToPay".*?class="a-offscreen">₹([0-9,]+)/i;
    const priceMatch = html.match(priceRegex);
    if (priceMatch) {
      data.price = parseInt(priceMatch[1].replace(/,/g, ''));
    } else {
      const priceRegex2 = /<span class="a-price-whole">([0-9,]+)/i;
      const priceMatch2 = html.match(priceRegex2);
      if (priceMatch2) {
        data.price = parseInt(priceMatch2[1].replace(/,/g, ''));
      }
    }

    // 2. Parse Old Price (MRP)
    const oldPriceRegex = /class="a-text-price".*?class="a-offscreen">₹([0-9,]+)/i;
    const oldPriceMatch = html.match(oldPriceRegex);
    if (oldPriceMatch) {
      data.oldPrice = parseInt(oldPriceMatch[1].replace(/,/g, ''));
    }

    // 3. Parse Rating
    const ratingRegex = /([3-5]\.[0-9]) out of 5 stars/i;
    const ratingMatch = html.match(ratingRegex);
    if (ratingMatch) {
      data.rating = parseFloat(ratingMatch[1]);
    } else {
      const ratingRegex2 = /([3-5]\.[0-9]) out of 5/i;
      const ratingMatch2 = html.match(ratingRegex2);
      if (ratingMatch2) {
        data.rating = parseFloat(ratingMatch2[1]);
      }
    }

    // 4. Parse Reviews
    const reviewsRegex = /id="acrCustomerReviewText">([0-9,]+)\s*ratings/i;
    const reviewsMatch = html.match(reviewsRegex);
    if (reviewsMatch) {
      data.reviews = parseInt(reviewsMatch[1].replace(/,/g, ''));
    } else {
      const reviewsRegex2 = /id="acrCustomerReviewText">([0-9,]+)\s*reviews/i;
      const reviewsMatch2 = html.match(reviewsRegex2);
      if (reviewsMatch2) {
        data.reviews = parseInt(reviewsMatch2[1].replace(/,/g, ''));
      }
    }

    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error(`Error scraping ASIN ${asin} from Amazon:`, error.message);
  }
  return null;
}

async function run() {
  console.log('Loading books.json database...');
  const fileContent = fs.readFileSync(booksPath, 'utf-8');
  const books = JSON.parse(fileContent);
  
  console.log(`Found ${books.length} books. Scraping Amazon India details...`);
  
  let successCount = 0;
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    console.log(`[${i+1}/${books.length}] Scraping Amazon page for "${book.title}" (ASIN: ${book.asin})...`);
    
    const amazonData = await scrapeAmazonProduct(book.asin);
    
    if (amazonData) {
      if (amazonData.price) book.price = amazonData.price;
      if (amazonData.oldPrice) book.oldPrice = amazonData.oldPrice;
      if (amazonData.rating) book.rating = amazonData.rating;
      if (amazonData.reviews) book.reviews = amazonData.reviews;
      
      // Update discountPercent
      if (book.price && book.oldPrice) {
        book.discountPercent = Math.round((1 - book.price / book.oldPrice) * 100);
      }
      
      book.priceLastCheckedAt = new Date().toISOString().split('T')[0];
      successCount++;
      console.log(` -> Synced! Price: ₹${book.price}, OldPrice: ₹${book.oldPrice}, Discount: ${book.discountPercent}%, Rating: ${book.rating}★, Reviews: ${book.reviews}`);
    } else {
      console.log(' -> Failed to scrape. Keeping existing details.');
    }
    
    // Sleep to prevent getting blocked (3 seconds random gap)
    const sleepTime = 1500 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, sleepTime));
  }
  
  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
  console.log(`Sync complete! Successfully updated ${successCount}/${books.length} books from Amazon India.`);
}

run();
