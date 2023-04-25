import { getObjectGetter, getObjectSetter, superGetter, superSetter } from "./Super_Getter_Setter";
//namespace整合步骤3 把子模块都引入这里整合 同时让子模块执行注册脚本 (不带 "{xxx} from"  可以在引入时直接动用脚本文件内的顶级函数)

 


/**
    用万能的any类型
    
    globalThis["dev"] = <any>{}; 
    来做中转 就2行代码 可以节省很多功夫
 
    如果直接定义
    globalThis["dev"] = {} 
    的话会 报错:  类型“{}”缺少类型“typeof dev”中的以下属性: A, B   
    强迫你必须把 globalThis["dev"]的所有字段都补全了 例如要像下面这样写
 
    globalThis["dev"] = {
        A:null,
        B:null,
        ...,
        ...,
        ...,
        ...,
        ...,
        ...,
        ...,
        ...
    }
*/

export const ccutils = globalThis["ccutils"] = {
    superSetter: superSetter,
    superGetter: superGetter,
    getObjectSetter:getObjectSetter,
    getObjectGetter: getObjectGetter,
    
}





