import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

test('Should produce cardConfigSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();

  const customCc = [
    {label: '?', value: -2, color: '#bdbfbf'},
    {label: '1/2', value: 0.5, color: '#667a66'}
  ];

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setCardConfig',
      payload: {
        cardConfig: customCc
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'cardConfigSet');

    const [cardConfigSetEvent] = producedEvents;

    expect(cardConfigSetEvent.payload.cardConfig).toEqual(customCc);
    expect(room.cardConfig).toEqual(customCc);
  });
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
