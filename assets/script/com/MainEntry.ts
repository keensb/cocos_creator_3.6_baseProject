import "../overwrite/EngineOverride";//不带 from 关键字的import,  作用是直接导进来并立即执行 相当于js的 require()
import { _decorator, Component, find, director, Node, log, UIOpacity, Label, tween, Vec3, BaseNode, NodeEventType, Scene, resources, AssetManager, assetManager, SpriteAtlas, Sprite, SpriteFrame, dragonBones, Texture2D, Asset, ImageAsset, AudioClip } from 'cc';
import { ClassSon } from '../utils/ClassSon';
import { superSetter } from '../utils/GlabolImport';


import { DEBUG } from 'cc/env';
import { asyncAsset } from '../utils/asyncAsset';

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
        console.log("okokokok", this.node["__proto__"]);
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

        //tween(bg).to(5, { scaleX: 2 }).start();
        //tween(bg).to(5, { hh: 400 }).start();





        /* 
            assetManager.loadAny({url:'assets/res/dog.jpg', type: SpriteAtlas}, (err, res) => {
            let sprite = this.getComponent(Sprite);
            //sprite.spriteFrame = res.getSpriteFrame(bg);
            console.log("aaaaa", err,res);
            }) 
        */


        /* assetManager.loadAny({uuid:'xxx', type: SpriteAtlas}, (err, res) => {
            let sprite = this.getComponent(Sprite);
            sprite.spriteFrame = res.getSpriteFrame(bg);
          }) */

        NodeEventType.SCENE_CHANGED_FOR_PERSISTS

        let textObj2 = this.test<Object>(10, 20, Node, "hello");


        console.log("textObj2 =", textObj2, textObj2["name"])

        var xxx = new Node();




        this.node.addChild(xxx)
        console.log("STAGE_CHANGED1111", xxx.stage);

        this.node.removeChild(xxx)
        console.log("STAGE_CHANGED2222", xxx.stage, DEBUG);

        console.log(director.getScene().findSubComponent(MainEntry), find("Canvas").findSubComponent(MainEntry));

        this.assetHandler();
    }



    private test<T>(x: number, y: number, inst: new (...parmas) => T, ...args): T {
        let obj = new inst(...args);
        obj["x"] = x;
        obj["y"] = y;
        return <T>obj;
    }

    update(deltaTime: number) {

    }


    private async assetHandler(): Promise<void> {
        
        /* let bundle = await asyncAsset.loadOneBundle("res", false);


        bundle.load("dog" , Asset, (err, res) => {
          
        }) */
       /*  await asyncAsset.bundleLoadUsingAssets("res", (f, t, p) => { 
            console.log(f, t);
        }) */
        
        let dog = await asyncAsset.bundleLoadByUrl("res", "dog", SpriteFrame);
        
         
        //let dog2 = assetManager.getBundle("res").load(
            //AssetManager.Bundle.prototype.get
        window["dog"] = dog;
        
        //assetManager.loadRemote('https://baishancdn.hicnhm.com/beiji_res/assets/avatar3/300000015_8_5.png', (err, texture) => console.log(texture));

        //sprite.spriteFrame
    }
}