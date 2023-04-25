import { AssetManager, assetManager, Asset, SpriteFrame } from "cc";
import { usingAssets } from "../config/usingAssets";

//傻瓜式用法 let res = await asyncAsset.loadOneBundle("bundleName", "资源在bundle文件夹件里的路径", cc类型列如SpriteFrame); 自动先搜索或加载bundle 再搜索或加载资源 然后返回

/*
//关于官方文档 的 "可传入进度回调以及完成回调，通过组合 `request` 和 `options` 参数，几乎可以实现和扩展所有想要的加载效果。非常建议"  --- request 和 options 是个什么鬼??
1 首先在控制台输入 
    cc.assetManager.loadAny 
  会返回代码块 点击代码块可以定位到实现assetManager.loadAny的位置

2 在 public loadAny() 函数定义的末行  "pipeline.async(task);" 打个断点

3 在控制台输入 
    cc.assetManager.loadAny({'path': 'images/background'}, {'myParam': 'important'}, ()=>{console.log("这是进度回调 progress callback")}, ()=>{console.log("这是完成回调 complete callback")});

4 断点被命中时 在控制台依次输入 request、 options、 onProgress、 onComplete  看看这些都是啥

5 省流: request={'path': 'images/background'}  options={'myParam': 'important'}  
*/
export class asyncAsset {
    /**
     * 通过异步队列的方式加载一个分包 bundle , 第二个参数的用途是: 询问是否在加载bundle的同时, 顺便把该bundle下的所有子资源都一并加载了
     */
    public static async loadOneBundle(bundleName: string, loadAllSubAssets = false, onProgress?: (finished, total, res?) => void, onComplete?: (error?, resArray?) => void,): Promise<AssetManager.Bundle> {
        return new Promise<AssetManager.Bundle>(resolve => {
            let _bundle = assetManager.getBundle(bundleName);
            if (_bundle) {
                if (!loadAllSubAssets) {
                    resolve(_bundle);
                }
                else {
                    _bundle.loadDir("./", (finished, total, res) => {
                        if (onProgress) {
                            onProgress(finished, total, res);
                        }
                    },
                        (error, resArray) => {
                            if (onComplete) {
                                onComplete(error, resArray);
                            }
                            if (!error) {
                                resolve(_bundle);
                            }
                            else {
                                resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                            }
                        })
                }
                return;
            }
            assetManager.loadBundle(bundleName, (error, bundle) => {
                if (!error) {
                    if (!loadAllSubAssets) {
                        resolve(bundle);
                    }
                    else {
                        bundle.loadDir("./", (finished, total, res) => {
                            if (onProgress) {
                                onProgress(finished, total, res);
                            }
                        },
                            (error, resArray) => {
                                if (onComplete) {
                                    onComplete(error, resArray);
                                }
                                if (!error) {
                                    resolve(bundle);
                                }
                                else {
                                    resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                                }
                            })
                    }
                }
                else {
                    console.info("bundle " + bundleName + " 不存在!")
                    resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                }
            })
        });
    }


    /**
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下的某个文件下的所有资源
     *  如果要加载 bundle 本身的文件夹, 第二个参数写 "./" 或使用默认值就好 
     */
    public static async bundleLoadDir(bundle: AssetManager.Bundle, dirName: string = "./", onProgress?: (finished, total, res?) => void, onComplete?: (error?, resArray?) => void): Promise<Asset[]> {
        return new Promise<Asset[]>(resolve => {
            bundle.loadDir(dirName,
                (finished, total, res) => {
                    if (onProgress) {
                        //console.info(finish,total)//预先获取加载总数量
                        onProgress(finished, total, res);//注意total也需要预读文件夹中的资源总数量, 是会动态发生改变的  可能引发进度条跳动的情况
                    }
                },
                (error, resArray) => {
                    if (onComplete) {
                        onComplete(error, resArray);
                    }
                    if (!error) {
                        resolve(resArray);
                    }
                    else {
                        resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                    }
                })
        });
    }


