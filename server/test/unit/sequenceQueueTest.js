import assert from 'assert';
import queueFactory from '../../src/sequenceQueue';

describe('sequenceQueue', ()=> {

  it('register first, push one job', mochaDone => {
    const queue = queueFactory((job, done) => {
      assert(job);
      assert.equal(job.number, 1);
      assert.equal(typeof done, 'function');
      mochaDone();
    });


    queue.push({
      number: 1
    });

  });

  it('push one job, register afterwards', done => {
    const queue = queueFactory((job, nextJob) => {
      assert(job);
      assert.equal(job.number, 1);
      assert.equal(typeof nextJob, 'function');
      done();
    });

    queue.push({
      number: 1
    });

  });

  it('push two jobs', done => {

    const queue = queueFactory((job, proceed) => {
      jobCount++;

      if (jobCount === 1) {
        handlingFirstJob = true;
        assert.equal(job.number, 1);

        setTimeout(function () {
          handlingFirstJob = false;
          proceed();
        }, 1);

      } else if (jobCount === 2) {
        assert(!handlingFirstJob, 'Must not call handler for job2 if job1 is still being handled!');
        assert.equal(job.number, 2);

        done();
      }

    });

    var jobCount = 0;
    var handlingFirstJob = false;


    queue.push({
      number: 1
    });
    queue.push({
      number: 2
    });

  });
});
