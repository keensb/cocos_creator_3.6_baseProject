import  "../overwrite/EngineOverride";//不带 from 关键字的import,  作用是直接导进来并立即执行 相当于js的 require()
import { _decorator, Component, find, director, Node, log, UIOpacity, Label, tween, Vec3, BaseNode, NodeEventType, Scene, resources, AssetManager, assetManager, SpriteAtlas, Sprite, SpriteFrame, dragonBones, Texture2D, Asset, ImageAsset, AudioClip, sp, AnimationClip, utils, NodeActivator, UITransform, instantiate } from 'cc';
import { ClassSon } from './example/ClassSon';



import { DEBUG } from 'cc/env';
import { asyncAsset } from '../mgr/asyncAsset';
import { usingAssets } from "../config/usingAssets";
import { ccutils } from "../ccutils/ccutils";



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
         
    }

    start() {
        /* console.log(1234567);
        let son = new ClassSon();
        log(son.a)
        ccutils.superSetter(ClassSon, son, "a", 5);
        log(son.a)
        son.a = 3;
        log(son.a);
        ccutils.superGetter(ClassSon, son, "a"); */

        //find("Canvas/bg").getComponent(UIOpacity).opacity = 100;

        var bg = find("Canvas/bg");
        var love = find("Canvas/love");
        var nn = find("Canvas/Node1/Node2");
        
        window["bg"] = bg;
        window["sp"] = bg.getComponent(Sprite);
        window["sf"] = bg.getComponent(Sprite).spriteFrame;
        bg.setPosition(100, bg.position.y);

        window["love"] = love;
        window["lsp"] = love.getComponent(Sprite);
        window["lsa"] = love.getComponent(Sprite).spriteAtlas;
        window["lsf"] = love.getComponent(Sprite).spriteFrame;

        window["nn"] = nn;
        let mm = window["mm"] = new Node("mm");
        mm.parent = nn.parent;
        mm.x = nn.x;
        mm.y = nn.y;

        nn.getOrAddComponent(Sprite).spriteFrame = love["spriteFrame"];
        nn.opacity = 80;
        mm.getOrAddComponent(Sprite).spriteFrame = love["spriteFrame"];
        mm.opacity = 254;
         
        /* assetManager.loadAny({uuid:'xxx', type: SpriteAtlas}, (err, res) => {
            let sprite = this.getComponent(Sprite);
            sprite.spriteFrame = res.getSpriteFrame(bg);
          }) */

       
        
        let xx = resources.getUsingAsset(usingAssets.res.chuansongganzi)
          

        //console.log(director.getScene().findSubComponent(MainEntry), find("Canvas").findSubComponent(MainEntry));
        assetManager.loadAny("ec6af875-be27-41a4-92be-06042e848fde", (err, res) => { 
            console.log("xxxxxxxxx", err, res);
            window["bigPic"] = res;
        })
        
    }


 

    update(deltaTime: number) {

    }


    
}