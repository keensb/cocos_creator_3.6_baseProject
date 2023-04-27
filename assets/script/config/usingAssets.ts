/** created by assetExport.py */
import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, sp, dragonBones, JsonAsset, TextAsset, Asset } from "cc";

/*
目前3.6版本发现的规律
	所有资源加载后储存在字典 assetManager.assets 里面, 每个资源生成一个对应的AssetInfo, AssetInfo的uuid就是该资源的key;  使用 bundle.get(path, type) 将尝试匹配对应的AssetInfo, 然后通过它的uuid在assetManager.assets里查找资源
	bundle.load('图片相对路径', SpriteFrame) 或 bundle.load('图片相对路径', Texture2D)  只能获得 ImageAsset, 类型参数 SpriteFrame 根本没用(这个在官方文档有说明)
	bundle.load('图片相对路径' + '/spriteFrame')  将获得 SpriteFrame, 不需要类型参数 SpriteFrame
	bundle.load('图片相对路径' + '/texture')  将获得 Texture2D, 不需要类型参数 Texture2D
	assetManager.loadAny(图片uuid + '@6c48a')  将在回调方法里获得 Texture2D
	assetManager.loadAny(图片uuid + '@f9941')  将在回调方法里获得 SpriteFrame
	spine动画josn数据文件只能通过 assetManager.loadAny(uuid) 的方式去加载才能获得正确类型 sp.SkeletonData, 否则返回一个 ImageAsset(因为如果spine动画的json文件叫做abcd.json, 那么它的图集肯定就叫做abcd.png, 两者去掉后缀变成同名同路径, 而bundle.load()的path参数又偏偏不允许带后缀名, 默认你要加载的是图集); 龙骨动画则不用
*/

export const usingAssets = {
	res: {
		zxnn_main_atlas_plist: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".plist", type: SpriteAtlas },
		zxnn_main_atlas_png: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".png", type: SpriteFrame },
		bg_jpg: { bundle: "res", url: "bg", ext: ".jpg", type: SpriteFrame },
		dog_jpg: { bundle: "res", url: "dog", ext: ".jpg", type: SpriteFrame },
		bawanglong_ske_json: { bundle: "res", url: "dragon/bawanglong_ske", ext: ".json", type: dragonBones.DragonBonesAsset },
		bawanglong_tex_json: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".json", type: dragonBones.DragonBonesAtlasAsset },
		bawanglong_tex_png: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".png", type: SpriteFrame },
		hzw_jpeg: { bundle: "res", url: "hzw", ext: ".jpeg", type: SpriteFrame },
		RJ336669_img_main_webp: { bundle: "res", url: "RJ336669_img_main", ext: ".webp", type: SpriteFrame },
		sound_1_mp3: { bundle: "res", url: "sound_1", ext: ".mp3", type: AudioClip },
		chuansongganzi_atlas_txt: { bundle: "res", url: "spine/chuansongganzi.atlas", ext: ".txt", type: TextAsset },
		chuansongganzi_json: { bundle: "res", url: "spine/chuansongganzi", ext: ".json", type: sp.SkeletonData, uuid: "e5d7ae7a-17e7-4571-8c0b-5ba4ecdc57fb" },
		chuansongganzi_png: { bundle: "res", url: "spine/chuansongganzi", ext: ".png", type: SpriteFrame },
		bg_jpg$1: { bundle: "res", url: "sub1/bg", ext: ".jpg", type: SpriteFrame },
		dog_jpg$1: { bundle: "res", url: "sub1/dog", ext: ".jpg", type: SpriteFrame },
		hzw_jpeg$1: { bundle: "res", url: "sub1/hzw", ext: ".jpeg", type: SpriteFrame },
		bg_jpg$2: { bundle: "res", url: "sub2/bg", ext: ".jpg", type: SpriteFrame },
		dog_jpg$2: { bundle: "res", url: "sub2/dog", ext: ".jpg", type: SpriteFrame },
		hzw_jpeg$2: { bundle: "res", url: "sub2/hzw", ext: ".jpeg", type: SpriteFrame }
	}
}
globalThis["usingAssets"] = globalThis["UA"] = usingAssets;


export const usingBundles = {
	res: "res",
	resources: "resources",
}
globalThis["usingBundles"] = globalThis["UB"] = usingBundles;