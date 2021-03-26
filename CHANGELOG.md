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
