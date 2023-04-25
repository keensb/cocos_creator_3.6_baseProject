import { director } from "cc";
import { ClassSuper } from "./ClassSuper";

export class ClassSon extends ClassSuper {
    protected _a: number = 1;
    protected _b: number = 2;

    constructor() {
        super();
    }

    public set a(value: number) {
        console.log("这里是子类的 set 方法");
        this._a = value;
        super.c = 10;
    }

    public get a(): number {
        console.log("这里是子类的 get 方法");
        return this._a;
    }
}
