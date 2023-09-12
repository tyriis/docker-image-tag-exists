import * as core from '@actions/core'
import { findTag } from './find-tag.mjs'

try {
  const registry = core.getInput('registry')
  const repository = core.getInput('repository')
  const tag = core.getInput('tag')
  const token = core.getInput('token')
  const tagFound = await findTag(registry, repository, tag, token)
  core.setOutput('tag', tagFound ? 'found' : 'not found')
} catch (error) {
  core.setFailed(error.message)
}
