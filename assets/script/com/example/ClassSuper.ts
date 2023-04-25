export class ClassSuper {
    protected _a: number = 1;
    protected _b: number = 2;

    protected c: number = 0;

    public set a(value: number) {
        console.log("这里是父类的 set 方法");
        this._a = value * 2;
    }

    public get a(): number {
        console.log("这里是父类的 get 方法");
        return this._a - 1;
    }
}

