const
  assert = require('assert'),
  queueFactory = require('../../src/sequenceQueue');

describe('sequenceQueue', ()=> {

  it('register first, push one job', mochaDone => {
    const queue = queueFactory();

    queue.setJobHandler((job, done) => {
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
    const queue = queueFactory();

    queue.push({
      number: 1
    });

    queue.setJobHandler((job, nextJob) => {
      assert(job);
      assert.equal(job.number, 1);
      assert.equal(typeof nextJob, 'function');
      done();
    });

  });

  it('push two jobs', done => {

    const queue = queueFactory();

    var jobCount = 0;
    var handlingFirstJob = false;

    queue.setJobHandler((job, nextJob) => {
      jobCount++;

      if (jobCount === 1) {
        handlingFirstJob = true;
        assert.equal(job.number, 1);

        setTimeout(function () {
          handlingFirstJob = false;
          nextJob();
        }, 1);

      } else if (jobCount === 2) {
        assert(!handlingFirstJob, 'Must not call handler for job2 if job1 is still being handled!');
        assert.equal(job.number, 2);

        done();
      }

    });

    queue.push({
      number: 1
    });
    queue.push({
      number: 2
    });

  });
});
