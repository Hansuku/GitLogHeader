import * as vscode from 'vscode';
import { GitCodeLensProvider } from './codelens/codeLensProvider';

export function activate(context: vscode.ExtensionContext) {
	// 注册语言编辑器激活插件服务 所有语言都可以激活这个插件
	const codelensProvider = new GitCodeLensProvider();
  vscode.languages.registerCodeLensProvider({
    "language": "*"
  }, codelensProvider);
}

export function deactivate() {}
