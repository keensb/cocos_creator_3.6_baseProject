# 此.py文件放在 creator 3.x版本的根目录下, 与assets文件夹同级  自动导出配置到 ./script/config/usingAssets.ts 文件

'''
    不支持骨骼动画资源   请先自行把骨骼动画封装成预制体
'''
'''
os.path.abspath(path) #返回绝对路径<---------------------------------------------有用
os.path.basename(path) #返回文件名<---------------------------------------------有用
os.path.commonprefix(list) #返回多个路径中，所有path共有的最长的路径。
os.path.dirname(path) #返回文件路径<---------------------------------------------有用
os.path.exists(path)  #路径存在则返回True,路径损坏返回False
os.path.lexists  #路径存在则返回True,路径损坏也返回True
os.path.expanduser(path)  #把path中包含的"~"和"~user"转换成用户目录
os.path.expandvars(path)  #根据环境变量的值替换path中包含的”$name”和”${name}”
os.path.getatime(path)  #返回最后一次进入此path的时间。<---------------------------------------------有用
os.path.getmtime(path)  #返回在此path下最后一次修改的时间。<---------------------------------------------有用
os.path.getctime(path)  #返回path的大小
os.path.getsize(path)  #返回文件大小，如果文件不存在就返回错误
os.path.isabs(path)  #判断是否为绝对路径
os.path.isfile(path)  #判断路径是否为文件<---------------------------------------------有用
os.path.isdir(path)  #判断路径是否为目录<---------------------------------------------有用
os.path.islink(path)  #判断路径是否为链接
os.path.ismount(path)  #判断路径是否为挂载点
os.path.join(path1[, path2[, ...]])  #把目录和文件名合成一个路径
os.path.normcase(path)  #转换path的大小写和斜杠
os.path.normpath(path)  #规范path字符串形式
os.path.realpath(path)  #返回path的真实路径
os.path.relpath(path[, start])  #从start开始计算相对路径
os.path.samefile(path1, path2)  #判断目录或文件是否相同
os.path.sameopenfile(fp1, fp2)  #判断fp1和fp2是否指向同一文件
os.path.samestat(stat1, stat2)  #判断stat tuple stat1和stat2是否指向同一个文件
os.path.split(path)  #把路径分割成dirname和basename，返回一个元组
os.path.splitdrive(path)   #一般用在windows下，返回驱动器名和路径组成的元组
os.path.splitext(path)  #分割路径，返回路径名和文件扩展名的元组
os.path.splitunc(path)  #把路径分割为加载点与文件
# 遍历path，进入每个目录都调用visit函数，visit函数必须有3个参数(arg, dirname, names)，dirname表示当前目录的目录名，names代表当前目录下的所有文件名，args则为walk的第三个参数
os.path.walk(path, visit, arg)
os.path.supports_unicode_filenames  #设置是否支持unicode路径名
'''


# list = os.listdir(rootdir)  # 列出文件夹下所有的目录与文件

import os
import re
import json
bundleNames = []


def findBundleInDir(dirPath):
    list = os.listdir(dirPath)  # 列出文件夹下所有的目录与文件
    for i in range(0, len(list)):
        path = os.path.join(dirPath, list[i])
        path = path.replace("\\", "/")
        file_extension = os.path.splitext(list[i])[1]
        if os.path.isdir(path):  # 这个是文件夹 继续递归向下遍历
            findBundleInDir(path)
        # 找到与文件夹对应的 .meta 检查一下它是不是bundle
        elif file_extension == ".meta" and os.path.isdir(path.split(".meta")[0]):
            with open(path, "r", encoding="utf-8") as file:
                read = file.read()
                jsonData = json.loads(read)
                if "isBundle" in jsonData["userData"] and jsonData["userData"]["isBundle"] == True:
                    if read.find("\"bundleName\": \"\"") != -1:  # 这个bundle没有自定义的名称 使用的是默认名
                        bundleNames.append([os.path.basename(path).split(".")[
                                            0], path.split(".meta")[0]])
                    else:
                        bundleNames.append([read.split("\"bundleName\":")[
                            1].split("\"")[1], path.split(".meta")[0]])


findBundleInDir("./assets")


