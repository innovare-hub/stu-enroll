import dotenv from 'dotenv';
import mongoose from 'mongoose';
import supertest from 'supertest';
import createServer from '../utils/server';
import { faculty } from '../models/student';
import { OBJECT_ID_REGEX } from '../constants';
import { NepalStates } from '../models/student';
import { StudentInput } from '../models/student';
import { Student } from '../constants/tests';

const app = createServer();
dotenv.config();

beforeAll(async () => {
  const DB_URI = process.env.DB_URI as string;
  await mongoose.connect(DB_URI);
});

describe('Student', () => {
  let newStudent: string = '';

  describe('Create student', () => {
    describe('given the data is in valid format', () => {
      it('should create a new student', async () => {
        // A sample student data object
        const studentData: StudentInput = {
          email: 'test@example.com',
          password: 'test123456',
          dateOfBirth: '2000-01-01',
          mobileNo: 1234567890,
          faculty: faculty.BIM,
          semester: 2,
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Example City',
          state: NepalStates.One,
          postalCode: 12345,
          guardianName: 'Jane Doe',
          guardianContact: 9876543210,
          createdAt: new Date(),
          updatedAt: new Date(),
          comparePassword: async (candidatePassword: string) => {
            // For testing purposes, simply returning true or false
            return candidatePassword === studentData.password;
          },
        };

        // Make a POST request to create the student
        const res = await supertest(app)
          .post('/student')
          .send({ ...studentData, passwordConfirmation: studentData.password });

        // Assertions
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body._id).toMatch(OBJECT_ID_REGEX);

        newStudent = res.body._id; // will use to get/delete the student
      });
    });
  });

  describe('Get student', () => {
    describe("given the student doesn't exist", () => {
      it('should return 404', async () => {
        const STUDENT_ID: string = new mongoose.Types.ObjectId().toString();
        const res = await supertest(app).get(`/students/${STUDENT_ID}`);

        expect(res.statusCode).toBe(404);
      });
    });

    describe('given the student exists', () => {
      it('should return status 200 and student doc.', async () => {
        const STUDENT_ID: string = newStudent;
        const res = await supertest(app).get(`/students/${STUDENT_ID}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('student');
        expect(res.body.student).toMatchObject<Student>({
          _id: expect.any(String),
          email: expect.any(String),
          dateOfBirth: expect.any(String),
          mobileNo: expect.any(Number),
          faculty: expect.any(String),
          semester: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          address: expect.any(String),
          city: expect.any(String),
          state: expect.any(String),
          postalCode: expect.any(Number),
          guardianName: expect.any(String),
          guardianContact: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        });
      });
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});
