/**
 * Defines the ActiveSessions Map type
 * @typedef {Object} ActiveSessions
 */

type UUID = string;

export type ActiveSessions = Map<UUID, AuthDetails>;
