import {promises as fs} from 'fs';
import path from 'path';
import * as url from 'url';

import parseJsonDataUrlToStories from '../../src/commandHandlers/parseJsonDataUrlToStories.js';

import {EXPECT_UUID_MATCHING, textToJsonDataUrl} from '../testUtils.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

test('parse json file', async () => {
  const jsonContent = await fs.readFile(
    path.join(__dirname, '../testPoinzJsonExport.json'),
    'utf-8'
  );
  const dataUrl = textToJsonDataUrl(jsonContent);

  const stories = parseJsonDataUrlToStories(dataUrl);

  expect(stories).toBeDefined();
  expect(stories.length).toBe(3);

  expect(stories[0]).toMatchObject({
    storyId: EXPECT_UUID_MATCHING,
    title: 'Welcome to your Poinz room!'
  });

  expect(stories[0].estimations).toEqual({});

  expect(stories[1]).toMatchObject({
    storyId: EXPECT_UUID_MATCHING,
    consensus: 3,
    title: 'Second story'
  });

  expect(stories[2]).toMatchObject({
    storyId: EXPECT_UUID_MATCHING,
    title: 'Story that was trashed',
    trashed: true
  });

  expect(stories[2].estimations).toEqual({});
});
