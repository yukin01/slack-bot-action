import { StatusType } from './status'

export const defaultColors: Record<StatusType, string> = {
  success: '#18be52',
  failure: '#E96D76',
  cancelled: '#3b3b82',
  custom: '#e9e9e9',
}

export const defaultText: Record<StatusType, string> = {
  success: ':white_check_mark: The action has been successfully completed.',
  failure: ':exclamation: The action has failed',
  cancelled: ':exclamation: The action has been cancelled',
  custom: '',
}

export const defaultFooter =
  '<https://github.com/yukin01/slack-bot-action|Slack Bot Action>'
export const defaultFooterIcon =
  'https://slack-imgs.com/?c=1&o1=wi32.he32.si&url=https%3A%2F%2Fgithub.githubassets.com%2Ffavicon.ico'
