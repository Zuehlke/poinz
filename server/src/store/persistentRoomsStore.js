/**
 * this was the former redis implementation of the rooms store which stored room data persistently.
 * It was not used in production deployment for a long time and implementation did not support new features.
 * See git history.
 */
export default {
  init
};

function init() {
  throw new Error(
    'Persistent mock room store (former implementation with redis) is currently no longer supported!'
  );
}
