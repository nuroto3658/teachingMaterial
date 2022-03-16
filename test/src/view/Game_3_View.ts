class Game_3_View extends eui.Component implements eui.UIComponent
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
	private nextButton: eui.Button;
	//	回答時間
	private totalTimes: number;
	//	問題數
	private questions: number = 0;
	private questionsList: number[];
	//	答題正確
	private correct: boolean = false;
	//	血量
	private playerHP: number = 5;
	private enemyHP: number = 5;
	public callBack: Main
	//	返回按鈕
	public backGP: eui.Group;
	public backBGimg: eui.Image;
	public backButton: eui.Button;
	public successImg: eui.Image;
	public failImg: eui.Image;
	//	血條
	private HPGP: eui.Group;
	private bossHPGP: eui.Group;
	// 超連結
	private hyperlinkGP: eui.Group;

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
		this.enemy = AssetsUtil.getInstance().getDragonBoneByConfig(AssetsConfig.BOSS_3_ANIMATION, 0, true);
		this.masterGP.addChild(this.player)
		this.enemyGP.addChild(this.enemy)

	}

	public startGame()
	{
		const self = this;
		self.resetSetting();
		self.visible = true;
		self.figureGP.visible = true;
		self.questionsList =
			Question.hard_questionList.sort(function ()
			{//隨機打亂這個陣列
				return Math.random() - 0.4;
			});
		egret.Tween.get(this)
			.wait(2000)
			.call(this.closeVsGP)
			.wait(1000)
			.call(this.startQuestion)
	}

	private resetSetting()
	{
		const self = this;
		let blood: eui.Image;
		//	寫條visible開啟
		for (let i = 0; i < self.HPGP.numChildren; i++)
		{
			blood = self.HPGP.getChildAt(i) as eui.Image;
			blood.visible = true;
			blood = self.bossHPGP.getChildAt(i) as eui.Image;
			blood.visible = true;
		}
		//	寫條回滿
		self.playerHP = AssetsConfig.fullHP;
		self.enemyHP = AssetsConfig.fullHP;
		//	動畫回到idle
		self.enemy.animation.gotoAndPlayByFrame("idle", 0, -1);
		self.player.animation.gotoAndPlayByFrame("idle", 0, -1);
	}
	private closeVsGP()
	{
		const self = this;
		self.figureGP.visible = false;
		self.HPGP.visible = true;
		self.bossHPGP.visible = true;

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
		if (self.questions > 9)
		{
			self.questions = 0;
		}
		let questions = self.questionsList[self.questions]
		self.questionImg.source = "question_0" + questions + "_hard_png";

		self.questionImg.visible = true;
		self.questionBGImg.visible = true;
		self.buttonGP.visible = true;
		self.countdownFNT.visible = true;
		self.buttonGP.touchEnabled = true;
		self.totalTimes = 60;
		egret.Tween.removeTweens(self)
		egret.Tween.get(self, { onChange: self.onChange, onChangeObj: self })
			.to({ totalTimes: 0 }, 60000)
			.wait(200)
			.call(() => self.onClickOption("5"));
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
		answer = Question.hard_answerList[self.questionsList[self.questions]].indexOf(input);
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
		let questions = self.questionsList[self.questions]
		if (questions == 1 || questions == 2)
		{
			if (self.correct)
			{
				self.answerImg.source = "noIntroduce_png";
			}
			else
			{
				self.answerImg.source = "noIntroduce_error_png";
			}
		}
		else
		{
			self.answerImg.source = "answer_0" + questions + "_hard_png";
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
		if (self.questionsList[self.questions] == 3)
		{
			self.createHyperlink(self.questionsList[self.questions]);
		}
		else if (self.questionsList[self.questions] == 4)
		{
			self.createHyperlink(self.questionsList[self.questions]);
		}
		self.questions++;
		egret.Tween.get(this)
			.wait(2000).call(this.showNext)
	}

	private createHyperlink(index): void
	{
		const self = this;
		let tx: egret.TextField;
		self.hyperlinkGP.touchEnabled = true;
		switch (index)
		{
			case 3:
				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://tfc-taiwan.org.tw", style: { "href": "https://tfc-taiwan.org.tw" } });
				tx.width = 450;
				tx.height = 30;
				tx.x = 353;
				tx.y = 196;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);

				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://www.mygopen.com/", style: { "href": "https://www.mygopen.com/" } });
				tx.width = 450;
				tx.height = 30;
				tx.x = 204;
				tx.y = 232;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);

				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://www.rumtoast.com/", style: { "href": "https://www.rumtoast.com/" } });
				tx.width = 450;
				tx.height = 30;
				tx.x = 204;
				tx.y = 267;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);

				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://cofacts.tw/", style: { "href": "https://cofacts.tw/" } });
				tx.width = 316;
				tx.height = 30;
				tx.x = 316;
				tx.y = 304;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);

				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://fact-checker.line.me/", style: { "href": "https://fact-checker.line.me/" } });
				tx.width = 460;
				tx.height = 30;
				tx.x = 255;
				tx.y = 341;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);

				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://getdr.com/", style: { "href": "https://getdr.com/" } });
				tx.width = 330;
				tx.height = 30;
				tx.x = 300;
				tx.y = 376;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);
				break;
			case 4:
				tx = new egret.TextField();
				tx.textFlow = new Array<egret.ITextElement>({ text: "https://i.win.org.tw/ ", style: { "href": "https://i.win.org.tw/ " } });
				tx.width = 330;
				tx.height = 30;
				tx.x = -10;
				tx.y = 352;
				tx.textColor = 0x0000FF;
				tx.touchEnabled = true;
				self.hyperlinkGP.addChild(tx);
				break;
		}

	}


	private showNext(): void
	{
		const self = this
		egret.Tween.removeTweens(self)
		self.nextImg.visible = true;
		self.nextButton.visible = true;
		self.nextButton.once(egret.TouchEvent.TOUCH_TAP, self.showAnimation, this);
	}

	private showAnimation(): void
	{
		const self = this;
		self.logoImg.visible = false;
		self.questionImg.visible = false;
		self.questionBGImg.visible = false;
		self.answerImg.visible = false;
		self.nextImg.visible = false;
		self.nextButton.visible = false;
		if (self.hyperlinkGP.numChildren > 0)
		{
			self.hyperlinkGP.removeChildren();
			self.hyperlinkGP.touchEnabled = false;
		}
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
		let bloodPosition = 0;
		let blood: eui.Image;
		switch (who)
		{
			case "master":
				self.player.animation.gotoAndPlayByFrame("attack", 0, 1);
				egret.setTimeout(() =>
				{
					self.enemyHP--
					if (self.enemyHP == 0)
					{
						self.enemy.animation.gotoAndPlayByFrame("dead", 0, 1);
						self.enemy.once(dragonBones.EgretEvent.COMPLETE, () => self.afterDead("enemy"), this);
						self.callBack.createView("game3");
						self.callBack.playSound("dragon_dead");
					}
					else
					{
						self.enemy.animation.gotoAndPlayByFrame("hurt", 0, 1);
						self.enemy.once(dragonBones.EgretEvent.COMPLETE, () => self.afterHurt("player"), this);
						self.callBack.playSound("attack");
						self.callBack.playSound("dragon_hurt");
					}

					bloodPosition = self.enemyHP + 2;
					blood = self.bossHPGP.getChildAt(bloodPosition) as eui.Image;
					blood.visible = false;
				}, self, 500);

				break;
			case "enemy":
				self.enemy.animation.gotoAndPlayByFrame("attack", 0, 1);
				egret.setTimeout(() =>
				{
					self.playerHP--
					if (self.playerHP == 0)
					{
						self.player.animation.gotoAndPlayByFrame("dead", 0, 1);
						self.player.once(dragonBones.EgretEvent.COMPLETE, () => self.afterDead("master"), this);
						self.callBack.playSound("dragon_attack");
						self.callBack.playSound("dead");
					}
					else
					{
						self.player.animation.gotoAndPlayByFrame("hurt", 0, 1);
						self.player.once(dragonBones.EgretEvent.COMPLETE, () => self.afterHurt("player"), this);
						self.callBack.playSound("hurt");
						self.callBack.playSound("dragon_attack");
					}
					bloodPosition = self.playerHP + 2;
					blood = self.HPGP.getChildAt(bloodPosition) as eui.Image;
					blood.visible = false;
				}, self, 500);
				break;
		}

	}

	private afterHurt(whoHurt): void
	{
		const self = this;
		self.startQuestion();
	}
	private afterDead(whoDead): void
	{
		const self = this;
		self.backGP.visible = true;
		self.backBGimg.visible = true;
		self.backButton.visible = true;
		let state: string;
		switch (whoDead)
		{
			case "master":
				self.failImg.visible = true;
				state = "fail";
				break;
			case "enemy":
				self.successImg.visible = true;
				state = "success";
				self.callBack.playSound("victory");
				break;
		}
		self.backButton.once(egret.TouchEvent.TOUCH_TAP, () => self.callBack.onClickBackButton(state, "game3"), this);
		this.player.animation.stop();
		this.enemy.animation.stop();
	}
}
