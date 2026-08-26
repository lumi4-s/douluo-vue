// 斗罗大陆模拟器 - 完整游戏逻辑（前后端分离版）

// ===== 工具函数 =====
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randf = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ===== 随机生成名字 =====
function generateRandomName() {
    const surnames = ['唐', '戴', '马', '小', '宁', '奥', '朱', '竹', '清', '白', '陈', '林', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
    const firstChars = ['三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿', '天', '地', '玄', '黄', '宇', '宙', '洪', '荒', '日', '月', '星', '辰', '云', '风', '雨', '雪', '霜', '露', '雾', '雷', '电', '冰', '火', '水', '土', '金', '木', '山', '河', '湖', '海', '林', '森', '花', '草', '树', '叶', '根', '枝', '果', '实', '春', '夏', '秋', '冬', '晨', '暮', '朝', '夕', '昼', '夜', '明', '暗', '光', '影', '灵', '魂', '心', '意', '志', '气', '力', '速', '敏', '捷', '智', '慧', '聪', '明', '睿', '哲', '圣', '贤', '神', '仙', '佛', '魔', '鬼', '妖', '精', '怪', '龙', '凤', '麒', '麟', '龟', '鹤', '鹰', '燕', '雀', '雁', '鹏', '雕', '狼', '虎', '豹', '狮', '熊', '象', '马', '牛', '羊', '猪', '狗', '猫', '兔', '鼠', '蛇', '鱼', '虾', '蟹', '贝', '珠', '宝', '玉', '石', '钻', '晶', '璃', '琉', '珀', '瑚', '珊', '珍', '瑰', '玮', '琪', '琳', '琅', '琥', '珀', '琮', '琬', '琰', '玥', '珂', '珈', '珉', '珊', '珙', '珞', '珩', '珥', '珧', '珣', '珽', '琀', '琛', '琚', '瑜', '瑞', '瑟', '瑰', '瑚', '瑀', '瑁', '瑗', '瑙', '瑚', '瑛', '瑜', '瑭', '璃', '璈', '瑾', '璀', '璁', '璇', '璋', '璎', '璜', '璀', '璠', '璟', '璩', '璐', '璨', '璪', '璫', '璬', '璮', '璯', '環', '璱', '璲', '璳', '璴', '璵', '璶', '璷', '璸', '璹', '璺', '璻', '璼', '璽', '璾', '璿', '瓀', '瓁', '瓂', '瓃', '瓄', '瓅', '瓆', '瓇', '瓈', '瓉', '瓊', '瓋', '瓌', '瓍', '瓎', '瓏', '瓐', '瓑', '瓒', '瓓', '瓔', '瓕', '瓖', '瓗', '瓘', '瓙', '瓚', '瓛'];
    const secondChars = ['', '儿', '子', '夫', '妻', '哥', '姐', '弟', '妹', '郎', '君', '王', '皇', '帝', '后', '妃', '嫔', '贵', '卿', '相', '将', '军', '师', '傅', '保', '太', '少', '老', '小', '大', '中', '高', '低', '长', '幼', '新', '旧', '古', '今', '前', '后', '左', '右', '上', '下', '内', '外', '东', '西', '南', '北', '中', '正', '邪', '善', '恶', '美', '丑', '真', '假', '虚', '实', '空', '无', '有', '无', '生', '死', '存', '亡', '兴', '衰', '盛', '弱', '强', '刚', '柔', '阴', '阳', '乾', '坤', '震', '巽', '坎', '离', '艮', '兑', '天', '地', '水', '火', '山', '泽', '风', '雷', '日', '月', '星', '辰', '云', '雨', '雪', '霜', '露', '雾', '冰', '雹', '霞', '虹', '霓', '霄', '汉', '河', '江', '湖', '海', '洋', '泉', '溪', '涧', '潭', '池', '沼', '泽', '渊', '瀑', '潮', '汐', '浪', '涛', '波', '澜', '漪', '涟', '漩', '涡', '汀', '渚', '洲', '岛', '礁', '岸', '滩', '沙', '尘', '埃', '土', '泥', '石', '岩', '崖', '壁', '峰', '岭', '山', '丘', '陵', '原', '野', '林', '森', '树', '木', '花', '草', '叶', '根', '枝', '果', '实', '种', '苗', '芽', '蕾', '苞', '朵', '瓣', '蕊', '粉', '蜜', '香', '臭', '味', '声', '音', '响', '鸣', '叫', '喊', '呼', '吸', '吹', '嘘', '叹', '息', '气', '风', '云', '雨', '雪', '霜', '露', '雾', '雷', '电', '冰', '火', '水', '土', '金', '木'];
    
    const surname = pick(surnames);
    const first = pick(firstChars);
    const second = pick(secondChars);
    
    return surname + first + second;
}

// ===== 武魂类别 =====
const WUHUN_CATEGORIES = {
    '强攻系': { icon: '⚔️', list: ['昊天锤', '破魂枪', '白虎', '蓝电霸王龙', '七杀剑', '黄金圣龙', '泰坦巨猿', '暗黑魔虎', '金刚狼', '狂战斧', '裂地锤', '龙鳞刀', '暴风战矛', '雷霆戟', '焚天剑', '玄冰锤', '破军枪', '银月狼', '烈火狮', '疾风豹', '铁甲犀', '血影蝠', '金翅鹏', '玄铁重剑', '霸王枪', '龙牙刀', '虎魄剑', '麒麟臂', '九头蛇', '熔岩巨人', '冰霜巨龙', '暗影刺客', '雷霆战斧', '暴风弓', '炎魔锤', '寒冰剑'] },
    '敏攻系': { icon: '💨', list: ['柔骨兔', '白鹤', '闪电貂', '幽冥猫', '风灵鸟', '影豹', '银月狐', '幻影蝶', '疾风狼', '暗影蛇', '灵猫', '飞羽', '电光鼠', '风刃', '影舞者', '白鹿', '青鸟', '幻蝶', '灵猴', '风鹰', '暗影狐', '银狼', '金蝉', '玉兔', '雨燕', '蜂鸟', '蜻蜓', '蝴蝶', '飞蛾'] },
    '防御系': { icon: '🛡️', list: ['玄武龟', '铁甲犀牛', '巨石像', '金刚熊', '大地之王', '石甲熊', '冰碧帝皇蝎', '泰坦巨猿', '玄龟', '穿山甲', '岩石巨人', '钢铁堡垒', '盾甲龙', '铁壁虫', '厚甲犀', '磐石龟', '金刚不坏', '不动明王', '山崩', '地裂'] },
    '控制系': { icon: '🎯', list: ['蓝银草', '彼岸花', '千钧蚁皇', '冰天雪女', '精神之海', '时空之龙', '幻境蝶', '梦魇', '噬魂蛛皇', '迷幻花', '魅惑狐', '催眠术', '时间停止', '空间扭曲', '心灵控制', '梦境编织', '幻象大师', '傀儡师', '暗影束缚', '蛛网缠绕'] },
    '辅助系': { icon: '✨', list: ['七宝琉璃塔', '九心海棠', '食神', '九宝琉璃塔', '如意盘', '生命女神', '天使', '凤凰', '麒麟', '神龙', '圣杯', '神灯', '魔法书', '智慧之眼', '命运之轮', '太阳神像', '月亮女神', '星辰之力', '彩虹桥', '许愿星'] },
    '治疗系': { icon: '🌿', list: ['九心海棠', '生命之树', '治愈天使', '圣光麒麟', '生命女神', '百草经', '灵猫', '玉兔', '金蝉', '青鸟', '神医', '药仙', '灵芝', '人参果', '蟠桃', '玉露', '甘霖', '春风', '暖阳', '月华'] }
};

// ===== 出身选项 =====
const ORIGINS = [
    { id: 'A', name: '圣魂村', desc: '与唐三同村，见证他武魂觉醒', bonus: { 精神力: 5 } },
    { id: 'B', name: '诺丁城', desc: '诺丁学院所在地，魂师起步之地', bonus: { 人脉: 5 } },
    { id: 'C', name: '天斗城', desc: '天斗帝国首都，繁华大都市', bonus: { money: 30, 人脉: 3 } },
    { id: 'D', name: '星斗大森林', desc: '魂兽聚集地，危险与机遇并存', bonus: { 力量: 5, 体质: 5 } },
    { id: 'E', name: '武魂城', desc: '武魂殿总部，魂师圣地', bonus: { 名声: 10 } },
    { id: 'F', name: '落日森林', desc: '温和魂兽区域，适合新手猎杀', bonus: { 速度: 5 } }
];

// ===== 家世背景 =====
const FAMILIES = [
    { id: 'A', name: '孤儿', desc: '无父无母，身世成谜', hasHome: false, bonus: { 心性: 10, 快意: 5 } },
    { id: 'B', name: '平民家庭', desc: '普通人家，温饱无忧', hasHome: true, bonus: { 体质: 5 } },
    { id: 'C', name: '商人家庭', desc: '家境殷实，从小耳濡目染', hasHome: true, bonus: { money: 50, 人脉: 5 } },
    { id: 'D', name: '魂师家庭', desc: '父母皆是魂师，家学渊源', hasHome: true, bonus: { 力量: 3, 防御: 3, 精神力: 3 } },
    { id: 'E', name: '贵族家庭', desc: '天斗贵族，身份显赫', hasHome: true, bonus: { money: 100, 名声: 10, 人脉: 10 } },
    { id: 'F', name: '宗门弟子', desc: '出身名门，有宗门背景', hasHome: true, bonus: { 力量: 5, 名声: 5 } },
    { id: 'G', name: '铁匠家庭', desc: '父亲是铁匠，与唐三家是邻居', hasHome: true, bonus: { 力量: 8 } },
    { id: 'H', name: '医者家庭', desc: '世代行医，救死扶伤', hasHome: true, bonus: { 精神力: 8, 健康值: 20 } }
];

// ===== 记忆保留 =====
const MEMORIES = [
    { id: 'A', name: '完整记忆', desc: '保留全部前世记忆', bonus: { 精神力: 10, 剧情预知度: 100 } },
    { id: 'B', name: '碎片记忆', desc: '只记得一些关键片段', bonus: { 精神力: 5, 剧情预知度: 50 } },
    { id: 'C', name: '模糊记忆', desc: '前世记忆朦胧不清', bonus: { 精神力: 3, 剧情预知度: 20 } },
    { id: 'D', name: '技能记忆', desc: '只记得前世的技能知识', bonus: { 力量: 5, 速度: 5 } },
    { id: 'E', name: '无记忆', desc: '完全忘记前世，如同新生', bonus: { 心性: 10, 快意: 10 } }
];

// ===== 武魂潜力 =====
const POTENTIALS = [
    { id: 'A', name: '绝世天才', desc: '先天满魂力，武魂品质极高', bonus: { 武魂品质: 5 } },
    { id: 'B', name: '双生武魂', desc: '拥有两个武魂，天赋异禀', bonus: { 武魂品质: 4 } },
    { id: 'C', name: '天才', desc: '先天魂力8-9级，武魂品质优良', bonus: { 武魂品质: 4 } },
    { id: 'D', name: '优秀', desc: '先天魂力6-7级，武魂品质不错', bonus: { 武魂品质: 3 } },
    { id: 'E', name: '普通', desc: '先天魂力3-5级，武魂品质一般', bonus: { 武魂品质: 2 } },
    { id: 'F', name: '废柴', desc: '先天魂力0-2级，武魂品质低下', bonus: { 武魂品质: 1 } }
];

// ===== 性格 =====
const PERSONALITIES = [
    { id: 'A', name: '热血侠义', desc: '嫉恶如仇，乐于助人', bonus: { 名声: 5, 人脉: 5 } },
    { id: 'B', name: '冷静理智', desc: '遇事冷静，善于分析', bonus: { 精神力: 8 } },
    { id: 'C', name: '腹黑狡诈', desc: '心思缜密，善于算计', bonus: { 隐蔽度: 10, 世界线扰动值: 5 } },
    { id: 'D', name: '温柔善良', desc: '心地善良，待人温和', bonus: { 人脉: 10 } },
    { id: 'E', name: '孤傲冷漠', desc: '性格孤僻，独来独往', bonus: { 力量: 5, 速度: 5 } },
    { id: 'F', name: '活泼开朗', desc: '乐观向上，善于交际', bonus: { 人脉: 8, 快意: 5 } },
    { id: 'G', name: '沉稳厚重', desc: '老成持重，值得信赖', bonus: { 防御: 8, 名声: 5 } },
    { id: 'H', name: '疯狂偏执', desc: '行事疯狂，执着一念', bonus: { 力量: 10, 心性: -5 } },
    { id: 'I', name: '佛系随缘', desc: '与世无争，随遇而安', bonus: { 心性: 10, 健康值: 10 } },
    { id: 'J', name: '野心勃勃', desc: '胸有大志，不甘平凡', bonus: { 名声: 10, 世界线扰动值: 10 } }
];

// ===== 初始物品 =====
const INIT_ITEMS = [
    { id: 'A', icon: '💰', name: '一袋金币', desc: '初始资金50金币', type: '特殊' },
    { id: 'B', icon: '📜', name: '武魂秘籍', desc: '一本基础武魂修炼功法', type: '特殊' },
    { id: 'C', icon: '🧪', name: '回血药水', desc: '三瓶初级回血药水', type: '消耗品' },
    { id: 'D', icon: '🗡️', name: '铁剑', desc: '一把普通的铁制长剑', type: '武器' },
    { id: 'E', icon: '🎁', name: '神秘礼盒', desc: '一个未知的神秘礼盒', type: '特殊' }
];

// ===== 地图数据 =====
const MAP_DATA = {
    '斗罗大陆': { desc: '武魂与魂师的世界，两大帝国与武魂殿并立。', children: ['天斗帝国', '星罗帝国', '武魂城', '星斗大森林', '落日森林', '杀戮之都', '天脊山脉', '海神岛'] },
    '天斗帝国': { desc: '大陆北方强国，首都天斗城。', children: ['天斗城', '圣魂村', '诺丁城', '昊天宗', '七宝琉璃宗', '蓝电霸王龙家族', '后山', '瀑布', '山洞', '矿洞', '古战场'] },
    '星罗帝国': { desc: '大陆南方帝国，首都星罗城。', children: ['星罗城', '边境要塞'] },
    '星罗城': { desc: '星罗帝国首都，与天斗城并称大陆两大主城。', parent: '星罗帝国' },
    '边境要塞': { desc: '天斗与星罗边境的军事要塞，常年驻扎重兵。', parent: '星罗帝国' },
    '圣魂村': { desc: '唐三与唐昊隐居的村子。', children: ['铁匠铺', '后山', '村口'] },
    '铁匠铺': { desc: '唐昊的铁匠铺，终日传出打铁声。', parent: '圣魂村', events: ['遇见唐昊', '遇见唐三'] },
    '后山': { desc: '圣魂村后山，唐三常在此偷偷修炼。', parent: '圣魂村', events: ['发现唐三修炼', '偶遇神秘人'] },
    '村口': { desc: '圣魂村口，老杰克村长常在此巡视。', parent: '圣魂村', events: ['遇见杰克村长', '路人闲谈'] },
    '诺丁城': { desc: '诺丁初级魂师学院所在。', unlock: 'level', unlockVal: 15, cost: 2, children: ['诺丁初级魂师学院', '武魂分殿', '集市', '酒馆'] },
    '诺丁初级魂师学院': { desc: '初级魂师学院，未来唐三与小舞将在此入学。', parent: '诺丁城' },
    '酒馆': { desc: '诺丁城的酒馆，三教九流汇聚之地。', parent: '诺丁城' },
    '天斗城': { desc: '天斗帝国首都，大陆最繁华的城市。', unlock: 'level', unlockVal: 20, cost: 5, children: ['皇宫', '天斗皇家学院', '武魂分殿', '拍卖行', '斗魂场'] },
    '皇宫': { desc: '天斗帝国皇宫，雪夜大帝居住之地。', parent: '天斗城' },
    '天斗皇家学院': { desc: '天斗帝国最高学府，天才云集。', parent: '天斗城' },
    '拍卖行': { desc: '天斗城的拍卖行，奇珍异宝应有尽有。', parent: '天斗城' },
    '斗魂场': { desc: '魂师对战的场所，可获得斗魂徽章。', parent: '天斗城' },
    '武魂城': { desc: '武魂殿总部，教皇殿矗立中央。', unlock: 'age', unlockVal: 15, cost: 10, children: ['教皇殿', '武魂分殿', '斗魂场', '武魂图书馆'] },
    '教皇殿': { desc: '武魂殿最高权力中心，教皇比比东所在地。', parent: '武魂城' },
    '武魂图书馆': { desc: '收藏了无数武魂相关典籍的图书馆。', parent: '武魂城' },
    '昊天宗': { desc: '天下第一宗门，唐昊出身之地，隐世不出。', parent: '天斗帝国', unlock: 'level', unlockVal: 50, cost: 15 },
    '七宝琉璃宗': { desc: '大陆第一辅助宗门，宁风致为宗主。', parent: '天斗帝国', unlock: 'level', unlockVal: 40, cost: 10 },
    '蓝电霸王龙家族': { desc: '大陆第一兽武魂家族，宗主玉元震。', parent: '天斗帝国', unlock: 'level', unlockVal: 40, cost: 10 },
    '星斗大森林': { desc: '大陆最凶险的魂兽森林。', children: ['外围区', '混合区', '核心区'] },
    '外围区': { desc: '星斗大森林外围，十年至百年魂兽出没。', unlock: 'level', unlockVal: 10, cost: 5, hunt: true, parent: '星斗大森林' },
    '混合区': { desc: '星斗大森林混合区，百年至万年魂兽出没。', unlock: 'level', unlockVal: 30, cost: 8, hunt: true, parent: '星斗大森林' },
    '核心区': { desc: '星斗大森林核心区，千年至十万年魂兽出没。', unlock: 'level', unlockVal: 60, cost: 12, hunt: true, parent: '星斗大森林' },
    '落日森林': { desc: '天斗城附近的魂兽森林，冰火两仪眼藏于深处。', children: ['落日外围', '落日深处', '冰火两仪眼'] },
    '落日外围': { desc: '落日森林外围，十年至百年魂兽出没。', unlock: 'level', unlockVal: 20, cost: 3, hunt: true, parent: '落日森林' },
    '落日深处': { desc: '落日森林深处，百年至万年魂兽出没。', unlock: 'level', unlockVal: 50, cost: 8, hunt: true, parent: '落日森林' },
    '冰火两仪眼': { desc: '落日森林最深处的秘境，冰火交融之地。', unlock: 'level', unlockVal: 70, cost: 15, parent: '落日森林' },
    '瀑布': { desc: '山间一道壮丽的瀑布，水声如雷。', events: ['感悟水元素', '发现隐藏洞窟'], hasTrigger: true },
    '山洞': { desc: '一个深邃的山洞，可能有魂兽或宝物。', events: ['探索山洞深处', '遭遇地穴魂兽'], hasTrigger: true },
    '矿洞': { desc: '一座废弃的矿洞，石壁上有暗红色晶石。', events: ['采集矿石', '发现古代矿道'], hasTrigger: true },
    '古战场': { desc: '一片荒芜的古战场，散落着残破的兵器和骨骸。', events: ['寻找遗物', '感受杀气'], hasTrigger: true },
    '天脊山脉': { desc: '横贯大陆的巍峨山脉。', children: ['天脊古栈道', '落雁峡', '天柱峰'] },
    '天脊古栈道': { desc: '悬崖上的栈道，宽仅容一人。', events: ['穿越栈道', '遭遇山匪'], hasTrigger: true, parent: '天脊山脉' },
    '落雁峡': { desc: '天脊山脉中段的一处峡谷，风极大。', events: ['寻找古路', '发现隐世剑派'], hasTrigger: true, parent: '天脊山脉' },
    '天柱峰': { desc: '天脊山脉主峰，高耸入云。', unlock: 'level', unlockVal: 80, cost: 20, parent: '天脊山脉' },
    '海神岛': { desc: '大海深处的神秘岛屿，海神的传承之地。', unlock: 'level', unlockVal: 80, cost: 30 },
    '杀戮之都': { desc: '独立于大陆之外的杀戮世界。', unlock: 'age', unlockVal: 18, cost: 15, children: ['入口', '杀戮场', '地狱路'] },
    '入口': { desc: '杀戮之都的入口，隐藏在地下。', parent: '杀戮之都' },
    '杀戮场': { desc: '杀戮之都的核心区域，魂师在此厮杀。', parent: '杀戮之都' },
    '地狱路': { desc: '通往杀戮之都深处的道路，九死一生。', parent: '杀戮之都' }
};

// ===== NPC数据 =====
const NPC_DATA = {
    '唐三': { age: 5, baseAge: 5, loc: '圣魂村', desc: '双生武魂（蓝银草/昊天锤），先天满魂力。', icon: '🌿' },
    '唐昊': { age: 45, baseAge: 45, loc: '圣魂村', desc: '昊天斗罗，95级封号斗罗。', icon: '🔨' },
    '杰克村长': { age: 60, baseAge: 60, loc: '圣魂村', desc: '圣魂村村长，和蔼可亲。', icon: '👴' },
    '大师(玉小刚)': { age: 40, baseAge: 40, loc: '天斗城', desc: '蓝电霸王龙家族弃徒，武魂理论大师。', icon: '📖' },
    '戴沐白': { age: 9, baseAge: 9, loc: '星罗城', desc: '星罗帝国皇子，白虎武魂。', icon: '🐯' },
    '宁荣荣': { age: 7, baseAge: 7, loc: '七宝琉璃宗', desc: '七宝琉璃宗宗主之女。', icon: '🏯' },
    '比比东': { age: 45, baseAge: 45, loc: '武魂城', desc: '武魂殿教皇，罗刹神传承者。', icon: '👑' },
    '小舞': { age: 5, baseAge: 5, loc: '星斗大森林', desc: '十万年魂兽柔骨兔化形。', icon: '🐰' },
    '马红俊': { age: 8, baseAge: 8, loc: '天斗城', desc: '邪火凤凰武魂。', icon: '🔥' },
    '奥斯卡': { age: 8, baseAge: 8, loc: '天斗城', desc: '食物系武魂，香肠专卖。', icon: '🌭' },
    '朱竹清': { age: 7, baseAge: 7, loc: '星罗城', desc: '幽冥灵猫武魂。', icon: '🐱' }
};

// ===== 魂兽数据 =====
const SOUL_BEASTS = [
    { name: '十年魂兽', minYear: 10, maxYear: 99, hp: 20, atk: 5, def: 2, exp: 5, gold: [5, 15] },
    { name: '百年魂兽', minYear: 100, maxYear: 999, hp: 80, atk: 15, def: 8, exp: 20, gold: [20, 50] },
    { name: '千年魂兽', minYear: 1000, maxYear: 9999, hp: 200, atk: 40, def: 20, exp: 80, gold: [80, 200] },
    { name: '万年魂兽', minYear: 10000, maxYear: 99999, hp: 500, atk: 100, def: 50, exp: 200, gold: [300, 800] },
    { name: '十万年魂兽', minYear: 100000, maxYear: 999999, hp: 1500, atk: 300, def: 150, exp: 1000, gold: [2000, 5000] }
];

// ===== 商店物品 =====
const SHOP_ITEMS = [
    { name: '干粮', desc: '恢复少量体力', price: 5, type: '消耗品', effect: { 体质: 10 } },
    { name: '回血药水', desc: '恢复健康值', price: 20, type: '消耗品', effect: { 健康值: 30 } },
    { name: '魂力药水', desc: '临时提升魂力', price: 50, type: '消耗品', effect: { 精神力: 10 } },
    { name: '铁剑', desc: '普通铁制长剑', price: 100, type: '武器', atk: 5 },
    { name: '精钢剑', desc: '精钢打造的长剑', price: 500, type: '武器', atk: 15 },
    { name: '皮甲', desc: '兽皮制作的护甲', price: 80, type: '防具', def: 5 },
    { name: '锁子甲', desc: '铁环编织的护甲', price: 400, type: '防具', def: 15 },
    { name: '速度靴', desc: '提升移动速度', price: 200, type: '鞋子', spd: 10 },
    { name: '魂力项链', desc: '提升精神力', price: 300, type: '饰品', spirit: 10 },
    { name: '武魂秘籍', desc: '修炼功法，永久提升', price: 1000, type: '特殊', effect: { 武魂品质: 1 } }
];

// ===== 事务模板 =====
const TASK_TEMPLATES = [
    { title: '采集草药', desc: '为药店采集10份草药', difficulty: '简单', reward: { gold: [10, 20] } },
    { title: '送信任务', desc: '将信件送到指定地点', difficulty: '简单', reward: { gold: [7, 15] } },
    { title: '清理野兽', desc: '清理村庄附近的野兽', difficulty: '普通', reward: { gold: [20, 40] } },
    { title: '护送商队', desc: '护送商队安全抵达目的地', difficulty: '普通', reward: { gold: [25, 50] } },
    { title: '猎杀魂兽', desc: '猎杀指定年限的魂兽', difficulty: '中级', reward: { gold: [50, 100] } },
    { title: '探索遗迹', desc: '探索古代遗迹并取回宝物', difficulty: '中级', reward: { gold: [75, 150] } },
    { title: '讨伐盗贼', desc: '剿灭盘踞山区的盗贼团', difficulty: '高级', reward: { gold: [150, 300] } },
    { title: 'S级悬赏', desc: '完成极其危险的悬赏任务', difficulty: '高级', reward: { gold: [250, 500] } }
];

// 事务成功率（降低20%）
const TASK_SUCCESS_RATE = {
    '简单': 0.7,
    '普通': 0.55,
    '中级': 0.3,
    '高级': 0.1
};

// 事务失败伤害（难度越大，扣除血量越多）
const TASK_FAIL_DAMAGE = {
    '简单': 5,
    '普通': 10,
    '中级': 20,
    '高级': 35
};

// ===== 魂骨模板 =====
const SOUL_BONE_TEMPLATES = [
    { name: '精神凝聚之智慧头骨', slot: '头部', year: 1000, bonus: { 精神力: 15, 魂力储量: 10 } },
    { name: '火焰爆裂头骨', slot: '头部', year: 5000, bonus: { 精神力: 25, 力量: 10 } },
    { name: '蓝银皇右腿骨', slot: '右腿', year: 10000, bonus: { 速度: 20, 体质: 10 } },
    { name: '邪魔虎鲸左腿骨', slot: '左腿', year: 10000, bonus: { 力量: 25, 速度: 15 } },
    { name: '泰坦巨猿左臂骨', slot: '左手', year: 10000, bonus: { 力量: 30, 防御: 10 } },
    { name: '天青牛蟒右臂骨', slot: '右手', year: 10000, bonus: { 精神力: 20, 魂力储量: 20 } },
    { name: '山龙王躯干骨', slot: '躯干', year: 20000, bonus: { 防御: 30, 体质: 20, 力量: 15 } },
    { name: '冰碧帝皇蝎躯干骨', slot: '躯干', year: 400000, bonus: { 精神力: 40, 体质: 30, 速度: 20 } },
    { name: '初级头骨', slot: '头部', year: 100, bonus: { 精神力: 5 } },
    { name: '初级躯干骨', slot: '躯干', year: 100, bonus: { 防御: 5, 体质: 5 } },
    { name: '初级左手骨', slot: '左手', year: 100, bonus: { 力量: 5 } },
    { name: '初级右手骨', slot: '右手', year: 100, bonus: { 力量: 5 } },
    { name: '初级左腿骨', slot: '左腿', year: 100, bonus: { 速度: 5 } },
    { name: '初级右腿骨', slot: '右腿', year: 100, bonus: { 速度: 5 } }
];

// ===== 魂师等级称号 =====
function getSoulTitle(level) {
    if (level < 0) return '未觉醒';
    if (level < 10) return '魂士';
    if (level < 20) return '魂师';
    if (level < 30) return '大魂师';
    if (level < 40) return '魂尊';
    if (level < 50) return '魂宗';
    if (level < 60) return '魂王';
    if (level < 70) return '魂帝';
    if (level < 80) return '魂圣';
    if (level < 90) return '魂斗罗';
    if (level < 95) return '封号斗罗';
    if (level < 99) return '超级斗罗';
    return '神级';
}

// ===== 添加日志 =====
function addLog(player, msg) {
    if (!player.log) player.log = [];
    const time = `第${player.turn || 1}月第${player.day || 1}天`;
    player.log.push({ time, msg });
    if (player.log.length > 200) player.log.shift();
}

// ===== 好感度爱心计算 =====
function getLoveHearts(like) {
    if (like === 0 || like === undefined) return '';
    const level = Math.floor(Math.abs(like) / 20);
    const heart = like > 0 ? '❤️' : '🖤';
    return heart.repeat(level);
}

// ===== 检查是否可以吸收魂环 =====
function canAbsorbRing(player) {
    const level = Math.floor(player.魂力等级 || 0);
    const ringCount = (player.魂环配置 || []).length;
    const maxRings = Math.floor(level / 10);
    return ringCount < maxRings;
}

// ===== 创建角色 =====
function createPlayer(name, gender) {
    const origin = pick(ORIGINS);
    let family = pick(FAMILIES);
    const memory = pick(MEMORIES);
    const potential = pick(POTENTIALS);
    const personality = pick(PERSONALITIES);
    const item = pick(INIT_ITEMS);

    const potName = potential.name;
    let isDual = (potName === '双生武魂');

    // 隐藏武魂：孤竹（5%概率）
    let isHiddenGuzhu = false;
    if (rand(0, 100) < 5) {
        isHiddenGuzhu = true;
        isDual = false;
        family = FAMILIES[0];
        name = '十年孤竹';
    }

    // 随机武魂
    const categories = Object.keys(WUHUN_CATEGORIES);
    const cat1 = pick(categories);
    let wuhun1Name, wuhun1Category;
    if (isHiddenGuzhu) {
        wuhun1Name = '孤竹';
        wuhun1Category = '隐藏武魂';
    } else {
        wuhun1Name = pick(WUHUN_CATEGORIES[cat1].list);
        wuhun1Category = cat1;
    }

    // 双生武魂
    let wuhun2Name = null, wuhun2Category = null;
    if (isDual) {
        const cat2 = pick(categories);
        wuhun2Name = pick(WUHUN_CATEGORIES[cat2].list);
        wuhun2Category = cat2;
    }

    const innateSoul = rand(3, 10);
    const initialLevel = Math.min(innateSoul, 99);

    const player = {
        name,
        gender,
        ageYears: 6,
        origin: origin.name,
        family: family.name,
        hasHome: family.hasHome,
        memory: memory.name,
        potential: potName,
        personality: personality.name,
        initItem: item.name,
        先天魂力: innateSoul,
        魂力等级: initialLevel,
        武魂品质: potential.bonus.武魂品质 || 3,
        wuhunList: [wuhun1Name],
        wuhunCategoryList: [wuhun1Category],
        isDualSoul: isDual,
        wuhun2Name: isDual ? wuhun2Name : null,
        wuhun2Category: isDual ? wuhun2Category : null,
        魂环配置: [],
        体质: 50,
        精神力: 40,
        力量: 35,
        速度: isHiddenGuzhu ? 85 : 40,
        防御: 35,
        魂力储量: innateSoul * 10,
        名声: 0,
        人脉: 0,
        势力好感: {},
        剧情预知度: 0,
        隐蔽度: 70,
        世界线扰动值: 0,
        心性: 50,
        快意: 50,
        健康值: 80,
        money: 20,
        silver: 0,
        copper: 0,
        inventory: [],
        equipment: { 武器: null, 防具: null, 饰品: null, 鞋子: null },
        soulBones: { 头部: null, 躯干: null, 左手: null, 右手: null, 左腿: null, 右腿: null },
        soulBoneInventory: [],
        location: ['斗罗大陆', '天斗帝国', origin.name],
        log: [],
        turn: 1,
        day: 1,
        partners: [],
        npcLikes: {},
        npcTriggered: {},
        monthlyLikeGain: {},
        visitedLocations: {},
        eventsTriggered: [],
        hunted: 0,
        trained: 0,
        fights: 0,
        canTrain: true,
        ended: false,
        tasksCompleted: 0,
        availableTasks: [],
        godAttempts: 0,
        tangBattleTriggered: false
    };

    // 应用出身/家世/记忆/性格加成
    if (origin && origin.bonus) { for (let key in origin.bonus) { if (player[key] !== undefined) player[key] += origin.bonus[key]; } }
    if (family && family.bonus) { for (let key in family.bonus) { if (player[key] !== undefined) player[key] += family.bonus[key]; } }
    if (memory && memory.bonus) { for (let key in memory.bonus) { if (player[key] !== undefined) player[key] += memory.bonus[key]; } }
    if (personality && personality.bonus) { for (let key in personality.bonus) { if (player[key] !== undefined) player[key] += personality.bonus[key]; } }

    // 初始物品
    player.inventory.push({ name: item.name, desc: item.desc, icon: item.icon, type: item.type, count: 1 });
    player.inventory.push({ name: '干粮 (3天)', type: '食物', count: 3 });

    // 初始化NPC好感度
    for (let key in NPC_DATA) {
        player.npcLikes[key] = { like: 0, met: false };
        player.npcTriggered[key] = false;
        player.monthlyLikeGain[key] = 0;
    }

    // 记录初始访问地区
    player.visitedLocations = {};
    for (let loc of player.location) {
        player.visitedLocations[loc] = true;
    }

    // 隐藏武魂孤竹特殊处理
    if (wuhun1Name === '孤竹') {
        player.力量 = 15;
        addLog(player, '🎋 觉醒隐藏武魂「孤竹」，名字强制改为「十年孤竹」。特性：高速度低攻击，身世飘零注定孤独。');
    }

    player.baseStats = { 体质: player.体质, 精神力: player.精神力, 力量: player.力量, 速度: player.速度, 防御: player.防御, 魂力等级: player.魂力等级 };

    addLog(player, `🗡️ ${name} 穿越至斗罗大陆，降临在${origin.name}。`);
    addLog(player, `🏠 家世：${family.name}`);
    addLog(player, `⚔️ 武魂：${wuhun1Name}（${wuhun1Category}）${isDual ? ` + ${wuhun2Name}（${wuhun2Category}）` : ''}`);
addLog(player, `🌟 先天魂力：${innateSoul}，初始等级：${initialLevel}级`);

    // 生成初始事务
    player.availableTasks = generateTasks(player);

    return player;
}

// ===== 生成事务 =====
function generateTasks(player) {
    const tasks = [];
    const count = rand(3, 5);
    for (let i = 0; i < count; i++) {
        const template = pick(TASK_TEMPLATES);
        tasks.push({
            id: Date.now() + i,
            title: template.title,
            desc: template.desc,
            difficulty: template.difficulty,
            reward: {
                gold: rand(template.reward.gold[0], template.reward.gold[1])
            }
        });
    }
    return tasks;
}

// ===== 修炼 =====
function cultivate(player) {
    if (!player.canTrain) {
        return { success: false, message: '今天已经修炼过了，明天再来吧。' };
    }
    player.canTrain = false;
    player.trained++;
    
    // 检查魂环数量：每10级需要一个魂环
    const requiredRings = Math.floor(player.魂力等级 / 10);
    const currentRings = player.魂环配置?.length || 0;
    const needRing = currentRings < requiredRings;
    
    const baseGain = 0.2;
    let gain = baseGain;
    let isCrit = false;
    
    if (Math.random() < 0.5) {
        isCrit = true;
        const extra = Math.random() < 0.05 ? 1 : (0.1 + Math.random() * 0.4);
        gain += extra;
    }
    
    // 如果魂环数量不足，获取经验效率乘以0.000001倍
    let ringPenalty = false;
    if (needRing) {
        gain = gain * 0.000001;
        ringPenalty = true;
    }
    
    player.魂力等级 = Math.round((player.魂力等级 + gain) * 10) / 10;
    player.魂力储量 += Math.floor(gain * 10);
    
    let logMsg = `🧘 修炼魂力，获得 ${gain} 级魂力${isCrit ? '（暴击！）' : ''}`;
    let resultMsg = `修炼成功！魂力+${gain}${isCrit ? '（暴击！）' : ''}`;
    
    if (ringPenalty) {
        const needLevel = requiredRings * 10;
        logMsg += `（魂力停滞！需要吸收${requiredRings}个魂环才能突破${needLevel}级）`;
        resultMsg += `\n⚠️ 魂力停滞！当前需要${requiredRings}个魂环（已有${currentRings}个），吸收魂环后才能正常突破！`;
    }
    
    addLog(player, logMsg);
    return { success: true, gain, isCrit, ringPenalty, requiredRings, currentRings, message: resultMsg };
}

// ===== 探索 =====
function explore(player) {
    const currentLoc = player.location[player.location.length - 1];
    const locData = MAP_DATA[currentLoc] || {};

    // 检查是否在魂兽森林（星斗大森林、落日森林及其子地区）
    const isSoulBeastForest = ['星斗大森林', '落日森林', '外围区', '混合区', '核心区', '落日外围', '落日深处', '冰火两仪眼'].includes(currentLoc) ||
        (player.location.some(loc => ['星斗大森林', '落日森林'].includes(loc)));

    // 如果在魂兽森林，有60%概率碰到魂兽
    if (isSoulBeastForest && Math.random() < 0.6) {
        const huntResult = huntBeast(player);
        addLog(player, `🔍 探索：${huntResult.message}`);
        return { success: true, huntResult, message: huntResult.message, isHunt: true };
    }

    // 随机事件
    const events = [
        { msg: '你在周围探索，发现了一些有用的材料。', reward: { money: rand(5, 20) } },
        { msg: '你遇到了一位路过的魂师，他指点了你几句。', reward: { 精神力: 1 } },
        { msg: '你发现了一个隐秘的角落，里面有一个宝箱！', reward: { money: rand(20, 50) } },
        { msg: '你在探索中遇到了危险，勉强脱身。', reward: { 体质: -2, 健康值: -10 } },
        { msg: '你帮助了一位迷路的老人，他感谢了你。', reward: { 名声: 2, 人脉: 1 } }
    ];

    if (locData.hunt) {
        events.push({ msg: '你遇到了一只低阶魂兽，经过一番战斗将其击败！', reward: { money: rand(10, 30), 名声: 1 } });
    }

    // 有概率遇到NPC
    const npcsAtLoc = Object.keys(NPC_DATA).filter(n => NPC_DATA[n].loc === currentLoc);
    if (npcsAtLoc.length > 0 && Math.random() < 0.4) {
        const npc = pick(npcsAtLoc);
        if (!player.npcLikes[npc].met) {
            player.npcLikes[npc].met = true;
            addLog(player, `👋 你在${currentLoc}遇到了${npc}！`);
            events.push({ msg: `你遇到了${npc}，并与他/她相识。`, reward: { 人脉: 2 }, npcMet: npc });
        }
    }

    const event = pick(events);
    if (event.reward.money) player.money += event.reward.money;
    if (event.reward.精神力) player.精神力 += event.reward.精神力;
    if (event.reward.体质) player.体质 = Math.max(0, player.体质 + event.reward.体质);
    if (event.reward.健康值) player.健康值 = Math.max(0, player.健康值 + event.reward.健康值);
    if (event.reward.名声) player.名声 += event.reward.名声;
    if (event.reward.人脉) player.人脉 += event.reward.人脉;

    addLog(player, `🔍 探索：${event.msg}`);
    return { success: true, event, message: event.msg };
}

// ===== 休息 =====
function rest(player) {
    player.体质 = 100;
    player.健康值 = 100;
    addLog(player, `😴 休息了一下，体力、健康已回满。`);
    return { success: true, message: '休息完成，体力、健康已回满！' };
}

// ===== 推进一天 =====
function advanceDay(player, days = 1) {
    for (let i = 0; i < days; i++) {
        player.day++;
        if (player.day > 30) {
            player.day = 1;
            player.turn++;
            // 每月重置好感度获取上限
            for (let key in player.monthlyLikeGain) {
                player.monthlyLikeGain[key] = 0;
            }
            // 每月年龄增长
            player.ageYears = Math.round((player.ageYears + 1 / 12) * 100) / 100;
        }
        // 每天重置修炼状态
        player.canTrain = true;
    }
    return { success: true, day: player.day, turn: player.turn, message: `时间推进到第${player.turn}月第${player.day}天` };
}

// ===== 推进一月 =====
function advanceMonth(player) {
    // 直接跳到下个月第1天
    player.turn++;
    player.day = 1;
    addLog(player, `📅 时间推进到第${player.turn}月第1天。`);
    return { success: true, day: player.day, turn: player.turn, message: `时间推进到第${player.turn}月第1天` };
}

// ===== 导航到地区 =====
function navigate(player, location) {
    if (!MAP_DATA[location]) {
        return { success: false, message: '未知地区' };
    }
    const locData = MAP_DATA[location];
    // 检查解锁条件
    if (locData.unlock === 'level' && player.魂力等级 < locData.unlockVal) {
        return { success: false, message: `你的等级太低，需要${locData.unlockVal}级才能进入${location}。` };
    }
    if (locData.unlock === 'age' && player.ageYears < locData.unlockVal) {
        return { success: false, message: `你的年龄太小，需要${locData.unlockVal}岁才能进入${location}。` };
    }
    // 检查金币
    if (locData.cost && player.money < locData.cost) {
        return { success: false, message: `金币不足，需要${locData.cost}金币才能前往${location}。` };
    }
    if (locData.cost) {
        player.money -= locData.cost;
    }
    player.location = ['斗罗大陆', '天斗帝国', location];
    player.visitedLocations[location] = true;
    addLog(player, `🚶 你来到了${location}。${locData.desc}`);
    return { success: true, location, message: `你来到了${location}` };
}

// ===== 与NPC对话（增加好感度） =====
function talkToNpc(player, npcName) {
    if (!NPC_DATA[npcName]) {
        return { success: false, message: '未知的NPC' };
    }
    if (!player.npcLikes[npcName] || !player.npcLikes[npcName].met) {
        return { success: false, message: '你还没有认识这个人' };
    }
    // 检查每月好感度上限
    if ((player.monthlyLikeGain[npcName] || 0) >= 10) {
        return { success: false, message: `这个月与${npcName}的好感度已经达到上限了。` };
    }
    // 每次对话+2好感度
    const gain = 2;
    player.npcLikes[npcName].like = Math.min(100, (player.npcLikes[npcName].like || 0) + gain);
    player.monthlyLikeGain[npcName] = (player.monthlyLikeGain[npcName] || 0) + gain;

    // 检查是否进入情缘（好感度>=60）
    let enteredLove = false;
    if (player.npcLikes[npcName].like >= 60 && !player.partners.includes(npcName)) {
        player.partners.push(npcName);
        enteredLove = true;
        addLog(player, `💕 ${npcName}对你的好感度达到了60，进入了情缘关系！`);
    }

    // 检查是否可以结为伴侣（好感度>=90）
    let canMarry = player.npcLikes[npcName].like >= 90;

    const dialogues = [
        `${npcName}：今天天气不错呢。`,
        `${npcName}：你最近修炼得怎么样了？`,
        `${npcName}：听说了吗？武魂殿最近有大动作。`,
        `${npcName}：有空一起去修炼吗？`,
        `${npcName}：你真是个有趣的人呢。`
    ];

    addLog(player, `💬 与${npcName}对话，好感度+${gain}`);
    return {
        success: true,
        dialogue: pick(dialogues),
        like: player.npcLikes[npcName].like,
        hearts: getLoveHearts(player.npcLikes[npcName].like),
        enteredLove,
        canMarry,
        message: `与${npcName}对话，好感度+${gain}`
    };
}

// ===== 结为伴侣 =====
function marryNpc(player, npcName) {
    if (!NPC_DATA[npcName]) {
        return { success: false, message: '未知的NPC' };
    }
    if (!player.npcLikes[npcName] || player.npcLikes[npcName].like < 90) {
        return { success: false, message: `好感度不足，需要90点才能结为伴侣。` };
    }
    if (player.spouse === npcName) {
        return { success: false, message: `你已经和${npcName}结为伴侣了。` };
    }
    player.spouse = npcName;
    addLog(player, `💍 你与${npcName}结为伴侣，从此携手同行！`);
    return { success: true, spouse: npcName, message: `你与${npcName}结为伴侣！` };
}

// ===== 猎取魂兽 =====
function huntBeast(player) {
    const currentLoc = player.location[player.location.length - 1];
    const locData = MAP_DATA[currentLoc] || {};
    if (!locData.hunt) {
        return { success: false, message: '这里不能猎杀魂兽，请前往星斗大森林或落日森林。' };
    }

    // 根据地区决定魂兽等级
    let beastPool;
    if (currentLoc === '外围区' || currentLoc === '落日外围') {
        beastPool = SOUL_BEASTS.slice(0, 2); // 十年、百年
    } else if (currentLoc === '混合区' || currentLoc === '落日深处') {
        beastPool = SOUL_BEASTS.slice(1, 4); // 百年、千年、万年
    } else if (currentLoc === '核心区') {
        beastPool = SOUL_BEASTS.slice(2); // 千年、万年、十万年
    } else {
        beastPool = SOUL_BEASTS.slice(0, 2);
    }

    const beast = pick(beastPool);
    const year = rand(beast.minYear, beast.maxYear);
    player.hunted++;
    player.fights++;

    // 战斗计算
    const playerPower = player.力量 + player.防御 + player.精神力 + player.魂力等级 * 2;
    const beastPower = beast.atk + beast.def + year / 100;
    const winRate = clamp(playerPower / (playerPower + beastPower), 0.1, 0.9);
    const won = Math.random() < winRate;

    if (won) {
        const gold = rand(beast.gold[0], beast.gold[1]);
        player.money += gold;
        player.名声 += Math.floor(beast.exp / 10);
        addLog(player, `⚔️ 猎杀了一只${year}年${beast.name}，获得${gold}金币！`);

        // 概率获得魂骨（年份越高，概率越大）
        let soulBone = null;
        const boneDropRate = Math.min(0.3, year / 100000); // 最高30%概率
        if (Math.random() < boneDropRate) {
            // 根据魂兽年份选择合适的魂骨
            const suitableBones = SOUL_BONE_TEMPLATES.filter(b => b.year <= year * 2);
            if (suitableBones.length > 0) {
                soulBone = { ...pick(suitableBones) };
                player.soulBoneInventory.push(soulBone);
                addLog(player, `🦴 获得了魂骨：${soulBone.name}（${soulBone.year}年）！`);
            }
        }

        // 检查是否可以吸收魂环
        const canAbsorb = canAbsorbRing(player);
        return {
            success: true,
            won: true,
            beast: { ...beast, year },
            gold,
            soulBone,
            canAbsorbRing: canAbsorb,
            message: `猎杀成功！获得${gold}金币${soulBone ? `，获得魂骨：${soulBone.name}！` : ''}${canAbsorb ? '，可以吸收魂环！' : '，但当前无法吸收魂环（需要每10级才能吸收一个）。'}`
        };
    } else {
        const damage = rand(10, 30);
        player.健康值 = Math.max(0, player.健康值 - damage);
        player.体质 = Math.max(0, player.体质 - 10);
        addLog(player, `💔 被${year}年${beast.name}击败，损失${damage}健康值！`);
        return {
            success: true,
            won: false,
            beast: { ...beast, year },
            damage,
            message: `猎杀失败！被${beast.name}击败，损失${damage}健康值。`
        };
    }
}

// ===== 吸收魂环 =====
function absorbRing(player, beastYear, beastName) {
    if (!canAbsorbRing(player)) {
        return { success: false, message: '当前无法吸收魂环（需要每10级才能吸收一个）。' };
    }
    const ring = {
        name: beastName || '魂环',
        year: beastYear,
        absorbedAt: player.魂力等级
    };
    if (!player.魂环配置) player.魂环配置 = [];
    player.魂环配置.push(ring);
    // 吸收魂环提升属性
    player.力量 += Math.floor(beastYear / 1000) + 1;
    player.防御 += Math.floor(beastYear / 1000) + 1;
    player.精神力 += Math.floor(beastYear / 1000) + 1;
    addLog(player, `💍 吸收了${beastYear}年魂环，实力大增！`);
    return { success: true, ring, message: `吸收${beastYear}年魂环成功！` };
}

// ===== 接取并完成事务 =====
function doTask(player, taskId) {
    const taskIndex = player.availableTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        return { success: false, message: '事务不存在或已完成。' };
    }
    const task = player.availableTasks[taskIndex];
    const successRate = TASK_SUCCESS_RATE[task.difficulty] || 0.5;
    const won = Math.random() < successRate;

    if (won) {
        player.money += task.reward.gold;
        player.tasksCompleted++;
        addLog(player, `📋 完成事务「${task.title}」，获得${task.reward.gold}金币！`);
        // 移除已完成事务
        player.availableTasks.splice(taskIndex, 1);
        return { success: true, won: true, task, message: `事务完成！获得${task.reward.gold}金币。` };
    } else {
        const damage = TASK_FAIL_DAMAGE[task.difficulty] || 10;
        player.健康值 = Math.max(0, player.健康值 - damage);
        addLog(player, `❌ 事务「${task.title}」失败，损失${damage}健康值。`);
        player.availableTasks.splice(taskIndex, 1);
        return { success: true, won: false, task, message: `事务失败，损失${damage}健康值。` };
    }
}

