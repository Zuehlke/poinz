import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoom} from '../testUtils';

test('Should produce usernameSet event', async () => {
  const {processor, roomId, userId} = await prepOneUserInOneRoom();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setUsername',
      payload: {
        username: 'John Doe'
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'usernameSet');

    const [usernameSetEvent] = producedEvents;

    expect(usernameSetEvent.payload.username).toEqual('John Doe');
    expect(usernameSetEvent.userId).toEqual(userId);

    expect(room.users[userId].username).toEqual('John Doe');
  });
});
