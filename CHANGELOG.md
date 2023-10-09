### 0.20.2: 2023-10-09

* Fix "Fork me on GitHub" Ribbon

### 0.20.1: 2023-09-30

* Bugfix

### 0.20.0: 2023-09-30

* Sorting of stories in estimation matrix (#370)
* Dependencies updated

### 0.19.1: 2023-08-25

* Show stories without estimation in most-left column in estimation matrix (#364)
* Dependencies updated

### 0.19.0: 2023-07-01

* Stories import from json file (#358)
* Backlog toolbar always shown (filter, sort, dropdown menu)
* File upload button in backlog dropdown menu
* Dependencies updated

### 0.18.4: 2023-05-29

* Dependencies updated

### 0.18.3: 2023-03-19

* Fixed some issues with editor for custom card configuration
* Dependencies updated

### 0.18.2: 2023-02-11

* Renamed all occurences of "PoinZ" to "Poinz"
* Dependencies updated

### 0.18.1: 2023-01-15

* Fix for favicon not working: webmanifest file was not copied during build (#309)

### 0.18.0: 2023-01-12

* preserve "story-key" when importing stories from an external tool via csv (#323)
* split build process into two parts (extracted building docker image to separate build step) (#317)
* dependencies updated

### 0.17.6: 2022-12-06

* (more) seasonal easter eggs
* dependencies updated

### 0.17.5: 2022-11-19

* dependencies updated
* switched to ESM in backend

### 0.17.4: 2022-09-18

* dependencies updated

### 0.17.3: 2022-07-09

* Changed background on landing page
* dependencies updated

### 0.17.2: 2022-06-16

* Minor fixes for custom card config editor
* dependencies updated

### 0.17.1: 2022-05-22

* Fix a bug where username change was not correctly persisted (#275)
* Persist custom backlog width to local storage
* Story points in imported stories stored as consensus (#264)
* dependencies updated (react 18)

### 0.17.0: 2022-04-15

* Manual sorting of stories in backlog via drag'n'drop  (#252)
* Backlog resizable: Width of backlog can be set with mouse (#265)
* dependencies updated

### 0.16.0: 2022-03-30

* Introduce Drag'n'Drop of stories in the estimation matrix. Stories can be dragged to other columns in order to "settle" on a new value.
* Remember "Include Trashed Stories" flag in estimation matrix
* Technical improvement: do not allow users to join without username. joinCommand is sent after collecting username from user.
* dependencies updated

### 0.15.2: 2022-02-09

* Introduce new set of avatars (more variety, gender-neutral, cute animals)
* Password improvements: password repeat field in room settings to prevent typos. Remove password field on landing page.
* dependencies updated

### 0.15.1: 2022-02-01

* Fix a bug that prevented users from clearing their current estimate
* UI Tweaking for mobile devices (smaller user avatars and cards)
* Switched to node.js 16 LTS
* dependencies updated

### 0.15.0: 2022-01-30

* Markdown support in story description (#233, thanks for the suggestion @martin-sos)
* Estimation Matrix that gives an overview of all estimated stories in your room (#234, thanks for the suggestion @martin-sos)

### 0.14.0: 2022-01-23

* Link imported stories to issue tracking system
* Unused rooms will now be kept for two months instead of one
* Replace uuidv4 with nanoid
* Dependencies updated

### 0.13.4: 2022-01-06

* New function in the active Backlog: Move all (visible) stories to the trash
* Various smaller bugfixes
* Dependencies updated

### 0.13.3: 2021-11-21

* Halloween Easter Egg fixed
* Dependencies updated

### 0.13.0: 2021-10-03

* Confidence Levels : Allow users in the room to specify how confident they are when estimating a story (#178, thanks to @gotdibbs and @gvheertum)

### 0.12.0: 2021-09-17

* Display "Recommendation" in Estimation Summary: the first card that is larger than the numerical average. Eexcept numerical average is within 10% of the lower card. (#207, thanks to @ecaron)
* You can now settle for any card. (Previously, only cards that were chosen by at least one user were possible settle values).
* Dependencies updated

### 0.11.6: 2021-09-04

* Moved "New Round" button to the right. This prevents accidentally starting a new round, when clicking "Reveal" (#206, thanks to @ecaron)
* Added autocomplete attribute to name input fields. Should prevent browsers from suggesting credit card numbers (#205, thanks to @ecaron)
* Dependencies updated

### 0.11.5: 2021-08-28

* Modify "quick menu" on user's avatar: add option to quickly toggle "spectator" mode (exclude from estimations).
* All users can now mark all other users as spectator.

### 0.11.4: 2021-08-09

* Ignore negative card values in calculating the "numerical average" (#192)
* Dependencies updated

### 0.11.3: 2021-05-08

* Dependencies updated

### 0.11.2: 2021-03-26

* Fix link to manual in auto-generated story (thanks to @kratz00)

### 0.11.1: 2021-03-21

* Display story creation date in backlog
* UI tweaks: Wider Settings Panel on the right. Display own user's avatar in Top Bar. Custom (thin) scrollbars.
* Dependencies updated

### 0.11.0: 2021-03-16

* New feature "settle": if story is revealed but no consensus is reached, you can choose one card as the consensus value for the story
* Estimation Summary shows numerical average
* Small styling improvements in Estimation Summary
* Room export now contains consensus value explicitly

### 0.10.1: 2021-03-11

* Mark stories in backlog that were estimated, but without consensus
* Frontend refactoring of redux state + reducers
* Updated dependencies

### 0.10.0: 2021-02-06

* Estimation Summary: After a story is revealed, show how many users estimated, which cards were used and how often. (thanks to @gotdibbs for the suggestion)
* If a new room is created, a default sample story is already added automatically. This allows to start estimating right away. (thanks to @gotdibbs for the suggestion)
* Added additional sorting option in backlog:  stories with consensus first vs. stories without consensus first
* Updated dependencies

### 0.9.1: 2021-01-30

* Sorting and filtering of stories in backlog
* Improvements for password protected rooms

### 0.9.0: 2021-01-24

* Optional password protection for rooms

### 0.8.6: 2020-12-28

* Updated dependencies
* Switched to node.js 14 LTS

### 0.8.5: 2020-12-12

* Support for old (non chromium) Windows Edge
* Updated dependencies (some fixes needed for new socket.IO version)

### 0.8.4: 2020-11-08

* Fetch backend room state on certain command rejections
* Rejoin room on socket re-connect
* Visual editor for card configuration

### 0.8.3: 2020-10-31

* Handle whitespace in custom room ids gracefully. They are now replaced with dashes.
* Updated dependencies

### 0.8.2: 2020-10-27

* Added "Help" view to the right-hand sidebar
* Extended user manual

### 0.8.1: 2020-10-25

* Clicking a story in the Backlog no longer selects the story for estimation! 
* Introduced button to jump to the next story (i.e. select it for estimation).
* Added changelog
* Added user manual (first few use cases)

### 0.8.0: 2020-10-24

* Added option to disable auto reveal. This is a room-wide setting. Auto reveal is still "on" per default. 
* Fixed a bug where the consensus badge was not correctly displayed if the card configuration had a card with value=0.
* Renamed "UserMenu" to "Settings": Split Settings into user-related and room-related configuration options.
