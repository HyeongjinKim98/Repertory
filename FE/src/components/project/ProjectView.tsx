import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  // SetStateAction,
  // MutableRefObject,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { formatMilliSecondsToTimeString } from '@/util';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import { Dialog } from './Dialog';
import ImageSquare from '../common/ImageSquare';
import * as dance from '@/services/dance';
import * as project from '@/services/project';
// import { Title } from './Title';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Upload } from '@mui/icons-material';
import { SetState } from 'zustand';
import TagsInput from '../common/TagInput';
interface ITrimSection {
  start: number;
  end: number;
}
interface SliderProps {
  startTime: number;
  endTime: number;
  duration: number;
}
const Tmp = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
`;
const FlexWrapper = styled.div`
  padding: 1.2rem;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-around;
`;

const PleaseUploadFile = styled.div`
  margin-top: 20%;
  margin-bottom: -22%;
  height: auto;
  font-size: 1.7rem;
  position: relative;
  display: flex;
  text-align: center;
  justify-content: center;
  width: 100%;
`;
const ClearButton = styled.button<{ isDisabled: boolean }>`
  color: ${(props) => (props.isDisabled ? 'grey' : 'white')};
`;

const TRButton = styled.button<{ isDisabled: boolean }>`
  color: ${(props) => (props.isDisabled ? 'grey' : 'white')};
`;

const Title = styled.div`
  margin-top: -6px;
  height: 2.2rem;
  width: 100%;
  padding: 1.5rem;
  font-size: 1.8rem;
  color: white;
  text-align: left;
  display: flex;
  align-items: center;
  border-bottom: 0.6rem solid var(--background-color);
`;
const TitleName = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const HiddenInput = styled.input`
  display: none;
`;
const TitleButton = styled.button`
  margin-top: 0.15rem;
  margin-left: 1.2rem;
  margin-right: 0.3rem;
  background: transparent;
  font-size: 1rem;
  &:hover {
    /* border-color: #9a9a9a; */
    color: #9a9a9a;
  }
  margin-bottom: 10px;
`;
const StyledVideo = styled.video`
  height: 70%;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const StyledSlider = styled.input<SliderProps>`
  margin-top: 10px;
  width: 95%;
  min-height: 16px;
  background: #808080;
  border-radius: 0.5rem;
  overflow: hidden;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-runnable-track {
    width: 100%;
    /* height: 30px; */
    cursor: pointer;
    border-radius: 6px;
  }
  &::-webkit-slider-thumb {
    height: 40px;
    width: 4px;
    border-radius: 6px;
    background: #524242;
    cursor: pointer;
    -webkit-appearance: none;
  }
  &::-moz-range-track {
    width: 100%;
    height: 36px;
    width: 4px;
    cursor: pointer;
    border-radius: 6px;
  }
  &::-moz-range-thumb {
    height: 40px;
    width: 4px;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
  }

  position: relative; // 가상 요소의 위치를 기준으로 설정

  &::before,
  &::after {
    content: ''; // 가상 요소의 내용을 비움
    position: absolute; // 가상 요소를 절대 위치로 설정
    top: 0;
    bottom: 0;
    width: 3px; // 세로선의 너비를 2px로 설정
  }

  &::before {
    left: ${(props) =>
      (props.startTime / props.duration) *
      100}%; // 시작 시간에 해당하는 위치로 설정
    background-color: #a1a1ff;
  }

  &::after {
    left: ${(props) =>
      (props.endTime / props.duration) *
      100}%; // 종료 시간에 해당하는 위치로 설정세로선의 색상을 파란색으로 설정
    background-color: #ff8181;
  }
`;

const StartTimeButton = styled.button<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? '#a7a7ff' : 'white')};
  &:hover {
    cursor: pointer;
  }
`;

const EndTimeButton = styled.button<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? '#ff9797' : 'white')};
  &:hover {
    cursor: pointer;
  }
`;
const Time = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-right: 24px;
  padding-left: 24px;
