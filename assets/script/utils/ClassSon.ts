import { director } from "cc";
import { ClassSuper } from "./ClassSuper";

export class ClassSon extends ClassSuper {
    protected _a: number = 1;
    protected _b: number = 2;

    constructor() {
        super();
    }

    public set a(value: number) {
        console.log("这里是子类的 set a");
        this._a = value;
        super.c = 10;
    }

    public get a(): number {
        return this._a;
    }
}
