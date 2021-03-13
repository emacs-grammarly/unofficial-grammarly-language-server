import { injectable } from 'inversify'
import minimatch from 'minimatch'
import { DocumentContext } from '@emacs-grammarly/unofficial-grammarly-api'
import { commands, ConfigurationTarget, window, workspace } from 'vscode'
import { GrammarlyClient } from '../client'
import { form, select } from '../form'
import { Registerable } from '../interfaces'
import { GrammarlySettings } from '../settings'
import { toArray } from '../utils/toArray'

@injectable()
export class SetGoalsCommand implements Registerable {
  constructor(private readonly client: GrammarlyClient) { }

  register() {
    return commands.registerCommand('grammarly.setGoals', this.execute.bind(this))
  }

  private async execute() {
    if (!this.client.isReady()) return
    if (!window.activeTextEditor) {
      window.showInformationMessage('No active text document found.')

      return
    }

    const document = window.activeTextEditor.document

    if (this.client.isIgnoredDocument(document.uri.toString(), document.languageId)) {
      const ext = document.fileName.substr(document.fileName.lastIndexOf('.'))
      window.showInformationMessage(`The ${ext} filetype is not supported.`)
      return
    }

    if (!workspace.getWorkspaceFolder(document.uri)) {
      window.showInformationMessage(`The file does not belong to current workspace.`)
      return
    }

    const uri = document.uri.toString()
    const config = workspace.getConfiguration().get<GrammarlySettings>('grammarly')!
    const override = config.overrides.find((override) =>
      toArray(override.files).some((pattern) => minimatch(uri, pattern)),
    )
    const settings: DocumentContext = {
      audience: config.audience,
      dialect: config.dialect,
      domain: config.domain,
      emotions: config.emotions,
      goals: config.goals,
      style: config.style,
      ...override?.config,
    }

    const result = await form<DocumentContext>('Set Goals', [
      select('audience', 'Audience', [
        {
          label: 'general',
          description: 'Easy for anyone to read with minimal effort.',
          picked: settings.audience === 'general',
        },
        {
          label: 'knowledgeable',
          description: 'Requires focus to read and understand.',
          picked: settings.audience === 'knowledgeable',
        },
        {
          label: 'expert',
          description: 'May require rereading to understand.',
          picked: settings.audience === 'expert',
        },
      ]),
      select('dialect', 'Dialect', [
        {
          label: 'american',
          description: '🇺🇸 American',
          picked: settings.dialect === 'american',
        },
        {
          label: 'australian',
          description: '🇦🇺 Australian',
          picked: settings.dialect === 'australian',
        },
        {
          label: 'british',
          description: '🇬🇧 British',
          picked: settings.dialect === 'british',
        },
        {
          label: 'canadian',
          description: '🇨🇦 Canadian',
          picked: settings.dialect === 'canadian',
        },
      ]),
      select('domain', 'Domain', [
        {
          label: 'academic',
          picked: settings.domain === 'academic',
          description: 'Strictly applies all rules and formal writing conventions.',
        },
        {
          label: 'business',
          picked: settings.domain === 'business',
          description: 'Applies almost all rules, but allow some informal expressions.',
        },
        {
          label: 'general',
          picked: settings.domain === 'general',
          description: 'Applies most rules and conventions with medium strictness.',
        },
        {
          label: 'technical',
          picked: settings.domain === 'technical',
          description: 'Applies almost all rules, plus technical writing conventions.',
        },
        {
          label: 'casual',
          picked: settings.domain === 'casual',
          description: 'Applies most rules, but allow stylistic flexibility.',
        },
        {
          label: 'creative',
          picked: settings.domain === 'creative',
          description: 'Allows some intentional bending of rules and conventions.',
        },
      ]),
      select(
        'emotions',
        'Emotions: How do you want to sound?',
        [
          {
            label: 'neutral',
            picked: settings.emotions.includes('neutral'),
            description: '😐 Neutral',
          },
          {
            label: 'confident',
            picked: settings.emotions.includes('confident'),
            description: '🤝 Confident',
          },
          {
            label: 'joyful',
            picked: settings.emotions.includes('joyful'),
            description: '🙂 Joyful',
          },
          {
            label: 'optimistic',
            picked: settings.emotions.includes('optimistic'),
            description: '✌️ Optimistic',
          },
          {
            label: 'respectful',
            picked: settings.emotions.includes('respectful'),
            description: '🙌 Respectful',
          },
          {
            label: 'urgent',
            picked: settings.emotions.includes('urgent'),
            description: '⏰ Urgent',
          },
          {
            label: 'friendly',
            picked: settings.emotions.includes('friendly'),
            description: '🤗 Friendly',
          },
          {
            label: 'analytical',
            picked: settings.emotions.includes('analytical'),
            description: '📊 Analytical',
          },
        ],
        { canSelectMany: true },
      ),
      select(
        'goals',
        'Goals: What are you trying to do?',
        [
          {
            label: 'inform',
            picked: settings.goals.includes('inform'),
            description: 'Inform',
          },
          {
            label: 'describe',
            picked: settings.goals.includes('describe'),
            description: 'Describe',
          },
          {
            label: 'convince',
            picked: settings.goals.includes('convince'),
            description: 'Convince',
          },
          {
            label: 'tellStory',
            picked: settings.goals.includes('tellStory'),
            description: 'Tell A Story',
          },
        ],
        { canSelectMany: true },
      ),
    ]).run()

    if (result) {
      const config = workspace.getConfiguration('grammarly', document.uri)
      const overrides = config.get<GrammarlySettings['overrides']>('overrides') || []
      const file = workspace.asRelativePath(document.uri)
      const pattern = `**/${file}`
      const index = overrides.findIndex((override) => override.files.includes(pattern))

      if (index >= 0) {
        if (overrides[index].files.length === 1) {
          overrides[index].config = result
        } else {
          overrides[index].files.splice(overrides[index].files.indexOf(pattern), 1)
          overrides.push({
            files: [pattern],
            config: result,
          })
        }
      } else {
        overrides.push({
          files: [pattern],
          config: result,
        })
      }

      await config.update('overrides', overrides, ConfigurationTarget.WorkspaceFolder)

      this.client.check(document.uri.toString())
    }
  }
}
