import { AssetManager, assetManager, Asset, SpriteFrame } from "cc";
import { useAssets } from "../config/useAssets";

export class asyncAsset {
    /**
     * 通过异步队列的方式加载一个分包 bundle , 第二个参数的用途是: 询问是否在加载bundle的同时, 顺便把该bundle下的所有子资源都一并加载了
     */
    public static async loadOneBundle(bundleName: string, loadAllSubAssets = false, onProgress?: (finish, total, item?) => void, onComplete?: (error?, resArray?) => void,): Promise<AssetManager.Bundle> {
        return new Promise<AssetManager.Bundle>(resolve => {
            assetManager.loadBundle(bundleName, (error, bundle) => {
                if (!error) {
                    if (!loadAllSubAssets) {
                        resolve(bundle);
                    }
                    else {
                        bundle.loadDir("./", (finish, total, item) => {
                            if (onProgress) {
                                onProgress(finish, total, item);
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
                    console.info("分包 " + bundleName + " 不存在!")
                    resolve(null);//即使加载失败了也调用resolve() 当做成功来进行异步回调, 不过此时返回的是null, 表示该bundle不存在
                }
            })
        });
    }


    /**
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下的某个文件下的所有资源
     *  如果要加载 bundle 本身的文件夹, 第二个参数写 "./" 就好 
     */
    public static async bundleLoadDir(bundle: AssetManager.Bundle, dirName: string = "./", onProgress?: (finish, total, item?) => void, onComplete?: (error?, resArray?) => void): Promise<Asset[]> {
        return new Promise<Asset[]>(resolve => {
            bundle.loadDir(dirName,
                (finish, total, item) => {
                    if (onProgress) {
                        //console.info(finish,total)//预先获取加载总数量
                        onProgress(finish, total, item);//注意total也需要预读文件夹中的资源总数量, 是会动态发生改变的  可能引发进度条跳动的情况
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
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下的某个资源(注意:第二个参数不要带后缀名 例如 aaa/bbb.json 只要写 "aaa/bbb"就好)
     */
    public static async bundleLoadByUrl<T>(bundle: AssetManager.Bundle | string, resUrl: string, assetType?: new () => T): Promise<T> {
        return new Promise<T>(resolve => {
            let _bundle: any = bundle;
            if (typeof bundle == "string") {
                _bundle = assetManager.getBundle(bundle);
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


    public static async assetManagerLoadRemote(urlObject: string | string[], onProgress?: (finish?: number, total?: number, currentRes?: any) => void, onComplete?: (currentRes?: any) => void): Promise<any> {
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
     *  让一个 AssetManager.bundle 对象加载在其主文件夹下、并且在useAssets.ts文件中配置过的所有资源 
     */
    public static async bundleLoadUseAssets(bundle: AssetManager.Bundle, onProgress?: (finish: number, total: number, finishPath?: string) => void, onComplete?: () => void): Promise<void> {
        return new Promise(resolve => {
            const name = bundle.name;
            const keys = [];

            for (let key in useAssets[name]) {
                keys.push(key);
            }

            let fin = 0;
            let total = keys.length;
            for (let i = 0; i < keys.length; i++) {
                let object: any = useAssets[name][keys[i]];
                if (object.urlPrefix) {
                    total += object.end - object.start;
                }
            }

            for (let i = 0; i < keys.length; i++) {
                let object: any = useAssets[name][keys[i]];
                if (object.url) {
                    bundle.load(object.url, object.type, (err, res) => {
                        fin++;
                        if (err != undefined) {
                            console.info("资源包<" + name + "> 加载 {url:\"" + object.url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                        }
                        if (onProgress) {
                            onProgress(fin, total, keys[i]);
                        }
                        if (fin == total) {
                            if (onComplete) {
                                onComplete();
                            }
                            resolve();
                        }
                    });
                }
                else {
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
                            bundle.load(url, object.type, (err, res) => {
                                if (err != undefined) {
                                    console.info("资源包<" + name + "> 加载 {url:\"" + url + "\"" + ", type:\"" + object.type.prototype["__classname__"] + "\"} 失败!");//检查路径和类型
                                }
                                fin++;
                                if (onProgress) {
                                    onProgress(fin, total, keys[i]);
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
}
