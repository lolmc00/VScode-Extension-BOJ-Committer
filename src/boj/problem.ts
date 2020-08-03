
export class Problem {
    constructor(public id: number, public title: string, public isSpecailJudge: boolean, public testCases: Array<TestCase>) {}
}

export class TestCase {
    constructor(public input: string, public output: string){}
}

export class Result {
    constructor(public input: string, public expectedOutput: string, public yourOutput: string,
        public isCorrect: boolean, public isOccurError: boolean){}
}