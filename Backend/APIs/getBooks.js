import {Book} from "../models/models.js";

 const getBooks = async (params) => {
    
    let inputValue = params.inputValue;
    const offset = params.offset;
    const limit = params.limit;
    
    inputValue = decodeURIComponent(params.inputValue);
    //to tackle book names having special characters, 
    let escapedInputValue = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// searching if by title if not found, the search by author, if not found, then finally searched by isbn
    let booksList = await Book.find({ title: new RegExp(escapedInputValue, 'i') });
    
    const numericQuery = parseInt(escapedInputValue);

    if(booksList.length===0){
        try {
            booksList = await Book.find({ author: new RegExp(escapedInputValue, 'i') });
            if (booksList.length === 0 && !isNaN(numericQuery)) {
              booksList = await Book.find({ isbn: numericQuery });
            }
          } catch (error) {
            
            console.error('Error while searching for books:', error);
            return error;
          }
    }
    const resultObj = {
        booksList: booksList.slice(offset, offset + limit),
        totalLength: booksList.length
    };
    
    return resultObj;
    
}
export default getBooks;