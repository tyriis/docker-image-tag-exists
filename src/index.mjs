import * as core from '@actions/core'
import { findTag } from './find-tag.mjs'

try {
  const image = core.getInput('image')
  const tag = core.getInput('tag')
  const tagFound = await findTag(image, tag)
  core.setOutput('tag', tagFound ? 'found' : 'not found')
} catch (error) {
  core.setFailed(error.message)
}
