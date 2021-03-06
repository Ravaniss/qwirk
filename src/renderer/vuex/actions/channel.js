import * as types from '../mutation-types';
export const setServer = (state, server) => {
    state.commit(types.SET_SERVER, server);
};
export const upWaitMsg = (state, server) => {
    state.commit(types.UP_WAIT_MESSAGE, server);
};
export const setServers = (state, servers) => {
    state.commit(types.SET_SERVERS, servers);
};
export const setChannel = (state, channel) => {
    state.commit(types.SET_CHANNEL, channel);
};
