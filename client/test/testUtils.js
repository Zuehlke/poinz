export const EXPECT_UUID_MATCHING = expect.stringMatching(
  new RegExp(
    /^([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[-a-z0-9_]{21})$/ // match "old" uuidv4 (lowercase) and "new" nanoid with custom alphabet (no uppercase letters)
  )
);
