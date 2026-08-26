// 纯前端版本API - 直接调用本地gameLogic，使用localStorage保存游戏状态
import gameLogic from './gameLogic.js'

// 内存存储游戏状态
const gameSessions = {}

// 辅助函数：获取会话
function getSession(sessionId) {
  return gameSessions[sessionId]
}

// 辅助函数：更新会话并返回
function updateSession(sessionId, result) {
  const session = gameSessions[sessionId]
  if (!session) return null
  // 保存到localStorage
  try {
    localStorage.setItem('douluo_save_' + sessionId, JSON.stringify(session.player))
  } catch (e) {}
  return {
    player: session.player,
    logs: session.player.log || [],
    result: result || {}
  }
}

// 角色创建
export function createCharacter(name, gender) {
  return new Promise((resolve) => {
    let playerName = name ? name.trim() : ''
    // 如果名字为空或全是数字，则随机生成名字
    if (!playerName || /^\d+$/.test(playerName)) {
      playerName = gameLogic.generateRandomName()
    }
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    const player = gameLogic.createPlayer(playerName, gender || '男')
    gameSessions[sessionId] = { player }
    // 保存到localStorage
    try {
      localStorage.setItem('douluo_save_' + sessionId, JSON.stringify(player))
    } catch (e) {}
    resolve({
      data: {
        sessionId,
        player,
        logs: player.log || []
      }
    })
  })
}

// 获取游戏状态
export function getState(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) {
      // 尝试从localStorage恢复
      try {
        const saved = localStorage.getItem('douluo_save_' + sessionId)
        if (saved) {
          const player = JSON.parse(saved)
          gameSessions[sessionId] = { player }
          resolve({ data: { player, logs: player.log || [] } })
          return
        }
      } catch (e) {}
      reject({ response: { data: { error: '会话不存在' } } })
      return
    }
    resolve({ data: { player: session.player, logs: session.player.log || [] } })
  })
}

// 修炼
export function cultivate(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.cultivate(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 探索
export function explore(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.explore(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 休息
export function rest(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.rest(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 推进一天
export function advanceDay(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.advanceDay(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 推进一月
export function advanceMonth(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.advanceMonth(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 导航
export function navigate(sessionId, location) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.navigate(session.player, location)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 与NPC对话
export function talkToNpc(sessionId, npcName) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.talkToNpc(session.player, npcName)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 与NPC结婚
export function marryNpc(sessionId, npcName) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.marryNpc(session.player, npcName)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 猎魂
export function huntBeast(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.huntBeast(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 吸收魂环
export function absorbRing(sessionId, ringIndex) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.absorbRing(session.player, ringIndex)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 做任务
export function doTask(sessionId, taskId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.doTask(session.player, taskId)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 刷新任务
export function refreshTasks(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.refreshTasks(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 购买物品
export function buyItem(sessionId, itemId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.buyItem(session.player, itemId)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 出售物品
export function sellItem(sessionId, itemId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.sellItem(session.player, itemId)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 装备物品
export function equipItem(sessionId, itemId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.equipItem(session.player, itemId)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 卸下装备
export function unequipItem(sessionId, slot) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.unequipItem(session.player, slot)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 使用物品
export function useItem(sessionId, itemId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.useItem(session.player, itemId)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 获取已认识的NPC列表
export function getMetNpcs(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.getMetNpcs(session.player)
    resolve({ data: result })
  })
}

// 获取伴侣列表
export function getPartners(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.getPartners(session.player)
    resolve({ data: result })
  })
}

// 货币兑换
export function exchangeCurrency(sessionId, from, to, amount) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.exchangeCurrency(session.player, from, to, amount)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 成神突破
export function attemptGod(sessionId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.attemptGod(session.player)
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 装备魂骨
export function equipSoulBone(sessionId, itemId) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.equipSoulBone ? gameLogic.equipSoulBone(session.player, itemId) : { success: false, message: '功能未实现' }
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 卸下魂骨
export function unequipSoulBone(sessionId, slot) {
  return new Promise((resolve, reject) => {
    const session = getSession(sessionId)
    if (!session) return reject({ response: { data: { error: '会话不存在' } } })
    const result = gameLogic.unequipSoulBone ? gameLogic.unequipSoulBone(session.player, slot) : { success: false, message: '功能未实现' }
    resolve({ data: updateSession(sessionId, result) })
  })
}

// 存档
export function saveGame(sessionId) {
  return new Promise((resolve) => {
    const session = getSession(sessionId)
    if (!session) return resolve({ data: { message: '会话不存在' } })
    try {
      localStorage.setItem('douluo_save_' + sessionId, JSON.stringify(session.player))
      resolve({ data: { message: '存档成功！' } })
    } catch (e) {
      resolve({ data: { message: '存档失败：' + e.message } })
    }
  })
}

// 读档
export function loadGame(sessionId) {
  return new Promise((resolve, reject) => {
    try {
      const saved = localStorage.getItem('douluo_save_' + sessionId)
      if (saved) {
        const player = JSON.parse(saved)
        gameSessions[sessionId] = { player }
        resolve({ data: { player, logs: player.log || [], message: '读档成功！' } })
      } else {
        reject({ response: { data: { error: '没有找到存档' } } })
      }
    } catch (e) {
      reject({ response: { data: { error: '读档失败：' + e.message } } })
    }
  })
}

// 重置游戏
export function resetGame(sessionId) {
  return new Promise((resolve) => {
    delete gameSessions[sessionId]
    try {
      localStorage.removeItem('douluo_save_' + sessionId)
    } catch (e) {}
    resolve({ data: { message: '游戏已重置！' } })
  })
}

// 获取商店物品
export function getShopItems() {
  return new Promise((resolve) => {
    resolve({ data: gameLogic.SHOP_ITEMS || [] })
  })
}
