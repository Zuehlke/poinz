import authenticatorFactory from '../../src/auth/authenticator';

const mockStore = {
  getAppConfig: async function getAppConfig() {
    return {
      githubAuthClientId: 'mock-value',
      githubAuthSecret: 'mock-value'
    };
  }
};
test('should throw on invalid github code', async () => {
  const auth = await authenticatorFactory(mockStore);

  return expect(auth.requestJWT('1234')).rejects.toThrow(/Invalid/g);
});
