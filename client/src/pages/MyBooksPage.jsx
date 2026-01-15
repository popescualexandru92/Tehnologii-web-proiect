import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMyBooks, deleteBook } from '../api/book.routes';

const MyBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyBooks();
      
      if (response?.success) {
        setBooks(response.data);
      } else {
        console.error('Failed to fetch books:', response);
        setError(response?.message || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error in fetchMyBooks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      return;
    }

    try {
      const response = await deleteBook(bookId);
      
      if (response?.success) {
        toast.success('Book deleted successfully!');
        setBooks(books.filter(book => book.id !== bookId));
      } else {
        toast.error(response?.message || 'Failed to delete book');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the book');
      console.error('Error deleting book:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">My Books</h1>
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't added any books yet.</p>
          <a href="/books" className="text-blue-600 hover:text-blue-700 underline">
            Browse books to add to your collection
          </a>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6 text-white">You have {books.length} book{books.length !== 1 ? 's' : ''} in your collection</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
              >
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-colors z-10"
                  title="Delete book"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {book.author}
                  </p>
                  {book.url && book.url !== '#' && (
                    <a 
                      href={book.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      View details
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBooksPage;
