const landingPage = require('./pages/landingPage');

describe('mutliUser Join Room', () => {
  const additionalJoinerCount = 3;
  const ourNewBrowsers = [];

  beforeEach(async () => {
    for (let nb = 0; nb < additionalJoinerCount; nb++) {
      const newBrowser = browser.forkNewDriverInstance();
      await newBrowser.waitForAngularEnabled(false);
      newBrowser.ignoreSynchronization = true;
      ourNewBrowsers.push(newBrowser);
    }
  });

  afterEach(async () => {
    ourNewBrowsers.forEach((brws) => brws.quit());
  });

  it('Multiple users join same room', async () => {
    // first a room must exist...
    await landingPage.goTo();
    await landingPage.createRoomAndSetOwnUsername('creator');
    // now get assigned (random, unique) roomId from url
    const url = await browser.getCurrentUrl();
    const roomId = url.substring(url.lastIndexOf('/') + 1);

    ourNewBrowsers.forEach((newBrowser, index) => {
      join(newBrowser, 'joiner_' + index);
    });

    // const appRoot = element(by.id('app-root'));
    // testUtils.saveScreenShotOf(appRoot, 'multiUser.joinRoom.png')

    // now check if initial browser (creator) sees all other users
    element.all(by.css('.users .user')).then((items) => {
      expect(items.length).toBe(additionalJoinerCount + 1); // creator plus additionalJoinerCount
    });

    async function join(browserInstance, username) {
      browserInstance.get('/' + roomId);
      await landingPage.enterOwnUsername(username, browserInstance);
    }
  });
});