// ===== 刷新事务（消耗5金币） =====
function refreshTasks(player) {
    if (player.money < 5) {
        return { success: false, message: '金币不足，刷新事务需要5金币。' };
    }
    player.money -= 5;
    player.availableTasks = generateTasks(player);
    addLog(player, '🔄 花费5金币刷新了事务列表。');
    return { success: true, tasks: player.availableTasks, message: '事务列表已刷新！' };
}

// ===== 装备魂骨 =====
function equipSoulBone(player, boneIndex) {
    if (boneIndex < 0 || boneIndex >= player.soulBoneInventory.length) {
        return { success: false, message: '魂骨不存在。' };
    }
    const bone = player.soulBoneInventory[boneIndex];
    const slot = bone.slot;
    // 如果该槽位已有魂骨，先卸下
    if (player.soulBones[slot]) {
        const oldBone = player.soulBones[slot];
        // 移除旧魂骨属性加成
        if (oldBone.bonus) {
            for (let key in oldBone.bonus) {
                player[key] = Math.max(0, player[key] - oldBone.bonus[key]);
            }
        }
        player.soulBoneInventory.push(oldBone);
    }
    // 装备新魂骨
    player.soulBones[slot] = bone;
    player.soulBoneInventory.splice(boneIndex, 1);
    // 应用魂骨属性加成
    if (bone.bonus) {
        for (let key in bone.bonus) {
            player[key] += bone.bonus[key];
        }
    }
    addLog(player, `🦴 装备了${bone.name}（${bone.year}年）。`);
    return { success: true, bone, message: `装备${bone.name}成功！` };
}