`;
const ProjectViewWrapper = styled.div`
  /* background-color: red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 73vh;
`;
interface Props {
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoRefOrg: React.RefObject<HTMLVideoElement>;
  trimVideo: (trimSection: ITrimSection) => Promise<void>;
}
const ProjectView = (props: Props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState({ start: '', middle: '', end: '' });
  const [orgVideo, setOrgVideo] = useState('');
  const [imageFiles, setImageFiles] = useState<{
    start: File | null;
    middle: File | null;
    end: File | null;
  }>({
    start: null,
    middle: null,
    end: null,
  });

  const [startPose, setStartPose] = useState('');
  const [endPose, setEndPose] = useState('');
  // const [video, setVideo] = useState<File | null>(null);
  useEffect(() => {
    const video = props.videoRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    if (video) {
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      }
    };
  }, [props.videoRef, startPose, endPose]);
  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);

    setCurrentTime(time);
    console.log(time);

    if (props.videoRef.current) {
      props.videoRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    if (props.videoRef.current) {
      setCurrentTime(props.videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (props.videoRef.current) {
      setDuration(props.videoRef.current.duration);
    }
  };

  const handleButtonClick = () => {
    console.log('btn click');
    if (fileInput.current) fileInput.current.click();
  };

  const playVideo = () => {
    setIsPlaying(true);
    if (props.videoRef.current) {
      props.videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    if (props.videoRef.current) {
      props.videoRef.current.pause();
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    pauseVideo();
    if (props.videoRef.current) {
      props.videoRef.current.src = '';
      props.setVideo(null);
      setOrgVideo('');
      props.videoRef.current.load();
    }
    console.log('upload');
    if (event.target.files) {
      const file = event.target.files[0];
      props.setVideo(file);
      if (props.videoRef.current) {
        props.videoRef.current.src = URL.createObjectURL(file);
        setOrgVideo(URL.createObjectURL(file));
      }
    }
  };
  const setOriginVideo = () => {
    if (props.videoRef.current) {
      props.videoRef.current.src = orgVideo;
    } else {
      alert('Naaaah!');
    }
  };
  const captureImage = async (
    video: HTMLVideoElement,
    time: number
  ): Promise<File> => {
    video.currentTime = time;
    await new Promise((r) => setTimeout(r, 200));

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/jpeg');
    const data = atob(dataUrl.split(',')[1]);
    const mime = dataUrl.split(';')[0].split(':')[1];
    const buf = new ArrayBuffer(data.length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < data.length; i++) {
      arr[i] = data.charCodeAt(i);
    }
    const blob = new Blob([arr], { type: mime });
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    return file;
  };

  const saveImages = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
      const video = videoRef.current;
      const duration = video.duration;
      const startTime = 0;
      const middleTime = duration / 2;
      const endTime = duration;

      const startImage = await captureImage(video, startTime);
      const middleImage = await captureImage(video, middleTime);
      const endImage = await captureImage(video, endTime);

      setImageFiles({
        start: startImage,
        middle: middleImage,
        end: endImage,
      });

      setImages({
        start: URL.createObjectURL(startImage),
        middle: URL.createObjectURL(middleImage),
        end: URL.createObjectURL(endImage),
      });
    }
  };

  const UploadSource = async () => {
    const data = {
      sourceName: 'MySource',
      sourceLength: duration,
      tagNameList: ['tag1', 'tag2'],
      start: 'string',
      end: 'string',
    };
    const formData = new FormData();
    formData.append(
      'postSource',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (props.videoRef.current) {
      // Blob URL을 File 객체로 변환
      const response1 = await fetch(images.start);
      const blob1 = await response1.blob();
      const file1 = new File([blob1], 'filename1', { type: blob1.type });

      const response2 = await fetch(props.videoRef.current.src);
      const blob2 = await response2.blob();
      const file2 = new File([blob2], 'filename2', { type: blob2.type });

      formData.append('sourceThumbnail', file1);
      formData.append('sourceVideo', file2);
    }

    dance.postSource(formData);
  };

  const DetectPose = async () => {
    if (imageFiles.start instanceof File) {
      await project.detectPose(imageFiles.start).then((res) => {
        setStartPose(res.data.recommend_pose_name);
        console.log(res.data);
      });
    }
    if (imageFiles.end instanceof File) {
      await project.detectPose(imageFiles.end).then((res) => {
        setEndPose(res.data.recommend_pose_name);
        console.log(res.data);
      });
    }
  };
  // TRButton 클릭 이벤트
  // const onTRButtonClick = async () => {
  //   saveImages(props.videoRef);
  //   await DetectPose();
  // };

  const Trim = async () => {
    props.trimVideo({ start: startTime * 1000, end: endTime * 1000 });
    await saveImages(props.videoRef);
    await DetectPose();
    setStartTime(0);
    setEndTime(0);
    pauseVideo();
    setOpen(true);
  };
  const handleOpenDialog = async () => {
    if (props.videoRef.current === null) {
      alert('Upload Video First!');
    } else {
      setOpen(true);
    }
  };
  return (
    <>
      <HiddenInput
        type='file'
        onChange={(e) => handleFileUpload(e)}
        ref={fileInput}
      />
      <ProjectViewWrapper>
        <Title>
          <TitleName>Project</TitleName>
          <TitleButton type='button' onClick={setOriginVideo}>
            <HistoryRoundedIcon />
          </TitleButton>
          <TitleButton type='button' onClick={handleButtonClick}>
            <FileUploadIcon />
          </TitleButton>
          <TitleButton type='button' onClick={handleOpenDialog}>
            <SaveIcon />
          </TitleButton>
          <Dialog title='Source' open={open} onClose={() => setOpen(false)}>
            {/* const SourceDialog = (images, UploadSource, setOpen) */}
            <SourceDialog
              images={images}
              UploadSource={UploadSource}
              setOpen={setOpen}
              duration={duration}
              startPose={startPose}
              endPose={endPose}
            />
          </Dialog>
        </Title>
        {props.videoRef.current?.src === '' && (
          <PleaseUploadFile>Upload File First</PleaseUploadFile>
        )}
        <StyledVideo
          ref={props.videoRef}
          onLoadedData={(event) => event.currentTarget.play()}
          onTimeUpdate={handleTimeUpdate} // 비디오 재생 시간이 변경될 때마다 호출
          onLoadedMetadata={handleDurationChange} // 비디오 메타데이터가 로드되면 호출
        ></StyledVideo>
        <Tmp>
          {/* <button onClick={onTRButtonClick}>Ready</button> */}
          <StartTimeButton
            isActive={startTime > 0}
            onClick={() => {
              setStartTime(currentTime);
              pauseVideo();
            }}
          >
            Start
          </StartTimeButton>

          <EndTimeButton
            isActive={endTime > 0}
            onClick={() => {
              setEndTime(currentTime);
              pauseVideo();
            }}
          >
            End
          </EndTimeButton>
          <button onClick={isPlaying ? pauseVideo : playVideo}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
          <ClearButton
            isDisabled={startTime === 0 && endTime === 0}
            onClick={() => {
              setStartTime(0);
              setEndTime(0);
              console.log(endTime);
              console.log(endTime / duration);
            }}
            disabled={startTime === 0 && endTime === 0}
          >
            Clear
          </ClearButton>

          <TRButton
            isDisabled={startTime === 0 || endTime === 0}
            onClick={Trim}
            disabled={startTime === 0 || endTime === 0}
          >
            TRIM
          </TRButton>
        </Tmp>
        <StyledSlider
          type='range'
          min='0'
          step='0.1'
          max={duration}
          value={currentTime}
          onChange={handleTimeChange}
          startTime={startTime} // startTime 상태를 전달
          endTime={endTime}
          duration={duration} // endTime 상태를 전달
        />
        <Time>
          <p>{formatMilliSecondsToTimeString(currentTime * 1000, 'minute')}</p>

          <p>{formatMilliSecondsToTimeString(duration * 1000, 'minute')}</p>
        </Time>
      </ProjectViewWrapper>
    </>
  );
};

