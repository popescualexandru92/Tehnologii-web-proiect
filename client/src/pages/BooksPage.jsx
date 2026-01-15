import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../components/LoadingSpinner';
import BookCard from '../../components/BookCard';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const loggedIn = useSelector(state => state.user.loggedIn);

  const fetchBooks = async (query = '') => {
    try {
      setLoading(true);
      setError(null);

      let searchTerm;
      if (query.trim()) {
        searchTerm = query.trim();
      } else {
        // Search for bestseller and popular books
        const currentYear = new Date().getFullYear();
        searchTerm = `bestseller+${currentYear}`;
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=20&orderBy=relevance&langRestrict=en`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchQuery);
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
      <h1 className="text-3xl font-bold mb-6 text-white">Popular Books</h1>
      
      {loggedIn && (
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} isLoggedIn={loggedIn} />
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
