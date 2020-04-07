// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { API as GitAPI, GitExtension, APIState } from './api/git';
import request from 'request';
import cheerio from 'cheerio';

const getNumber = (path: string): number => {
    let splited = path.split('\\');
    let fileName = splited[splited.length - 1];
    let result: number = Number(fileName.split('.')[0].split('BOJ')[1]);
    return result;
};

const crawl = (num:number): Promise<string> => {
    let address: string = 'https://www.acmicpc.net/problem/' + num;
    let result: Promise<string> = new Promise<string>((resolve, reject) => {
        request.get(address, (err, res) => {
            if (err !== null && err !== undefined) {
                console.log(err);
                reject(err);
            } else {
                resolve(res.body);
            }
        });
    });
    return result;
};

const getTitle = (num: number): Promise<string> => {
    let result: Promise<string> = new Promise<string>((resolve, reject) => {
        crawl(num).then((body) => {
            let $ = cheerio.load(body);
            let result: string = $('#problem_title').text();
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
    return result;
};

const getDestination = (path: string): vscode.Uri => {
    let result: vscode.Uri = vscode.Uri.file(path.replace("\\unsolved", "\\solved"));
    return result;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
    
    console.log('Congratulations, your extension "boj-committer" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.BOJCommitter', () => {
        // The code you place here will be executed every time your command is executed
        if (vscode.window.activeTextEditor !== undefined){
            let activeTextEditor: vscode.TextEditor = vscode.window.activeTextEditor;
            let problemNumber: number = getNumber(activeTextEditor.document.uri.fsPath);
            vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                getTitle(problemNumber).then(title => {
                    let destination: vscode.Uri = getDestination(activeTextEditor.document.uri.fsPath);
                    vscode.workspace.fs.copy(activeTextEditor.document.uri, destination, { overwrite: true }).then(() => {
                        vscode.workspace.openTextDocument(destination).then((document: vscode.TextDocument) => {
                            vscode.window.showTextDocument(document, 1, false).then(() => {
                                vscode.commands.executeCommand("git.refresh").then(() => {
                                    vscode.commands.executeCommand('git.stage').then(() => {
                                        const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
                                        const git = gitExtension?.getAPI(1);
                                        git?.repositories[0].commit(title).then(() => {
                                            vscode.window.showInformationMessage(`[BOJ Committer] Completed (Problem: ${title})`);
                                        });
                                    });
                                });
                            });
                        });
                    });
                }).catch(err => {
                    vscode.window.showInformationMessage(err);
                });
            });
        }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
