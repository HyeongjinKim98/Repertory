import styled from 'styled-components';
import SourceList from '@/components/project/SourceList';
import ProjectView from '@/components/project/ProjectView';
import Workbench from '@/components/project/Workbench';

import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { formatMilliSecondsToTimeString } from '@/util';
import { ISource } from '@/services/interface';

interface ITrimSection {
  start: number;
  end: number;
}
const Container = styled.div`
  display: flex;
  align-items: center;
`;
const SourceWrapper = styled(Container)`
  z-index: 10;
  margin: var(--sidebar-margin);
  border-radius: 10px;
  max-height: calc(100vh - var(--sidebar-margin) * 2);
  background-color: var(--sidebar-color);
  width: var(--sidebar-project--width);
  justify-content: space-evenly;
  flex-direction: column;
`;
const EditWrapper = styled(Container)`
  z-index: 10;
  margin-right: 10px;
  border-radius: 10px;
  min-height: calc(100vh - var(--sidebar-margin));
  width: calc(100vw - var(--sidebar-margin) * 3);
  min-width: calc(100vw - var(--sidebar-project--width));
  justify-content: space-evenly;
  flex-direction: column;
`;

const ViewWarpper = styled.div`
  border-radius: 10px;
  background-color: var(--sidebar-color);
  width: 100%;
  min-width: calc(100vw - var(--sidebar-project--width));
  display: flex;
  height: calc(82vh - var(--sidebar-margin) * 2);
  justify-content: center;
  align-items: center;
`;

const WorkbenchWarpper = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  min-height: calc(20vh - var(--sidebar-margin) * 2);
  background-color: var(--sidebar-color);
  width: calc(100vw - var(--sidebar-project--width));
  width: 100%;
  justify-content: space-evenly;
  flex-direction: column;
`;

const ProjectPage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRefOrg = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  if (loaded) console.log('ffmpeg loaded!');
  useEffect(() => {
    load();
  }, []);

  // Load FFmpeg
  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
      // use web worker
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        'text/javascript'
      ),
    });
    setLoaded(true);
  };

  // Get source (file =>(startMilliseconds, endMilliseconds))
  const trimVideo = async ({ start, end }: ITrimSection) => {
    console.log(
      `trim ${formatMilliSecondsToTimeString(
        start
      )} to ${formatMilliSecondsToTimeString(end)}`
    );
    const ffmpeg = ffmpegRef.current;
    if (!videoFile) {
      console.log('no file');
      return;
    }
    await ffmpeg.writeFile('input.avi', await fetchFile(videoFile));
    console.log(`[FFmpeg] : ${ffmpeg} is written`);

    console.log(formatMilliSecondsToTimeString(start));
    console.log(formatMilliSecondsToTimeString(end));
    await ffmpeg.exec([
      '-i',
      'input.avi',
      '-ss',
      formatMilliSecondsToTimeString(start),
      '-to',
      formatMilliSecondsToTimeString(end),
      '-c:v',
      'copy',
      '-c:a',
      'copy',
      '-f',
      'mp4',
      'output.mp4',
    ]);

    const fileData = await ffmpeg.readFile('output.mp4');

    // to video
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );
      console.log(videoRef.current.src);
      // append to list
      // VideoRefList.current.push(videoRef.current);
      // console.log(VideoRefList.current);
    }
  };

  // concat video
  const ConcatVideos = async (videos: Array<ISource>) => {
    const ffmpeg = ffmpegRef.current;
    let fileList = '';

    // Create a promise for each video file
    const promises = videos.map(async (video, i) => {
      // Fetch and write the original file
      await ffmpeg.writeFile(
        `original${i}.mp4`,
        await fetchFile(video.sourceUrl)
      );

      // Transcode the file to ensure consistent codecs, using the ultrafast preset
      await ffmpeg.exec([
        '-i',
        `original${i}.mp4`,
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-b:v',
        '300k',
        '-b:a',
        '64k', // Lower audio bitrate
        '-vf',
        'scale=-1:480',
        '-r',
        '12',
        '-c:a',
        'aac',
        '-strict',
        '-2',
        '-y',
        `input${i}.mp4`,
      ]);
      fileList += `file 'input${i}.mp4'\n`;
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    // Write the list to a file
    await ffmpeg.writeFile('filelist.txt', fileList);

    // Use the concat protocol
    await ffmpeg.exec([
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      'filelist.txt',
      '-c',
      'copy',
      '-y',
      'output.mp4',
    ]);

    const fileData = await ffmpeg.readFile('output.mp4');
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );
      console.log(videoRef.current.src);
    } else {
      console.log('bye');
    }
  };

  return (
    <>
      <Container>
        <SourceWrapper>
          {/* source list */}
          <SourceList />
        </SourceWrapper>
        <EditWrapper>
          <ViewWarpper>
            {/* video display */}
            {/* <p ref={messageRef}></p> */}
            <ProjectView
              setVideo={setVideoFile}
              videoRef={videoRef}
              videoRefOrg={videoRefOrg}
              trimVideo={trimVideo}
            />
          </ViewWarpper>
          <WorkbenchWarpper>
            {/* workbench */}
            <Workbench
              concatVideos={(sources) => ConcatVideos(sources)}
            ></Workbench>
          </WorkbenchWarpper>
        </EditWrapper>
      </Container>
    </>
  );
};

export default ProjectPage;
