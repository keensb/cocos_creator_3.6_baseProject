import { _decorator, Component, find, director, Node, log, UIOpacity, Label, tween, Vec3, BaseNode } from 'cc';
import { engineOverrider } from '../overwrite/engineOverride';
import { ClassSon } from '../utils/ClassSon';
import { superSetter } from '../utils/GlabolImport';

import "../overwrite/engineOverride";//不带 from 关键字的import,  作用是直接导进来并立即执行 相当于js的 require()

const { ccclass, property } = _decorator;



@ccclass('MainEntry')
export class MainEntry extends Component {

    @property({
        type: Label,//对象类型
        visible: true,//是否在面板上显示这个属性
        displayName: "我被改了名字",//改对象对外显示的名称
        tooltip: "我的原名叫 label"//鼠标移上去时显示的说明
    })
    label: Label = null;

    onLoad() {
        //engineOverrider.startWrite();//在 creator 底层的JS原型链中 新增或覆盖自定义的业务代码
    }

    start() {
        let son = new ClassSon();
        log(son.a)
        superSetter(ClassSon, son, "a", 5);
        log(son.a)
        son.a = 3;
        log(son.a);
        
        //find("Canvas/bg").getComponent(UIOpacity).opacity = 100;
        var bg = find("Canvas/bg");
        bg.getOrAddComponent(UIOpacity).opacity = 100;
        window["bg"] = bg;
        bg.setPosition(100, bg.position.y);

        console.log("scale", bg.scale)
        
        tween(bg).to(5, { scaleX: 2 }).start();
        tween(bg).to(5, { hh: 400 }).start();


        let textObj1 = this.test<Object>(10, 20);//这里没传入第三个参数, 也就是类型 所以 Object 不起作用 返回的将是默认的 Node
        let textObj2 = this.test<Object>(10, 20, Object);//这里没传入第三个参数, 也就是类型 所以 Object 不起作用

        console.log("textObj1 =", textObj1)
        console.log("textObj2 =", textObj2)


    }

    private test<T>(x: number, y: number, inst?: new () => T): T {

        let obj = !!inst ? new inst : new Node();
        obj["x"] = x;
        obj["y"] = y;
        return <T>obj;
    }

    update(deltaTime: number) {

    }
}



