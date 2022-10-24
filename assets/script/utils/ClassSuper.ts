export class ClassSuper {
    protected _a: number = 1;
    protected _b: number = 2;

    protected c: number = 0;

    public set a(value: number) {
        console.log("这里是父类的 set a");
        this._a = value * 2;
    }

    public get a(): number {
        return this._a;
    }
}

