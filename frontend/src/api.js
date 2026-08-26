import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 角色创建
export function createCharacter(name, gender) {
  return api.post('/create', { name, gender })
}

// 获取游戏状态
export function getState(sessionId) {
  return api.get(`/state/${sessionId}`)
}

// 修炼
export function cultivate(sessionId) {
  return api.post(`/cultivate/${sessionId}`)
}

// 探索
export function explore(sessionId) {
  return api.post(`/explore/${sessionId}`)
}

// 休息
export function rest(sessionId) {
  return api.post(`/rest/${sessionId}`)
}

// 推进一天
export function advanceDay(sessionId, days = 1) {
  return api.post(`/advance-day/${sessionId}`, { days })
}

// 推进一月
export function advanceMonth(sessionId) {
  return api.post(`/advance-month/${sessionId}`)
}

// 导航到地区
export function navigate(sessionId, location) {
  return api.post(`/navigate/${sessionId}`, { location })
}

// 与NPC对话
export function talkToNpc(sessionId, npcName) {
  return api.post(`/talk/${sessionId}`, { npcName })
}

// 结为伴侣
export function marryNpc(sessionId, npcName) {
  return api.post(`/marry/${sessionId}`, { npcName })
}

// 猎取魂兽
export function huntBeast(sessionId) {
  return api.post(`/hunt/${sessionId}`)
}

// 吸收魂环
export function absorbRing(sessionId, beastYear, beastName) {
  return api.post(`/absorb-ring/${sessionId}`, { beastYear, beastName })
}

// 完成事务
export function doTask(sessionId, taskId) {
  return api.post(`/task/${sessionId}`, { taskId })
}

// 刷新事务
export function refreshTasks(sessionId) {
  return api.post(`/refresh-tasks/${sessionId}`)
}

// 购买物品
export function buyItem(sessionId, itemName) {
  return api.post(`/buy/${sessionId}`, { itemName })
}

// 出售物品
export function sellItem(sessionId, itemIndex) {
  return api.post(`/sell/${sessionId}`, { itemIndex })
}

// 装备物品
export function equipItem(sessionId, itemIndex) {
  return api.post(`/equip/${sessionId}`, { itemIndex })
}

// 卸下装备
export function unequipItem(sessionId, slot) {
  return api.post(`/unequip/${sessionId}`, { slot })
}

// 装备魂骨
export function equipSoulBone(sessionId, boneIndex) {
  return api.post(`/equip-soul-bone/${sessionId}`, { boneIndex })
}

// 卸下魂骨
export function unequipSoulBone(sessionId, slot) {
  return api.post(`/unequip-soul-bone/${sessionId}`, { slot })
}

// 使用物品
export function useItem(sessionId, itemIndex) {
  return api.post(`/use/${sessionId}`, { itemIndex })
}

// 货币兑换
export function exchangeCurrency(sessionId, from, to, amount) {
  return api.post(`/exchange/${sessionId}`, { from, to, amount })
}

// 成神突破
export function attemptGod(sessionId) {
  return api.post(`/god/${sessionId}`)
}

// 获取已认识的NPC列表
export function getNpcs(sessionId) {
  return api.get(`/npcs/${sessionId}`)
}

// 获取情缘列表
export function getPartners(sessionId) {
  return api.get(`/partners/${sessionId}`)
}

// 获取商店物品列表
export function getShopItems() {
  return api.get('/shop')
}

// 获取地图数据
export function getMapData() {
  return api.get('/map')
}

// 存档
export function saveGame(sessionId) {
  return api.post(`/save/${sessionId}`)
}

// 读档
export function loadGame(sessionId) {
  return api.post(`/load/${sessionId}`)
}

// 重置游戏
export function resetGame(sessionId) {
  return api.post(`/reset/${sessionId}`)
}

export default api
