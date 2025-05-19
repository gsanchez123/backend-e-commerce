import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js'; // verificar que  esta ruta sea correcta según  estructura

const expect = chai.expect;
chai.use(chaiHttp);

describe('Adoption API', () => {
  let createdAdoptionId;

  it('debería crear una adopción', (done) => {
    chai.request(app)
      .post('/api/adoptions')
      .send({
        name: 'Max',
        species: 'Perro',
        age: 3,
        adopted: false
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        createdAdoptionId = res.body._id;
        done();
      });
  });

  it('debería obtener todas las adopciones', (done) => {
    chai.request(app)
      .get('/api/adoptions')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('debería obtener una adopción por ID', (done) => {
    chai.request(app)
      .get(`/api/adoptions/${createdAdoptionId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').eql(createdAdoptionId);
        done();
      });
  });

  it('debería eliminar una adopción', (done) => {
    chai.request(app)
      .delete(`/api/adoptions/${createdAdoptionId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
