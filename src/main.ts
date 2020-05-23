import * as core from '@actions/core'
import { WebClient } from '@slack/web-api'
import { messageFactory } from './factory'

async function run(): Promise<void> {
  try {
    const token = core.getInput('oauth_token')
    const client = new WebClient(token)
    core.info('[Info] Slack client has been initialized.')

    const status = core.getInput('status')
    const githubToken = core.getInput('github_token')
    const channel = core.getInput('channel')

    const message = await messageFactory({ status, githubToken, channel })
    const { ok, error } = await client.chat.postMessage(message)
    core.info(`[Info] Request result is ${ok}`)
    if (error) {
      throw new Error(error)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
