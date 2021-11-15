'use strict';

import * as vscode from 'vscode';
import simpleGit, {SimpleGit, LogResult} from 'simple-git';

export class GitCodeLensProvider implements vscode.CodeLensProvider {
  private formatTime(date: Date): String {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }
  public async provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken) : Promise<vscode.CodeLens[]> {
    const gitPath = vscode.workspace.workspaceFolders?.find(n =>  document.uri.fsPath.includes(n.uri.fsPath));
    const codeLenses = [];
    try {
      const git: SimpleGit = simpleGit(gitPath?.uri.fsPath, { binary: 'git' });
      const logData: LogResult = await git.log({
        file: document.uri.fsPath
      });
      const startAt = new Date(logData.all[logData.all.length - 1].date);
      const first = {
        name: logData.all[logData.all.length - 1].author_name,
        time: this.formatTime(startAt),
      };
      const endAt = new Date(logData.all[0].date);
      const last = {
        name: logData.all[0].author_name,
        time: this.formatTime(endAt),
      };
      codeLenses.push(
        new vscode.CodeLens(
          new vscode.Range(0, 0, 0, 0), {
          "title": `Creater: ${first.name} | Create At: ${first.time} | Last Editor: ${last.name} | Update At: ${last.time}`,
          "command": "",
          "arguments": [
              document, 0 + 1, 0
          ]
      }));
    } catch (error) {
      console.warn(error);
      console.warn("😭For the above reasons, git log header can't apply");
    }
    return codeLenses;
  }
}