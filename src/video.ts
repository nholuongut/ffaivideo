import ffmpeg from 'fluent-ffmpeg';
import { setFFPath } from './utils/ffmpeg';
import { VideoConfig } from './config/config';
import { VideoAspect } from './config/constant';
import { toResolution } from './utils/video-aspect';
import {
  getMetadata,
  runFFmpegCommand,
  convertFiltersToString,
} from './utils/ffmpeg';
import { convertHexToAssColor } from './utils/utils';

const combineFinalVideo = async (
  videoDuration: number,
  audioFile: string,
  subtitleFile: string,
  downloadedVideos: string[],
  config: VideoConfig,
  progress: Function,
): Promise<string> => {
  setFFPath();
  const {
    bgMusic = '',
    voiceVolume = 1,
    bgMusicVolume = 0.5,
    fontSize,
    fontsDir = '',
    fontName = '',
    textColor,
    strokeColor,
    strokeWidth,
    textBottom,
    output,
  } = config;
  const clips = await processingSubVideos(
    videoDuration,
    downloadedVideos,
    config,
  );
  progress(90);
  
  let command = ffmpeg();
  let vfilter = '';
  clips.forEach((file, index) => {
    vfilter += `[${index}:v]`;
    command = command.addInput(file);
  });
  command.input(audioFile);
  command.input(bgMusic);
  command.input(subtitleFile);

  const filters = [
    `${vfilter}concat=n=${clips.length}:v=1:a=0[v]`,
    `[${clips.length}:a]volume=${voiceVolume}[audio]`,
    `[${clips.length + 1}:a]volume=${bgMusicVolume}[bg]`,
    `[audio][bg]amix=inputs=2[a]`,
    `[v]subtitles=${subtitleFile}[v]`,
  ];
  if (fontsDir || fontName) {
    const str = convertFiltersToString({
      fontsdir: fontsDir,
      fontname: fontName,
      fontsize: fontSize,
      fontcolor: convertHexToAssColor(textColor || ''),
      bordercolor: convertHexToAssColor(strokeColor || ''),
      borderw: strokeWidth,
      y: textBottom,
    });
    const subtitle = filters[filters.length - 1];
    filters[filters.length - 1] = subtitle.replace(/\[v\]$/g, `:${str}[v]`);
  }

  command.outputOptions([
    '-filter_complex',
    `${filters.join(';').replace(/;$/gi, '')}`,
    '-map',
    '[v]',
    '-map',
    `[a]`,
    '-c:v',
    'libx264',
    '-c:a',
    'aac',
    '-strict',
    'experimental',
    '-t',
    `${videoDuration}`,
  ]);
  command.fps(30).addOutput(output);
  await runFFmpegCommand(command);
  return output;
};

// Pre-crop all downloaded sub-videos
const processingSubVideos = async (
  videoDuration: number,
  downloadedVideos: string[],
  config: VideoConfig,
): Promise<string[]> => {
  const {
    videoClipDuration: maxClipDuration = 5,
    videoAspect = VideoAspect.Portrait,
  } = config;
  const [videoWidth, videoHeight] = toResolution(videoAspect);
  const clips = [];
  let index = 0;
  let totalDuration = 0;

  while (totalDuration < videoDuration) {
    const videoPath = downloadedVideos[index];
    const { duration, width, height } = await getMetadata(videoPath);
    const lastDur = Math.floor(videoDuration - totalDuration);
    const realDur = Math.min(lastDur, duration, maxClipDuration);
    if (realDur <= 0) break;

    const ffcommand = ffmpeg(videoPath).noAudio();
    ffcommand.inputOptions('-ss 00:00:00').inputOptions(`-t ${realDur >> 0}`);
    ffcommand.fps(30);
    const filters = [];
    if (width != videoWidth || height != videoHeight) {
      let clipRatio = width / height;
      let videoRatio = videoWidth / videoHeight;
      if (clipRatio == videoRatio) {
        filters.push(`scale=${videoWidth}:${videoHeight}`);
      } else {
        let scaleFactor;
        if (clipRatio > videoRatio) {
          scaleFactor = videoWidth / width;
        } else {
          scaleFactor = videoHeight / height;
        }
        let newWidth = width * scaleFactor;
        let newHeight = height * scaleFactor;
        filters.push(`scale=${newWidth}:${newHeight}`);
      }
      filters.push(
        `pad=${videoWidth}:${videoHeight}:(ow-iw)/2:(oh-ih)/2:black`,
      );
    }
    ffcommand.videoFilters(filters);
    const output = videoPath.replace(/vid-/, 'o-');
    ffcommand.addOutput(output);
    await runFFmpegCommand(ffcommand);
    clips.push(output);

    totalDuration += realDur;
    index++;
    if (index >= downloadedVideos.length) index = 0;
  }

  return clips;
};

export { combineFinalVideo };
