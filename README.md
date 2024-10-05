<p align="center">  
  <img src="./logo.png" alt="Logo" style="width:380px;">  
</p>

<p align="center"> 
A node.js project that generates short videos using popular AI LLM.
</p>

![](https://i.imgur.com/waxVImv.png)
### [View all Roadmaps](https://github.com/nholuongut/all-roadmaps) &nbsp;&middot;&nbsp; [Best Practices](https://github.com/nholuongut/all-roadmaps/blob/main/public/best-practices/) &nbsp;&middot;&nbsp; [Questions](https://www.linkedin.com/in/nholuong/)
<br/>

## FFAIVideo
A lightweight node.js project that utilizes the currently popular AI LLM in the industry to intelligently generate short videos. Without the need for complex configurations, simply input a short piece of text, and it can automatically synthesize an exciting video content.

## Features
- Fully developed on Node.js, enabling quick mastery by front-end developers.  
- Minimal dependencies, easy installation, cross-platform, and low machine requirements.  
- Simple usage, just input text to intelligently create compelling videos.  
- Supports Chinese and English scripts, with multiple voice options.  
- Includes subtitle generation, adjustable for font, position, color, and size.  
- Supports background music with adjustable volume.  

## Installation

```shell
npm install ffaivideo
```
Note: To run the preceding commands, Node.js and npm must be installed.

## Example usage

```javascript
const { generateVideo } = require('ffaivideo');

generateVideo(
  {
    provider: 'g4f',
    // Use the free g4f, or OpenAI, or Moonshot account
    // provider: 'openai',
    // openai: {
    //   apiKey: 'xxx',
    //   modelName: 'xxx',
    //   baseUrl: 'xxx',
    // },
    termsNum: 8,
    subtitleMaxWidth: 9,
    videoClipDuration: 12,
    voiceName: 'zh-CN-YunjianNeural',
    bgMusic: path.join(__dirname, './assets/songs/m1.mp3'),
    output: path.join(__dirname, './output'),
    pexels: {
      apiKey: 'xxx',
    },
    videoScript: `
    ...Enter your text here
  `,
  },
  progress => {
    console.log(progress);
  },
).then(videoPath => {
  console.log(videoPath);
});
```

## Installation preparation

#### About the config of LLM
The current project already supports multiple AI LLM models such as **OpenAI**, **Moonshot**, **Azure**, **g4f**, **Google Gemini**, etc. to meet your different needs. If you want to introduce other AI LLM models, please fork this project and submit a **Pull Request (PR)** for us to evaluate and merge.

Before using this project, please make sure that you have applied for an API Key from the corresponding service provider. For example, if you plan to use **GPT-4.0** or **GPT-3.5**, you need to make sure that you already have an API Key from [OpenAI](https://openai.com/). In addition, you can also choose to use g4f, which is an open source library that provides free GPT usage services. Please note that although g4f is free, its service stability may fluctuate, and the usage experience may be good and bad from time to time. You can find its repository link on GitHub: [https://github.com/xtekky/gpt4free](https://github.com/xtekky/gpt4free).

In addition, as another option, you can apply for API services by visiting the [Moonshot ai](https://www.moonshot.cn/) platform. After registration, you will immediately receive 15 of experience money, which is enough to support about 1,500 conversations. After successfully applying, you need to set the provider to moonshot and configure the corresponding apiKey to complete the project setup.

You need to configure **apiKey**, **modelName** and **baseUrl**. For azure ai, you also need to configure **apiVersion**.

```javascript
openai: {
  apiKey: 'xxxx',
  modelName: 'gpt-4-turbo-preview',
  baseUrl: 'https://api.openai.com/v1',
},
```

#### About video material site
The video resources of this project use the [Pexels](https://www.pexels.com) website. Please visit [https://www.pexels.com/api/new/](https://www.pexels.com/api/new/) and follow the instructions to apply for a new API key so that you can use the rich materials provided by Pexels in your project.

#### About voice tts
FFAIVideo integrates Microsoft [Edge's online text-to-speech](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech) service, powered by Microsoft Azure. Furthermore, it enables users to customize and set up their own app tokens for more flexible configuration and utilization of this service. As for the various voice options available for setup, you can find a detailed list in the following file within the GitHub repository: [https://github.com/nholuongut/ffaivideo/blob/main/src/config/voice-config.ts](https://github.com/nholuongut/ffaivideo/blob/main/src/config/voice-config.ts). This way, you can select the most suitable voice according to your specific needs.

#### About installing ffmpeg
Since FFAIVideo relies on FFmpeg for its functionality, it is essential that you install a standard, well-maintained version of FFmpeg. This will ensure that FFAIVideo operates smoothly and without any compatibility issues.

* How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)  
* How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)  
* How to compiling from Source on Linux [https://www.tecmint.com/install-ffmpeg-in-linux/](https://www.tecmint.com/install-ffmpeg-in-linux/)

## API Configuration
| Parameter name | Type | Default value | Description |
|--------|------|--------|------|
| provider | string | g4f | LLM Provider |
| moonshot | LLMConfig | - | Moonshot configuration |
| openai | LLMConfig | - | OpenAI configuration |
| azure | LLMConfig | - | Azure configuration |
| gemini | LLMConfig | - | Gemini configuration |
| g4f | LLMConfig | - | G4F configuration |
| pexels | MaterialSite | - | Pexels material site |
| videoScript | string | - | Script for generating videos |
| videoTerms | string \| string[] | - | Keywords for generating videos |
| videoAspect | VideoAspect | undefined | Video aspect ratio, can be undefined by default |
| videoClipDuration | number | 5 | Video clip duration, default is 5 seconds |
| termsNum | number | 5 | Number of keywords |
| output | string | - | Output path |
| cacheDir | string | - | Cache directory |
| voiceName | string | - | Voice name |
| voiceVolume | number | 1.0 | Voice volume, default is 1.0 |
| bgMusic | string | - | Background music |
| bgMusicVolume | number | 0.5 | Background music volume, default is 0.2 |
| fontsDir | string | - | Font directory |
| fontSize | number | 24 | Font size |
| fontName | string | - | Font name |
| textColor | string | "#FFFFFF" | Text color, default is "#FFFFFF" |
| strokeColor | string | "#000000" | Stroke color, default is "#000000" |
| strokeWidth | number | - | Stroke width |
| textBottom | number | 20 | Text bottom position |
| subtitleMaxWidth | number | - | Maximum subtitle width |
| debug | boolean | false | Debug mode |
| lastTime | number | 5 | Last time |
| removeCache | boolean | true | Whether to remove cache |

# I'm are always open to your feedback.  Please contact as bellow information:
### [Contact ]
* [Name: nho Luong]
* [Skype](luongutnho_skype)
* [Github](https://github.com/nholuongut/)
* [Linkedin](https://www.linkedin.com/in/nholuong/)
* [Email Address](luongutnho@hotmail.com)

![](https://i.imgur.com/waxVImv.png)
![](bitfield.png)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nholuong)

# License
* Nho Luong (c). All Rights Reserved.
