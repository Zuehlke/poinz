# PoinZ user manual

This page gives you an overview on the features and most common use cases.

## Table of Contents

* [PoinZ user manual](#poinz-user-manual)
  * [Table of Contents](#table-of-contents)
  * [The Board](#the-board)
  * [Joining and leaving rooms](#joining-and-leaving-rooms)
     * [Joining a room](#joining-a-room)
     * [Leaving a room](#leaving-a-room)
     * [Removing other users from the room](#removing-other-users-from-the-room)
  * [The Story Backlog](#the-story-backlog)
     * [Adding stories](#adding-stories)
     * [Editing stories](#editing-stories)
     * [Trashing stories](#trashing-stories)
  * [Estimating](#estimating)

## The Board

The board contains the [**Backlog**](#the-story-backlog) (list of stories on the left). The **Estimation Area**, where we see all users in the room as well as the currently selected story (in the middle). Optionally the **Settings** menu or the **Action Log** on the right.

![The Board](https://user-images.githubusercontent.com/1777143/97100788-84ded180-1697-11eb-9737-6ef82b5fc73b.png)

## Joining and leaving rooms

### Joining a room

You can join a room in three different ways

1. Visit the [landing page](https://poinz.herokuapp.com/) and click the big button **"Join new room"**. You will join a new room with a randomly assigned unique room id.
2. Visit the [landing page](https://poinz.herokuapp.com/), extend the form and enter a custom room name, then hit Enter or click the join button. If the room with this custom name (the room id) already exists, you will join it. Otherwise a new room is created.
3. Join a room directly by visiting the room url. (e.g. https://poinz.herokuapp.com/test   or  https://poinz.herokuapp.com/a-random-room-id-here). If the room with this name/id already exists, you will join it. Otherwise a new room is created.

![Join Room Form](https://user-images.githubusercontent.com/1777143/97100613-89a28600-1695-11eb-9d03-94a482cc0678.png)

### Leaving a room

You can leave a room by clicking the **leave** button in the top right corner. If you close your browser window or tab while you are in a room, other users will see you as "disconnected".

![TopBar Quick Menu](https://user-images.githubusercontent.com/1777143/97100648-dd14d400-1695-11eb-88ac-53540c09608d.png)
![Disconnected Users](https://user-images.githubusercontent.com/1777143/97101301-94144e00-169c-11eb-9dc8-bfc5ed949c6a.png)

### Removing other users from the room

You can remove ("kick") other users from the room:

1. First click on the avatar of the user
2. Click on the **leave** button on the right to kick the user. If you click the **cross** on the left, you cancel the action and the user stays in the room.


![Kick User](https://user-images.githubusercontent.com/1777143/97100674-4b599680-1696-11eb-94a0-892d65e43219.png)


## The Story Backlog

The story backlog contains all stories added or imported to your room. The story currently selected for estimation is marked with a **orange bar** on the left.

### Adding stories

1. Simply fill in the form on the top left. The *Title* is mandatory, the *Description* is optional. 
2. Drag and Drop a csv file with stories (e.g. an export from Jira) on to the backlog

### Editing stories

Hover a story in the backlog (or tap the story on your mobile device), in order to see a button with a **pencil** icon on the top right. Click on the pencil to enter the edit mode.
You can edit the title and the description of the story and save or discard your changes.

![Edit Story](https://user-images.githubusercontent.com/1777143/97101051-3c74e300-169a-11eb-8fce-6d0495421229.png)
![Edit Story Form](https://user-images.githubusercontent.com/1777143/97101074-75ad5300-169a-11eb-96a0-d50ce8543040.png)

### Trashing stories

Hover a story in the backlog (or tap the story on your mobile device), in order to see a button with a **trash can** icon on the top right. Click on the trash can to move the story to the trash.
Switch to the list of trashed stories by clicking on **Trash (N)** on the top of the Backlog. You can **restore** a trashed story or **delete it permanently**!


## Estimating

Only a single story can be estimated at a given time.
 
1. Click the story you want to estimate in the **Backlog** and click the blue **Estimate** button.
2. The board now shows the selected story. All users see the same story selected on the board.
3. Estimate the story by clicking one of the cards.
4. By default, the given estimates are *revealed* as soon as all active users did estimate. This behaviour can be changed in the settings (Auto Reveal).

If all users estimated the same value, *consensus* is achieved and the story will display a colored *badge*.

![consensus](https://user-images.githubusercontent.com/1777143/97101160-4ba86080-169b-11eb-997d-57b5648e6ff8.png)

### Manually reveal estimates

You can *reveal* the story at any time by clicking the blue **Reveal** button. Even if not all users in the room did estimate. All given estimates are shown.

![reveal](https://user-images.githubusercontent.com/1777143/97101241-08022680-169c-11eb-97de-9a27244c3dca.png)

### New Round

After the story was revealed (automatically or manually) you can start a New round by clicking the blue **new Round** button.
All previously given estimates on the currently selected story are erased and your team can start estimating again.

![new round](https://user-images.githubusercontent.com/1777143/97101245-0e909e00-169c-11eb-81f5-80a0c094014c.png)
