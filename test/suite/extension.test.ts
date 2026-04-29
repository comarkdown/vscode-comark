import * as assert from 'assert';
import * as vscode from 'vscode';

suite('MDC Extension Integration', () => {
  let extension: vscode.Extension<unknown> | undefined;

  suiteSetup(async function () {
    this.timeout(10000);

    extension = vscode.extensions.getExtension('Nuxt.mdc');

    if (extension && !extension.isActive) {
      await extension.activate();
    }
  });

  test('extension is present and activated', () => {
    assert.ok(extension, 'Extension Nuxt.mdc should be installed');
    assert.ok(extension?.isActive, 'Extension should be activated');
    assert.strictEqual(extension?.id, 'Nuxt.mdc');
  });

  test('mdc language is registered with VS Code', async () => {
    const languages = await vscode.languages.getLanguages();
    assert.ok(languages.includes('mdc'));
  });

  test('mdc.showOutput command is registered with VS Code', async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('mdc.showOutput'));
  });

  test('configuration defaults are loaded by VS Code', () => {
    const config = vscode.workspace.getConfiguration('mdc');
    assert.strictEqual(config.get('enableFormatting'), false);
    assert.strictEqual(config.get('enableComponentMetadataCompletions'), false);
    assert.strictEqual(config.get('debug'), false);
  });

  test('folding range provider responds for mdc files', async function () {
    this.timeout(5000);

    const doc = await vscode.workspace.openTextDocument({
      language: 'mdc',
      content: '::container\nSome content\n::'
    });

    const foldingRanges = await vscode.commands.executeCommand<vscode.FoldingRange[]>(
      'vscode.executeFoldingRangeProvider',
      doc.uri
    );

    assert.ok(foldingRanges !== undefined);
  });
});
