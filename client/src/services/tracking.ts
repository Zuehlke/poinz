import posthog from 'posthog-js';
import {
  RoomSettingsChangedEvent,
  StoryCreatedEvent,
  StoryEditedEvent,
  StoryTrashedEvent,
  StoryRestoredEvent,
  MatrixViewToggledEvent,
  RoomEvent
} from './tracking.types';

export const trackRoomSettingsChanged = (data: RoomSettingsChangedEvent) => {
  posthog.capture('room_settings_changed', data);
};

export const trackStoryCreated = (data: StoryCreatedEvent) => {
  posthog.capture('story_created', data);
};

export const trackStoryEdited = (data: StoryEditedEvent) => {
  posthog.capture('story_edited', data);
};

export const trackStoryTrashed = (data: StoryTrashedEvent) => {
  posthog.capture('story_trashed', data);
};

export const trackStoryRestored = (data: StoryRestoredEvent) => {
  posthog.capture('story_restored', data);
};

export const trackMatrixViewToggled = (data: MatrixViewToggledEvent) => {
  posthog.capture('matrix_view_toggled', data);
}; 

export const trackNewEstimationRound = (data: RoomEvent) => {
  posthog.capture('new_estimation_round', data);
};