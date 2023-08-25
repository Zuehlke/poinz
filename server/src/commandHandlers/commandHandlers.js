import addStory from './addStory.js';
import changeStory from './changeStory.js';
import deleteStory from './deleteStory.js';
import trashStory from './trashStory.js';
import restoreStory from './restoreStory.js';
import importStories from './importStories.js';
import clearStoryEstimate from './clearStoryEstimate.js';
import giveStoryEstimate from './giveStoryEstimate.js';
import settleEstimation from './settleEstimation.js';
import joinRoom from './joinRoom.js';
import kick from './kick.js';
import leaveRoom from './leaveRoom.js';
import newEstimationRound from './newEstimationRound.js';
import reveal from './reveal.js';
import selectStory from './selectStory.js';
import setUsername from './setUsername.js';
import setEmail from './setEmail.js';
import setAvatar from './setAvatar.js';
import toggleExclude from './toggleExclude.js';
import setCardConfig from './setCardConfig.js';
import setPassword from './setPassword.js';
import setRoomConfig from './setRoomConfig.js';
import setSortOrder from './setSortOrder.js';
import setStoryValue from './setStoryValue.js';

export default {
  addStory,
  changeStory,
  deleteStory,
  trashStory,
  restoreStory,
  importStories,
  clearStoryEstimate,
  giveStoryEstimate,
  settleEstimation,
  joinRoom,
  kick,
  leaveRoom,
  newEstimationRound,
  reveal,
  selectStory,
  setUsername,
  setEmail,
  setAvatar,
  toggleExclude,
  setCardConfig,
  setRoomConfig,
  setPassword,
  setSortOrder,
  setStoryValue
};

/**
 * The other command schemas reference this base schema.
 * Thus, every command must also adhere to these properties...
 */
export const baseCommandSchema = {
  id: 'command',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1
    },
    userId: {
      type: 'string',
      format: 'uuid'
    },
    name: {
      type: 'string',
      minLength: 1
    },
    roomId: {
      type: 'string',
      minLength: 1,
      format: 'roomId'
    },
    payload: {
      type: 'object'
    }
  },
  required: ['id', 'roomId', 'name', 'payload'],
  additionalProperties: false
};