    /**
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下的某个资源
     *  (注意:第二个参数不要带后缀名 例如 aaa/bbb.json 只要写 "aaa/bbb"就好)
     *  3.x的巨坑: 如果加载的是图片资源 例如 aa/bb/img.jpg   要写成 "aa/bb/img/spriteFrame"(加载出来的是SpriteFrame对象) 或 "aa/bb/img/texture"(加载出来的是Texture2D对象) 直接写 "aa/bb/img" 加载出来的是不伦不类的 ImageAsset 对象
     */
    public static async bundleLoadOneAsset<T>(bundle: AssetManager.Bundle | string, urlObj: string, assetType?: new (...args) => T, onComplete?: (currentRes?: new (...args) => T) => void): Promise<T>;
    public static async bundleLoadOneAsset<T>(bundle: AssetManager.Bundle | string, urlObj: { url: string }, assetType?: new (...args) => T, onComplete?: (currentRes?: new (...args) => T) => void): Promise<T>;
    public static async bundleLoadOneAsset<T>(bundle: AssetManager.Bundle | string, urlObj: string | { url: string }, assetType?: new (...args) => T, onComplete?: (currentRes?: any) => void): Promise<T> {
        let _bundle: any = bundle;
        if (typeof bundle == "string") {
            _bundle = assetManager.getBundle(bundle);
        }
        if (!_bundle) {
            if (typeof bundle == "string") {
                _bundle = await asyncAsset.loadOneBundle(bundle);
            }
        }
        let _urlObj: any = urlObj;
        //如果传入的urlObj是usingAsset.ts里的配置 assetType自动等于 urlObj.type
        if (!assetType && _urlObj.type) {
            assetType = _urlObj.type;
        }
        let resUrl = _urlObj["url"] || _urlObj;
        if (resUrl[resUrl.length - 1] == "/") {
            resUrl = resUrl.substring(0, resUrl.length - 1);
        }
        if (assetType && assetType.prototype && assetType.prototype.constructor) {//自动对应类型 补齐图片资源的后缀路径
            if (assetType.prototype.constructor.name == "SkeletonData" && _urlObj["uuid"]) {
                return new Promise<T>(resolve => {
                    if (!_bundle) {
                        console.warn("bundle不存在, 或未被加载");
                        if (onComplete) {
                            onComplete(null);//获取最后一个资源
                        }
                        resolve(null);
                        return;
                    }
                    assetManager.loadAny(_urlObj["uuid"], (error, res) => {
                        if (!error) {
                            resolve(res);
                            if (onComplete) {
                                onComplete(res);//获取最后一个资源
                            }
                        }
                        else {
                            console.warn("资源不存在, 请检查路径bundle " + _bundle.name + "所在路径" + _bundle.base + "下是否存在文件路径" + resUrl);//如果不存在,那多半是用错bundle或bundle路径了
                            if (onComplete) {
                                onComplete(null);//获取最后一个资源
                            }
                            resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                        }
                    })

                });
            }
            else if (assetType.prototype.constructor.name == "SpriteFrame") {
                let arr = resUrl.split("/");
                if (arr[arr.length - 1] !== "spriteFrame") {
                    resUrl += "/spriteFrame";
                }
            }
            else if (assetType.prototype.constructor.name == "Texture2D") {
                let arr = resUrl.split("/");
                if (arr[arr.length - 1] !== "texture") {
                    resUrl += "/texture";
                }
            }
        }

        return new Promise<T>(resolve => {
            if (!_bundle) {
                console.warn("bundle不存在, 或未被加载");
                resolve(null);
                return;
            }
            _bundle.load(resUrl, (error, res: any) => {
                if (!error) {
                    resolve(res);
                }
                else {
                    console.warn("资源不存在, 请检查路径bundle " + _bundle.name + "所在路径" + _bundle.base + "下是否存在文件路径" + resUrl);//如果不存在,那多半是用错bundle或bundle路径了
                    resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                }
            })

        });
    }


