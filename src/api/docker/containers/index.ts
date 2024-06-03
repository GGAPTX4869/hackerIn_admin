import request from '@/utils/request.ts'
enum API {
  GET_CONTAINER_LIST = '/docker/containers/getlist',
  GET_IMAGE_ALL = '/docker/dokimg/getall',
  ADD_CONTAINERS = '/docker/containers/add',
  GET_IMAGE_BY_TYPEID = '/docker/images/typeof/gbtype',
  CONTAINER_TEST = '/docker/containers/test',
  RM_CONTAINER_TEST = '/docker/containers/rmtest',

  DEL_DOCKER = '/docker/containers/rmcontainer',
}

export const reqGetContainerList = (data: any) =>
  request.get<any, any>(API.GET_CONTAINER_LIST, {
    params: {
      page: data.page,
      limit: data.limit,
      containername: data.containername,
      imagename: data.imagename,
    },
  })

export const reqDelDocker = (data: any) =>
  request.get<any, any>(API.DEL_DOCKER, {
    params: {
      containerid: data,
    },
  })

export const reqGetImageAll = () => request.get<any, any>(API.GET_IMAGE_ALL)

export const reqAddContainers = (data: any) =>
  request.post<any, any>(API.ADD_CONTAINERS, data)

export const reqGetImageByType = (data: any) =>
  request.get<any, any>(API.GET_IMAGE_BY_TYPEID, {
    params: {
      typeid: data,
    },
  })

export const reqTestContainer = (port: number, imageid: string) =>
  request.get<any, any>(API.CONTAINER_TEST, {
    params: {
      port: port,
      imageid: imageid,
    },
  })
export const reqRmTestContainer = (containerid: string) =>
  request.get<any, any>(API.RM_CONTAINER_TEST, {
    params: {
      containerid: containerid,
    },
  })
