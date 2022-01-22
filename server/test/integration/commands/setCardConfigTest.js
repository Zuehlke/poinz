import uuid from '../../../src/uuid';
import {prepOneUserInOneRoom} from '../../unit/testUtils';

test('Should produce cardConfigSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const customCc = [
    {label: '?', value: -2, color: '#bdbfbf'},
    {label: '1/2', value: '0.5', color: '#667a66'}, // <<-  allow strings representing a number (can be parsed to a number)
    {label: '1', value: '1', color: '#667a66'} // <<-  allow strings representing a number (can be parsed to a number)
  ];

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setCardConfig',
      payload: {
        cardConfig: customCc
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'cardConfigSet');

  const [cardConfigSetEvent] = producedEvents;

  const sanitizedConfig = [
    {label: '?', value: -2, color: '#bdbfbf'},
    {label: '1/2', value: 0.5, color: '#667a66'}, // we expect that the "value" properties are numbers, no longer strings
    {label: '1', value: 1, color: '#667a66'}
  ];

  expect(cardConfigSetEvent.payload.cardConfig).toEqual(sanitizedConfig);
  expect(room.cardConfig).toEqual(sanitizedConfig);
});

test('Should use defaultCardConfig if empty array in command (reset)', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setCardConfig',
      payload: {
        cardConfig: []
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'cardConfigSet');

  const [cardConfigSetEvent] = producedEvents;

  expect(cardConfigSetEvent.payload.cardConfig.length).toBe(12);
});

describe('preconditions', () => {
  test('Should throw if given cardConfig is not an array', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setCardConfig',
          payload: {
            cardConfig: {}
          }
        },
        userId
      )
    ).rejects.toThrow(
      'Command validation Error during "setCardConfig": Invalid type: object (expected array) in /payload/cardConfig'
    );
  });

  test('Should throw if given cardConfig is not valid', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'setCardConfig',
          payload: {
            cardConfig: [{invalid: '45343'}]
          }
        },
        userId
      )
    ).rejects.toThrow(/Command validation Error during "setCardConfig"/g); // do not check for specific message. format validator is unit tested
  });
});
