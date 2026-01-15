import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { addBook } from '../src/api/book.routes';

const BookCard = ({ book, isLoggedIn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const user = useSelector(state => state.user.user);
  const volumeInfo = book.volumeInfo;
  const thumbnail = volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';

  const handleAddBook = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      const bookData = {
        title: volumeInfo?.title || 'Unknown Title',
        author: volumeInfo?.authors?.join(', ') || 'Unknown Author',
        image: thumbnail,
        url: volumeInfo?.infoLink || '#',
        userId: user?.id
      };

      const response = await addBook(bookData);
      
      if (response?.success) {
        toast.success('Book added successfully!');
      } else {
        toast.error(response?.message || 'Failed to add book');
      }
    } catch (error) {
      toast.error('An error occurred while adding the book');
      console.error('Error adding book:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {isLoggedIn && (
        <button
          onClick={handleAddBook}
          disabled={isAdding}
          className={`absolute top-2 right-2 ${isAdding ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full p-2 shadow-lg transition-colors z-10 disabled:cursor-not-allowed`}
          title="Add to my books"
        >
          {isAdding ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
      <img 
        src={thumbnail} 
        alt={volumeInfo?.title || 'Book cover'}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {volumeInfo?.title || 'Unknown Title'}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {volumeInfo?.authors?.join(', ') || 'Unknown Author'}
        </p>
        {volumeInfo?.publishedDate && (
          <p className="text-gray-500 text-xs mb-2">
            Published: {volumeInfo.publishedDate}
          </p>
        )}
        {volumeInfo?.description && (
          <p className="text-gray-700 text-sm line-clamp-3 mb-3">
            {volumeInfo.description}
          </p>
        )}
        {volumeInfo?.pageCount && (
          <p className="text-gray-500 text-xs">
            Pages: {volumeInfo.pageCount}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
