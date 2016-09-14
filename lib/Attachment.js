/**
 * Dimensions.
 * @typedef {object} Dimensions
 * @property {!number} height
 * @property {!number} width
 */

/**
 * Media.
 * @typedef {object} Media
 * @property {!string} url Absolute URL pointing to the media source.
 * @property {!string} type e.g. "audio", "image", "video".
 * @property {?Dimensions} size Natural dimensions of the media.
 */

/**
 * A media attachment.
 * @mixes Media
 * @typedef {object} Attachment
 * @property {?string} id A UUID
 */