// ===== 卸下魂骨 =====
function unequipSoulBone(player, slot) {
    if (!player.soulBones[slot]) {
        return { success: false, message: '该槽位没有魂骨。' };
    }
    const bone = player.soulBones[slot];
    // 移除魂骨属性加成
    if (bone.bonus) {
        for (let key in bone.bonus) {
            player[key] = Math.max(0, player[key] - bone.bonus[key]);
        }
    }
    player.soulBoneInventory.push(bone);
    player.soulBones[slot] = null;
    addLog(player, `🦴 卸下了${bone.name}。`);
    return { success: true, bone, message: `卸下${bone.name}成功！` };
}

// ===== 购买物品 =====
function buyItem(player, itemName) {
    const item = SHOP_ITEMS.find(i => i.name === itemName);
    if (!item) {
        return { success: false, message: '商品不存在。' };
    }
    if (player.money < item.price) {
        return { success: false, message: `金币不足，需要${item.price}金币。` };
    }
    player.money -= item.price;
    // 检查是否是装备
    if (item.type === '武器' || item.type === '防具' || item.type === '鞋子' || item.type === '饰品') {
        player.inventory.push({ name: item.name, desc: item.desc, type: item.type, atk: item.atk || 0, def: item.def || 0, spd: item.spd || 0, spirit: item.spirit || 0 });
    } else {
        // 消耗品/食物：检查是否已有相同物品，有则堆叠
        const existingItem = player.inventory.find(i => i.name === item.name && i.type === item.type);
        if (existingItem) {
            existingItem.count = (existingItem.count || 1) + 1;
        } else {
            player.inventory.push({ name: item.name, desc: item.desc, type: item.type, count: 1 });
        }
    }
    addLog(player, `🛒 购买了${item.name}，花费${item.price}金币。`);
    return { success: true, item, message: `购买${item.name}成功！` };
}

