/**
 * Jobs can be pushed into the queue and are handled sequentially.
 * job N is only handled after job N-1 is done, even if both are pushed "simultaneously" (one right after the other).
 *
 * Currently the sequence queue only supports a single jobHandler (all we need for now).
 *
 */
module.exports = function queueFactory() {
  const queue = [];
  var handler;
  var isCurrentlyHandling = false;

  return {
    push,
    setJobHandler
  };


  /**
   * Push a job into the queue
   * @param {Object} job
   */
  function push(job) {
    queue.push(job);

    if (!isCurrentlyHandling) {
      // if not yet handling, start handling
      invokeJobHandler();
    }
  }

  /**
   * Set the job handler function
   * @param {function} jobHandler
   */
  function setJobHandler(jobHandler) {
    if (handler) {
      throw new Error('Sequence Queue supports only one handler to be registered!');
    }
    handler = jobHandler;
    invokeJobHandler();
  }

  function invokeJobHandler() {
    if (!handler || queue.length < 1) {
      return;
    }

    isCurrentlyHandling = true;

    const job = queue.shift();
    handler(job, () => {
      isCurrentlyHandling = false;
      invokeJobHandler();
    });
  }


};
