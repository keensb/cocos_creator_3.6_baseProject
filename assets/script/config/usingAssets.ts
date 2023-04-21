/** created by assetExport.py */
import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, dragonBones, JsonAsset, Asset } from "cc";

export const usingAssets = {
	res: {
		bg: { url: "bg", ext: ".jpg", type: SpriteFrame },
		dog: { url: "dog", ext: ".jpg", type: SpriteFrame },
		hzw: { url: "hzw", ext: ".jpeg", type: SpriteFrame },
		sound_1: { url: "sound_1", ext: ".mp3", type: AudioClip },
	},
}
globalThis["usingAssets"] = globalThis["UA"] = usingAssets;


export const usingBundles = {
	res: "res",
	resources: "resources",
}
globalThis["usingBundles"] = globalThis["UB"] = usingBundles;