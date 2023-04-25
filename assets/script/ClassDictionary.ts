import { ClassSon } from "./../script/com/example/ClassSon";
import { ClassSuper } from "./../script/com/example/ClassSuper";
import { EngineOverride } from "./../script/overwrite/EngineOverride";
import { MainEntry } from "./../script/com/MainEntry";
import { asyncAsset } from "./../script/mgr/asyncAsset";


export class ClassDictionary {
    public static classDic: { [key: string]: any } = {};
    public static getClassNameByTarget(anyObj: any): string {
        if (anyObj) {
            let str: string = anyObj.toString();
            if (str.indexOf("function ") != -1) {
                let str1: string = str.split(" ")[1];
                return str1.split("(")[0];
            }
            //anyObj非空时 有 ["__class__"] 的是实例 否则是一个Class
            if (anyObj["constructor"] && anyObj["constructor"].name) return anyObj["constructor"].name;
            if (anyObj["__proto__"]) return anyObj["__proto__"];
            if (anyObj["__class__"]) return anyObj["__class__"];

            if (anyObj.prototype && anyObj.prototype["__class__"]) return anyObj.prototype["__class__"];
        }

        let str = Object.prototype.toLocaleString.call(anyObj);
        let str1: string = str.split(" ")[1];
        return str1.split("]")[0];
    }
}

ClassDictionary.classDic["ClassSon"] = ClassSon;
ClassDictionary.classDic["ClassSuper"] = ClassSuper;
ClassDictionary.classDic["EngineOverride"] = EngineOverride;
ClassDictionary.classDic["MainEntry"] = MainEntry;
ClassDictionary.classDic["asyncAsset"] = asyncAsset;
