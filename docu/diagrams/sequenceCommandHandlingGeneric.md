sequenceDiagram
  autonumber
  participant PoinZ.Client
  participant PoinZ.Backend
  PoinZ.Client->>+PoinZ.Backend: command
  Note right of PoinZ.Backend: Validation. Is it a known command. Does the command match the schema.
  Note right of PoinZ.Backend: CommandHandler produces 1-N events
  Note right of PoinZ.Backend: EventHandlers modify room
  Note right of PoinZ.Backend: Events are broadcasted to all users in room
  PoinZ.Backend->>PoinZ.Client: event1
  PoinZ.Backend-->>-PoinZ.Client: event2
