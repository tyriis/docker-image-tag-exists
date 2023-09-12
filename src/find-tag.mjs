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

export const findTag = async (registry, repository, tag, token) => {
  try {
    if (debug) {
      echo`${JSON.stringify({ registry, repository, tag, token: !!token }, null, 2)}`
    }
    // const result = await $`docker manifest inspect ${image}:${tag}`
    let result = null
    if (token) {
      const header = `Authorization: Bearer ${token}`
      await $`curl --fail --location -H ${header} https://${registry}/v2/${repository}/manifests/${tag} > manifest.json`
      result = await $`cat manifest.json`
    } else {
      result = await $`docker manifest inspect ${registry}/${repository}:${tag}`
    }
    if (debug) {
      echo`${result}`
    }
    echo`container image tag found`
    return true
  } catch (error) {
    if (debug) {
      echo`${error}`
    }
    if (token && error.exitCode === 22) {
      // eslint-disable-next-line quotes
      const curlError = error.stderr.split('\n')
      const curlErrorMessage = curlError[curlError.length - 2]
      if (curlErrorMessage.indexOf('404') >= 0) {
        echo`container image tag not found`
        return false
      }
      throw new Error(curlErrorMessage)
    }
    for (const item of registryMessages) {
      if (token) {
        // dont use response message parsing when using curl
        break
      }
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
