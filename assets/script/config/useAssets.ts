/** created by assetExport.py */
import { AnimationClip, LabelAtlas, Font, SpriteAtlas, SpriteFrame, Prefab, AudioClip, dragonBones, JsonAsset, Asset } from "cc";

export const useAssets = {
	res: {
		bg: { url: "bg", ext: "jpg", type: SpriteFrame },
		dog: { url: "dog", ext: "jpg", type: SpriteFrame },
		hzw: { url: "hzw", ext: "jpeg", type: Asset },
	},
}
globalThis["useAssets"] = globalThis["UA"] = useAssets;


export const useBundles = {
	res: "res",
	resources: "resources",
}
globalThis["useBundles"] = globalThis["UB"] = useBundles;