export interface DockerReqData {
  code: number
  msg?: string
  total?: number
}

export interface dokImgInfo {
  id?: string
  imagename: string
  pullurl: string
  repo: string
  tag: string
  status: number
  createtime: string
  operateuser: string
}

export type DokImgList = dokImgInfo[]
export interface getDokImgListResData extends DockerReqData {
  data: DokImgList
}
export interface pullImageData {
  imagename: string
  pullurl: string
  tag: string
  status: number
}

export interface imageInfo {
  imageid: string
  imagename: string
  imagetag: string
  repository: string
  createtime: string
  size: string
}
export interface ImageInfoResData extends DockerReqData {
  data: imageInfo
}

export interface updateDokImgInfo {
  id: string
  imagename: string
  status: number
}
