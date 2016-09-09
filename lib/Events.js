export const ADD_MESSAGE = 'ADD_MESSAGE'
export const SET_CHAT_COMPLETE_RESULTS = 'SET_CHAT_COMPLETE_RESULTS'
export const SET_STAGED_MESSAGE = 'SET_STAGED_MESSAGE'
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES'
export const UPDATE_STAGED_MESSAGE = 'UPDATE_STAGED_MESSAGE'

/**
 * An asynchronous message which may be associated with another message.
 *
 * In order to ensure a responsive architecture, all other.js events are
 * asynchronous. However, it's often useful to treat messages as replies to
 * other messages. To accomplish this, tagged messages may contain a unique
 * identifier that other messages may refer to.
 *
 * @mixin
 * @event TAGGED_MESSAGE
 * @property {?Number} tag - A number that uniquely identifies this message.
 * @property {?Number} replyTag - The tag of another message to which this message
 *     replies.
 */
