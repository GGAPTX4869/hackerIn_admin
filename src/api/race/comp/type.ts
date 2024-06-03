export interface CompReqData {
  code: number
  msg?: string
  total?: number
}

export interface Team {
  teamid: string
  teamname: string
  teamleader: string
  description: string
  remark: string
  status: number
  operateuser: string
  createtime: string
  updatetime: string
}
export type TeamList = Team[]
export interface GetListReq extends CompReqData {
  data: TeamList
}
export interface Comp {
  competitonid: string
  competitonname: string
  notice: string
  report: string
  status: number
  type: number
  duration: string
  begintime: string
  endtime: string
  createtime: string
  sponsor: string
}
export type CompList = Comp[]
export interface GetCompReq extends CompReqData {
  data: CompList
}

export interface CompTeam {
  compid: string
  compname: string
  teamid: string
  teamname: string
  status: 1
}
export type CompTeamList = CompTeam[]
export interface GetCompTeamReq extends CompReqData {
  data: CompTeamList
}

export interface TeamUser {
  teamid: string
  teamname: string
  userid: string
  username: string
  status: 1
}
export type TeamUserList = TeamUser[]
export interface GetTeamUserReq extends CompReqData {
  data: TeamUserList
}
