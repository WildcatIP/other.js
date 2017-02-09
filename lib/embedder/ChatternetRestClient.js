export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'
export const IDENTITY_EXPIRED_ERROR = 'IDENTITY_EXPIRED_ERROR'

/**
 * A client for courier's stateless Chatternet REST API.
 *
 * @see https://github.com/other-xyz/courier
 * @see http://docs.internal.oregon.theother.io:3009/
 */
class ChatternetRestClient {
  constructor(
    extraFetchHeaders,
    host = process.env.COURIER_HOST || 'https://messaging.api.other.chat',
    onFetchError = console.error) {
    this.extraFetchHeaders = extraFetchHeaders
    this.onFetchError = onFetchError
    this.host = host
  }

  authenticateIdentity(identityId) {
    return this._fetchJSON('POST', '/auth/identity', {
      identityId,
    })
  }

  createAccount(email, password) {
    return this._fetchJSON('POST', '/account', {
      account: {
        email,
        password,
      },
    })
  }

  createChannel(isPrivate, name) {
    return this._fetchJSON('POST', '/channel', {
      channel: {
        isPrivate,
        name,
      },
    })
  }

  createIdentity(accountId, alias) {
    return this._fetchJSON('POST', `/account/${accountId}/identity`, {
      identity: {
        alias,
      },
    })
  }

  createMessage(channelId, message) {
    return this._fetchJSON('POST', `/channel/${channelId}/message`, {message})
  }

  deleteChannelFeature(channelId, featureId) {
    return this._fetchJSON('DELETE', `/channel/${channelId}/feature/${featureId}`)
  }

  deleteChannelLink(channelId, path) {
    return this._fetchJSON('DELETE', `/channel/${channelId}/link/${encodeURIComponent(path)}`)
  }

  deleteChannelMember(channelId, identityId) {
    return this._fetchJSON('DELETE', `/channel/${channelId}/members`, {
      identityId,
    })
  }

  deleteContact(identityId, contactId) {
    return this._fetchJSON('DELETE', `/identity/${identityId}/contacts`, {
      contactIds: [contactId],
    })
  }

  deleteIdentityFeature(identityId, featureId) {
    return this._fetchJSON('DELETE', `/identity/${identityId}/feature/${featureId}`)
  }

  deleteMessage(channelId, messageId) {
    return this._fetchJSON('DELETE', `/channel/${channelId}/message/${messageId}`)
  }

  editMessage(channelId, messageId, {attachments, format, text}) {
    return this._fetchJSON('PUT', `/channel/${channelId}/message/${messageId}`, {
      message: {
        attachments,
        format,
        text,
      },
    })
  }

  fetchChannels(identity) {
    return this._fetchJSON('GET', `/identity/${identity}/channels`)
  }

  fetchChannelDetails(channelId) {
    return this._fetchJSON('GET', `/channel/${channelId}`)
  }

  fetchChannelForLink(path) {
    return this._fetchJSON('GET', `/link?path=${encodeURIComponent(path)}`)
  }

  fetchChannelMembers(channelId) {
    return this._fetchJSON('GET', `/channel/${channelId}/members`)
  }

  fetchChannelMessages(channelId, {latest, since, range}) {
    let query = ''
    if (latest) {
      query = `?latest=${encodeURIComponent(latest)}`
    } else if (since) {
      query = `?since=${encodeURIComponent(since)}`
    } else if (range) {
      query = `?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`
    }
    return this._fetchJSON('GET', `/channel/${channelId}/events${query}`)
  }

  fetchChatter(identity) {
    return this._fetchJSON('GET', `/identity/${identity}/chatter`)
  }

  fetchConfig() {
    return this._fetchJSON('GET', '/client/config')
  }

  fetchContacts(identity) {
    return this._fetchJSON('GET', `/identity/${identity}/contacts`)
  }

  fetchAccountDetails(accountId) {
    return this._fetchJSON('GET', `/account/${accountId}`)
  }