    public static async assetManagerLoadRemote(urlObject: string | string[], onProgress?: (finished?: number, total?: number, currentRes?: any) => void, onComplete?: (currentRes?: any) => void): Promise<any> {
        return new Promise<any>(resolve => {
            let urlArr: string[] = [];
            urlArr = urlArr.concat(urlObject);
            let total = urlArr.length;
            let count = 0;
            let lastAsset: any;
            for (let url of urlArr) {
                assetManager.loadRemote(url, (err, asset: Asset) => {
                    if (err != undefined) {
                        console.info("加载资源 " + url + " 失败!");
                        lastAsset = null;
                    }
                    else {
                        lastAsset = asset;
                    }
                    count++;
                    if (onProgress) {
                        onProgress(count, total, lastAsset);
                    }

                    if (onComplete) {
                        onComplete(lastAsset);//获取最后一个资源
                    }
                })
            }
            resolve(lastAsset);
        });
    }


    /**
     *  直接通过usingAssets里的配置获取其中一个资源
     */
    public static async loadOneUsingAsset<T>(usingAsset: { bundle: string, url: string, type: new (...args) => T }, onComplete?: (currentRes?: new (...args) => T) => void): Promise<T> {
        let res = await asyncAsset.bundleLoadOneAsset(usingAsset.bundle, usingAsset);
        return new Promise<any>(resolve => {
            if (onComplete) {
                onComplete(<any>res);
            }
            resolve(res);
        })
    }


