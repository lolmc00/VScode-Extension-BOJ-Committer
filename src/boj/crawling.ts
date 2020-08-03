import got from 'got';
import cheerio from 'cheerio';
import {Problem, TestCase} from './problem';


export const crawl = (num:number): Promise<string> => {
    let address: string = 'https://www.acmicpc.net/problem/' + num;
    let result: Promise<string> = new Promise<string>((resolve, reject) => {
        got(address).then(res => {
            resolve(res.body);
        }).catch(err => {
            reject(err);
        });
    });
    return result;
};
  
export const getProblemData = (num: number): Promise<Problem> => {
    let ret: Promise<Problem> = new Promise<Problem>((resolve, reject) => {
        crawl(num).then((body) => {
            let $ = cheerio.load(body);
            let title: string = $('#problem_title').text();
            let isSpecialJudge:boolean = false;
            if ($('.label-info').length > 0){
                isSpecialJudge =$('.label-info').text() === "스페셜 저지";
            }

            let testCases: Array<TestCase> = new Array<TestCase>();
            for(var i = 1;;i++){
                if ($("#sample-input-" + i).length === 0) { break; }
                let input: string = $("#sample-input-" + i).text();
                let output: string = $("#sample-output-" + i).text();
                testCases.push(new TestCase(input, output));
            }
            let problemData: Problem = new Problem(num, title, isSpecialJudge, testCases);
            resolve(problemData);
        }).catch(err => {
            reject(err);
        });
    });
    return ret;
};