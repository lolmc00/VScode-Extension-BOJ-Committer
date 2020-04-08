// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { API as GitAPI, GitExtension, APIState } from './api/git';
import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';

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

const checkPath = (path: string): Boolean => {
    return path.includes("\\unsolved");
};

const checkSolvedPath = (path: string): Boolean =>{
    return fs.existsSync(path);
};

const checkEXEFile = (originPath: string): Boolean => {
    return fs.existsSync(originPath);
};

const getSolvedPathUri = (path: string): vscode.Uri => {
    return vscode.Uri.file(path.split("\\solved")[0].concat("\\solved"));
};

const changeDirectorySource = (originUri: vscode.Uri, destinationUri: vscode.Uri): Promise<void> =>{
    return new Promise<void>((resolve, reject) => {
        try{
            vscode.workspace.fs.copy(originUri, destinationUri, { overwrite: true }).then(() => {
                vscode.workspace.fs.delete(originUri).then(() => {
                    let exeOrigin: vscode.Uri = vscode.Uri.file(originUri.fsPath.replace(".cpp", ".exe"));
                    let exeDestination: vscode.Uri = getDestination(exeOrigin.fsPath);
                    if (checkEXEFile(exeOrigin.fsPath)){
                        vscode.workspace.fs.copy(exeOrigin, exeDestination, { overwrite: true }).then(() => {
                            vscode.workspace.fs.delete(exeOrigin).then(() => {
                                resolve();
                            });
                        });
                    }else{
                        resolve();
                    }
                });
            });
        }catch{
            reject;
        }
    });
};

const openTextDocument = (uri: vscode.Uri): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try{
            vscode.workspace.openTextDocument(uri).then((document: vscode.TextDocument) => {
                vscode.window.showTextDocument(document, 1, false).then(() => {
                    resolve();
                });
            });
        }catch{
            reject();
        }
    });
};

const commitAndPush = (commitMessage: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try{
            vscode.commands.executeCommand("git.refresh").then(() => {
                vscode.commands.executeCommand('git.stage').then(() => {
                    const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
                    const git = gitExtension?.getAPI(1);
                    git?.repositories[0].commit(commitMessage).then(() => {
                        resolve();
                    });
                });
            });
        }catch{
            reject();
        }
    });
};

const process = (origin: vscode.Uri, destination: vscode.Uri, commitMessage: string, title: string): void => {
    changeDirectorySource(origin, destination).then(() => {
        openTextDocument(destination).then(() => {
            commitAndPush(commitMessage).then(() => {
                vscode.window.showInformationMessage(`[BOJ Committer] Completed (Problem: ${title})`);
            });
        }).catch(() => {
            vscode.window.showErrorMessage("[BOJ Committer] 파일을 여는 도중 에러가 발생하였습니다.");
        });
    }).catch(() => {
        vscode.window.showErrorMessage("[BOJ Committer] 파일을 옮기는 도중 에러가 발생하였습니다.");
    });
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
        if (vscode.window.activeTextEditor !== undefined && checkPath(vscode.window.activeTextEditor.document.uri.fsPath)){
            let activeTextEditor: vscode.TextEditor = vscode.window.activeTextEditor;
            let problemNumber: number = getNumber(activeTextEditor.document.uri.fsPath);
            vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                getTitle(problemNumber).then(title => {
                    let origin: vscode.Uri = activeTextEditor.document.uri;
                    let destination: vscode.Uri = getDestination(origin.fsPath);
                    if (!checkSolvedPath(destination.fsPath)) {
                        vscode.workspace.fs.createDirectory(getSolvedPathUri(destination.fsPath)).then(()=> {
                            process(origin, destination, title, title);
                        });
                    }else{
                        process(origin, destination, title, title);
                    }
                }).catch(err => {
                    vscode.window.showErrorMessage(err);
                });
            });
        }else{
            vscode.window.showErrorMessage("[BOJ Committer] 에디터에 unsolved 폴더안에 있는 커밋시킬 소스 파일을 켜고 실행해주세요.");
        }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
