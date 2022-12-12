import { ClassSon } from "./../script/utils/ClassSon";
import { ClassSuper } from "./../script/utils/ClassSuper";
import { MainEntry } from "./../script/com/MainEntry";
import { engineOverrider } from "./../script/overwrite/engineOverride";


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
ClassDictionary.classDic["MainEntry"] = MainEntry;
ClassDictionary.classDic["engineOverrider"] = engineOverrider;