// ===== 出售物品 =====
function sellItem(player, itemIndex) {
    if (itemIndex < 0 || itemIndex >= player.inventory.length) {
        return { success: false, message: '物品不存在。' };
    }
    const item = player.inventory[itemIndex];
    const sellPrice = Math.floor((SHOP_ITEMS.find(i => i.name === item.name)?.price || 10) * 0.5);
    player.money += sellPrice;
    // 堆叠物品：数量大于1则减少数量，否则删除
    if (item.count && item.count > 1) {
        item.count -= 1;
    } else {
        player.inventory.splice(itemIndex, 1);
    }
    addLog(player, `💰 出售了${item.name}，获得${sellPrice}金币。`);
    return { success: true, sellPrice, message: `出售${item.name}成功，获得${sellPrice}金币。` };
}

// ===== 装备物品 =====
function equipItem(player, itemIndex) {
    if (itemIndex < 0 || itemIndex >= player.inventory.length) {
        return { success: false, message: '物品不存在。' };
    }
    const item = player.inventory[itemIndex];
    if (!['武器', '防具', '鞋子', '饰品'].includes(item.type)) {
        return { success: false, message: '该物品不能装备。' };
    }
    // 卸下当前装备
    if (player.equipment[item.type]) {
        player.inventory.push(player.equipment[item.type]);
    }
    // 装备新物品
    player.equipment[item.type] = item;
    player.inventory.splice(itemIndex, 1);
    addLog(player, `⚔️ 装备了${item.name}。`);
    return { success: true, item, message: `装备${item.name}成功！` };
}

