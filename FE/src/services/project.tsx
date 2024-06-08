import { $auth, $pose } from './config';

// 프로젝트 목록 조회
const getProjectsList = async () => {
  const response = await $auth().get(`/project/`);
  console.log(response);
  return response;
};

// 프로젝트 이름 수정
const patchProject = async (projectId: number) => {
  const response = await $auth().patch(`/project/${projectId}`);
  console.log(response); 
};

// 프로젝트 생성
const postProject = async (projectId: number, data: FormData) => {
  console.log(projectId);
  const response = await $auth().post(`/project`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response);
};
// 프로젝트 삭제
const deleteProject = async (projectId: number) => {
  const response = await $auth().delete(`/project/${projectId}`);
  console.log(response);
  return response;
};
// 선택한 프로젝트 정보 조회
const getProjectDetail = async (projectId: number) => {
  const response = await $auth().get(`/project/${projectId}`);
  console.log(response);
};
// 포즈 라벨링
const detectPose = async (img: File) => {
  const response = await $pose().post(`/pose/pose-detect/`, img, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });
  console.log(response);
  return response;
};
// const detectPose = async (img) => {
//   const response = await $pose().post(`/pose/pose-detect/`,img);
//   console.log(response);
// };

export {
  getProjectsList,
  patchProject,
  postProject,
  deleteProject,
  getProjectDetail,
  detectPose,
};
