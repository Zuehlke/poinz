/**
 * As of cypress 10.x the "run all spec" button was removed.
 * As a workaround, we import all test files here
 *
 * https://glebbahmutov.com/blog/run-all-specs-cypress-v10/
 * https://glebbahmutov.com/blog/run-all-specs/
 */
import './appStatus.cy';
import './backlogModification.cy';
import './changeRoomSettings.cy';
import './changeUserSettings.cy';
import './estimateStory.cy';
import './exportStories.cy';
import './joinNewRandomRoom.cy';
import './joinPasswordProtectedRoom.cy';
import './mobileMenuToggling.cy';
import './multiUser.cy';
