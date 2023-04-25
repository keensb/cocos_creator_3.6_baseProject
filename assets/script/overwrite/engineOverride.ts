//建议通过在主入口类节点 的onLoad执行 EngineOverride.startWrite
//在控制台输入 cc.Sprite 按回车, 出现代码块; 点击代码块可以找到定义的位置在 index.js
//cocos creator 3.0+ 引擎代码位置  可以尝试覆盖这几个位置
//CocosDashboard安装目录\resources\.editors\Creator\3.6.0\resources\resources\3d\engine\bin\.cache\dev\preview\bundled\index.js  主要
//CocosDashboard安装目录\resources\.editors\Creator\3.6.0\resources\resources\3d\engine\cocos\core\scene-graph\node.ts  次要
import { AssetManager, BaseNode, CCObject, Component, director, errorID, Material, Node, NodeEventType, path, RenderTexture, Scene, Sprite, SpriteFrame, Texture2D, UIOpacity, UIRenderer, UITransform, warn, __private } from 'cc';
import { DEBUG } from 'cc/env';
import '../ccutils/Super_Getter_Setter';


class EngineOverride {
    public static startWrite() {
        //新增API, 建议把API写进 or.d.ts 下的 interface BaseNode 中,便于在使用时带自动提示功能

        if (DEBUG) {
            Object.defineProperty(BaseNode.prototype, "sprite", {
                get: function () {
                    return this.getComponent(Sprite);
                },
                enumerable: true,
                configurable: true
            })

            Object.defineProperty(BaseNode.prototype, "spriteFrame", {
                get: function () {
                    if (!this.getComponent(Sprite)) {
                        console.warn("本节点原本不存在Sprite组件")
                        this.addComponent(Sprite);
                    }
                    return this.getComponent(Sprite).spriteFrame;
                },
                set: function (value) {
                    if (!this.getComponent(Sprite)) {
                        console.warn("本节点原本不存在Sprite组件")
                        this.addComponent(Sprite)
                    }
                    this.getComponent(Sprite).spriteFrame = value;
                },
                enumerable: true,
                configurable: true
            })

            Object.defineProperty(BaseNode.prototype, "texture", {
                get: function () {
                    if (!this.getComponent(Sprite)) return null;
                    if (!this.getComponent(Sprite).spriteFrame) return null;
                    return this.getComponent(Sprite).spriteFrame.texture;
                },
                enumerable: true,
                configurable: true
            })
        }


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

            _setParent.call(this, value, keepWorldTransform);

            newStage = this.stage;

            if (oldStage != newStage) {//场景发生了变化 有可能换了新场景 也有可能被加入场景成为可视节点  也有可能从场景上被移除出去
                let nodeList = [this];
                if (this.emit) this.emit(NodeEventType.STAGE_CHANGED);// node.stage 可以检测有无舞台

                function loop(node: BaseNode) {
                    if (node.children && node.children.length > 0) {
                        for (let key in node.children) {
                            let subNode = node.children[key];
                            nodeList.push(subNode);
                            if (subNode.emit) subNode.emit(NodeEventType.STAGE_CHANGED);// node.stage 可以检测有无舞台
                            loop(subNode);
                        }
                    }
                }
                loop(this);

                for (let key in nodeList) {
                    let node = nodeList[key]
                    if (node.getComponent(Sprite) && node.getComponent(Sprite).spriteFrame) {
                        let sp = node.getComponent(Sprite);
                        let sf = node.getComponent(Sprite).spriteFrame;
                        if (!sf["$_$__onStageRef__"]) sf["$_$__onStageRef__"] = 0;
                        if (!sf["$_$__onStageDic__"]) sf["$_$__onStageDic__"] = {};
                        if (newStage && !sf["$_$__onStageDic__"][sp.uuid]) {
                            sf["$_$__onStageRef__"]++;
                            sf["$_$__onStageDic__"][sp.uuid] = 1;
                        }
                        else if (!newStage && sf["$_$__onStageDic__"][sp.uuid]) {
                            sf["$_$__onStageRef__"]--;
                            delete sf["$_$__onStageDic__"][sp.uuid];
                        }
                    }
                }
            }
        }



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

