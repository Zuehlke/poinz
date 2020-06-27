import {promises as fs} from 'fs';
import path from 'path';
import parseToStories from '../../src/commandHandlers/storyImportParser';
import {EXPECT_UUID_MATCHING} from './testUtils';

test('parse real jira csv', async () => {
  const csvContent = await fs.readFile(path.join(__dirname, './testJiraIssueExport.csv'), 'utf-8');
  const base64data = Buffer.from(csvContent).toString('base64');
  const dataUrl = 'data:text/csv;base64,' + base64data;

  const stories = parseToStories(dataUrl);

  expect(stories.length).toBe(4);

  expect(stories[0]).toMatchObject({
    description: 'His account can be deactivated end of July.',
    estimations: {},
    id: EXPECT_UUID_MATCHING,
    title: 'SMRGR-6275 Something something Summary'
  });
  expect(stories[1]).toMatchObject({
    description: 'Hi Test,',
    estimations: {},
    id: EXPECT_UUID_MATCHING,
    title: 'SMRGR-3672 Delete Users'
  });
  expect(stories[2]).toMatchObject({
    description: `Dear test,

May sdgs.

Local Time 6:57 pm
Wednesday, 4 March 2020 (GMT+11)
Time in Canberra ACT, Australia
(Our actual local time is 3:57pm same as Perth only)

Sdgsdgsdg

Much appreciated! =)`,
    estimations: {},
    id: EXPECT_UUID_MATCHING,
    title: 'SMRGR-2643 timezone from AWST to HKT/SGT '
  });
  expect(stories[3]).toMatchObject({
    description: `Use cases:
 * sssss
 * sdgsdgsg

Steps to reproduce:
 * sdhgfhdhfdh

Dsfh`,
    estimations: {},
    id: EXPECT_UUID_MATCHING,
    title: 'SMRGR-2151 Optimize messages'
  });
});
