import 'zx/globals'

/* global $ echo */
$.verbose = false

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
    await $`docker manifest inspect ${image}:${tag}`
    echo`container image tag found`
    return true
  } catch (error) {
    for (const item of registryMessages) {
      echo`${item}`
      if (error.message.indexOf(item) >= 0) {
        echo`container image tag not found`
        return false
      }
    }
    throw error
  }
}
