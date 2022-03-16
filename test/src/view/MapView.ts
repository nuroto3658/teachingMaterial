class MapView extends eui.Component implements eui.UIComponent
{

	// public buttonGP_1: eui.Group;
	// public optionGP_1: eui.Group;
	public callBack: Main;
	public maplock_2_Img: eui.Image;
	public maplock_3_Img: eui.Image;
	public icon_1: eui.Image;
	public icon_2: eui.Image;
	public icon_3: eui.Image;
	public constructor()
	{
		super();
	}

	protected partAdded(partName: string, instance: any): void
	{
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void
	{
		super.childrenCreated();
		this.icon_1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onMapClick("1"), this);
		this.icon_2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onMapClick("2"), this);
		this.icon_3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onMapClick("3"), this);
	}

	private onMapClick(level)
	{
		const self = this;
		// self.buttonGP_1.touchEnabled = false;
		self.visible = false;
		self.callBack.clickMapLevel(level);
	}

	public showIcon(mission)
	{
		const self = this;
		switch (mission)
		{
			case "game1":
				if (self.maplock_2_Img.alpha == 0) return;
				self.maplock_2_Img.visible = true;
				egret.Tween.get(self.maplock_2_Img)
					.to({ alpha: 0 }, 1500)
					.wait(500)
					.call(() => self.afterShowIcon(mission))
				break;
			case "game2":
				if (self.maplock_3_Img.alpha == 0) return;
				self.maplock_3_Img.visible = true;
				egret.Tween.get(self.maplock_3_Img)
					.to({ alpha: 0 }, 1500)
					.wait(500)
					.call(() => self.afterShowIcon(mission))
				break;
			case "game3":
				break;

		}
	}
	private afterShowIcon(mission)
	{
		const self = this;

		switch (mission)
		{
			case "game1":
				self.icon_2.visible = true;
				break;
			case "game2":
				self.icon_3.visible = true;
				break;
			case "game3":
				break;

		}
	}
}
