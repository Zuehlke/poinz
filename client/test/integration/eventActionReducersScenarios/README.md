# eventActionReducer Scenario Tests

Our react client application handles backend-sent events like "roomJoined" or "storyAdded". They are transformed into
redux actions and reduced by the "eventReducer" (**client/app/services/reducers/eventReducer.js**).

In order to test the correct reducing of these events to the redux store, we decided to not unit-test every single
reducer but to choose a more "real-life" approach by reducing a series of events (called "scenarios").

To make sure, that the test-input (series of events) is valid/correct/up-2-date, there is a backend system test that
produces these scenarios and stores them as json files.

See **server/test/integration/eventReducerScenarioGeneratorTest.js**
