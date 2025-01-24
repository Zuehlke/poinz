export const getJoinUserdata = (state) => state.joining.userdata;

export const getJoinRoomId = (state) => state.joining.roomId;

export const getPendingJoinCommandId = (state) => state.joining.pendingJoinCommandId;

export const hasJoinFailedAuth = (state) => !!state.joining.authFailed;
