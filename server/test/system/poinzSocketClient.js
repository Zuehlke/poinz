import socketIoClient from 'socket.io-client';
import {promises as fs} from 'fs';
import {v4 as uuid} from 'uuid';

/**
 * provides functionality to interact with our poinz backend over websockets.
 *
 * Allows you to send commands and wait for respective events.
 * Almost identical to the real poinz webclient, except only one socket (with one socketID) that can be used with multiple user Ids.
 *
 * @param backendUrl
 */
export default function poinzSocketClientFactory(backendUrl = 'http://localhost:3000') {
  const socket = socketIoClient(backendUrl);
  const receivedEvents = [];
  let eventWaitPromises = [];

  socket.on('event', (msg) => {
    if (msg.name === 'commandRejected') {
      throw new Error('Command was rejected!\n' + JSON.stringify(msg, null, 4));
    }
    receivedEvents.push(msg);
    checkWaitingPromises();
  });

  return {
    sendCommand,
    cmdAndWait,
    waitForEvents,
    dumpAllEvents,
    disconnect,
    cmds: {
      joinRoom,
      leaveRoom,
      kick,
      setUsername,
      setEmail,
      toggleExclude,
      addStory,
      changeStory,
      selectStory,
      trashStory,
      restoreStory,
      deleteStory,
      giveEstimate,
      clearEstimate,
      newRound,
      setCardConfig,
      toggleAutoReveal,
      setPassword
    }
  };

  /**
   * Wait for events to arrive over the websocket that correlate to a command you just sent.
   * Specify how many events you expect (one command can produce multiple events in the backend...).
   *
   * Will resolve as soon as the specified number of events with the matching correlationId did arrive (were received).
   *
   * @param {string} correlationId
   * @param {number} expectedEventCount
   * @return {Promise<object[]>} Resolves to the array of received events
   */
  function waitForEvents(correlationId, expectedEventCount = 1) {
    let pResolve;
    let pReject;

    const newEventWaitPromise = new Promise((resolve, reject) => {
      pResolve = resolve;
      pReject = reject;
    });

    eventWaitPromises.push({
      correlationId,
      expectedEventCount,
      promise: newEventWaitPromise,
      resolve: pResolve,
      reject: pReject
    });

    checkWaitingPromises();

    return newEventWaitPromise;
  }

  function checkWaitingPromises() {
    eventWaitPromises = eventWaitPromises.filter((ewp) => {
      const matchingEvents = receivedEvents.filter((ev) => ev.correlationId === ewp.correlationId);

      if (matchingEvents.length === ewp.expectedEventCount) {
        ewp.resolve(matchingEvents);
        return false; // remove promise from array, so that we do not check it in the future
      }
      return true; // keep promise in array
    });
  }

  /**
   * writes all received events to the specified file (as json)
   *
   * @param {string} outputFilePath
   * @return {Promise<void>}
   */
  async function dumpAllEvents(outputFilePath) {
    await fs.writeFile(outputFilePath, JSON.stringify(receivedEvents), 'utf-8');
  }

  function disconnect() {
    if (socket) {
      socket.disconnect();
    }
  }

  function sendCommand(cmd) {
    const cmdId = uuid();
    socket.emit('command', {
      ...cmd,
      id: cmdId
    });
    return cmdId;
  }

  /**
   Wrapper function that saves us some glue code.

   ```
   await client.cmdAndWait(
   client.cmds.joinRoom(roomId, userId),
   3  // wait for three events  (roomCreated, roomJoined, avatarSet)
   );
   ```

   *
   * @param {string} cmdId
   * @param {number} expectedEventCount
   * @return {Promise<object[]>} Resolves to the array of received events
   */
  async function cmdAndWait(cmdId, expectedEventCount = 1) {
    if (!cmdId) {
      throw new Error('Please pass in cmd id !');
    }

    return waitForEvents(cmdId, expectedEventCount);
  }

  /**  helpers **/

  function joinRoom(roomId, userId, username, email, password) {
    return sendCommand({
      name: 'joinRoom',
      roomId,
      userId,
      payload: {
        username,
        email,
        password
      }
    });
  }

  function leaveRoom(roomId, userId, connectionLost) {
    return sendCommand({
      name: 'leaveRoom',
      roomId,
      userId,
      payload: {
        connectionLost
      }
    });
  }

  function kick(roomId, userId, userIdToKick) {
    return sendCommand({
      name: 'kick',
      roomId,
      userId,
      payload: {
        userId: userIdToKick
      }
    });
  }

  function setUsername(roomId, userId, username) {
    return sendCommand({
      name: 'setUsername',
      roomId,
      userId,
      payload: {
        username
      }
    });
  }

  function setEmail(roomId, userId, email) {
    return sendCommand({
      name: 'setEmail',
      roomId,
      userId,
      payload: {
        email
      }
    });
  }

  function toggleExclude(roomId, userId, userIdToToggle) {
    return sendCommand({
      name: 'toggleExclude',
      roomId,
      userId,
      payload: {userId: userIdToToggle}
    });
  }

  function addStory(roomId, userId, storyTitle, storyDescription) {
    return sendCommand({
      name: 'addStory',
      roomId,
      userId,
      payload: {
        title: storyTitle,
        description: storyDescription
      }
    });
  }

  function changeStory(roomId, userId, storyId, storyTitle, storyDescription) {
    return sendCommand({
      name: 'changeStory',
      roomId,
      userId,
      payload: {
        storyId,
        title: storyTitle,
        description: storyDescription
      }
    });
  }

  function selectStory(roomId, userId, storyId) {
    return sendCommand({
      name: 'selectStory',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function trashStory(roomId, userId, storyId) {
    return sendCommand({
      name: 'trashStory',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function restoreStory(roomId, userId, storyId) {
    return sendCommand({
      name: 'restoreStory',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function deleteStory(roomId, userId, storyId) {
    return sendCommand({
      name: 'deleteStory',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function giveEstimate(roomId, userId, storyId, value, confidence) {
    return sendCommand({
      name: 'giveStoryEstimate',
      roomId,
      userId,
      payload: {
        storyId,
        value,
        confidence
      }
    });
  }

  function clearEstimate(roomId, userId, storyId) {
    return sendCommand({
      name: 'clearStoryEstimate',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function newRound(roomId, userId, storyId) {
    return sendCommand({
      name: 'newEstimationRound',
      roomId,
      userId,
      payload: {
        storyId
      }
    });
  }

  function setCardConfig(roomId, userId, cardConfig) {
    return sendCommand({
      name: 'setCardConfig',
      roomId,
      userId,
      payload: {
        cardConfig
      }
    });
  }

  function toggleAutoReveal(roomId, userId) {
    return sendCommand({
      name: 'toggleAutoReveal',
      roomId,
      userId,
      payload: {}
    });
  }

  function setPassword(roomId, userId, password) {
    return sendCommand({
      name: 'setPassword',
      roomId,
      userId,
      payload: {
        password
      }
    });
  }
}