interface IPropsSourceDailog {
  images: {
    start: string;
    middle: string;
    end: string;
  };
  UploadSource: () => void;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  duration: number;
  startPose: string;
  endPose: string;
}
const InputWrapper = styled.div`
  padding: 0.4rem;
  display: flex;
  font-size: 1.2rem;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  margin-bottom: 1.4rem;
  align-items: center;
`;
const Input = styled.input`
  width: 200px;
  border-radius: 1.2rem;
  padding: 0.4rem;
  height: 1.6rem;
  font-size: 1.2rem;
  display: flex;
`;
const Label = styled.label`
  font-size: 1.3rem;
  min-width: 200px;
`;
const Section = styled.div`
  width: 50%;
  height: 100%;
  padding: 1.2rem;
  @media (max-width: 1080px) {
    width: 500px;
  }
`;
const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;
const SourceDialog = ({
  images,
  UploadSource,
  setOpen,
  duration,
  startPose,
  endPose,
}: IPropsSourceDailog) => {
  const [sourceName, setSourceName] = useState('');
  const [sourceLength, setSourceLength] = useState(duration);
  const [start, setStart] = useState(startPose);
  const [end, setEnd] = useState(endPose);
  return (
    <>
      <Wrapper>
        <Section>
          <ImageWrapper>
            <ImageSquare src={images.start} size={140} />
            <ImageSquare src={images.middle} size={140} />
            <ImageSquare src={images.end} size={140} />
          </ImageWrapper>
        </Section>
        <Section>
          <InputWrapper>
            <Label>NAME</Label>
            <Input type='text' placeholder='Source Name' />
          </InputWrapper>
          <InputWrapper>
            <Label>LENGHT</Label>
            <Input
              type='text'
              placeholder='Length'
              value={sourceLength}
              onChange={(e) => setSourceLength(e.currentTarget.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>START POSE</Label>
            <Input
              type='text'
              placeholder='Start'
              value={start}
              onChange={(e) => setStart(e.currentTarget.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Label>END POSE</Label>
            <Input
              type='text'
              placeholder='End'
              value={end}
              onChange={(e) => setEnd(e.currentTarget.value)}
            />
            <Label>Tag</Label>
            <TagsInput />
          </InputWrapper>
        </Section>
      </Wrapper>
      <FlexWrapper>
        <button onClick={() => UploadSource()}>Upload</button>
        <button onClick={() => setOpen(false)}>Close</button>
      </FlexWrapper>
    </>
  );
};

export default ProjectView;