        Object.defineProperty(Node.prototype, "zIndex", {
            get: function () {
                //没有UIOpacity? 那就自动创建一个
                return this.getSiblingIndex();
            },
            set: function (value) {
                //没有UIOpacity? 那就自动创建一个
                this.setSiblingIndex(value);
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


        //关于纹理集和子纹理的关系  主要体现在 SpriteAtlas 与 SpriteFrame
        //首先 SpriteFrame 的字段 name 就是 SpriteAtlas在资源库里的命名 , 而不是子纹理的命名
        //其次 SpriteFrame的uuid格式 就是 SpriteAtlas的uuid + @后缀    例如 SpriteFrame的uuid是e80e626f-66d8-47ed-afd6-a74a52d53b22@6c48a   那么SpriteAtlas的uuid就是去掉@6c48a后的 e80e626f-66d8-47ed-afd6-a74a52d53b22



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

        let _destroy = Component.prototype.destroy;
        Component.prototype.destroy = function (): boolean {
            if (this.constructor == Sprite.prototype.constructor && this["spriteFrame"]) {
                let oldFrame = this["spriteFrame"];
                if (!oldFrame["$_$__spriteRef__"]) oldFrame["$_$__spriteRef__"] = 0;
                if (!oldFrame["$_$__spriteDic__"]) oldFrame["$_$__spriteDic__"] = {};
                if (oldFrame["$_$__spriteDic__"][this.uuid]) {
                    oldFrame["$_$__spriteRef__"]--;
                    delete oldFrame["$_$__spriteDic__"][this.uuid];
                }

                if (!oldFrame["$_$__onStageRef__"]) oldFrame["$_$__onStageRef__"] = 0;
                if (!oldFrame["$_$__onStageDic__"]) oldFrame["$_$__onStageDic__"] = {};
                if (oldFrame["$_$__onStageDic__"][this.uuid]) {
                    oldFrame["$_$__onStageRef__"]--;
                    delete oldFrame["$_$__onStageDic__"][this.uuid];
                }
            }
            return _destroy.call(this);
        }

        //在Sprite初始化的时候 统计spriteFrame被所有Sprite引用的次数  被字典或数组储存的spriteFrame 不会被统计进来
        Sprite.prototype["_updateBuiltinMaterial"] = function () {
            let mat = UIRenderer.prototype["_updateBuiltinMaterial"]();
            ///=↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓新增↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓


            let sf: SpriteFrame = this.spriteFrame;
            let stage = null;
            if (this.node) {
                stage = this.node.stage;
            }
            if (sf) {
                if (DEBUG) {
                    sf["$_$__debugDes__"] = {
                        描述: {
                            1: '关于 自定义自动引用计数 $_$__xxx 字段的解释(该说明仅在DEBUG版本可见):',
                            2: '为了避免SpriteFrame繁琐的自增自减操作(addRef和decRef), 采用自动统计策略 为此, 重写了一些底层方法, 但并不与 addRef和decRef 冲突',
                            3: '$_$__spriteRef__ 表示该SpriteFrame当前总共被几个Sprite组件所引用',
                            4: '$_$__onStageRef__ 表示引用该SpriteFrame的Sprite组件 目前总共有几个出现在场景里',
                            5: '※理论上$_$__onStageRef__ 的值任何时候都不应该大于 $_$__spriteRef__',
                            6: '※根据creator的循环渲染机制 当该SpriteFram 没有出现在场景上时   也就是$_$__onStageRef__ 的值为0时 才可以通过destroy()安全销毁该SpriteFram'
                        }
                    }
                }

                if (!sf["$_$__spriteRef__"]) sf["$_$__spriteRef__"] = 0
                if (!sf["$_$__spriteDic__"]) sf["$_$__spriteDic__"] = {};
                if (!sf["$_$__spriteDic__"][this.uuid]) {
                    sf["$_$__spriteRef__"]++;
                    sf["$_$__spriteDic__"][this.uuid] = 1;
                }

                if (!sf["$_$__onStageRef__"]) sf["$_$__onStageRef__"] = 0;
                if (!sf["$_$__onStageDic__"]) sf["$_$__onStageDic__"] = {};
                if (stage && !sf["$_$__onStageDic__"][this.uuid]) {
                    sf["$_$__onStageRef__"]++;
                    sf["$_$__onStageDic__"][this.uuid] = 1;
                }
                else if (!stage && sf["$_$__onStageDic__"][this.uuid]) {
                    sf["$_$__onStageRef__"]--;
                    delete sf["$_$__onStageDic__"][this.uuid];
                }
            }
            ///=↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑新增↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
            if (this.spriteFrame && this.spriteFrame.texture instanceof RenderTexture) {
                const defines = { SAMPLE_FROM_RT: true, ...mat.passes[0].defines };
                const renderMat = new Material();
                renderMat.initialize({
                    effectAsset: mat.effectAsset,
                    defines,
                });
                mat = renderMat;
            }
            return mat;
        }

        let SpriteType = { 0: 'SIMPLE', 1: 'SLICED', 2: 'TILED', 3: 'FILLED', SIMPLE: 0, SLICED: 1, TILED: 2, FILLED: 3 };
        //在Sprite变更spriteFrame的时候 统计spriteFrame被所有Sprite引用的次数  被字典或数组储存的spriteFrame 不会被统计进来
        Sprite.prototype["_applySpriteFrame"] = function (oldFrame: SpriteFrame | null) {
            const spriteFrame = this._spriteFrame;

            ///=↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓新增↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            if (oldFrame) {
                if (!oldFrame["$_$__spriteRef__"]) oldFrame["$_$__spriteRef__"] = 0;
                if (!oldFrame["$_$__spriteDic__"]) oldFrame["$_$__spriteDic__"] = {};
                if (oldFrame["$_$__spriteDic__"][this.uuid]) {
                    oldFrame["$_$__spriteRef__"]--;
                    delete oldFrame["$_$__spriteDic__"][this.uuid];
                }

                if (!oldFrame["$_$__onStageRef__"]) oldFrame["$_$__onStageRef__"] = 0;
                if (!oldFrame["$_$__onStageDic__"]) oldFrame["$_$__onStageDic__"] = {};
                if (oldFrame["$_$__onStageDic__"][this.uuid]) {
                    oldFrame["$_$__onStageRef__"]--;
                    delete oldFrame["$_$__onStageDic__"][this.uuid];
                }

            }
            if (spriteFrame) {
                if (!spriteFrame["$_$__spriteRef__"]) spriteFrame["$_$__spriteRef__"] = 0;
                if (!spriteFrame["$_$__spriteDic__"]) spriteFrame["$_$__spriteDic__"] = {};
                if (!spriteFrame["$_$__spriteDic__"][this.uuid]) {
                    spriteFrame["$_$__spriteRef__"]++;
                    spriteFrame["$_$__spriteDic__"][this.uuid] = 1;
                }

                if (!spriteFrame["$_$__onStageRef__"]) spriteFrame["$_$__onStageRef__"] = 0;
                if (!spriteFrame["$_$__onStageDic__"]) spriteFrame["$_$__onStageDic__"] = {};
                if (this.node && this.node.stage && !spriteFrame["$_$__onStageDic__"][this.uuid]) {
                    spriteFrame["$_$__onStageRef__"]++;
                    spriteFrame["$_$__onStageDic__"][this.uuid] = 1;
                }
            }
            ///=↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑新增↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

            if (oldFrame && this._type === SpriteType.SLICED) {
                oldFrame.off(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
            }

            let textureChanged = false;
            if (spriteFrame) {
                if (!oldFrame || oldFrame.texture !== spriteFrame.texture) {
                    textureChanged = true;
                }
                if (textureChanged) {
                    if (this.renderData) this.renderData.textureDirty = true;
                    this.changeMaterialForDefine();
                }
                this._applySpriteSize();
                if (this._type === SpriteType.SLICED) {
                    spriteFrame.on(SpriteFrame.EVENT_UV_UPDATED, this._updateUVs, this);
                }
            }
        }



        /* let scene_activate = Scene.prototype["_activate"];
        Scene.prototype["_activate"] = function () {
            scene_activate.call(this);

            let nodeList = [];
            

            function loop(node: BaseNode) {
                if (node.children && node.children.length > 0) {
                    for (let key in node.children) {
                        let subNode = node.children[key];
                        nodeList.push(subNode);
                        if (subNode.emit) subNode.emit(NodeEventType.STAGE_CHANGED);// node.stage 可以检测有无舞台
                        loop(subNode);
                    }
                }
            }
            loop(this);


            for (let key in nodeList) {
                let node = nodeList[key]
                let stage = node.stage;
                if (stage && node.getComponent(Sprite) && node.getComponent(Sprite).spriteFrame) {
                    let sp = node.getComponent(Sprite);
                    let sf = node.getComponent(Sprite).spriteFrame;
                    if (!sf["$_$__onStageRef__"]) sf["$_$__onStageRef__"] = 0;
                    if (!sf["$_$__onStageDic__"]) sf["$_$__onStageDic__"] = {};
                    if (!sf["$_$__onStageDic__"][sp.uuid]) {
                        sf["$_$__onStageRef__"]++;
                        sf["$_$__onStageDic__"][sp.uuid] = 1;
                    }
                    else if (!stage && sf["$_$__onStageDic__"][sp.uuid]) {
                        sf["$_$__onStageRef__"]--;
                        delete sf["$_$__onStageDic__"][sp.uuid];
                    }
                }
            }
        }  */

    }
}
EngineOverride.startWrite()