    /**
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下、并且在usingAssets.ts文件中配置过的所有资源 
     */
    public static async bundleLoadOneUsingAsset(bundle: AssetManager.Bundle | string, onProgress?: (finished: number, total: number, finishPath?: string) => void, onComplete?: () => void): Promise<void> {
        let _bundle: any = bundle;
        if (typeof bundle == "string") {
            _bundle = assetManager.getBundle(bundle);
            if (!_bundle) {
                _bundle = await asyncAsset.loadOneBundle(bundle);
            }
        }

        return new Promise(resolve => {
            if (!_bundle) {
                console.warn("bundle不存在, 或未被加载");
                resolve(null);
                return;
            }

            const name = _bundle.name;
            const keys = [];

            for (let key in usingAssets[name]) {
                keys.push(key);
            }

            let fin = 0;
            let total = keys.length;
            for (let i = 0; i < keys.length; i++) {
                let object: any = usingAssets[name][keys[i]];
                if (object.urlPrefix) {
                    total += object.end - object.start;
                }
            }



            for (let i = 0; i < keys.length; i++) {
                let object: any = usingAssets[name][keys[i]];
                if (object.url) {
                    if (object.url[object.url.length - 1] == "/") {
                        object.url = object.url.substring(0, object.url.length - 1);
                    }
                    if (object.type && object.type.prototype && object.type.prototype.constructor) {//自动对应类型 补齐图片资源的后缀路径
                        if (object.type.prototype.constructor.name == "SkeletonData" && object["uuid"]) {
                            assetManager.loadAny(object["uuid"], (error, res) => {
                                fin++;
                                if (error != undefined) {
                                    console.info("资源包<" + name + "> 加载 {url:\"" + object.url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                                }
                                if (onProgress) {
                                    onProgress(fin, total, object.url);
                                }
                                if (fin == total) {
                                    if (onComplete) {
                                        onComplete();
                                    }
                                    resolve();
                                }
                            })
                            continue;
                        }
                        else if (object.type.prototype.constructor.name == "SpriteFrame") {
                            let arr = object.url.split("/");
                            if (arr[arr.length - 1] !== "spriteFrame") {
                                object.url += "/spriteFrame";
                            }
                        }
                        else if (object.type.prototype.constructor.name == "Texture2D") {
                            let arr = object.url.split("/");
                            if (arr[arr.length - 1] !== "texture") {
                                object.url += "/texture";
                            }
                        }
                    }
                    _bundle.load(object.url, object.type, (err, res) => {
                        fin++;
                        if (err != undefined) {
                            console.info("资源包<" + name + "> 加载 {url:\"" + object.url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                        }
                        if (onProgress) {
                            onProgress(fin, total, object.url);
                        }
                        if (fin == total) {
                            if (onComplete) {
                                onComplete();
                            }
                            resolve();
                        }
                    });
                }
                else {//以下是早前用于批量加载序列帧动画纹理的业务逻辑, 由于需求的数据格式无法通过工具asserExport.py实现(需要手动添加编辑, 但是每次运行asserExport.py就会被覆盖)  现已废弃 也可以保留
                    if (object.urlPrefix) {
                        //例如 testList: { urlPrefix: "aa/bb/cc", variableLength: 3, start:1, end:215, suffix:"_game_png", type: SpriteFrame }, 将加载 "aa/bb/cc001_game_png" 到 "aa/bb/cc215_game_png" 的资源
                        if (object.start > object.end) {
                            console.info("资源包<" + name + "> " + object.urlPrefix + " 出现序列资源问题, start数值" + object.start + " 大于end数值" + object.end);
                            return;
                        }
                        for (let j: number = object.start; j <= object.end; j++) {

                            let str = j.toString();
                            while (str.length < object.variableLength) {//仅在当前序列数值长度小于指定变量长度时, 才在序列数值前面补0;  如果指定长度是0 或 1, 而当前序列数值是 10(长度为2), 则不做处理(自适像 xxx_1.png<注意不是xxx_001.png> 到 xxx_9999.png 这类不固定后缀变量长度的序列)
                                str = 0 + str;
                            }
                            if (!object.type) {
                                object.type = SpriteFrame;
                            }
                            if (!object.suffix) {
                                object.suffix = "";
                            }
                            //if (!object.suffix)
                            let url = object.urlPrefix + str + object.suffix;
                            if (url[url.length - 1] == "/") {
                                url = url.substring(0, url.length - 1);
                            }

                            if (object.type.prototype.constructor.name == "SkeletonData" && object["uuid"]) {
                                assetManager.loadAny(object["uuid"], (error, res) => {
                                    fin++;
                                    if (error != undefined) {
                                        console.info("资源包<" + name + "> 加载 {url:\"" + object.url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                                    }
                                    if (onProgress) {
                                        onProgress(fin, total, object.url);
                                    }
                                    if (fin == total) {
                                        if (onComplete) {
                                            onComplete();
                                        }
                                        resolve();
                                    }
                                })
                                continue;
                            }
                            else if (object.type && object.type.prototype && object.type.prototype.constructor) {//自动对应类型 补齐图片资源的后缀路径
                                if (object.type.prototype.constructor.name == "SpriteFrame") {
                                    let arr = url.split("/");
                                    if (arr[arr.length - 1] !== "spriteFrame") {
                                        //url += "/spriteFrame";
                                    }
                                }
                                else if (object.type.prototype.constructor.name == "Texture2D") {
                                    let arr = url.split("/");
                                    if (arr[arr.length - 1] !== "texture") {
                                        url += "/texture";
                                    }
                                }
                            }
                            _bundle.load(url, object.type, (err, res) => {
                                if (err != undefined) {
                                    console.info("资源包<" + name + "> 加载 {url:\"" + url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                                }
                                fin++;
                                if (onProgress) {
                                    onProgress(fin, total, url);
                                }
                                if (fin == total) {
                                    if (onComplete) {
                                        onComplete();
                                    }
                                    resolve();
                                }

                            });
                        }
                    }
                }
            }
        })
    }


    /**
     *  把assetManager.loadAny转为异步队列 函数 可以通过 await实现
     */
    public static async loadAny<T extends Asset>(requests: string, onComplete?: (res: T) => void): Promise<T>;
    public static async loadAny<T extends Asset>(requests: string[], onComplete?: (res: T) => void): Promise<T>;
    public static async loadAny<T extends Asset>(requests: any, onComplete?: (res: T) => void): Promise<T> {
        return new Promise<T>(resolve => {
            assetManager.loadAny(requests, (err, res: T) => {
                if (!err) {
                    if (onComplete) {
                        onComplete(res);
                    }
                    resolve(res);
                }
                else {
                    if (onComplete) {
                        onComplete(null);
                    }
                    resolve(null);
                }
            })
        })
    }
}

window["asyncAsset"] = asyncAsset;