// ===== 卸下装备 =====
function unequipItem(player, slot) {
    if (!player.equipment[slot]) {
        return { success: false, message: '该槽位没有装备。' };
    }
    const item = player.equipment[slot];
    player.inventory.push(item);
    player.equipment[slot] = null;
    addLog(player, `📤 卸下了${item.name}。`);
    return { success: true, item, message: `卸下${item.name}成功！` };
}

// ===== 使用物品 =====
function useItem(player, itemIndex) {
    if (itemIndex < 0 || itemIndex >= player.inventory.length) {
        return { success: false, message: '物品不存在。' };
    }
    const item = player.inventory[itemIndex];
    if (item.type !== '消耗品' && item.type !== '食物') {
        return { success: false, message: '该物品不能使用。' };
    }
    // 应用效果
    const shopItem = SHOP_ITEMS.find(i => i.name === item.name);
    if (shopItem && shopItem.effect) {
        for (let key in shopItem.effect) {
            if (player[key] !== undefined) {
                player[key] = Math.min(100, player[key] + shopItem.effect[key]);
            }
        }
    }
    // 减少数量
    if (item.count > 1) {
        item.count--;
    } else {
        player.inventory.splice(itemIndex, 1);
    }
    addLog(player, `🧪 使用了${item.name}。`);
    return { success: true, item, message: `使用${item.name}成功！` };
}

