/**
 *
 * most of these patterns will be checked on every key typed in an input field.
 * make sure to not enforce a min-length (otherwise input fields cannot be cleared)
 *
 *
 * All commands are validated on the backend.
 *
 */

export const USERNAME_REGEX = /^.{0,80}$/;
export const EMAIL_REGEX = /^[-a-zA-Z0-9._@*]{0,245}$/;
export const ROOM_ID_REGEX = /^[-a-z0-9_]*$/;
export const STORY_TITLE_REGEX = /^.{0,100}$/;
export const STORY_DESCRIPTION_MAX_LENGTH = 2000;
