const request = require('supertest');
const app = require('../app');
const { db } = require('../config/database');

describe('Business Registration and Listing API', () => {
  beforeAll(async () => {
    // Clear test database
    await new Promise((resolve) => {
      db.run('DELETE FROM businesses', resolve);
    });
  });

  const testBusinesses = [
    {
      tradeName: 'Test Business 1',
      legalName: 'Test Legal Name 1',
      gstin: '27AAPFU0939F1ZV',
      pan: 'AAPFU0939F',
      registeredAddress: {
        building: '123',
        street: 'Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001'
      },
      mobile: '9876543210',
      email: 'test1@business.com'
    },
    {
      tradeName: 'Test Business 2',
      legalName: 'Test Legal Name 2',
      gstin: '29AAPFU0939F1ZX',
      pan: 'BAPFU0939F',
      registeredAddress: {
        building: '456',
        street: 'Another Street',
        city: 'Bangalore',
        state: 'Karnataka',
        pinCode: '560001'
      },
      mobile: '9876543211',
      email: 'test2@business.com'
    }
  ];

  describe('Business Registration', () => {
    test('should register a new business with valid data', async () => {
      const response = await request(app)
        .post('/api/business/register')
        .send(testBusinesses[0]);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Business registered successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.tradeName).toBe(testBusinesses[0].tradeName);
    });

    test('should not register business with duplicate GSTIN', async () => {
      const response = await request(app)
        .post('/api/business/register')
        .send(testBusinesses[0]);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Business with this GSTIN already exists');
    });

    test('should not register business with missing required fields', async () => {
      const invalidBusiness = {
        tradeName: 'Invalid Business',
        // missing other required fields
      };

      const response = await request(app)
        .post('/api/business/register')
        .send(invalidBusiness);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields');
    });
  });

  describe('Business Listing', () => {
    beforeAll(async () => {
      // Register second test business
      await request(app)
        .post('/api/business/register')
        .send(testBusinesses[1]);
    });

    test('should get all registered businesses', async () => {
      const response = await request(app)
        .get('/api/business');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      
      // Verify business data
      const businesses = response.body;
      expect(businesses[0]).toHaveProperty('tradeName');
      expect(businesses[0]).toHaveProperty('gstin');
      expect(businesses[0]).toHaveProperty('registeredAddress');
    });

    test('should return businesses with correct structure', async () => {
      const response = await request(app)
        .get('/api/business');

      const business = response.body[0];
      expect(business).toMatchObject({
        id: expect.any(Number),
        tradeName: expect.any(String),
        legalName: expect.any(String),
        gstin: expect.any(String),
        pan: expect.any(String),
        mobile: expect.any(String),
        email: expect.any(String),
        registeredAddress: expect.any(String),
      });
    });
  });

  describe('Data Validation', () => {
    test('should validate GSTIN format', async () => {
      const invalidBusiness = {
        ...testBusinesses[0],
        gstin: 'INVALID-GSTIN'
      };

      const response = await request(app)
        .post('/api/business/register')
        .send(invalidBusiness);

      expect(response.status).toBe(400);
    });

    test('should validate PAN format', async () => {
      const invalidBusiness = {
        ...testBusinesses[0],
        pan: 'INVALID-PAN'
      };

      const response = await request(app)
        .post('/api/business/register')
        .send(invalidBusiness);

      expect(response.status).toBe(400);
    });

    test('should validate mobile number', async () => {
      const invalidBusiness = {
        ...testBusinesses[0],
        mobile: '123' // invalid mobile number
      };

      const response = await request(app)
        .post('/api/business/register')
        .send(invalidBusiness);

      expect(response.status).toBe(400);
    });
  });

  afterAll(async () => {
    // Clean up test database
    await new Promise((resolve) => {
      db.run('DELETE FROM businesses', resolve);
    });
  });
}); 