// ===== 获取已认识的NPC列表 =====
function getMetNpcs(player) {
    const result = [];
    for (let key in player.npcLikes) {
        if (player.npcLikes[key].met) {
            const npc = NPC_DATA[key];
            result.push({
                name: key,
                age: npc.age,
                loc: npc.loc,
                desc: npc.desc,
                icon: npc.icon,
                like: player.npcLikes[key].like,
                hearts: getLoveHearts(player.npcLikes[key].like),
                isPartner: player.partners.includes(key),
                isSpouse: player.spouse === key,
                canMarry: player.npcLikes[key].like >= 90 && player.spouse !== key
            });
        }
    }
    return result;
}

// ===== 获取情缘列表 =====
function getPartners(player) {
    return player.partners.map(name => {
        const npc = NPC_DATA[name];
        return {
            name,
            age: npc.age,
            loc: npc.loc,
            desc: npc.desc,
            icon: npc.icon,
            like: player.npcLikes[name].like,
            hearts: getLoveHearts(player.npcLikes[name].like),
            isSpouse: player.spouse === name,
            canMarry: player.npcLikes[name].like >= 90 && player.spouse !== name
        };
    });
}

// ===== 货币兑换 =====
function exchangeCurrency(player, from, to, amount) {
    // 汇率：1金=10银=100铜
    const rates = { gold: 1, silver: 10, copper: 100 };
    // 属性名映射（玩家对象中金币属性名是money）
    const propMap = { gold: 'money', silver: 'silver', copper: 'copper' };
    if (!rates[from] || !rates[to]) {
        return { success: false, message: '无效的货币类型' };
    }
    const fromProp = propMap[from];
    const toProp = propMap[to];
    if (player[fromProp] < amount) {
        return { success: false, message: `${from}不足` };
    }
    player[fromProp] -= amount;
    const converted = Math.floor(amount * rates[from] / rates[to]);
    player[toProp] += converted;
    addLog(player, `💱 兑换：${amount}${from} → ${converted}${to}`);
    return { success: true, from, to, amount, converted, message: `兑换成功！${amount}${from} → ${converted}${to}` };
}

