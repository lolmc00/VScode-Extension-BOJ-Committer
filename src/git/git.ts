import { execSync } from "child_process";

export const addAndCommit = (dirPath : string, fileName: string, commitMessage: string): Promise<void> => {
    return new Promise<void>((resolve, reject) =>{
        try{
            let buffer = execSync(`cd ${dirPath +"\\.."} && git add ${fileName} && git commit -m "${commitMessage}"`);
            console.log(buffer);
            resolve();
        }catch(error){
            reject(error);
        }
    });
};