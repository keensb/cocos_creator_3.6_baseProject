/** created by usingAssetExport_3x.py */
//asset目录下所有被设置为'Bundle'的文件夹, 里面资源都会被注册进来
import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, sp, dragonBones, JsonAsset, TextAsset, Asset } from "cc";

/*
目前3.6版本发现的规律
	所有资源加载后储存在字典 assetManager.assets 里面, 每个资源生成一个对应的AssetInfo, AssetInfo的uuid就是该资源的key;  使用 bundle.get(path, type) 将尝试匹配对应的AssetInfo, 然后通过它的uuid在assetManager.assets里查找资源
	bundle.load('图片相对路径', SpriteFrame) 或 bundle.load('图片相对路径', Texture2D)  只能获得 ImageAsset, 类型参数 SpriteFrame 根本没用(这个在官方文档有说明)
	bundle.load('图片相对路径' + '/spriteFrame')  将获得 SpriteFrame, 不需要类型参数 SpriteFrame
	bundle.load('图片相对路径' + '/texture')  将获得 Texture2D, 不需要类型参数 Texture2D
	assetManager.loadAny(图片uuid + '@6c48a')  将在回调方法里获得 Texture2D   (或者使用更暴力的方式同步获取 assetManager.assets._map[图片uuid + '@6c48a'])
	assetManager.loadAny(图片uuid + '@f9941')  将在回调方法里获得 SpriteFrame   (或者使用更暴力的方式同步获取 assetManager.assets._map[图片uuid + '@f9941'])
	texturePack打包图集, 配置文件与png文件去掉后缀名之后路径相同, 因此加载时必须声明 SpriteAtlas, 否则加载的就是 ImageAsset
	spine动画 json配置文件与png文件去掉后缀路径相同, 因此加载时必须声明 sp.SkeletonData, 否则加载的就是 ImageAsset   龙骨动画则不用(因为json与png去掉后缀 路径也不同名)
*/

export const usingAssets = {
	res: {
		zxnn_main_atlas_plist: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".plist", type: SpriteAtlas, uuid: "ec6af875-be27-41a4-92be-06042e848fde" },
		zxnn_main_atlas_png: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".png", type: SpriteFrame, uuid: "e80e626f-66d8-47ed-afd6-a74a52d53b22" },
		bg_jpg: { bundle: "res", url: "bg", ext: ".jpg", type: SpriteFrame, uuid: "2b14f3a8-b889-4ee4-8e8c-4ac66d19e4c0" },
		dog_jpg: { bundle: "res", url: "dog", ext: ".jpg", type: SpriteFrame, uuid: "dcabd975-61d3-4db7-b731-174086c525f3" },
		bawanglong_ske_json: { bundle: "res", url: "dragon/bawanglong_ske", ext: ".json", type: dragonBones.DragonBonesAsset, uuid: "8ccf8008-4e28-4b23-9b23-ab54323d55fd" },
		bawanglong_tex_json: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".json", type: dragonBones.DragonBonesAtlasAsset, uuid: "1262964e-9f1a-4c61-95d1-623bda580a0d" },
		bawanglong_tex_png: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".png", type: SpriteFrame, uuid: "fc7a0305-4ac0-4112-aba7-6aa2b11cfab8" },
		hzw_jpeg: { bundle: "res", url: "hzw", ext: ".jpeg", type: SpriteFrame, uuid: "b637398c-d65e-4aac-8d36-799850526b4a" },
		sound_1_mp3: { bundle: "res", url: "sound_1", ext: ".mp3", type: AudioClip, uuid: "71ccf2cf-1a76-40b6-950d-b55b543e0b28" },
		chuansongganzi_atlas_txt: { bundle: "res", url: "spine/chuansongganzi.atlas", ext: ".txt", type: TextAsset, uuid: "d903ba09-7ee6-48a2-9aaf-0a2aa96b6175" },
		chuansongganzi_json: { bundle: "res", url: "spine/chuansongganzi", ext: ".json", type: sp.SkeletonData, uuid: "e5d7ae7a-17e7-4571-8c0b-5ba4ecdc57fb" },
		chuansongganzi_png: { bundle: "res", url: "spine/chuansongganzi", ext: ".png", type: SpriteFrame, uuid: "d43b1e3a-923b-4d89-9464-3b0198638f4c" },
		bg_jpg$1: { bundle: "res", url: "sub1/bg", ext: ".jpg", type: SpriteFrame, uuid: "2abbf3c3-f370-4628-bf7e-5309b079dd06" },
		dog_jpg$1: { bundle: "res", url: "sub1/dog", ext: ".jpg", type: SpriteFrame, uuid: "97f98e01-e381-4a6b-a583-286ca590ee35" },
		hzw_jpeg$1: { bundle: "res", url: "sub1/hzw", ext: ".jpeg", type: SpriteFrame, uuid: "8b2ef6ff-4880-4af2-b7e2-abc28b8f33fc" },
		bg_jpg$2: { bundle: "res", url: "sub2/bg", ext: ".jpg", type: SpriteFrame, uuid: "343708b9-308b-4def-8b66-680b41b23b48" },
		dog_jpg$2: { bundle: "res", url: "sub2/dog", ext: ".jpg", type: SpriteFrame, uuid: "6c3a1e21-23a0-4cc1-b205-38690d07d67e" },
		hzw_jpeg$2: { bundle: "res", url: "sub2/hzw", ext: ".jpeg", type: SpriteFrame, uuid: "c46d8da0-7146-4505-a66e-b3d601a9b853" }
	}
}
globalThis["usingAssets"] = usingAssets;


export const usingBundles = {
	res: "res",
}
globalThis["usingBundles"] = usingBundles;