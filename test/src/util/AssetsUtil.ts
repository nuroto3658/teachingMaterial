class AssetsUtil
{
	private static instance: AssetsUtil;

	public constructor()
	{
	}

	public static getInstance(): AssetsUtil
	{
		if (!AssetsUtil.instance)
		{
			AssetsUtil.instance = new AssetsUtil();
		}

		return AssetsUtil.instance;
	}

	/**
	 * 透過 AssetsConfig 紀錄動畫檔名、armature 的設定檔建立龍骨
	 * @param config
	 * @param playTimes
	 * @param usePool
	 */
	public getDragonBoneByConfig(
		config: string,
		playTimes?: number,
		usePool: boolean = false
	): dragonBones.EgretArmatureDisplay
	{
		const self = this;

		const configAry: string[] = config.split('|');
		const fileName: string = configAry[0];
		let armatureName: string = configAry[1];
		let animationName: string = '';
		if (configAry.length > 2)
		{
			animationName = configAry[2];
		}

		let display: dragonBones.EgretArmatureDisplay;

		const key = 'dragonFactory';

		let factory: dragonBones.EgretFactory
		if (!factory)
		{
			factory = new dragonBones.EgretFactory();
		}

		let skeletonData

		if (!skeletonData)
		{
			skeletonData = RES.getRes(`${fileName}_ske_json`);

			if (skeletonData == null)
			{
				throw new Error(
					`getDragonBoneByConfig is failed. Can not get resource by ${fileName}_ske_json`
				);
			}

			factory.addDragonBonesData(factory.parseDragonBonesData(skeletonData));
			//處理Texture
			self.addDragonTexture(factory, fileName);
		}

		display = factory.buildArmatureDisplay(
			armatureName
		);

		return display;
	}

	private addDragonTexture(factory: dragonBones.EgretFactory, name: string): void
	{
		let textureData = RES.getRes(`${name}_tex_json`);
		let texture = RES.getRes(`${name}_tex_png`);

		//配置只有一張圖
		if (texture)
		{
			factory.addTextureAtlasData(factory.parseTextureAtlasData(textureData, texture));
			return;
		}

		//自動配置多張圖
		let seq: number = 0;
		while (true)
		{
			textureData = RES.getRes(`${name}_tex_${seq}_json`);
			texture = RES.getRes(`${name}_tex_${seq}_png`);

			if (textureData == null && texture == null)
			{
				return;
			} else if (
				(textureData != null && texture == null) ||
				(textureData == null && texture != null)
			)
			{
				throw new Error(
					`addDragonTexture failed. error getting ${name}_tex_${seq} resource.`
				);
			}

			factory.addTextureAtlasData(factory.parseTextureAtlasData(textureData, texture));
			seq++;
		}
	}
	/**
	 * 綁定龍骨插槽
	 *
	 * @param armatureDisplay 龍骨物件
	 * @param slotName 插槽名稱
	 * @param displayObj 將放入龍骨插槽裡的物件，建議外層再以 group 包裝，否則容易有其他問題
	 *
	 * @returns true，若插槽設定成功
	 */
	public static setDragonBoneSlotDisplay(
		armatureDisplay: dragonBones.EgretArmatureDisplay,
		slotName: string,
		displayObj: egret.DisplayObject
	): boolean
	{
		if (!displayObj)
		{
			console.log(
				`Failed display object for the slot name ${slotName} in the armature ${armatureDisplay.name}`
			);
			return false;
		}

		const slot = armatureDisplay.armature.getSlot(slotName);
		if (!slot)
		{
			console.log(`Slot name ${slotName} in the armature ${armatureDisplay.name} is not exist`);
			return false;
		}
		const slotNameKey = 'slotName';

		const objSlotName = displayObj[slotNameKey];
		if (objSlotName)
		{
			// 備註：同個物件 重複塞入不同插槽時 如果不把物件前一個插槽的記憶體釋放斷開連結 將無法塞進
			const preSlot = armatureDisplay.armature.getSlot(objSlotName);
			if (preSlot)
			{
				preSlot.display = null;
			}
		}

		if (!!slot.display)
		{
			// 備註：提醒插槽重複插入 如無清除原物件有可能造成記憶體膨脹
			console.log(`Slot name ${slotName} have displayObj in the armature ${armatureDisplay.name}`);
		}

		displayObj[slotNameKey] = slotName;
		slot.display = displayObj;
		slot.invalidUpdate();
		return true;
	}

	/**
	 * 移除龍骨插槽中的顯示元件
	 *  * @param armatureDisplay 龍骨物件
	 * @param slotName 插槽名稱
	 */
	public static removeDragonBoneSlotDisplay(
		armatureDisplay: dragonBones.EgretArmatureDisplay,
		slotName: string
	): boolean
	{
		const slot = armatureDisplay.armature.getSlot(slotName);

		if (!slot)
		{
			return false;
		}

		const removeObj = slot.display;

		if (!removeObj)
		{
			return false;
		}

		const slotNameKey = 'slotName';
		removeObj[slotNameKey] = null;

		slot.display = null;
	}

	//刪除Group內的子項目 包含龍骨移除
	public static removeGroupChildren(targetGP: egret.DisplayObjectContainer)
	{
		const len = targetGP.numChildren;
		let anim;
		for (let i = 0; i < len; i++)
		{
			anim = targetGP.removeChildAt(0);
			if (anim instanceof dragonBones.EgretArmatureDisplay) anim.dispose();
			anim = null;
		}
		targetGP.removeChildren();
	}

}
