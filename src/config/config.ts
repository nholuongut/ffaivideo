import path from 'path';
import { merge } from 'lodash';
import { LLMConfig, defaultLLMConfig } from './llm-config';
import { VideoAspect } from './constant';
import { isFilePath } from '../utils/file';
import { uuid } from '../utils/utils';

interface MaterialSite {
  apiKey: string;
  host?: string;
  port?: number;
  enableProxy: boolean;
}

interface VideoConfig {
  taskId?: string;
  provider?: string;
  moonshot?: LLMConfig;
  openai?: LLMConfig;
  azure?: LLMConfig;
  gemini?: LLMConfig;
  g4f?: LLMConfig;
  pexels?: MaterialSite;
  videoScript?: string; // Script used to generate video
  videoTerms?: string | string[]; // Keywords used to generate video
  videoAspect?: VideoAspect; // Default can be undefined
  videoClipDuration?: number; // Default is 5 seconds
  termsNum?: number;
  output: string;
  cacheDir?: string;

  voiceName: string;
  voiceVolume?: number; // Default is 1.0
  bgMusic?: string;
  bgMusicVolume?: number; // Default is 0.2

  fontsDir?: string;
  fontSize?: number;
  fontName?: string;
  textColor?: string; // Default is "#FFFFFF"
  strokeColor?: string; // Default is "#000000"
  strokeWidth?: number;
  textBottom?: number;
  subtitleMaxWidth?: number;
  debug?: boolean;
  lastTime?: number;
  removeCache?: boolean;

  [key: string]: any;
}

const defaultPexels: MaterialSite = {
  apiKey: '',
  enableProxy: false,
  host: '10.10.1.10',
  port: 1080,
};

// A default VideoConfig for basic configuration
const defalutVideoConfig: VideoConfig = {
  provider: 'g4f',
  pexels: defaultPexels,
  output: '',
  cacheDir: '',
  debug: false,
  termsNum: 5,
  subtitleMaxWidth: 9999,
  lastTime: 5,
  voiceName: 'zh-CN-XiaoxiaoNeural',
  videoAspect: VideoAspect.Portrait,
  videoClipDuration: 6,
  voiceVolume: 1.0,
  bgMusicVolume: 0.5,
  textColor: '#FFFFFF',
  textBottom: 20,
  fontSize: 24,
  strokeColor: '#000000',
  strokeWidth: 1,
  removeCache: true,
};

// Merge your config and the default config
const mergeConfig = (config: VideoConfig): VideoConfig => {
  const fconfig = merge(defalutVideoConfig, config);
  fconfig.provider = fconfig.provider ?? 'g4f';
  fconfig[fconfig.provider] = merge(
    defaultLLMConfig[fconfig.provider],
    fconfig[fconfig.provider],
  );

  return fconfig;
};

const createOutputConfig = (config: VideoConfig): VideoConfig => {
  if (!config.output)
    throw new Error(
      'Sorry, you must enter an output file path or directory path.',
    );

  const taskId = uuid();
  config.taskId = taskId;
  if (isFilePath(config.output)) {
    const dir = path.dirname(config.output);
    config.cacheDir = path.join(dir, taskId, 'cache_files');
    config.output = config.output;
  } else {
    const dir = path.join(config.output, taskId);
    config.cacheDir = path.join(dir, 'cache_files');
    config.output = path.join(dir, `final.mp4`);
  }

  return config;
};

export {
  VideoConfig,
  LLMConfig,
  MaterialSite,
  mergeConfig,
  createOutputConfig,
};
