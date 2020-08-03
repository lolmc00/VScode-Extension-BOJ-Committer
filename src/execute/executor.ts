import { execSync } from "child_process";
import { resolve } from "path";
import { TestCase, Result } from "../boj/problem";
import { Extension } from "./fileExtension";

export class Executor {

    private static prepare(extension:Extension, sourceDir: string, fileName: string) {
        try{
            execSync(`SET "SOURCE_DIR=${sourceDir}" && SET "SOURCE_FILE=${sourceDir + "\\" + fileName}" && call ${extension.compile}`);
        }catch(err){
            console.log(err);
        }
    }

    private static run(extension:Extension, sourceDir: string, fileName: string, input: string, expectedOutput: string): Result {
        try{
            const buffer = execSync(`SET "SOURCE_DIR=${sourceDir}" && SET "SOURCE_FILE=${sourceDir + "\\" + fileName}" && call ${extension.execute}`, {input: input});
            const output = buffer.toString();
            let trimmedOutput = output.replace("\r", "").trim();
            let trimmedExpectedOutput = expectedOutput.trim();
            return new Result(input, trimmedExpectedOutput, trimmedOutput, trimmedExpectedOutput === trimmedOutput, false);
        }catch(err){
            return new Result('', '', '', false, true);
        }
    }

    public static test(extension:Extension, dirPath: string, fileName: string, testCases: Array<TestCase>): Result[] {
        dirPath = resolve(dirPath);
        let ret = [];
        Executor.prepare(extension, dirPath, fileName);
        for (let i = 0; i < testCases.length; i++) {
            const input = testCases[i].input, expectedOutput = testCases[i].output;
            const result = Executor.run(extension, dirPath, fileName, input, expectedOutput);
            ret.push(result);
        }
        return ret;
    }
}