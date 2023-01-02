import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import { response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

//close connection after tests
async function deleteData() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterAll(async () => {
  try {
    await deleteData();
    await mongoose.connection.close();
  } catch (err) {
    console.log(`${err}`);
    throw err;
  }
});
//dynamic blogid and token
let blogId = '';
let msgId = '';
let TESTTOKEN = '';
//testing authorization
describe('/POST Signup', () => {
  describe('given an email and password', () => {
    test('Should respond with 200 status code', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        email: 'mukunzifabric@gmail.com',
        password: 'Pass@123',
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe('invalid email or password', () => {
    test('should respond with 400 status code', async () => {
      const response = await request(app).post('/api/v1/auth/signup').send({
        email: 'mukunzifabric@gmail.com',
        password: '12',
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
describe('/POST Login', () => {
  describe('given valid credentials', () => {
    test('Should respond 200 status code', async () => {
      const response = await request(app).post('/api/v1/auth/login/').send({
        email: 'mukunzifabric@gmail.com',
        password: 'Pass@123',
      });
      expect(response.statusCode).toBe(200);
      TESTTOKEN = response.body.token;
    });
  });
  describe('invalid credentials provided', () => {
    test('Should respond with status code 400', async () => {
      const response = await request(app).post('/api/v1/auth/login/').send({
        email: 'mukunzifabrice77@gmail.com',
        password: 'pass@123',
      });
      expect(response.statusCode).toBe(400);
    });
  });
});

//testing a blog

//test blog creation
//created blog
const blogDetails = {
  title: 'testing an image',
  content: 'lorem ipsum test',
};
const img = path.resolve('./tests');
describe('/POST Blogs', () => {
  describe('Given a valid blog and authorised', () => {
    test('Should respond with status code 200', async () => {
      const response = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `Bearer ${TESTTOKEN}`)
        .field(blogDetails)
        .attach('image', `${img}/dafault-blog.jpg`);
      expect(response.body.message).toBe('Blog is created!');
    });
  });
  describe('Given a blog but not authorised', () => {
    test('Should respond with status code 403', async () => {
      const response = await request(app).post('/api/v1/blogs').send({
        title: 'test blog',
        content: 'lorem ipsum test',
      });
      expect(response.statusCode).toBe(403);
    });
  });
  describe('Given invalid blog data', () => {
    test('Should respond invalid blog data', async () => {
      const response = await request(app)
        .post('/api/v1/blogs')
        .set('Authorization', `bearer ${TESTTOKEN}`)
        .send({
          title: '',
          content: 'lorem ipsum test',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Invalid blog details');
    });
  });
});

//test get all blogs

describe('/GET /blogs', () => {
  describe('Get all blogs', () => {
    test('should respond with 200 status code', async () => {
      const response = await request(app).get('/api/v1/blogs/');
      expect(response.statusCode).toBe(200);
    });
  });
  describe('Get blog by id', () => {
    describe('given invalid blog id', () => {
      test('Should respond blog not found', async () => {
        const response = await request(app).get(
          '/api/v1/blogs/63b420902adf860697ee1991'
        );
        expect(response.body.message).toBe('Blog is not found');
      });
    });
    describe('given a valid blog id', () => {
      beforeEach(async () => {
        const response = await request(app).get('/api/v1/blogs');
        blogId = response.body[0]._id;
      });
      test('Should respond a single blog', async () => {
        const response = await request(app).get(`/api/v1/blogs/${blogId}`);
        expect(response.body).toHaveProperty('blog');
      });
    });
  });
});

//test update a blog

describe('/PATCH /blogs/:id', () => {
  describe('Unauthorized user', () => {
    test('should respond with status code 403', async () => {
      const response = await request(app)
        .patch('/api/v1/blogs/63bbc1563e6046f62585b21e')
        .send({
          title: 'test a blog',
          content: 'lorem ipsum test',
        });
      expect(response.statusCode).toBe(403);
    });
  });
  describe('Invalid blog data input', () => {
    test('Should respond with invalid blog data', async () => {
      const response = await request(app)
        .patch('/api/v1/blogs/63bbc1563e6046f62585b21e')
        .send({
          title: 'test blog',
          content: '',
        })
        .set('Authorization', `bearer ${TESTTOKEN}`);
      expect(response.body.message).toBe('Invalid blog details');
    });
  });
  describe('Valid blog data and authorised', () => {
    test('Should respond Blog updated!', async () => {
      const response = await request(app)
        .patch(`/api/v1/blogs/${blogId}`)
        .field(blogDetails)
        .attach('image', `${img}/dafault-blog.jpg`)
        .set('Authorization', `bearer ${TESTTOKEN}`);
      expect(response.body.message).toBe('Blog updated!');
    });
  });
});

//testing comments

//adding a comment
describe('/POST /blogs/id/comments', () => {
  describe('Invalid comments id', () => {
    test('should respond invalid blog id', async () => {
      const response = await request(app)
        .post('/api/v1/blogs/63bbc1563e6046f62585b211/comments')
        .send({
          names: 'mukunzi',
          comment: 'great job!',
        });
      expect(response.body.message).toBe('Blog is not found');
    });
  });
  describe('Valid comment id with invalid comment details', () => {
    test('Should respond invalid comment details', async () => {
      const response = await request(app)
        .post('/api/v1/blogs/63bd070b2c6f6e77b109bb6f/comments')
        .send({
          names: 'mukunzi123',
          comment: 'great job!',
        });
      expect(response.body.message).toBe('Invalid names or comment');
    });
  });
  describe('Valid blog id and valid comment details', () => {
    test('should respond comment added successfully', async () => {
      const response = await request(app)
        .post(`/api/v1/blogs/${blogId}/comments`)
        .send({
          names: 'mukunzi',
          comment: 'great job!',
        });
      expect(response.body.message).toBe('Comment added!');
    });
  });
});
//getting a comment
describe('/GET /blogs/:id/comments', () => {
  describe('given a valid blog id', () => {
    test('should respond with status code 200', async () => {
      const response = await request(app).get(
        `/api/v1/blogs/${blogId}/comments`
      );
      expect(response.statusCode).toBe(200);
    });
  });
  describe('given invalid blog id', () => {
    test('Should respond invalid blog id', async () => {
      const response = await request(app).get(
        '/api/v1/blogs/63b420902adf860697ee199a/comments'
      );
      expect(response.body.message).toBe('Blog is not found');
    });
  });
});

//adding message
describe('/POST /messages', () => {
  describe('given a valid message details', () => {
    test('should respond message sent!', async () => {
      const response = await request(app).post('/api/v1/messages').send({
        names: 'Isaro Holliness',
        email: 'isaroholliness@gmail.com',
        phone: '+250789630057',
        message: 'please leave a message after the beep',
      });
      expect(response.body.message).toBe('Message has been sent');
    });
  });
  describe('given invalid message details', () => {
    test('should respond invalid message details', async () => {
      const response = await request(app).post('/api/v1/messages').send({
        names: 'Isaro Holliness',
        email: 'isarohollinessgmail.com',
        phone: '+250789630057',
        message: 'please leave a message after the beep',
      });
      expect(response.body.message).toBe('Invalid message details');
    });
  });
});
//getting all messages

describe('/GET /messages', () => {
  describe('authorised user', () => {
    test('should display all messages', async () => {
      const response = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${TESTTOKEN}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('messages');
    });
  });
  describe('unauthorised user', () => {
    test('should display user not authorised', async () => {
      const response = await request(app).get('/api/v1/messages');
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Unauthorized request');
    });
  });
});

//getting a message by id
describe('/GET /messages', () => {
  describe('given valid message id and authorised', () => {
    beforeEach(async () => {
      const response = await request(app)
        .get('/api/v1/messages')
        .set('Authorization', `Bearer ${TESTTOKEN}`);
      msgId = response.body.messages[0]._id;
    });
    test('should respond a single message details', async () => {
      const response = await request(app)
        .get(`/api/v1/messages/${msgId}`)
        .set('Authorization', `Bearer ${TESTTOKEN}`);
      expect(response.body).toHaveProperty('message');
    });
  });
  describe('given a valid message id but not authorised', () => {
    test('should respond unauthorised user', async () => {
      const response = await request(app).get(`/api/v1/messages/${msgId}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe('Unauthorized request');
    });
  });
  test('Check delete message', async () => {
    const response = await request(app)
      .delete(`/api/v1/messages/${msgId}`)
      .set('Authorization', `Bearer ${TESTTOKEN}`);
    expect(response.body.message).toBe('Message has deleted!');
  });
});
//adding like
describe('/POST /blogs/:id/addLike', () => {
  describe('given a valid blog id', () => {
    test('should respond like added!', async () => {
      const response = await request(app).post(
        `/api/v1/blogs/${blogId}/addLike`
      );
      expect(response.body.message).toBe('Like Added!');
    });
  });
  describe('given invalid blog id', () => {
    test('should respond invalid blog', async () => {
      const response = await request(app).post(
        '/api/v1/blogs/63bbc1563e6046f62585b211/addLike'
      );
      expect(response.body.message).toBe('Blog is not found');
    });
  });
});
//unlike blog
describe('/POST /blogs/:id/unlike', () => {
  describe('given a valid blog id', () => {
    test('should respond like added!', async () => {
      const response = await request(app).post(
        `/api/v1/blogs/${blogId}/unlike`
      );
      expect(response.body.message).toBe('unliked!');
    });
  });
  describe('given invalid blog id', () => {
    test('should respond invalid blog id', async () => {
      const response = await request(app).post(
        '/api/v1/blogs/63bbc1563e6046f62585b211/unlike'
      );
      expect(response.body.message).toBe('Blog is not found');
    });
  });
  test('Check delete blog', async () => {
    const response = await request(app)
      .delete(`/api/v1/blogs/${blogId}`)
      .set('Authorization', `bearer ${TESTTOKEN}`);

    expect(response.body.message).toBe('Blog has deleted');
  });
});