// ===== 成神突破 =====
function attemptGod(player) {
    if (player.ended) {
        return { success: false, message: '你的故事已经结束。' };
    }
    if (player.魂力等级 < 99) {
        return { success: false, message: '需要99级才能尝试成神突破。' };
    }
    const requiredRings = player.isDualSoul ? 10 : 9;
    if ((player.魂环配置?.length || 0) < requiredRings) {
        return { success: false, message: `魂环未满（需要${requiredRings}个），无法成神。` };
    }
    player.godAttempts = (player.godAttempts || 0) + 1;
    // 0.1%成功率
    const success = Math.random() < 0.001;
    if (success) {
        player.魂力等级 = 100;
        player.ended = true;
        const ending = generateGodEnding(player);
        addLog(player, '🏆 成神突破成功！');
        advanceDay(player, 1);
        return { success: true, god: true, ending, message: '🏆 成神突破成功！' };
    } else {
        const dmg = Math.floor(Math.random() * 21) + 10;
        player.体质 = Math.max(0, Math.min(100, player.体质 - dmg));
        player.baseStats.体质 = player.体质;
        player.健康值 = Math.max(0, Math.min(100, (player.健康值 || 80) - Math.floor(Math.random() * 11) - 5));
        addLog(player, `💔 成神突破失败（第${player.godAttempts}次），体质 -${dmg}`);
        if ((player.健康值 || 80) <= 0) {
            player.ended = true;
            const deathStory = generateDeathStory(player);
            addLog(player, '💀 成神失败，陨落...');
            return { success: false, died: true, deathStory, message: '💀 成神失败，陨落...' };
        }
        advanceDay(player, 1);
        return { success: false, message: `💔 成神突破失败！体质 -${dmg}，第 ${player.godAttempts} 次尝试。` };
    }
}

