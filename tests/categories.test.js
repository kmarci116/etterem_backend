const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../routes/categories');
const db = require('../db');

jest.mock('../db', () => ({
    query: jest.fn(),
    pool: {
        getConnection: jest.fn()
    }
}));

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

describe('Categories API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/categories should return all categories', async () => {
        const mockCategories = [{ id: 1, name: 'Desserts' }, { id: 2, name: 'Drinks' }];
        db.query.mockResolvedValue(mockCategories);

        const response = await request(app).get('/api/categories');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCategories);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM Categories');
    });

    it('GET /api/categories/:id should return a specific category', async () => {
        const mockCategory = { id: 1, name: 'Desserts' };
        db.query.mockResolvedValue([mockCategory]);

        const response = await request(app).get('/api/categories/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCategory);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM Categories WHERE id = ?', ['1']);
    });

    it('GET /api/categories/:id should return 404 if not found', async () => {
        db.query.mockResolvedValue([]);

        const response = await request(app).get('/api/categories/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    it('POST /api/categories should create a category', async () => {
        const mockResult = { insertId: 3, affectedRows: 1 };
        db.query.mockResolvedValue(mockResult);

        const newCategory = { id: 3, name: 'Appetizers' };
        const response = await request(app).post('/api/categories').send(newCategory);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Created successfully', result: mockResult });
        expect(db.query).toHaveBeenCalledWith('INSERT INTO Categories (id, name) VALUES (?, ?)', [3, 'Appetizers']);
    });

    it('PUT /api/categories/:id should update a category', async () => {
        const mockResult = { affectedRows: 1 };
        db.query.mockResolvedValue(mockResult);

        const response = await request(app).put('/api/categories/1').send({ name: 'Updated Desserts' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Updated successfully', result: mockResult });
        expect(db.query).toHaveBeenCalledWith('UPDATE Categories SET name = ? WHERE id = ?', ['Updated Desserts', '1']);
    });

    it('DELETE /api/categories/:id should delete a category', async () => {
        const mockResult = { affectedRows: 1 };
        db.query.mockResolvedValue(mockResult);

        const response = await request(app).delete('/api/categories/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Deleted successfully', result: mockResult });
        expect(db.query).toHaveBeenCalledWith('DELETE FROM Categories WHERE id = ?', ['1']);
    });
});
