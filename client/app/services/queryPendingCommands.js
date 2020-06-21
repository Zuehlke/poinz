export function hasMatchingPendingCommand(state, commandName) {
  return !!getMatchingPendingCommand(state, commandName);
}

export function getMatchingPendingCommand(state, commandName) {
  if (state.pendingCommands) {
    return Object.values(state.pendingCommands).find((cmd) => cmd.name === commandName);
  } else {
    return undefined;
  }
}

export function getAllMatchingPendingCommands(state, commandName) {
  if (state.pendingCommands) {
    return Object.values(state.pendingCommands).filter((cmd) => cmd.name === commandName);
  } else {
    return [];
  }
}
