expect.extend({
  /**
   * custom jest matcher to check events produced by the commandProcessor
   *
   * ```
   *  expect(producedEvents).toMatchEvents(commandId, roomId, 'eventNameOne', 'eventNameTwo');
   * ```
   * @param received  The object/value under test
   * @param expectedCommandId
   * @param expectedRoomId
   * @param eventNames
   */
  toMatchEvents(received, expectedCommandId, expectedRoomId, ...eventNames) {
    if (!received) {
      return {
        pass: false,
        message: () =>
          'Expected producedEvents to be defined\n' +
          `  Received: ${this.utils.printReceived(received)}`
      };
    }

    if (!Array.isArray(received)) {
      return {
        pass: false,
        message: () =>
          'Expected producedEvents to be an array\n' +
          `  Received: ${this.utils.printReceived(received)}`
      };
    }

    if (received.length !== eventNames.length) {
      return {
        pass: false,
        message: () =>
          `Expected producedEvents to contain ${eventNames.length} event(s)\n` +
          `  Expected: ${this.utils.printExpected(eventNames.length)}  (${eventNames.join(
            ', '
          )})\n` +
          `  Received: ${this.utils.printReceived(received.length)}  (${received
            .map((re) => re.name)
            .join(', ')})`
      };
    }

    const eventTestResultsNotPassed = eventNames
      .map(testSingleEvent.bind(this))
      .filter((tr) => !!tr);

    if (eventTestResultsNotPassed.length > 0) {
      return eventTestResultsNotPassed[0];
    }

    // the happy case, all checks successful
    return {
      pass: true,

      // message in case of expect(...).not.toMatchEvents
      message: () =>
        `Expect ${
          received.length
        } producedEvents not to match your specifications: \n${JSON.stringify(
          {commandId: expectedCommandId, roomId: expectedRoomId, eventNames},
          null,
          4
        )}\nBut they did.`
    };

    /**
     * checks a single event: name, correlationId, roomId
     */
    function testSingleEvent(expectedEventName, index) {
      if (received[index].name !== expectedEventName) {
        return {
          pass: false,
          message: () =>
            `Expected name of producedEvent[${index}] to match\n` +
            `  Expected: ${this.utils.printExpected(expectedEventName)}\n` +
            `  Received: ${this.utils.printReceived(received[index].name)}`
        };
      }

      if (received[index].correlationId !== expectedCommandId) {
        return {
          pass: false,
          message: () =>
            `Expected correlationId of producedEvent[${index}] ("${expectedEventName}") to match\n` +
            `  Expected: ${this.utils.printExpected(expectedCommandId)}\n` +
            `  Received: ${this.utils.printReceived(received[index].correlationId)}`
        };
      }

      if (received[index].roomId !== expectedRoomId) {
        return {
          pass: false,
          message: () =>
            `Expected roomId of producedEvent[${index}] ("${expectedEventName}") to match\n` +
            `  Expected: ${this.utils.printExpected(expectedRoomId)}\n` +
            `  Received: ${this.utils.printReceived(received[index].roomId)}`
        };
      }

      if (typeof received[index].payload !== 'object') {
        return {
          pass: false,
          message: () =>
            `Expected payload of producedEvent[${index}] ("${expectedEventName}") to be of type "object"\n` +
            `  Expected: ${this.utils.printExpected('object')}\n` +
            `  Received: ${this.utils.printReceived(typeof received[index].payload)}`
        };
      }

      return undefined;
    }
  }
});
