//建议通过在主入口类添加 import "../overwrite/EngineOverride" 的方式直接加载并执行
//在控制台输入 cc.Sprite 按回车, 出现代码块; 点击代码块可以找到定义的位置在 index.js
//cocos creator 3.0+ 引擎代码位置  可以尝试覆盖这几个位置
//CocosDashboard安装目录\resources\.editors\Creator\3.6.0\resources\resources\3d\engine\bin\.cache\dev\preview\bundled\index.js  主要
//CocosDashboard安装目录\resources\.editors\Creator\3.6.0\resources\resources\3d\engine\cocos\core\scene-graph\node.ts  次要
import { AssetManager, BaseNode, Component, director, Node, NodeEventType, path, Sprite, SpriteFrame, Texture2D, UIOpacity, UITransform, __private } from 'cc';
import { DEBUG } from 'cc/env';


export class EngineOverride {

    public static startWrite() {
        //新增API, 建议把API写进 or.d.ts 下的 interface BaseNode 中,便于在使用时带自动提示功能 

        //检测BaseNode之下有没有这个Component, 有的话直接返回Component的引用; 没有的话自动新增Component实例再返回其引用
        BaseNode.prototype.getOrAddComponent = function <T extends Component>(componentType: new (...parmas) => T, ...args): T {
            if (!this.getComponent(componentType)) {
                return this.addComponent.call(this, componentType, ...args);
            }
            return this.getComponent(componentType);
        }

        //检测一个Node对象是否正处于场景中的渲染队列(类似于检测 egret.DisplayObject 的 stage)
        Object.defineProperty(BaseNode.prototype, "stage", {
            get: function () {
                let parent = this.parent;
                while (parent) {
                    if (parent == director.getScene()) {
                        break;
                    }
                    parent = parent.parent;
                }
                return parent;
            },
            enumerable: true,
            configurable: true
        });

        BaseNode.prototype.findSubComponent = function <T extends Component>(componentType: new (...parmas) => T, ...args): T[] {

            let arr = [];
            let obj = this.getComponent.call(this, componentType, ...args);
            if (obj) {
                arr.push(obj);
            }

            function loop(node) {
                if (node && node.children && node.children.length > 0) {
                    for (let i = 0; i < node.children.length; i++) {
                        let nodeObj = (node.children[i].getComponent.call(node.children[i], componentType, ...args));
                        if (nodeObj) {
                            arr.push(nodeObj);
                        }
                        loop(node.children[i]);
                    }
                }
            }

            loop(this);
            return arr;
        }

        const _setParent = BaseNode.prototype.setParent;
        BaseNode.prototype.setParent = function setParent(value, keepWorldTransform) {
            //不能用 if(this.scene)来判断是否在场景上 this.scene 不会随着节点的 加载/移除 发生改变
            let oldStage = this.stage;
            let newStage;

            const loopHandler = function (node: BaseNode, evtType: string) {
                if (node && node.children && node.children.length > 0) {
                    for (let i = 0; i < node.children.length; i++) {
                        if (!node.children[i].emit)
                            continue;
                        node.children[i].emit(evtType);
                        loopHandler(node[i], evtType);
                    }
                }
            }

            _setParent.call(this, value, keepWorldTransform);

            newStage = this.stage;

            if (oldStage != newStage) {//场景发生了变化 有可能换了新场景 也有可能被加入场景成为可视节点  也有可能从场景上被移除出去
                if (this.emit) this.emit(NodeEventType.STAGE_CHANGED);// node.stage 可以检测有无舞台
                loopHandler(this, NodeEventType.STAGE_CHANGED);
            }
        }

        //新增getter/setter:

        //建议把getter/setter 变量写进 or.d.ts 下的 interface Node 中,便于在使用时带自动提示功能 
        //绕开UIOpacity  直接通过赋值修改Node的opacity(不透明度)
        Object.defineProperty(Node.prototype, "opacity", {
            get: function () {
                //没有UIOpacity? 那就自动创建一个
                return this.getOrAddComponent(UIOpacity).opacity;
            },
            set: function (value) {
                //没有UIOpacity? 那就自动创建一个
                this.getOrAddComponent(UIOpacity).opacity = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BaseNode.prototype, "ww", {
            get: function () {
                //没有UITransform? 那就自动创建一个
                return this.getOrAddComponent(UITransform).width;
            },
            set: function (value) {
                //没有UITransform? 那就自动创建一个
                this.getOrAddComponent(UITransform).width = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Node.prototype, "hh", {
            get: function () {
                //没有UITransform? 那就自动创建一个
                return this.getOrAddComponent(UITransform).height;
            },
            set: function (value) {
                //没有UITransform? 那就自动创建一个
                this.getOrAddComponent(UITransform).height = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "x", {
            get: function () {
                return this.position.x;
            },
            set: function (value) {
                this.setPosition(value, this.position.y, this.position.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "y", {
            get: function () {
                return this.position.y;
            },
            set: function (value) {
                this.setPosition(this.position.x, value, this.position.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "z", {
            get: function () {
                return this.position.z;
            },
            set: function (value) {
                this.setPosition(this.position.x, this.position.y, value);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "scaleX", {
            get: function () {
                return this.scale.x;
            },
            set: function (value) {
                this.setScale(value, this.scale.y, this.scale.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "scaleY", {
            get: function () {
                return this.scale.y;
            },
            set: function (value) {
                this.setScale(this.scale.x, value, this.scale.z);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Node.prototype, "scaleZ", {
            get: function () {
                return this.scale.z;
            },
            set: function (value) {
                this.setScale(this.scale.x, this.scale.y, value);
            },
            enumerable: true,
            configurable: true
        });

        //覆盖 让 bundle.get("图片路径", SpriteFrame) 或 bundle.get("图片路径", Texture2D), 填入第二个具体类型参数时  返回一个 SpriteFrame 或 Texture2D,  而不是 ImageAsset
        AssetManager.Bundle.prototype.getInfoWithPath = function (path: string, type?: __private._cocos_core_asset_manager_shared__AssetType | null): __private._cocos_core_asset_manager_config__IAddressableInfo | null {
            if (path[path.length - 1] == "/") {
                path = path.substring(0, path.length - 1);
            }

            if (type == SpriteFrame) {//自动对应类型 补齐图片资源的后缀路径
                let arr = path.split("/");
                if (arr[arr.length - 1] !== "spriteFrame") {
                    path += "/spriteFrame";
                }
            }
            else if (type == Texture2D) {//自动对应类型 补齐图片资源的后缀路径
                let arr = path.split("/");
                if (arr[arr.length - 1] !== "texture") {
                    path += "/texture";
                }
            }
            return this._config.getInfoWithPath(path, type);
        }

        /*  Sprite.prototype["_flushAssembler"] = function () {
             const assembler = Sprite.Assembler.getAssembler(this);
 
             if (this._assembler !== assembler) {
                 this.destroyRenderData();
                 this._assembler = assembler;
             }
 
             if (!this.renderData) {
                 if (this._assembler && this._assembler.createData) {
                     this._renderData = this._assembler.createData(this);
                     this.renderData!.material = this.getRenderMaterial(0);
                     this.markForUpdateRenderData();
                     if (this.spriteFrame) {
                         this._assembler.updateUVs(this);
                     }
                     this._updateColor();
                 }
             }
 
             // Only Sliced type need update uv when sprite frame insets changed
             if (this._spriteFrame) {
                 if (this._spriteFrame.texture) {
                     
                 }
                 if (this._type === 1) {
                     this._spriteFrame.on(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
                 } else {
                     this._spriteFrame.off(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
                 }
             }
         }; */



    }
}

EngineOverride.startWrite();

