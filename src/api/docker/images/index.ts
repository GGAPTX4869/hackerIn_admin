import request from '@/utils/request.ts'
import {
  DockerReqData,
  getDokImgListResData,
  ImageInfoResData,
  pullImageData,
  updateDokImgInfo,
} from './type.ts'

enum API {
  // 获取镜像信息列表
  DOK_IMG_GET_LIST_API = '/docker/dokimg/getlist',
  TEST_REPO_USE_API = '/docker/dokimg/testimg',
  PULL_IMG_API = '/docker/images/pullimage',
  GET_IMAGE_INFO_API = '/docker/images/getinfo',
  REFRESH_DOK_IMG_INFO = '/docker/dokimg/refresh',
  DEL_TEST_IMG_API = '/docker/dokimg/del',
  UPDATE_IMG_API = '/docker/dokimg/update',
  DEL_IMG_API = '/docker/images/del',

  // 类型
  GET_IMAGE_TYPE_LIST = '/docker/images/type/getlist',
  GET_IMAGE_TYPE_ALL = '/docker/images/type/getall',
  ADD_IMAGE_TYPE = '/docker/images/type/add',
  UPDATE_IMAGE_TYPE = '/docker/images/type/update',
  GET_IMAGE_OF_TYPE = '/docker/images/typeof/getbyid',
  ADD_IMAGE_OF_TYPE = '/docker/images/typeof/add',
  DEL_IMAGE_OF_TYPE = '/docker/images/typeof/del',
}

export const reqDokImgInfoList = (page: number, limit: number) =>
  request.get<any, getDokImgListResData>(API.DOK_IMG_GET_LIST_API, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqTestRepoUse = (data: string) =>
  request.get<any, DockerReqData>(API.TEST_REPO_USE_API, {
    params: {
      pullurl: data,
    },
  })
export const reqPullImg = (data: pullImageData) =>
  request.post<any, DockerReqData>(API.PULL_IMG_API, data)
export const getImageInfo = (data: string) =>
  request.get<any, ImageInfoResData>(API.GET_IMAGE_INFO_API, {
    params: {
      tag: data,
    },
  })
export const refreshDokImgInfo = () =>
  request.get<any, DockerReqData>(API.REFRESH_DOK_IMG_INFO)
export const delTestDokImg = (data: string) =>
  request.get<any, DockerReqData>(API.DEL_TEST_IMG_API, {
    params: {
      pullurl: data,
    },
  })
export const updatetDokImg = (data: updateDokImgInfo) =>
  request.post<any, DockerReqData>(API.UPDATE_IMG_API, data)
export const delImage = (data: string) =>
  request.get<any, DockerReqData>(API.DEL_IMG_API, {
    params: {
      id: data,
    },
  })
export const reqGetImageTypeList = (page: any, limit: any) =>
  request.get<any, any>(API.GET_IMAGE_TYPE_LIST, {
    params: {
      page: page,
      limit: limit,
    },
  })
export const reqGetImageTypeAll = () =>
  request.get<any, any>(API.GET_IMAGE_TYPE_ALL)

export const reqGetImageOfTypeById = (data: string) =>
  request.get<any, any>(API.GET_IMAGE_OF_TYPE, {
    params: {
      imageid: data,
    },
  })

export const reqAddImageOfType = (data: any) =>
  request.post<any, any>(API.ADD_IMAGE_OF_TYPE, data)

export const reqAddImageType = (data: any) =>
  request.post<any, any>(API.ADD_IMAGE_TYPE, data)
export const reqDelImageType = (data: any) =>
  request.get<any, any>(API.DEL_IMAGE_OF_TYPE, {
    params: {
      typeid: data,
    },
  })
export const reqUpdateImageType = (data: any) =>
  request.post<any, any>(API.UPDATE_IMAGE_TYPE, data)
