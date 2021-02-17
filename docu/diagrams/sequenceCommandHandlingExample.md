sequenceDiagram
  autonumber
  participant PoinZ.Client
  participant PoinZ.Backend
  PoinZ.Client->>+PoinZ.Backend: setUsername
  Note right of PoinZ.Backend: Validation of command schema
  Note right of PoinZ.Backend: CommandHandler produces "usernameSet" event
  Note right of PoinZ.Backend: EventHandler modifies room (sets new username)
  Note right of PoinZ.Backend: "usernameSet" event is broadcasted to all users in room
  PoinZ.Backend->>-PoinZ.Client: usernameSet
