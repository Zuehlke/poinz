erDiagram
  Command }|--|{ Event : produces
  Command {
    string id
    string userId
    string roomId
    string name
    object payload
  }
  Event {
    string id
    string userId
    string correlationId
    string roomId
    string name
    object payload
  }
