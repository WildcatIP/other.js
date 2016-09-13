/**
 * A message.
 * @typedef {object} Message
 * @property {?string} avatarUrl URL of the avatar image.
 * @property {?Attachment[]} attachments Array of attachments objects.
 * @property {?string} format String indicating message format (e.g. "markdown").
 * @property {?string} identityId UUID of the sender's identity encoded as a
 *     base-16 string.
 * @property {?string} text Plain text of the message.
 * @property {?double} time Sent timestamp. Used as a unique identifier.
 */