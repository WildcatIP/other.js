/**
 * A message.
 * @typedef {object} Message
 * @property {?string} avatarUrl URL of the avatar image.
 * @property {?Object.<string, Attachment>} attachments Mapping of UUID to
 *     attachment objects.
 * @property {?string} format String indicating message format (e.g. "markdown").
 * @property {?string} identityId UUID of the sender's identity encoded as a
 *     base-16 string.
 * @property {?string} text Plain text of the message.
 * @property {?double} time Sent timestamp. Used as a unique identifier.
 * @property {?Object[]} entities A list of entities that apply to the message.
 *     Each entity consists of the |start| and |length| of the range to which it
 *     applies as well as the entity's |id| and whether it |isIdentity|.
 */
