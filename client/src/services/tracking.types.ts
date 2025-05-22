export interface RoomEvent {
  roomId: string;
}

export interface RoomSettingsChangedEvent extends RoomEvent {
  setting: 'confidence' | 'autoReveal' | 'password' | 'issueTracking';
  newValue: boolean | string;
}

export interface StoryEvent extends RoomEvent {
  storyId: string;
}

export interface StoryCreatedEvent extends StoryEvent {
  hasDescription: boolean;
  descriptionLength: number;
}

export interface StoryEditedEvent extends StoryEvent {
  fieldChanged: 'title' | 'description' | 'both';
}

export interface StoryTrashedEvent extends StoryEvent {
  hadConsensus: boolean;
  storyLifetimeMinutes: number;
}

export interface StoryRestoredEvent extends StoryEvent {
  timeInTrashMinutes: number;
}

export interface MatrixViewToggledEvent extends RoomEvent {
  totalStories: number;
}
