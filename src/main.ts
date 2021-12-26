import * as core from '@actions/core'
import { WebClient } from '@slack/web-api'
import { MessageBuilder } from './builder'

async function run(): Promise<void> {
  try {
    const token = core.getInput('oauth_token', { required: true })
    const client = new WebClient(token)
    core.info('[Info] Slack client has been initialized.')

    const optional = <T extends string>(value: T) =>
      value === '' ? undefined : value

    const builder = new MessageBuilder({
      status: core.getInput('status', { required: true }),
      githubToken: core.getInput('github_token', { required: true }),
      channel: core.getInput('channel', { required: true }),
      text: optional(core.getInput('text')),
      username: optional(core.getInput('username')),
      iconEmoji: optional(core.getInput('icon_emoji')),
      iconURL: optional(core.getInput('icon_url')),
    })
    const message = await builder.build()

    const { ok, error } = await client.chat.postMessage(message)
    core.info(`[Info] Request result is ${ok}`)
    if (error) {
      throw new Error(error)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
