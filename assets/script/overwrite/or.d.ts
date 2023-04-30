//or.d.ts 的作用是实现外部异步覆写, 外部异步覆写 的好处是不直接修改底层代码, 可以与保留原有的底层代码以便进行比较; 同时即便升级了新的creator版本也不会覆盖既有的覆写内容

//declare module 不能少  
declare module "cc" {//<----------注意:这里坑爹的地方  模块名不是 cc 而是带引号的字符串 "cc"    module cc 与 module "cc" 不是同一个模块 !!  3.x引擎声明了弃用 cc模块(declare const cc: never;)  然后改用了 "cc"模块(declare module "cc")   但仍然可以通过 window["cc"] 获得对这个 module "cc"的引用

    export interface BaseNode {
        /**
        * 检测Node之下有没有这个Component ,有的话直接返回Component的引用; 没有的话自动新增Component实例再返回其引用
        * @param   componentType 组件类型
        */
        getOrAddComponent<T extends Component>(componentType: new (...parmas) => T, ...agrs): T;

        /**
         * 检测BaseNode当前的最高父级节点是否为当前的Scene(director.getScene());  baseNode.stage不等同于baseNode.scene,  baseNode.stage会随着自身或任一父级容器的 加载/移除 检测自身当前最高父级节点是不是当前场景 并同时对外派发NodeEventType.STAGE_CHANGED消息通知
         */
        stage: Scene;

        /**
         * 检测本节点(最高级别为Scene)和其下各级子节点有没有这个Component, 有的话存进数组并最终返回
         */
        findSubComponent<T extends Component>(componentType: new (...parmas) => T, ...agrs): T[];
    }

    export namespace AssetManager {
        export interface Bundle {
            getUsingAsset<T extends Asset>(usingAsset: { url: string, type: new (...parmas) => T }): T;
        }
    }

    export interface SpriteFrame {
        /**
         * 判断SpriteFrame对象当前是否可以被安全销毁
         */
        destorySafe: boolean;
    }

    export interface Node {//这里声明是 interface Node  , 避免和 class Node 重复

        /**
         * 按照creator 2.x习惯直接修改 Node的不透明度
         */
        opacity: number;

        /**
         * 按照creator 2.x习惯直接修改 Node的宽度 用width会有黄字提示 width 已被弃用, 尤其在使用tween的时候控制台会被大量刷屏
         */
        nodeWidth: number;

        /**
         * 按照creator 2.x习惯直接修改 Node的高度 用height会有黄字提示 height 已被弃用, 尤其在使用tween的时候控制台会被大量刷屏
         */
        nodeHeight: number;

        /**
         * 按照creator 2.x习惯直接修改 Node在父级节点上的x坐标
         */
        x: number;

        /**
         * 按照creator 2.x习惯直接修改 Node在父级节点上的y坐标
         */
        y: number;

        /**
         * 按照creator 2.x习惯直接修改 Node在父级节点上的深度值
         */
        z: number;

        /**
         * 按照creator 2.x习惯直接修改 Node在父级节点上的深度值
         */
        zIndex: number;

        /**
         * 按照creator 2.x习惯直接修改 Node的水平拉伸比例
         */
        scaleX: number;

        /**
         * 按照creator 2.x习惯直接修改 Node的竖直拉伸比例
         */
        scaleY: number;

        /**
         * 按照creator 2.x习惯  不知道这是啥, 但是随手写了...
         */
        scaleZ: number;

        /**
         * 直接从node上获得 UITransform 的引用, 没有的话则自动添加
         */
        uiTransform: UITransform;
    }


    //定义事件
    export enum NodeEventType {
        STAGE_CHANGED = "scene-changed"
    }
}
