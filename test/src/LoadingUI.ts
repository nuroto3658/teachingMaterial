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

class LoadingUI extends eui.Component implements RES.PromiseTaskReporter
{

    public constructor()
    {
        super();
        this.skinName = 'resource/eui_skins/LoadingUI.exml';//指定好對應的面板名稱；
        this.createView();
    }

    private loadGP: eui.Group;
    private textField: egret.TextField;
    private progressBar: eui.ProgressBar;

    private createView(): void
    {
        this.textField = new egret.TextField();
        this.textField.width = 500;
        this.textField.height = 100;
        this.textField.size = 40
        this.textField.x = 550;
        this.textField.y = 690;
        this.textField.textAlign = "center";
        this.loadGP.addChild(this.textField);
        this.once(egret.TouchEvent.TOUCH_TAP, this.playBGN, this)
    }

    private playBGN(): void
    {
        const self = this;
        SoundDataMap.channel.push(SoundDataMap.testSound[0].play(0, 0));
    }


    public onProgress(current: number, total: number): void
    {
        this.textField.text = `Loading...${current}/${total}`;


        var fill = (current / total);//0,1之間
        this.progressBar.value = fill * 100;//進度條顯示的進度控制
    }
}
