import { ChatPostMessageArguments, MessageAttachment } from '@slack/web-api'
import { getOctokit, context } from '@actions/github'
import { getStatus } from './status'
import {
  defaultColors,
  defaultText,
  defaultFooter,
  defaultFooterIcon,
} from './default'

type Context = typeof context

type Builder<T> = {
  build: () => Promise<T>
}

export type MessageBuilderOption = {
  status: string
  channel: string
  text?: string
  username?: string
  iconEmoji?: string
  iconURL?: string
  githubToken: string
}

export type MessageBuilderMockOption = {
  context: Context
  commitMessage: string
}

export class MessageBuilder implements Builder<ChatPostMessageArguments> {
  private context: Context
  private mockCommitMessage?: string
  constructor(
    private option: MessageBuilderOption,
    mock?: MessageBuilderMockOption
  ) {
    this.option = option
    this.context = mock?.context ?? context // Use mock
    this.mockCommitMessage = mock?.commitMessage
  }

  private quote(value: string) {
    return '```' + value + '```'
  }

  private async fetchCommitMessage(): Promise<string> {
    const { option, context, mockCommitMessage } = this
    if (mockCommitMessage) return mockCommitMessage // Use mock

    const { sha } = context
    const { owner, repo } = context.repo
    const octokit = getOctokit(option.githubToken)
    const { data } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
    })
    return data.commit.message
  }

  async build(): Promise<ChatPostMessageArguments> {
    const { option } = this
    const { sha, workflow } = context
    const { owner, repo } = context.repo

    const githubRepo = `${owner}/${repo}`
    const githubRepoURL = `https://github.com/${owner}/${repo}`

    const status = getStatus(option.status)

    // Build attachment fields
    const fields: NonNullable<MessageAttachment['fields']> = []
    const commitMessage = await this.fetchCommitMessage()
    fields.push({
      title: 'Commit Message',
      value: this.quote(commitMessage),
      short: false,
    })
    fields.push({
      title: 'Repository',
      value: [
        `<${githubRepoURL}|${githubRepo}>`,
        `(<${githubRepoURL}/commit/${sha}|${sha.substring(0, 7)}>)`,
      ].join(' '),
      short: true,
    })
    fields.push({
      title: 'Workflow',
      value: `<${githubRepoURL}/commit/${sha}/checks|${workflow}>`,
      short: true,
    })

    const attachment: MessageAttachment = {
      color: defaultColors[status.type],
      fields: fields,
      footer_icon: defaultFooterIcon,
      footer: defaultFooter,
      ts: `${Math.floor(Date.now() / 1000)}`,
      mrkdwn_in: ['fields', 'text'],
    }

    return {
      channel: option.channel,
      text: option.text ?? defaultText[status.type],
      attachments: [attachment],
      username: option.username,
      icon_emoji: option.iconEmoji,
      icon_url: option.iconURL,
    }
  }
}
