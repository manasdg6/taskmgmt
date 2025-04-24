import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders task management app title', () => {
    render(<App />);
    expect(screen.getByText(/Task Management App/i)).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    const mockTasks = [
      { text: 'Task 1' },
      { text: 'Task 2' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockTasks });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Task added successfully' } });
    axios.get.mockResolvedValueOnce({ data: [{ text: 'New Task' }] });

    render(<App />);

    const input = screen.getByPlaceholderText(/enter a new task/i);
    const button = screen.getByText(/add task/i);

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        { task: 'New Task' }
      );
    });
  });

  test('handles error when fetching tasks', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test('handles error when adding task', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error('Failed to add task'));

    render(<App />);

    const input = screen.getByPlaceholderText(/enter a new task/i);
    const button = screen.getByText(/add task/i);

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
