import {joinIfReady} from '../../src/state/actions/commandActions';
import initialState from '../../src/state/initialState';
import rootReducer from '../../src/state/rootReducer';

test('joinIfReady: no presets in state: first username then roomId', () => {
  let state = initialState();
  const mockDispatch = jest.fn((action) => {
    state = rootReducer(state, action);
  });
  const mockSendCommand = jest.fn();
  const mockGetState = jest.fn(() => state);

  joinIfReady({username: 'Jimmy'})(mockDispatch, mockGetState, mockSendCommand);
  expect(mockDispatch.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls.length).toBe(0);

  joinIfReady({roomId: 'super-room'})(mockDispatch, mockGetState, mockSendCommand);
  expect(mockDispatch.mock.calls.length).toBe(2);
  expect(mockSendCommand.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls[0][0]).toEqual({
    name: 'joinRoom',
    payload: {
      username: 'Jimmy'
    },
    roomId: 'super-room'
  });
});

test('joinIfReady: no presets in state: first roomId then username', () => {
  let state = initialState();
  const mockDispatch = jest.fn((action) => {
    state = rootReducer(state, action);
  });
  const mockSendCommand = jest.fn();
  const mockGetState = jest.fn(() => state);

  joinIfReady({roomId: 'super-room'})(mockDispatch, mockGetState, mockSendCommand);
  expect(mockDispatch.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls.length).toBe(0);

  joinIfReady({username: 'Jimmy'})(mockDispatch, mockGetState, mockSendCommand);
  expect(mockDispatch.mock.calls.length).toBe(2);
  expect(mockSendCommand.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls[0][0]).toEqual({
    name: 'joinRoom',
    payload: {
      username: 'Jimmy'
    },
    roomId: 'super-room'
  });
});

test('joinIfReady: username & userId preset in state:  ', () => {
  let state = initialState();

  // let's set a username in state (would be from localstorage)
  state.joining.userdata.username = 'Johnny';
  state.joining.userdata.userId = 'user-id-johnny';

  const mockDispatch = jest.fn((action) => {
    state = rootReducer(state, action);
  });
  const mockSendCommand = jest.fn();
  const mockGetState = jest.fn(() => state);

  joinIfReady({roomId: 'super-room'})(mockDispatch, mockGetState, mockSendCommand);
  expect(mockDispatch.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls.length).toBe(1);
  expect(mockSendCommand.mock.calls[0][0]).toEqual({
    name: 'joinRoom',
    payload: {
      username: 'Johnny'
    },
    roomId: 'super-room',
    userId: 'user-id-johnny'
  });
});
