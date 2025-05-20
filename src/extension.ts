// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parse, stringify } from 'lossless-json';

const EXTENSION_NAME = 'Pretty JSON';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const prettify = vscode.commands.registerCommand(
    'vscode-pretty-json.prettify',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        // Select all text in current document
        const textRange = new vscode.Range(
          editor.document.lineAt(0).range.start,
          editor.document.lineAt(editor.document.lineCount - 1).range.end
        );

        const text = editor.document.getText(textRange);

        await vscode.languages.setTextDocumentLanguage(editor.document, 'json');

        editor.edit(async (editorBuilder) => {
          const isAlreadyFormatted = editor.document.lineCount > 1;
          const indentation = editor.options.insertSpaces
            ? editor.options.tabSize ?? 2
            : '\t';

          try {
            const formatted = stringify(parse(text), null, indentation);
            if (!formatted) {
              throw new Error('Unable to format text');
            }

            editorBuilder.replace(textRange, formatted);

            if (!isAlreadyFormatted) {
              // Reset cursor to start of document
              const pos0 = editor.document.positionAt(0);
              await vscode.window.showTextDocument(editor.document, {
                selection: new vscode.Selection(pos0, pos0),
              });
            }
          } catch (error) {
            vscode.window.showErrorMessage(`[${EXTENSION_NAME}] ${error}`);
          }
        });
      } else {
        vscode.window.showErrorMessage(
          `[${EXTENSION_NAME}] No active document`
        );
      }
    }
  );
  context.subscriptions.push(prettify);

  const uglify = vscode.commands.registerCommand(
    'vscode-pretty-json.uglify',
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        // Select all text in current document
        const textRange = new vscode.Range(
          editor.document.lineAt(0).range.start,
          editor.document.lineAt(editor.document.lineCount - 1).range.end
        );

        const text = editor.document.getText(textRange);

        editor.edit(async (editorBuilder) => {
          try {
            const formatted = stringify(parse(text));
            if (!formatted) {
              throw new Error('Unable to format text');
            }

            editorBuilder.replace(textRange, formatted);

            // Reset cursor to start of document
            const pos0 = editor.document.positionAt(0);
            await vscode.window.showTextDocument(editor.document, {
              selection: new vscode.Selection(pos0, pos0),
            });

            await vscode.languages.setTextDocumentLanguage(
              editor.document,
              'json'
            );
          } catch (error) {
            vscode.window.showErrorMessage(`[${EXTENSION_NAME}] ${error}`);
          }
        });
      } else {
        vscode.window.showErrorMessage(
          `[${EXTENSION_NAME}] No active document`
        );
      }
    }
  );
  context.subscriptions.push(uglify);
}

// this method is called when your extension is deactivated
export function deactivate() {}
