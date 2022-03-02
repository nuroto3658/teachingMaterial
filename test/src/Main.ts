//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer
{


    protected createChildren(): void
    {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) =>
        {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () =>
        {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () =>
        {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e =>
        {
            console.log(e);
        })
    }

    private async runGame()
    {
        await this.loadResource()
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // this.startAnimation(result);
        // await platform.login();
        // const userInfo = await platform.getUserInfo();
        // console.log(userInfo);

    }

    private async loadResource()
    {
        try
        {
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("loading", 2);//載入loading組
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await this.loadTheme();
            await RES.loadGroup("preload", 1, loadingView);
            await RES.loadGroup("questions", 0);
            await RES.loadGroup("game2", 0);
            this.stage.removeChild(loadingView);
        }
        catch (e)
        {
            console.error(e);
        }
    }

    private loadTheme()
    {
        return new Promise((resolve, reject) =>
        {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () =>
            {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    private mapView: MapView = null;
    private gameView: GameView = null;
    private game_2_View: Game_2_View = null;
    private game_3_View: Game_3_View = null;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void
    {
        const self = this;
        self.gameView = new GameView();
        self.gameView.percentHeight = self.gameView.percentWidth = 100;
        self.gameView.verticalCenter = self.gameView.horizontalCenter = 0;
        self.gameView.callBack = self;
        self.addChild(self.gameView);

        self.mapView = new MapView();
        self.mapView.percentHeight = self.mapView.percentWidth = 100;
        self.mapView.verticalCenter = self.mapView.horizontalCenter = 0;
        self.mapView.callBack = self;
        self.addChild(self.mapView);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap
    {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void
    {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () =>
        {
            count++;
            if (count >= textflowArr.length)
            {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    public createView(scene)
    {
        const self = this;
        switch (scene)
        {
            case "game1":
                if (self.game_2_View) return;
                self.game_2_View = new Game_2_View();
                self.game_2_View.percentHeight = self.gameView.percentWidth = 100;
                self.game_2_View.verticalCenter = self.gameView.horizontalCenter = 0;
                self.game_2_View.callBack = self;
                self.addChildAt(self.game_2_View, 0)
                break;
            case "game2":
                if (self.game_3_View) return;
                self.game_3_View = new Game_3_View();
                self.game_3_View.percentHeight = self.gameView.percentWidth = 100;
                self.game_3_View.verticalCenter = self.gameView.horizontalCenter = 0;
                self.game_3_View.callBack = self;
                self.addChildAt(self.game_3_View, 0)
                break;
            case "game3":
                break;
        }

    }

    public onClickBackButton(state: string, mission: string): void
    {
        const self = this;

        self.mapView.visible = true;
        switch (state)
        {
            case "success":
                self.mapView.visible = true;
                self.mapView.showIcon(mission);
                if (mission == "game1")
                {
                    self.gameView.backGP.visible = false;
                    self.gameView.backBGimg.visible = false;
                    self.gameView.failImg.visible = false;
                    self.gameView.successImg.visible = false;
                    self.gameView.backButton.visible = false;
                    self.gameView.visible = false;
                }
                else if (mission == "game2")
                {
                    self.game_2_View.backGP.visible = false;
                    self.game_2_View.backBGimg.visible = false;
                    self.game_2_View.failImg.visible = false;
                    self.game_2_View.successImg.visible = false;
                    self.game_2_View.backButton.visible = false;
                    self.game_2_View.visible = false;
                }
                else if (mission == "game3")
                {
                    self.game_3_View.backGP.visible = false;
                    self.game_3_View.backBGimg.visible = false;
                    self.game_3_View.failImg.visible = false;
                    self.game_3_View.successImg.visible = false;
                    self.game_3_View.backButton.visible = false;
                    self.game_3_View.visible = false;
                }
                break;
            case "fail":
                if (mission == "game1")
                {
                    self.gameView.backGP.visible = false;
                    self.gameView.backBGimg.visible = false;
                    self.gameView.failImg.visible = false;
                    self.gameView.successImg.visible = false;
                    self.gameView.backButton.visible = false;
                    self.gameView.visible = false;
                }
                else if (mission == "game2")
                {
                    self.game_2_View.backGP.visible = false;
                    self.game_2_View.backBGimg.visible = false;
                    self.game_2_View.failImg.visible = false;
                    self.game_2_View.successImg.visible = false;
                    self.game_2_View.backButton.visible = false;
                    self.game_2_View.visible = false;
                }
                else if (mission == "game3")
                {
                    self.game_3_View.backGP.visible = false;
                    self.game_3_View.backBGimg.visible = false;
                    self.game_3_View.failImg.visible = false;
                    self.game_3_View.successImg.visible = false;
                    self.game_3_View.backButton.visible = false;
                    self.game_3_View.visible = false;
                }
                break;
        }
    }

    public clickMapLevel(level)
    {
        const self = this;
        switch (level)
        {
            case "1":
                self.gameView.startGame();
                break;
            case "2":
                self.game_2_View.startGame();
                break;
            case "3":
                self.game_3_View.startGame();
                break;
        }
    }
}
