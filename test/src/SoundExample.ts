/**
 * 以下示例加载一个 MP3 文件，进行播放，并输出播放该 MP3 文件时所发生的声音事件的相关信息。
 */
class SoundExample extends egret.DisplayObjectContainer
{
	private index = 0;
	// public testSound: Array<egret.Sound> = [];
	public constructor()
	{
		super();
		this.startLoad();
	}
	private startLoad(): void
	{
		//创建 Sound 对象
		const sound = new egret.Sound();

		// const url: string = "resource/sound/loading_bgm.mp3";
		const url: string = "resource/sound/" + SoundList.list[this.index] + ".mp3";
		//添加加载完成侦听
		sound.once(egret.Event.COMPLETE, () => this.onLoadComplete(this.index), this);
		//开始加载
		sound.type = egret.Sound.MUSIC;
		sound.load(url);
		SoundDataMap.testSound.push(sound);

	}
	private onLoadComplete(index): void
	{
		//获取加载到的 Sound 对象
		//播放音乐
		if (index == SoundList.list.length - 1) return;
		this.index++
		const url: string = "resource/sound/" + SoundList.list[this.index] + ".mp3";
		//开始加载
		const sound = new egret.Sound();
		if (index < 4)
		{
			sound.type = egret.Sound.MUSIC;
		}
		else
		{
			sound.type = egret.Sound.EFFECT;
		}
		sound.load(url);
		SoundDataMap.testSound.push(sound);
		sound.once(egret.Event.COMPLETE, () => this.onLoadComplete(this.index), this);
	}
}
