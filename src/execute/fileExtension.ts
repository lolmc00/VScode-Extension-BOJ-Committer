import * as _executors from "../resources/executors.json";

interface IExecuteMethod {
    compile: string;
    execute: string;
}

export class Extension{
    static executors: {[type: string]: IExecuteMethod} = _executors;
    static types: {[extensionType: string] : string } = {
        "cpp": "C++14",
        "c": "C",
        "py": "Python3"
    };
    public compile: string;
    public execute: string;
    constructor(type: string){
        let extensionType: string = Extension.types[type];
        this.compile = Extension.executors[extensionType].compile;
        this.execute = Extension.executors[extensionType].execute;
    }
}