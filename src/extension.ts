// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fs from 'fs';
import { Executor, Extension } from "./execute";
import { addAndCommit } from './git/git';
import * as BOJ from './boj';

const getExtension = (path:string):Extension =>{
    let extension:string = getFileName(path).split('.')[1];
    return new Extension(extension);
};

const getFileName = (path:string): string => {
    let splited = path.split('\\');
    return splited[splited.length - 1];
};

const getNumber = (path: string): number => {
    return Number(getFileName(path).split('.')[0].split('BOJ')[1]);
};

const getDestination = (path: string): vscode.Uri => {
    let result: vscode.Uri = vscode.Uri.file(path.replace("\\unsolved", "\\solved"));
    return result;
};

const checkPath = (path: string): Boolean => {
    return path.includes("\\unsolved");
};

const getEXEUri = (originPath: string): vscode.Uri => {
    let splited: string[] = originPath.split("\\");
    let fileName: string = splited[splited.length - 1];
    let exeFileName: string = fileName.replace(fileName.split(".")[1], "exe");
    return vscode.Uri.file(originPath.replace(fileName, exeFileName));
};

const getSolvedPathUri = (path: string): vscode.Uri => {
    return vscode.Uri.file(path.split("\\solved")[0].concat("\\solved"));
};

const changeDirectorySource = (originUri: vscode.Uri, destinationUri: vscode.Uri): Promise<void> =>{
    return new Promise<void>((resolve, reject) => {
        try{
            vscode.workspace.fs.copy(originUri, destinationUri, { overwrite: true }).then(() => {
                vscode.workspace.fs.delete(originUri).then(() => {
                    let exeOrigin: vscode.Uri = getEXEUri(originUri.fsPath);
                    let exeDestination: vscode.Uri = getDestination(exeOrigin.fsPath);
                    if (fs.existsSync(exeOrigin.fsPath)){
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

const process = (origin: vscode.Uri, destination: vscode.Uri, commitMessage: string, fileName: string, title: string): void => {
    changeDirectorySource(origin, destination).then(() => {
        addAndCommit(destination.fsPath, fileName, commitMessage);
        vscode.window.showInformationMessage(`[BOJ Committer] Completed (Problem: ${title})`);
    }).catch(() => {
        vscode.window.showErrorMessage("[BOJ Committer] 파일을 옮기는 도중 에러가 발생하였습니다.");
    });
};

export function activate(context: vscode.ExtensionContext) {
    
	let disposable = vscode.commands.registerCommand('extension.BOJCommitter', () => {
        if (vscode.window.activeTextEditor !== undefined && checkPath(vscode.window.activeTextEditor.document.uri.fsPath)){
            
            let activeTextEditor: vscode.TextEditor = vscode.window.activeTextEditor;
            let filePath: string = activeTextEditor.document.uri.fsPath;
            let fileName: string = getFileName(filePath);
            let problemNumber: number = getNumber(filePath);

            vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                BOJ.getProblemData(problemNumber).then(problem => {
                    let origin: vscode.Uri = activeTextEditor.document.uri;
                    let destination: vscode.Uri = getDestination(origin.fsPath);

                    if (!fs.existsSync(destination.fsPath)) {
                        vscode.workspace.fs.createDirectory(getSolvedPathUri(destination.fsPath)).then(()=> {
                            process(origin, destination, problem.title, fileName, problem.title);
                        });
                    }else{
                        process(origin, destination, problem.title, fileName, problem.title);
                    }
                }).catch(err => {
                    vscode.window.showErrorMessage(err);
                });
            });
        }else{
            vscode.window.showErrorMessage("[BOJ Committer] unsolved 폴더안에 있는 커밋시킬 소스 파일을 켜고 실행해주세요.");
        }
    });
    let test = vscode.commands.registerCommand('extension.BOJTest', () => {
        if (vscode.window.activeTextEditor !== undefined && checkPath(vscode.window.activeTextEditor.document.uri.fsPath)){
            
            let activeTextEditor: vscode.TextEditor = vscode.window.activeTextEditor;
            let filePath: string = activeTextEditor.document.uri.fsPath;
            let fileName: string = getFileName(filePath);
            let problemNumber: number = getNumber(filePath);

            vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                BOJ.getProblemData(problemNumber).then(problem => {
                    let extension:Extension = getExtension(filePath);
                    let result = Executor.test(extension, filePath + "\\..", fileName, problem.testCases);
                    let outputChannel = vscode.window.createOutputChannel("Tests Result");
                    let isAllCorrect = true;
                    for(let i = 0; i < result.length; i++){
                        if(result[i].isCorrect === false){
                            isAllCorrect = false;
                            break;
                        }
                    }
                    outputChannel.appendLine(`Problem: ${problem.title}(${problem.id})\n`);
                    outputChannel.appendLine(`Total Results: ${isAllCorrect ? "Correct\n" : "Incorect\n"}`);
                    for(let i = 0; i < result.length; i++){
                        outputChannel.appendLine(`# Test Case ${(i + 1)}:`);
                        if(result[i].isOccurError){
                            outputChannel.appendLine(`Runtime Error`);
                        }else{
                            outputChannel.appendLine(`Expected Output:`);
                            outputChannel.appendLine(result[i].expectedOutput);
                            outputChannel.appendLine(`Your Output:`);
                            outputChannel.appendLine(result[i].yourOutput);
                            outputChannel.appendLine(`Result: ${result[i].isCorrect ? "Correct\n" : "Incorrect\n"}`);
                        }
                    }
                    outputChannel.show();
                }).catch(err => {
                    vscode.window.showErrorMessage(err);
                });
            });
        }else{
            vscode.window.showErrorMessage("[BOJ Committer] unsolved 폴더안에 있는 커밋시킬 소스 파일을 켜고 실행해주세요.");
        }
    });
    context.subscriptions.push(test);
	context.subscriptions.push(disposable);
}