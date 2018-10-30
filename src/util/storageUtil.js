/**
 * storage操作类
 * @authors jp
 * @date    2018-04-03
 */

/**
 * 存储sessionStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */
export const getStore = (name, type) => {
  if (!name) return;
  let val = window.sessionStorage.getItem(name);
  if (type === 'json') {
    return JSON.parse(val)
  }
  return val
}

/**
 * 删除sessionStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
}

/*
 * 存储localStorage
 */
export const setLocalStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/*
 * 获取localStorage
 */
export const getLocalStore = (name, type) => {
  if (!name) return;
  let val = window.localStorage.getItem(name);
  if (type === 'json') {
    return JSON.parse(val)
  }
  return val
}

/**
 * 删除localStorage
 */
export const removeLocalStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/*
删除所有的缓存
 */
export const clearStore = () => {
  window.localStorage.clear()
  window.sessionStorage.clear()
}

export const getToken = (name, type) => getStore(name, type)
export const setToken = (name, val) => setStore(name, val)
export const removeToken = (name) => removeStore(name)
export const getLocalStorage = (name, type) => getLocalStore(name, type)
export const setLocalStorage = (name, val) => setLocalStore(name, val)
export const removeLocalStorage = (name) => removeLocalStore(name)
export const clearStorage = () => clearStore()