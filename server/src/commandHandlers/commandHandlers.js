import addStory from './addStory';
import changeStory from './changeStory';
import deleteStory from './deleteStory';
import trashStory from './trashStory';
import restoreStory from './restoreStory';
import importStories from './importStories';
import clearStoryEstimate from './clearStoryEstimate';
import giveStoryEstimate from './giveStoryEstimate';
import settleEstimation from './settleEstimation';
import joinRoom from './joinRoom';
import kick from './kick';
import leaveRoom from './leaveRoom';
import newEstimationRound from './newEstimationRound';
import reveal from './reveal';
import selectStory from './selectStory';
import setUsername from './setUsername';
import setEmail from './setEmail';
import setAvatar from './setAvatar';
import toggleExclude from './toggleExclude';
import setCardConfig from './setCardConfig';
import setPassword from './setPassword';
import setRoomConfig from './setRoomConfig';

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
  setPassword
};

/**
 * The other command schemas reference this base schema.
 * Thus every command must also adhere to these properties...
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
