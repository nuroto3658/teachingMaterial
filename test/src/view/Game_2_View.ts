class Game_2_View extends eui.Component implements eui.UIComponent
{

	//	按鈕group
	private buttonGP: eui.Group;
	private button_1: eui.Button;
	private button_2: eui.Button;
	private button_3: eui.Button;
	private button_4: eui.Button;

	//	人物group
	private figureGP: eui.Group;
	private masterGP: eui.Group;
	private mapBGImg: eui.Image;
	private player: dragonBones.EgretArmatureDisplay;
	private enemyGP: eui.Group;
	private enemy: dragonBones.EgretArmatureDisplay;

	//	問題group
	private questionGP: eui.Group;
	private questionBGImg: eui.Image;
	private questionImg: eui.Image;
	private logoImg: eui.Image;
	private answerImg: eui.Image;
	private countdownFNT: eui.BitmapLabel;

	//	下一局開始
	private nextImg: eui.Image;
	//	回答時間
	private totalTimes: number;
	//	問題數
	private questions: number = 0;
	//	答題正確
	private correct: boolean = false;
	//	血量
	private playerHP: number = 5;
	private enemyHP: number = 5;
	public callBack: Main
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
		this.button_1.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onClickOption("1"), this);
		this.button_2.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onClickOption("2"), this);
		this.button_3.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onClickOption("3"), this);
		this.button_4.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.onClickOption("4"), this);
		this.player = AssetsUtil.getInstance().getDragonBoneByConfig(AssetsConfig.PLAYER_ANIMATION, 0, true);
		this.enemy = AssetsUtil.getInstance().getDragonBoneByConfig(AssetsConfig.BOSS_1_ANIMATION, 0, true);
		this.masterGP.addChild(this.player)
		this.enemyGP.addChild(this.enemy)

	}

	private onButtonClick()
	{
		const self = this;
		self.mapBGImg.visible = false;
		self.figureGP.visible = true;
		egret.Tween.get(this)
			.wait(2000)
			.call(this.closeVsGP)
			.wait(1000)
			.call(this.startQuestion)

	}
	private closeVsGP()
	{
		const self = this;
		self.figureGP.visible = false;

	}
	private startQuestion()
	{
		const self = this;
		self.enemy.animation.gotoAndPlayByFrame("idle", 0, -1);
		self.player.animation.gotoAndPlayByFrame("idle", 0, -1);
		this.countdownTimer()

	}

	private countdownTimer()
	{
		const self = this;
		self.questions++;
		if (self.questions > 2)
		{
			self.questions = 1
		}
		self.questionImg.source = "question_0" + self.questions + "_png";
		self.answerImg.source = "answer_0" + self.questions + "_png";
		self.questionImg.visible = true;
		self.questionBGImg.visible = true;
		self.buttonGP.visible = true;
		self.countdownFNT.visible = true;
		self.buttonGP.touchEnabled = true;
		self.totalTimes = 20;
		egret.Tween.removeTweens(self)
		egret.Tween.get(self, { onChange: self.onChange, onChangeObj: self })
			.to({ totalTimes: 0 }, 20000)
			.wait(200)
			.call(() => self.showAnswer());
	}


	private onChange(): void
	{
		this.countdownFNT.text = "" + Math.round(this.totalTimes);
	}

	private onClickOption(input: string)
	{
		const self = this;
		egret.Tween.removeTweens(self)
		self.buttonGP.touchEnabled = false;
		let answer: number;
		answer = Question.answerList[self.questions - 1].indexOf(input);
		if (answer == -1)
		{
			self.correct = false;
			self.logoImg.source = "no_png"
		}
		else
		{
			self.correct = true;
			self.logoImg.source = "yes_png"
		}
		egret.Tween.get(this)
			.wait(500).call(this.showAnswer)
	}

	private showAnswer()
	{
		const self = this
		egret.Tween.removeTweens(self)
		self.logoImg.visible = true;
		self.questionImg.visible = false;
		self.answerImg.visible = true;
		self.buttonGP.visible = false;
		self.countdownFNT.visible = false;
		egret.Tween.get(this)
			.wait(2000).call(this.showNext)
	}
	private showNext(): void
	{
		const self = this
		egret.Tween.removeTweens(self)
		self.nextImg.visible = true;
		self.nextImg.once(egret.TouchEvent.TOUCH_TAP, this.showAnimation, this);
	}

	private showAnimation(): void
	{
		const self = this;
		self.logoImg.visible = false;
		self.questionImg.visible = false;
		self.questionBGImg.visible = false;
		self.answerImg.visible = false;
		self.nextImg.visible = false;
		if (self.correct)
		{
			self.player.animation.gotoAndPlayByFrame("run", 0, 1);
			self.player.once(dragonBones.EgretEvent.COMPLETE, () => self.showAttack("master"), this);
		} else
		{
			self.enemy.animation.gotoAndPlayByFrame("run", 0, 1);
			self.enemy.once(dragonBones.EgretEvent.COMPLETE, () => self.showAttack("enemy"), this);
		}


	}

	private showAttack(who: string): void
	{
		const self = this;
		switch (who)
		{
			case "master":
				self.player.animation.gotoAndPlayByFrame("attack", 0, 1);
				egret.setTimeout(() =>
				{
					self.enemy.animation.gotoAndPlayByFrame("hurt", 0, 1);
					self.enemy.once(dragonBones.EgretEvent.COMPLETE, self.afterHurt, this);
					self.enemyHP--
				}, self, 500);

				break;
			case "enemy":
				self.enemy.animation.gotoAndPlayByFrame("attack", 0, 1);
				egret.setTimeout(() =>
				{
					self.player.animation.gotoAndPlayByFrame("hurt", 0, 1);
					self.player.once(dragonBones.EgretEvent.COMPLETE, self.afterHurt, this);
					self.playerHP--
				}, self, 500);
				break;
		}

	}

	private afterHurt(): void
	{
		const self = this;
		if (self.playerHP < 0)
		{
			self.player.animation.gotoAndPlayByFrame("dead", 0, 1);
			self.player.once(dragonBones.EgretEvent.COMPLETE, self.afterDead, this);
		}
		else if (self.enemyHP < 0)
		{
			self.enemy.animation.gotoAndPlayByFrame("dead", 0, 1);
			self.enemy.once(dragonBones.EgretEvent.COMPLETE, self.afterDead, this);
		}
		else
		{
			self.startQuestion();
		}
	}
	private afterDead(): void
	{
		const self = this;
		if (self.playerHP < 0)
		{
			self.player.animation.gotoAndPlayByFrame("die", 0, 1);
		}
		else if (self.enemyHP < 0)
		{
			self.enemy.animation.gotoAndPlayByFrame("die", 0, 1);
		}
		// self.createView()
	}
}
