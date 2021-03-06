// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const COMMAND = 'vscode-pretty-json.prettyjson';
  const { title: COMMAND_TITLE } =
    context.extension.packageJSON.contributes.commands.find(
      (item: any) => item.command === COMMAND
    );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(COMMAND, () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      // Select all text in current document
      const textRange = new vscode.Range(
        editor.document.lineAt(0).range.start,
        editor.document.lineAt(editor.document.lineCount - 1).range.end
      );

      const text = editor.document.getText(textRange);

      editor.edit(async (editorBuilder) => {
        const indentation = editor.options.insertSpaces
          ? editor.options.tabSize ?? 2
          : '\t';

        try {
          editorBuilder.replace(
            textRange,
            JSON.stringify(JSON.parse(text), null, indentation)
          );

          // Reset view to start of document after formatting
          const pos0 = editor.document.positionAt(0);
          await vscode.window.showTextDocument(editor.document, {
            selection: new vscode.Selection(pos0, pos0),
          });

          await vscode.languages.setTextDocumentLanguage(
            editor.document,
            'json'
          );
        } catch (error) {
          vscode.window.showErrorMessage(`[${COMMAND_TITLE}] ${error}`);
        }
      });
    } else {
      vscode.window.showErrorMessage(`[${COMMAND_TITLE}] No active document`);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
