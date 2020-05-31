import queueFactory from '../../src/sequenceQueue';

test('register first, push one job', (testFnDoneCb) => {
  const queue = queueFactory((job, done) => {
    expect(job).toBeDefined();
    expect(job.number).toBe(1);
    expect(typeof done).toEqual('function');
    testFnDoneCb();
  });

  queue.push({
    number: 1
  });
});

test('push two jobs', (testFnDoneCb) => {
  const queue = queueFactory((job, proceed) => {
    jobCount++;

    if (jobCount === 1) {
      handlingFirstJob = true;
      expect(job.number).toBe(1);

      setTimeout(function () {
        handlingFirstJob = false;
        proceed();
      }, 1);
    } else if (jobCount === 2) {
      expect(handlingFirstJob).toBe(false); // 'Must not call handler for job2 if job1 is still being handled!
      expect(job.number).toBe(2);

      testFnDoneCb();
    }
  });

  let jobCount = 0;
  let handlingFirstJob = false;

  queue.push({
    number: 1
  });
  queue.push({
    number: 2
  });
});
