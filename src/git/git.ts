import { execSync } from "child_process";

export const addAndCommit = (dirPath : string, fileName: string, commitMessage: string): void => {
    try{
        execSync(`cd ${dirPath +"\\.."} && git add ${fileName} && git commit -m ${commitMessage}`);
    }catch(error){
        console.log(error);
    }
    console.log("commit");
};