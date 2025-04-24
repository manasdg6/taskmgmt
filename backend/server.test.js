const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Mock fs module
jest.mock('fs');

const app = express();
require('./server');

describe('Task API Endpoints', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
    fs.existsSync.mockReturnValue(true);
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('healthy');
    });
  });

  describe('GET /tasks', () => {
    it('should return list of tasks', async () => {
      const mockTasks = 'Task 1\nTask 2';
      fs.readFileSync.mockReturnValue(mockTasks);

      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { text: 'Task 1' },
        { text: 'Task 2' }
      ]);
    });

    it('should handle errors', async () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });

      const response = await request(app).get('/tasks');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error reading tasks' });
    });
  });

  describe('POST /tasks', () => {
    it('should add new task', async () => {
      fs.appendFileSync.mockImplementation(() => {});

      const response = await request(app)
        .post('/tasks')
        .send({ task: 'New Task' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Task added successfully' });
      expect(fs.appendFileSync).toHaveBeenCalledWith(
        expect.any(String),
        'New Task\n'
      );
    });

    it('should handle errors', async () => {
      fs.appendFileSync.mockImplementation(() => {
        throw new Error('Write error');
      });

      const response = await request(app)
        .post('/tasks')
        .send({ task: 'New Task' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error adding task' });
    });
  });
});