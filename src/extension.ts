// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'vscode-pretty-json.prettyjson',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        await vscode.languages.setTextDocumentLanguage(editor.document, 'json');

        const textRange = new vscode.Range(
          editor.document.lineAt(0).range.start,
          editor.document.lineAt(editor.document.lineCount - 1).range.end
        );

        const text = editor.document.getText(textRange);

        editor.edit((editorBuilder) => {
          let indentation = editor.options.insertSpaces
            ? editor.options.tabSize ?? 2
            : '\t';

          editorBuilder.replace(
            textRange,
            JSON.stringify(JSON.parse(text), null, indentation)
          );
        });
      } else {
        vscode.window.showErrorMessage('Pretty JSON: No active document');
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
