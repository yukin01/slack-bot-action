import * as core from '@actions/core'
import { sum } from './sum'

async function run(): Promise<void> {
  try {
    const input = core.getInput('numbers')
    const numbers = input.split(',').map(Number)
    const result = sum(...numbers)

    core.info(`[Info] The result is ${result}`)
    core.setOutput('result', result.toString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
