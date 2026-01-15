// client/src/api/book.routes.js
import { axiosAuth } from "../axios/axiosAuth";

export const getMyBooks = async () => {
  try {
    const response = await axiosAuth.get('/books/my-books');
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return error.response?.data;
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await axiosAuth.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    return error.response?.data;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await axiosAuth.delete(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    return error.response?.data;
  }
};
