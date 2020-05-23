import { ChatPostMessageArguments, MessageAttachment } from '@slack/web-api'
import { GitHub, context } from '@actions/github'
import { getStatus } from './status'
import { defaultColors, defaultText, defaultFooter, defaultFooterIcon } from './default'

const quote = (value: string) => '```' + value + '```'

export type MessageFactoryArguments = {
  status: string
  githubToken: string
  channel: string
}

type MessageFactory = (args: MessageFactoryArguments) => Promise<ChatPostMessageArguments>

export const messageFactory: MessageFactory = async ({ status: rawStatus, githubToken, channel }) => {
  const octokit = new GitHub(githubToken)
  const { sha, workflow } = context
  const { owner, repo } = context.repo
  const { data } = await octokit.repos.getCommit({ owner, repo, ref: sha })
  const commitMessage = data.commit.message

  const githubRepo = `${owner}/${repo}`
  const githubRepoURL = `https://github.com/${owner}/${repo}`

  const status = getStatus(rawStatus)

  /* eslint-disable @typescript-eslint/camelcase */
  const attachment: MessageAttachment = {
    color: defaultColors[status.type],
    fields: [
      {
        title: 'Commit Message',
        value: quote(commitMessage),
        short: false
      },
      {
        title: 'Repository',
        value: `<${githubRepoURL}/tree/${sha}|${githubRepo}>`,
        short: true
      },
      {
        title: 'Commit',
        value: `<${githubRepoURL}/commit/${sha}|${sha.substring(0, 7)}>`,
        short: true
      },
      {
        title: 'Workflow',
        value: `<https://github.com/${owner}/${repo}/commit/${sha}/checks|${workflow}>`,
        short: true
      }
    ],
    footer_icon: defaultFooterIcon,
    footer: defaultFooter,
    ts: `${Math.floor(Date.now() / 1000)}`,
    mrkdwn_in: ['fields', 'text']
  }

  return {
    channel: channel,
    text: defaultText[status.type],
    attachments: [attachment]
  }
  /* eslint-enable @typescript-eslint/camelcase */
}
