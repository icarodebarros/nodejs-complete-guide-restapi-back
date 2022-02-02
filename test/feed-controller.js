const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const io = require('../socket');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', () => {
  
  before((done) => { // execute only once
    mongoose
      .connect(
        'mongodb+srv://node-app:node-app@cluster0.gafjw.mongodb.net/messages-test?retryWrites=true&w=majority' // database for tests
      )
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
 
  it('should add a created post to the posts of the creator', (done) => { // Pass 'done' only if needed, to deail with async code

    // sinon.stub(io, 'getIO').returns({ emit: () => {} });
    io.getIO = () => {
      return { emit: () => {} }
    }

    const req = {
      body: {
        title: 'Test title',
        content: 'Test content'
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };

    const res = {
      status: function() { return this },
      json: () => {}
    }

    FeedController.createPost(req, res, () => {}) // Async function
      .then(savedUser => {
        expect(savedUser).to.have.property('posts');
        expect(savedUser.posts).to.have.length(1);
        done();
      });

    // io.getIO.restore();
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
