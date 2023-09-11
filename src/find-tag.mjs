import 'zx/globals'

/* global $ echo */

$.verbose = false

const debug = process.env.NODE_LOG_LEVEL === 'debug'

const registryMessagesMap = {
  docker: 'no such manifest',
  github: 'manifest unknown',
  google: 'no such manifest',
  ecr: 'no such manifest',
  harbor: 'unknown: artifact',
}

// reduce the maping to an array with unique value strings
const registryMessages = Array.from(new Set(Object.entries(registryMessagesMap).map(([, value]) => value)))

export const findTag = async (image, tag) => {
  try {
    if (debug) {
      echo`${JSON.stringify({ image, tag }, null, 2)}`
    }
    const result = await $`docker manifest inspect ${image}:${tag}`
    if (debug) {
      echo`${JSON.stringify({ result })}`
    }
    echo`container image tag found`
    return true
  } catch (error) {
    if (debug) {
      echo`${JSON.stringify({ error })}`
    }
    for (const item of registryMessages) {
      if (debug) {
        echo`${JSON.stringify({ item })}`
      }
      if (error.message.indexOf(item) >= 0) {
        echo`container image tag not found`
        return false
      }
    }
    throw error
  }
}