// 生成成神结局
function generateGodEnding(player) {
    const gods = ['海神', '修罗神', '天使神', '罗刹神', '食神', '九彩神女'];
    const god = gods[Math.floor(Math.random() * gods.length)];
    return `经过无数次的尝试，你终于突破了神的界限，成为了${god}！\n\n你的名字将永远铭刻在斗罗大陆的历史中。\n\n修炼次数：${player.trained || 0}\n猎杀魂兽：${player.hunted || 0}\n成神尝试：${player.godAttempts}次`;
}

// 生成死亡故事
function generateDeathStory(player) {
    return `在第${player.godAttempts}次成神突破中，你失败了...\n\n强大的神力反噬让你的身体无法承受，最终陨落。\n\n你的故事到此结束，但你的传说将永远流传。`;
}

export default {
    // 数据
    WUHUN_CATEGORIES, ORIGINS, FAMILIES, MEMORIES, POTENTIALS, PERSONALITIES,
    INIT_ITEMS, MAP_DATA, NPC_DATA, SOUL_BEASTS, SHOP_ITEMS, TASK_TEMPLATES,
    TASK_SUCCESS_RATE,
    // 工具函数
    getSoulTitle, getLoveHearts, canAbsorbRing, generateRandomName,
    // 核心功能
    createPlayer, cultivate, explore, rest, advanceDay, advanceMonth, navigate,
    talkToNpc, marryNpc, huntBeast, absorbRing, doTask, refreshTasks,
    buyItem, sellItem, equipItem, unequipItem, useItem,
    getMetNpcs, getPartners, generateTasks, exchangeCurrency, attemptGod
};
