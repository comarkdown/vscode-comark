import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json' with { type: 'json' }

describe('package.json', () => {
  it('has the expected identity', () => {
    expect(packageJson.name).toBe('mdc')
    expect(packageJson.publisher).toBe('Nuxt')
    expect(packageJson.version).toBeTruthy()
    expect(packageJson.displayName).toBeTruthy()
  })
})

describe('contributes.languages', () => {
  const languages = packageJson.contributes.languages
  const mdc = languages.find(lang => lang.id === 'mdc')

  it('registers the mdc language', () => {
    expect(mdc).toBeDefined()
    expect(mdc?.aliases).toContain('MDC')
    expect(mdc?.extensions).toContain('.mdc')
  })
})

describe('contributes.grammars', () => {
  const grammars = packageJson.contributes.grammars

  it('contributes the standalone grammar', () => {
    expect(grammars.find(g => g.scopeName === 'text.markdown.mdc.standalone')).toBeDefined()
  })

  it('contributes the markdown injection grammar', () => {
    expect(grammars.find(g => g.scopeName === 'text.markdown.mdc')).toBeDefined()
  })
})

describe('contributes.commands', () => {
  const commands = packageJson.contributes.commands

  it.each(['mdc.showOutput', 'mdc.refreshMetadata'])('contributes %s', (command) => {
    expect(commands.find(c => c.command === command)).toBeDefined()
  })
})

describe('contributes.configuration', () => {
  const properties = packageJson.contributes.configuration.properties

  it.each([
    'mdc.enableFormatting',
    'mdc.enableComponentMetadataCompletions',
    'mdc.componentMetadataLocalFilePattern',
    'mdc.componentMetadataURL',
    'mdc.debug'
  ])('declares %s', (key) => {
    expect(properties).toHaveProperty(key)
  })

  it('defaults boolean toggles to false', () => {
    expect(properties['mdc.enableFormatting'].default).toBe(false)
    expect(properties['mdc.enableComponentMetadataCompletions'].default).toBe(false)
    expect(properties['mdc.debug'].default).toBe(false)
  })
})

describe('contributes.menus and keybindings', () => {
  it('contributes menu groups for mdc', () => {
    const menus = packageJson.contributes.menus
    expect(menus['editor/title']).toBeDefined()
    expect(menus['explorer/context']).toBeDefined()
    expect(menus.commandPalette).toBeDefined()
  })

  it('scopes the preview keybinding to mdc', () => {
    const previewKb = packageJson.contributes.keybindings.find(kb => kb.command === 'markdown.showPreview')
    expect(previewKb).toBeDefined()
    expect(previewKb?.when).toContain('editorLangId == mdc')
  })
})

describe('contributes.snippets', () => {
  it('contributes mdc snippets', () => {
    const snippets = packageJson.contributes.snippets
    expect(snippets.find(s => s.language === 'mdc')).toBeDefined()
  })
})
