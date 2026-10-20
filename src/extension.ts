import * as vscode from 'vscode';
import { convert, detectCase, CaseType } from './converter';

function applyConversion(type: CaseType): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Откройте файл в редакторе.');
    return;
  }
  const sel = editor.selection;
  const text = editor.document.getText(sel);
  if (!text) {
    vscode.window.showWarningMessage('Выделите текст для преобразования.');
    return;
  }
  const result = convert(text, type);
  editor.edit(builder => builder.replace(sel, result));
}

function showDetected(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const text = editor.document.getText(editor.selection);
  if (!text) {
    vscode.window.showWarningMessage('Выделите текст.');
    return;
  }
  vscode.window.showInformationMessage('Определён регистр: ' + detectCase(text));
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toUpper', () => applyConversion('upper')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toLowerCase', () => applyConversion('lower')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toSnake', () => applyConversion('snake')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toCamel', () => applyConversion('camel')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toPascal', () => applyConversion('pascal')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toKebab', () => applyConversion('kebab')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.toUpperSnake', () => applyConversion('upperSnake')));
  context.subscriptions.push(vscode.commands.registerCommand('caseConverter.detect', showDetected));
}

export function deactivate(): void {}