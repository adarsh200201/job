import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksPath = path.join(__dirname, '../src/data/books.json');

async function fetchBookFromGoogle(asin) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${asin}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.totalItems > 0) {
      const volumeInfo = data.items[0].volumeInfo;
      return {
        title: volumeInfo.title || null,
        subtitle: volumeInfo.subtitle || null,
        authors: volumeInfo.authors || [],
        publisher: volumeInfo.publisher || null,
        publishedDate: volumeInfo.publishedDate || null,
        rating: volumeInfo.averageRating || null,
        reviews: volumeInfo.ratingsCount || null,
        description: volumeInfo.description ? volumeInfo.description.replace(/<[^>]*>/g, '') : null,
        language: volumeInfo.language || 'English'
      };
    }
  } catch (error) {
    console.error(`Error fetching ASIN ${asin} from Google Books:`, error.message);
  }
  return null;
}

async function run() {
  console.log('Loading books.json database...');
  const fileContent = fs.readFileSync(booksPath, 'utf-8');
  const books = JSON.parse(fileContent);
  
  console.log(`Found ${books.length} books. Fetching real metadata...`);
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    console.log(`[${i+1}/${books.length}] Querying details for "${book.title}" (ASIN: ${book.asin})...`);
    
    const googleData = await fetchBookFromGoogle(book.asin);
    
    if (googleData) {
      // Keep existing manual descriptions and values if Google's is empty
      if (googleData.title) book.title = googleData.title;
      if (googleData.subtitle) book.subtitle = googleData.subtitle;
      if (googleData.authors.length > 0) book.author = googleData.authors.join(', ');
      if (googleData.publisher) book.publisher = googleData.publisher;
      if (googleData.publishedDate) book.publishedDate = googleData.publishedDate;
      if (googleData.rating) book.rating = googleData.rating;
      if (googleData.reviews) book.reviews = googleData.reviews;
      
      console.log(` -> Synced! Rating: ${book.rating}★, Reviews: ${book.reviews}`);
    } else {
      console.log(' -> No Google Books index found. Keeping existing details.');
    }
    
    // Tiny sleep to avoid API rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf-8');
  console.log('books.json updated successfully!');
}

run();