  fetchNotifications(identity, {latest, since, range}) {
    let query = ''
    if (latest) {
      query = `?latest=${encodeURIComponent(latest)}`
    } else if (since) {
      query = `?since=${encodeURIComponent(since)}`
    } else if (range) {
      query = `?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}`
    }
    return this._fetchJSON('GET', `/identity/${identity}/notifications${query}`)
  }

  fetchEntityDetails(channels = [], identities = []) {
    return this._fetchJSON('POST', '/fetch', {
      channels,
      identities,
    })
  }

  fetchIdentityDetails(identityId) {
    return this._fetchJSON('GET', `/identity/${identityId}`)
  }

  fetchIdentityDiscovery(identityId, numChannels) {
    const queryString = numChannels ? `?num_channels=${numChannels}` : ''
    return this._fetchJSON('GET', `/identity/${identityId}/discover${queryString}`)
  }

  linkChannel(channelId, isPermanent) {
    return this._fetchJSON('POST', `/channel/${channelId}/link`, {
      link: {
        type: isPermanent ? 'long' : 'short',
      },
    })
  }

  putChannelDetails(channelId, details) {
    return this._fetchJSON('PUT', `/channel/${channelId}`, {
      channel: details,
    })
  }

  putChannelFeature(channelId, featureUrl, featureIdentity) {
    return this._fetchJSON('POST', `/channel/${channelId}/feature`, {
      feature: {
        identityId: featureIdentity,
        url: featureUrl,
      },
    })
  }

  putChannelMember(channelId, identityId) {
    return this._fetchJSON('PUT', `/channel/${channelId}/members`, {
      identityId,
    })
  }

  putContact(identityId, contactId) {
    return this._fetchJSON('PUT', `/identity/${identityId}/contacts`, {
      contactIds: [contactId],
    })
  }

  putIdentityDetails(identityId, details) {
    return this._fetchJSON('PUT', `/identity/${identityId}`, {
      identity: details,
    })
  }

  putIdentityFeature(identityId, featureUrl) {
    return this._fetchJSON('POST', `/identity/${identityId}/feature`, {
      feature: {
        url: featureUrl,
      },
    })
  }

  putIdentityPreferences(identityId, preferences) {
    return this._fetchJSON('PUT', `/identity/${identityId}/preferences`, {
      preferences,
    })
  }

  get _headers() {
    return Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }, this.extraFetchHeaders)
  }

  _fetchJSON(method, endpoint, requestJSON) {
    const request = {
      cache: 'reload',
      credentials: 'include',
      headers: this._headers,
      method,
      mode: 'cors',
    }
    if (requestJSON) {
      request.body = JSON.stringify(camelCaseToUnderscore(requestJSON))
    }
    return global.fetch(this.host + endpoint, request).then(checkStatus).catch(this.onFetchError).then(parseJSON)
  }
}

export function camelCaseToUnderscore(object) {
  const newObject = {}
  for (const key of Object.keys(object)) {
    const value = object[key]
    const newValue = value instanceof Object && !(value instanceof Array) ?
      camelCaseToUnderscore(value) :
      value
    newObject[key.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`)] = newValue
  }
  return newObject
}

export function checkStatus(response) {
  const {status, statusText} = response

  // Standard HTTP status
  if (status >= 200 && status < 300 || status === 403) {
    return response
  }

  // Courier HTTP status
  const error = new Error(statusText)
  error.response = response
  switch (status) {
    case 460:  // account missing
    case 461:  // account invalid
    case 462:  // account expired
    case 470:  // identity missing
    case 471:  // identity invalid
      error.type = AUTHENTICATION_ERROR
      break
    case 472:  // identity expired
      error.type = IDENTITY_EXPIRED_ERROR
      break
    default:
      break
  }
  throw error
}

function parseJSON(response) {
  return response.status === 204 ? null : response.json()
}

export default ChatternetRestClient
