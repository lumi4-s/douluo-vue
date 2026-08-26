const express = require('express');
const cors = require('cors');
const gameLogic = require('./gameLogic');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 内存存储游戏状态
const gameSessions = {};

// 辅助函数：获取会话
function getSession(sessionId) {
    return gameSessions[sessionId];
}

// 辅助函数：更新会话并返回
function updateSession(sessionId, result) {
    const session = gameSessions[sessionId];
    if (!session) return null;
    return {
        player: session.player,
        logs: session.player.log || [],
        result: result || {}
    };
}

// ===== 角色创建 =====
app.post('/api/create', (req, res) => {
    const { name, gender } = req.body;
    let playerName = name ? name.trim() : '';
    // 如果名字为空或全是数字，则随机生成名字
    if (!playerName || /^\d+$/.test(playerName)) {
        playerName = gameLogic.generateRandomName();
    }
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const player = gameLogic.createPlayer(playerName, gender || '男');
    gameSessions[sessionId] = { player };
    res.json({
        sessionId,
        player,
        logs: player.log || []
    });
});

// ===== 获取游戏状态 =====
app.get('/api/state/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) {
        return res.status(404).json({ error: '会话不存在' });
    }
    res.json({
        player: session.player,
        logs: session.player.log || []
    });
});

// ===== 修炼 =====
app.post('/api/cultivate/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.cultivate(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 探索 =====
app.post('/api/explore/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.explore(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 休息 =====
app.post('/api/rest/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.rest(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 推进一天 =====
app.post('/api/advance-day/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const days = req.body.days || 1;
    const result = gameLogic.advanceDay(session.player, days);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 推进一月 =====
app.post('/api/advance-month/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.advanceMonth(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 导航到地区 =====
app.post('/api/navigate/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { location } = req.body;
    const result = gameLogic.navigate(session.player, location);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 与NPC对话 =====
app.post('/api/talk/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { npcName } = req.body;
    const result = gameLogic.talkToNpc(session.player, npcName);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 结为伴侣 =====
app.post('/api/marry/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { npcName } = req.body;
    const result = gameLogic.marryNpc(session.player, npcName);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 猎取魂兽 =====
app.post('/api/hunt/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.huntBeast(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 吸收魂环 =====
app.post('/api/absorb-ring/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { beastYear, beastName } = req.body;
    const result = gameLogic.absorbRing(session.player, beastYear, beastName);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 完成事务 =====
app.post('/api/task/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { taskId } = req.body;
    const result = gameLogic.doTask(session.player, taskId);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 刷新事务 =====
app.post('/api/refresh-tasks/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.refreshTasks(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 购买物品 =====
app.post('/api/buy/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { itemName } = req.body;
    const result = gameLogic.buyItem(session.player, itemName);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 出售物品 =====
app.post('/api/sell/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { itemIndex } = req.body;
    const result = gameLogic.sellItem(session.player, itemIndex);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 装备物品 =====
app.post('/api/equip/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { itemIndex } = req.body;
    const result = gameLogic.equipItem(session.player, itemIndex);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 卸下装备 =====
app.post('/api/unequip/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { slot } = req.body;
    const result = gameLogic.unequipItem(session.player, slot);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 装备魂骨 =====
app.post('/api/equip-soul-bone/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { boneIndex } = req.body;
    const result = gameLogic.equipSoulBone(session.player, boneIndex);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 卸下魂骨 =====
app.post('/api/unequip-soul-bone/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { slot } = req.body;
    const result = gameLogic.unequipSoulBone(session.player, slot);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 使用物品 =====
app.post('/api/use/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { itemIndex } = req.body;
    const result = gameLogic.useItem(session.player, itemIndex);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 货币兑换 =====
app.post('/api/exchange/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const { from, to, amount } = req.body;
    const result = gameLogic.exchangeCurrency(session.player, from, to, amount);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 成神突破 =====
app.post('/api/god/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const result = gameLogic.attemptGod(session.player);
    res.json(updateSession(req.params.sessionId, result));
});

// ===== 获取已认识的NPC列表 =====
app.get('/api/npcs/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const npcs = gameLogic.getMetNpcs(session.player);
    res.json({ npcs });
});

// ===== 获取情缘列表 =====
app.get('/api/partners/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    const partners = gameLogic.getPartners(session.player);
    res.json({ partners });
});

// ===== 获取商店物品列表 =====
app.get('/api/shop', (req, res) => {
    res.json({ items: gameLogic.SHOP_ITEMS });
});

// ===== 获取地图数据 =====
app.get('/api/map', (req, res) => {
    res.json({ locations: gameLogic.MAP_DATA });
});

// ===== 存档 =====
app.post('/api/save/:sessionId', (req, res) => {
    const session = getSession(req.params.sessionId);
    if (!session) return res.status(404).json({ error: '会话不存在' });
    // 实际项目可写入文件或数据库
    try {
        const fs = require('fs');
        const saveDir = __dirname + '/saves';
        if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
        fs.writeFileSync(saveDir + '/' + req.params.sessionId + '.json', JSON.stringify(session.player));
        res.json({ success: true, message: '存档成功！' });
    } catch (e) {
        res.json({ success: false, message: '存档失败：' + e.message });
    }
});

// ===== 读档 =====
app.post('/api/load/:sessionId', (req, res) => {
    try {
        const fs = require('fs');
        const saveFile = __dirname + '/saves/' + req.params.sessionId + '.json';
        if (!fs.existsSync(saveFile)) {
            return res.json({ success: false, message: '没有找到存档' });
        }
        const player = JSON.parse(fs.readFileSync(saveFile, 'utf8'));
        gameSessions[req.params.sessionId] = { player };
        res.json({
            success: true,
            player,
            logs: player.log || [],
            message: '读档成功！'
        });
    } catch (e) {
        res.json({ success: false, message: '读档失败：' + e.message });
    }
});

// ===== 重置游戏 =====
app.post('/api/reset/:sessionId', (req, res) => {
    delete gameSessions[req.params.sessionId];
    res.json({ success: true, message: '游戏已重置' });
});

app.listen(PORT, () => {
    console.log(`斗罗大陆模拟器后端运行在 http://localhost:${PORT}`);
    console.log('API文档：');
    console.log('  POST /api/create - 创建角色');
    console.log('  GET  /api/state/:sessionId - 获取游戏状态');
    console.log('  POST /api/cultivate/:sessionId - 修炼');
    console.log('  POST /api/explore/:sessionId - 探索');
    console.log('  POST /api/rest/:sessionId - 休息');
    console.log('  POST /api/advance-day/:sessionId - 推进一天');
    console.log('  POST /api/advance-month/:sessionId - 推进一月');
    console.log('  POST /api/navigate/:sessionId - 导航到地区');
    console.log('  POST /api/talk/:sessionId - 与NPC对话');
    console.log('  POST /api/marry/:sessionId - 结为伴侣');
    console.log('  POST /api/hunt/:sessionId - 猎取魂兽');
    console.log('  POST /api/absorb-ring/:sessionId - 吸收魂环');
    console.log('  POST /api/task/:sessionId - 完成事务');
    console.log('  POST /api/refresh-tasks/:sessionId - 刷新事务');
    console.log('  POST /api/buy/:sessionId - 购买物品');
    console.log('  POST /api/sell/:sessionId - 出售物品');
    console.log('  POST /api/equip/:sessionId - 装备物品');
    console.log('  POST /api/unequip/:sessionId - 卸下装备');
    console.log('  POST /api/use/:sessionId - 使用物品');
    console.log('  GET  /api/npcs/:sessionId - 获取已认识的NPC列表');
    console.log('  GET  /api/partners/:sessionId - 获取情缘列表');
    console.log('  GET  /api/shop - 获取商店物品列表');
    console.log('  GET  /api/map - 获取地图数据');
    console.log('  POST /api/save/:sessionId - 存档');
    console.log('  POST /api/load/:sessionId - 读档');
    console.log('  POST /api/reset/:sessionId - 重置游戏');
});
