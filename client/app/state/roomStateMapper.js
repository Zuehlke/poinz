/**
 * In our backend, the room data structure is slightly different than in the client (redux) state.
 *
 * In the client:
 *
 * - estimations is a separate object
 * - stories is not an array but an object, indexed by storyId. "estimations" property is removed.
 * - users is not an array but an object, indexed by userId
 *
 */

export function indexEstimations(beStories) {
  return (beStories || []).reduce((total, stry) => {
    total[stry.id] = stry.estimations;
    return total;
  }, {});
}

export function indexStories(beStories) {
  return (beStories || []).reduce((total, stry) => {
    total[stry.id] = {...stry};
    delete total[stry.id].estimations;
    return total;
  }, {});
}

export function indexUsers(beUsers) {
  return (beUsers || []).reduce((total, currentUser) => {
    total[currentUser.id] = currentUser;
    return total;
  }, {});
}
