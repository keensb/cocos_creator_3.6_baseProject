/** created by assetExport.py */
import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, sp, dragonBones, JsonAsset, TextAsset, Asset } from "cc";

export const usingAssets = {
	res: {
		zxnn_main_atlas: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".plist", type: SpriteAtlas },
		zxnn_main_atlas$1: { bundle: "res", url: "atlas/zxnn_main_atlas", ext: ".png", type: SpriteFrame },
		bg: { bundle: "res", url: "bg", ext: ".jpg", type: SpriteFrame },
		dog: { bundle: "res", url: "dog", ext: ".jpg", type: SpriteFrame },
		bawanglong_ske: { bundle: "res", url: "dragon/bawanglong_ske", ext: ".json", type: dragonBones.DragonBonesAsset },
		bawanglong_tex: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".json", type: dragonBones.DragonBonesAtlasAsset },
		bawanglong_tex$1: { bundle: "res", url: "dragon/bawanglong_tex", ext: ".png", type: SpriteFrame },
		hzw: { bundle: "res", url: "hzw", ext: ".jpeg", type: SpriteFrame },
		RJ336669_img_main: { bundle: "res", url: "RJ336669_img_main", ext: ".webp", type: SpriteFrame },
		sound_1: { bundle: "res", url: "sound_1", ext: ".mp3", type: AudioClip },
		chuansongganzi_atlas: { bundle: "res", url: "spine/chuansongganzi.atlas", ext: ".txt", type: TextAsset },
		chuansongganzi: { bundle: "res", url: "spine/chuansongganzi", ext: ".json", type: sp.SkeletonData, uuid: "e5d7ae7a-17e7-4571-8c0b-5ba4ecdc57fb" },
		chuansongganzi$1: { bundle: "res", url: "spine/chuansongganzi", ext: ".png", type: SpriteFrame },
		bg$1: { bundle: "res", url: "sub1/bg", ext: ".jpg", type: SpriteFrame },
		dog$1: { bundle: "res", url: "sub1/dog", ext: ".jpg", type: SpriteFrame },
		hzw$1: { bundle: "res", url: "sub1/hzw", ext: ".jpeg", type: SpriteFrame },
		bg$2: { bundle: "res", url: "sub2/bg", ext: ".jpg", type: SpriteFrame },
		dog$2: { bundle: "res", url: "sub2/dog", ext: ".jpg", type: SpriteFrame },
		hzw$2: { bundle: "res", url: "sub2/hzw", ext: ".jpeg", type: SpriteFrame },
	},
}
globalThis["usingAssets"] = globalThis["UA"] = usingAssets;


export const usingBundles = {
	res: "res",
	resources: "resources",
}
globalThis["usingBundles"] = globalThis["UB"] = usingBundles;