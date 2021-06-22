import supertest from 'supertest';
import { expect } from 'chai';
import server from './server';
import sharp = require('sharp');

const request = supertest.agent(server);

const webpContentType = /image\/webp/;
const jpegContentType = /image\/jpeg/;
const jsonContentType = /application\/json/;

describe('avatar routes', () => {
  let metaReader: sharp.Sharp;

  beforeEach(() => {
    metaReader = sharp();
  });

  describe('next avatar requests', () => {
    it('can generate an avatar', done => {
      request
        .get('/api/abott')
        .expect('Content-Type', webpContentType)
        .end(done);
    });

    it('supports a custom size parameter', done => {
      request
        .get('/api/abott/220')
        .pipe(metaReader);

      metaReader
        .metadata()
        .then(meta => {
          expect(meta.height).to.eql(220);
          expect(meta.width).to.eql(220);
          done();
        })
        .catch(done);
    });

    it('supports a custom format parameter', done => {
      request
        .get('/api/abott/220/jpg')
        .expect(200)
        .expect('Content-Type', jpegContentType)
        .end(done);
    });
  });

  describe('next avatar manual requests', () => {
    it('can generate a manually composed avatar', done => {
      request
        .get('/api/face/eyes1/nose4/mouth11/bbb')
        .expect(200)
        .expect('Content-Type', webpContentType)
        .end(done);
    });

    it('supports a custom size parameter', done => {
      request
        .get('/api/face/eyes1/nose4/mouth11/bbb/50')
        .expect(200)
        .expect('Content-Type', webpContentType)
        .pipe(metaReader);

      metaReader
        .metadata()
        .then(meta => {
          expect(meta.height).to.eql(50);
          expect(meta.width).to.eql(50);
          done();
        })
        .catch(done);
    });

    it('supports a custom format parameter', done => {
      request
      .get('/api/face/eyes1/nose4/mouth11/bbb/50/jpeg')
      .expect(200)
      .expect('Content-Type', jpegContentType)
      .end(done);
    });
  });

  describe('next avatar random requests', () => {
    it('can generate a random avatar', done => {
      const getRandom = () =>
        request
          .get('/api/random')
          .expect(200)
          .expect('Content-Type', webpContentType);
      const metaReader2 = sharp();

      getRandom().pipe(metaReader);
      getRandom().pipe(metaReader2);

      Promise.all([metaReader.metadata(), metaReader2.metadata()])
        .then(([meta, meta2]) => {
          expect(meta.size).not.to.equal(meta2.size);
          done();
        })
        .catch(done);
    });

    it('supports a custom size parameter', done => {
      request
        .get('/api/random/50')
        .expect(200)
        .expect('Content-Type', webpContentType)
        .pipe(metaReader);

      metaReader
        .metadata()
        .then(meta => {
          expect(meta.height).to.eql(50);
          expect(meta.width).to.eql(50);
          done();
        })
        .catch(done);
    });

    it('supports a custom format parameter', done => {
      request
        .get('/api/random/50/jpeg')
        .expect(200)
        .expect('Content-Type', jpegContentType)
        .end(done);
    });
  });

  describe('next avatar list requests', () => {
    it('responds with json', done => {
      request
        .get('/api/list')
        .expect('Content-Type', jsonContentType)
        .end(done);
    });

    it('responds with a list of possible face parts', done => {
      request
        .get('/api/list')
        .end((err, res) => {
          const faceParts = res.body.face;
          expect(faceParts).to.have.keys('eyes', 'mouth', 'nose');
          done();
        });
    });
  });
});
