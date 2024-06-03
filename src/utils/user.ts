export const SET_USERID = (userid: string) => {
  localStorage.setItem('userid', userid)
}

export const GET_USERID = () => {
  return localStorage.getItem('userid')
}

export const DEL_USERID = () => {
  localStorage.removeItem('userid')
}
