import {Book} from "../models/models.js";
// to render 12 random books each time homepage refreshes
async function getRandomBooks() {
    try {
      const bookCount = await Book.countDocuments();
  
      const randomIndices = generateRandomIndices(bookCount, 12);
  
      const randomBooks = await Book.find().skip(randomIndices[0]).limit(12);
  
      return randomBooks;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  function generateRandomIndices(max, count) {
    const indices = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  }

 const getHomepageBooks = async (params) => {
    
      const randomBooks = await getRandomBooks();
      
      return randomBooks;
    
    
}
export default getHomepageBooks;