import * as core from '@actions/core'
import 'zx/globals'

/* global $ echo */
$.verbose = false

try {
  const image = core.getInput('image')
  const tag = core.getInput('tag')
  try {
    await $`docker manifest inspect ${image}:${tag}`
    echo`container image tag exists`
    core.setOutput('tag', 'found')
  } catch (error) {
    if (error.message.indexOf('no such manifest') >= 0 || error.message.indexOf('manifest unknown') >= 0) {
      echo`container image tag does not exist`
      core.setOutput('tag', 'not found')
    } else {
      throw error
    }
  }
} catch (error) {
  core.setFailed(error.message)
}