fileArray = {}
filePathArray = {}
fileCount = 0

def findAssetInDir(bundleName, bundlePath, dirPath):
    list = os.listdir(dirPath)  # 列出文件夹下所有的目录与文件
    for i in range(0, len(list)):
        path = os.path.join(dirPath, list[i])
        if os.path.isfile(path):  # 这个是文件

            file_extension = os.path.splitext(list[i])[1]
            if file_extension != ".meta":  # 这个文件不是.meta
                # print(list[i])
                path = path.replace("\\", "/")
                if fileArray.get(bundleName) == None:
                    fileArray[bundleName] = []
                    filePathArray[bundleName] = []
                    global fileCount
                    fileCount += 1
                    
                fileArray[bundleName].append(path.split(bundlePath+"/")[1])
                filePathArray[bundleName].append(path)
                if bundleName == "resources":
                    print(path.split(bundlePath+"/")[1])
        elif os.path.isdir(path):  # 这个是文件夹 继续递归向下遍历
            findAssetInDir(bundleName, bundlePath, path)


for i in range(0, len(bundleNames)):
    findAssetInDir(bundleNames[i][0], bundleNames[i][1], bundleNames[i][1])


if not os.path.exists("./assets/script/config"):
    os.makedirs("./assets/script/config")

with open("./assets/script/config/usingAssets.ts", "w+", encoding="utf-8") as file:
    file.write("/** created by usingAssetExport_3x.py */"+"\n//asset目录下所有被设置为'Bundle'的文件夹, 里面资源都会被注册进来\n")
    file.write(
        'import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, sp, dragonBones, JsonAsset, TextAsset, Asset } from "cc";'+'\n\n')
    
    file.write("/*\n目前3.6版本发现的规律\n\t所有资源加载后储存在字典 assetManager.assets 里面, 每个资源生成一个对应的AssetInfo, AssetInfo的uuid就是该资源的key;  使用 bundle.get(path, type) 将尝试匹配对应的AssetInfo, 然后通过它的uuid在assetManager.assets里查找资源\n\tbundle.load('图片相对路径', SpriteFrame) 或 bundle.load('图片相对路径', Texture2D)  只能获得 ImageAsset, 类型参数 SpriteFrame 根本没用(这个在官方文档有说明)\n\tbundle.load('图片相对路径' + '/spriteFrame')  将获得 SpriteFrame, 不需要类型参数 SpriteFrame\n\tbundle.load('图片相对路径' + '/texture')  将获得 Texture2D, 不需要类型参数 Texture2D\n\tassetManager.loadAny(图片uuid + '@6c48a')  将在回调方法里获得 Texture2D   (或者使用更暴力的方式同步获取 assetManager.assets._map[图片uuid + '@6c48a'])\n\tassetManager.loadAny(图片uuid + '@f9941')  将在回调方法里获得 SpriteFrame   (或者使用更暴力的方式同步获取 assetManager.assets._map[图片uuid + '@f9941'])\n\ttexturePack打包图集, 配置文件与png文件去掉后缀名之后路径相同, 因此加载时必须声明 SpriteAtlas, 否则加载的就是 ImageAsset\n\tspine动画 json配置文件与png文件去掉后缀路径相同, 因此加载时必须声明 sp.SkeletonData, 否则加载的就是 ImageAsset   龙骨动画则不用(因为json与png去掉后缀 路径也不同名)\n*/\n\n")
    file.write("export const usingAssets = {"+"\n")
    for key in fileArray:
        fileCount -= 1
        file.write("\t" + key + ": {\n")
        # file.write("\t\t"+ "id: \"" + key + "\",\n")
        valueArr = fileArray[key]
        filePathArr = filePathArray[key]
        fileNameArray = []
        _len = len(valueArr)
        for i in range(0, _len):
            fileName = os.path.basename(valueArr[i])
            # 把 ???@2x.png 这类图片资源名称改为 ???_a2x.png
            tempName = fileName.replace("@", "_a")
            file_extension = fileName.split(".")[-1:][0].lower()
            tempName = ".".join(tempName.split('.')[:-1])

            fileName = tempName + "_" + file_extension

            n = 1
            pattern = r'[a-zA-Z]|_'
            pattern2 = re.compile(r'[^0-9a-zA-Z]')

            if not re.match(pattern, fileName[0:1]):
                # print("名字不是以字母或下划线开头的文件 ", fileName)
                fileName = "_" + fileName

            # 把非下划线 数字 字母组合的名称替换为下划线
            fileName = re.sub(pattern2, "_", fileName)
            tempName = fileName

            while fileName in fileNameArray:  # 避免重名
                # print("bundle:", key + "下有已存在同名资源",
                #       "-->", fileName, "自动使用其他名称")
                fileName = tempName + "$" + str(n)
                n = n + 1
            fileNameArray.append(fileName)
            assetType = "Asset"
            uuid = ""
            jsonData1 = {}
            if os.path.exists(filePathArr[i] + ".meta"):
                with open(filePathArr[i] + ".meta", "r", encoding="utf-8") as file1:
                    read1 = file1.read()
                    jsonData1 = json.loads(read1)
                    uuid = jsonData1["uuid"]
            if file_extension == "anim":  # 动画剪辑
                assetType = "AnimationClip"
            elif file_extension == "labelatlas":  # 艺术字
                assetType = "LabelAtlas"
            elif file_extension == "fnt":  # 位图文字
                assetType = "Font"
            elif file_extension == "plist":  # 图集
                assetType = "SpriteAtlas"
            elif file_extension == "png" or file_extension == "jpg" or file_extension == "jpeg" or file_extension == "bmp" or file_extension == "webp":  # 单图
                assetType = "SpriteFrame"
            elif file_extension == "prefab":  # 预制体
                assetType = "Prefab"
            elif file_extension == "mp3" or file_extension == "wav" or file_extension == "ogg":  # 音频
                assetType = "AudioClip"
            elif file_extension == "json":  # json配置文件
                assetType = "JsonAsset"
                # 优先从比较小的.meta文件去解析 如果新资源传入creator项目并在IDE里刷新了资源包 都会生成这个 .meta文件
                if os.path.exists(filePathArr[i] + ".meta"):
                    if "importer" in jsonData1 and jsonData1["importer"] == "spine-data":
                        assetType = "sp.SkeletonData"
                    elif "importer" in jsonData1 and jsonData1["importer"] == "dragonbones":
                        assetType = "dragonBones.DragonBonesAsset"
                    elif "importer" in jsonData1 and jsonData1["importer"] == "dragonbones-atlas":
                        assetType = "dragonBones.DragonBonesAtlasAsset"
                # .meta文件尚未生成 只能从较大的json文件去解析
                else:
                    with open(filePathArr[i], "r", encoding="utf-8") as file2:
                        read2 = file2.read()
                        jsonData2 = json.loads(read2)
                        if "skeleton" in jsonData2 and "spine" in jsonData2["skeleton"]:
                            assetType = "sp.SkeletonData"
                        elif "compatibleVersion" in jsonData2 and "armature" in jsonData2:
                            assetType = "dragonBones.DragonBonesAsset"
                        elif "imagePath" in jsonData2 and "SubTexture" in jsonData2:
                            assetType = "dragonBones.DragonBonesAtlasAsset"
            elif file_extension == "txt":
                assetType = "TextAsset"

            info = fileName + ": { bundle: \"" + key + "\", url: \"" + valueArr[i].split("." + file_extension)[
                0] + "\", ext: \"." + file_extension + "\", type: " + assetType + (", uuid: \"" + uuid + "\" }" if uuid != "" else " }")
            print(info)
            if i < _len - 1:
                info = info + ","
            # value[i].split(file_extension)[0]
            file.write("\t\t" + info + "\n")
        file.write("\t},\n" if fileCount > 0 else "\t}\n")
    file.write("}\n")
    file.write(
        "globalThis[\"usingAssets\"] = usingAssets;\n")

    file.write("\n\nexport const usingBundles = {"+"")
    for valueArr in bundleNames:
        file.write("\n\t" + valueArr[0] + ": " + "\"" + valueArr[0] + "\",")
    file.write("\n}\n")
    file.write(
        "globalThis[\"usingBundles\"] = usingBundles;")
    


input("\n\n=============================================导出配置完成=============================================")
