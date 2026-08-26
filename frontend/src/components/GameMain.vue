<template>
  <div class="game-container">
    <!-- 死亡界面 -->
    <div v-if="isDead" class="death-overlay">
      <div class="death-content">
        <div class="death-icon">💀</div>
        <h2 class="death-title">你已死亡</h2>
        <p class="death-desc">{{ player.name }}的魂力耗尽，生命走到了尽头...</p>
        <div class="death-stats">
          <p>享年：{{ Math.floor(player.ageYears) }}岁</p>
          <p>等级：{{ player.魂力等级 }}级（{{ soulTitle }}）</p>
          <p>魂环：{{ player.魂环配置?.length || 0 }}个</p>
        </div>
        <button class="death-btn" @click="handleReset(true)">🔄 重新开始</button>
      </div>
    </div>

    <!-- 顶部状态栏 -->
    <div class="top-bar">
      <div class="player-info">
        <span class="player-name">{{ player.name }}</span>
        <span class="player-tag">{{ player.gender }}</span>
        <span class="player-tag">{{ Math.floor(player.ageYears) }}岁</span>
        <span class="player-tag">{{ soulTitle }}</span>
      </div>
      <div class="top-stats">
        <span class="stat-tag">🪙 {{ player.money }}</span>
        <span class="stat-tag">⚡ {{ Math.floor(player.体质) }}/100</span>
        <span class="stat-tag">📅 第{{ player.turn }}月第{{ player.day }}天</span>
      </div>
    </div>

    <!-- 主布局 -->
    <div class="main-layout">
      <!-- 左栏 -->
      <div class="left-panel">
        <div class="panel-section">
          <div class="section-title">📊 属性</div>
          <!-- 状态条 -->
          <div class="status-bars">
            <div class="status-bar-item">
              <div class="status-bar-label">
                <span>❤️ 健康</span>
                <span>{{ Math.floor(player.健康值) }}/100</span>
              </div>
              <div class="status-bar-bg">
                <div class="status-bar-fill health-bar" :style="{ width: (player.健康值 || 0) + '%' }"></div>
              </div>
            </div>
            <div class="status-bar-item">
              <div class="status-bar-label">
                <span>💙 魂力</span>
                <span>{{ Math.floor(player.魂力储量) }}/100</span>
              </div>
              <div class="status-bar-bg">
                <div class="status-bar-fill soul-bar" :style="{ width: (player.魂力储量 || 0) + '%' }"></div>
              </div>
            </div>
          </div>
          <!-- 属性列表 -->
          <div class="attr-grid">
            <div class="attr-item" v-for="attr in attrs" :key="attr.label">
              <span class="attr-label">{{ attr.label }}</span>
              <span class="attr-val">{{ attr.val }}</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <div class="section-title">💍 魂环 ({{ player.魂环配置?.length || 0 }}/{{ maxRings }})</div>
          <div class="soul-ring-slots">
            <div class="soul-ring-slot" v-for="i in 9" :key="i"
              :class="{ filled: i <= (player.魂环配置?.length || 0) }"
              :title="i <= (player.魂环配置?.length || 0) ? player.魂环配置[i-1].year + '年 ' + getRingName(player.魂环配置[i-1].year) : '第' + i + '魂环'">
              <svg v-if="i <= (player.魂环配置?.length || 0)" class="ring-svg" viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="12" r="10" fill="none" :stroke="getRingColor(player.魂环配置[i-1].year)" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" fill="none" :stroke="getRingColor(player.魂环配置[i-1].year)" stroke-width="1" opacity="0.6"/>
              </svg>
              <span v-else class="ring-empty">○</span>
            </div>
          </div>
          <div class="ring-hint" v-if="!canAbsorbRing">需要每10级才能吸收一个魂环</div>
        </div>

        <div class="panel-section">
          <div class="section-title">⚔️ 装备</div>
          <div class="equip-grid">
            <div class="equip-slot" v-for="slot in equipSlots" :key="slot" @click="handleUnequip(slot)">
              <div class="equip-name">{{ player.equipment?.[slot]?.name || '空' }}</div>
              <div class="equip-type">{{ slot }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中栏 -->
      <div class="center-panel">
        <div class="nav-tabs">
          <button v-for="tab in tabs" :key="tab.id"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id">
            {{ tab.icon }} {{ tab.name }}
          </button>
        </div>

        <div class="content-area">
          <!-- 大陆总览 -->
          <div v-if="currentTab === 'dashboard'" class="tab-content">
            <h3>🌍 大陆总览</h3>
            <div class="info-card">
              <p><strong>武魂：</strong>{{ player.wuhunList?.join('、') || '未知' }}（{{ player.wuhunCategoryList?.join('、') }}）</p>
              <p v-if="player.isDualSoul"><strong>第二武魂：</strong>{{ player.wuhun2Name }}（{{ player.wuhun2Category }}）</p>
              <p><strong>武魂品质：</strong>{{ '⭐'.repeat(player.武魂品质 || 3) }}</p>
              <p><strong>出身：</strong>{{ player.origin }}</p>
              <p><strong>家世：</strong>{{ player.family }}</p>
              <p><strong>性格：</strong>{{ player.personality }}</p>
              <p><strong>记忆：</strong>{{ player.memory }}</p>
              <p><strong>当前位置：</strong>{{ player.location?.[player.location.length - 1] }}</p>
              <p v-if="player.spouse"><strong>💍 伴侣：</strong>{{ player.spouse }}</p>
            </div>
          </div>

          <!-- 魂师信息 -->
          <div v-if="currentTab === 'player'" class="tab-content">
            <h3>👤 魂师信息</h3>
            <div class="info-card">
              <p><strong>先天魂力：</strong>{{ player.先天魂力 }}</p>
              <p><strong>魂力等级：</strong>{{ player.魂力等级 }}级（{{ soulTitle }}）</p>
              <p><strong>魂力储量：</strong>{{ player.魂力储量 }}</p>
              <p><strong>力量：</strong>{{ player.力量 }} | <strong>速度：</strong>{{ player.速度 }}</p>
              <p><strong>防御：</strong>{{ player.防御 }}</p>
              <p><strong>精神力：</strong>{{ player.精神力 }} | <strong>健康值：</strong>{{ player.健康值 }}</p>
              <p><strong>心性：</strong>{{ player.心性 }} | <strong>快意：</strong>{{ player.快意 }}</p>
              <p><strong>隐蔽度：</strong>{{ player.隐蔽度 }} | <strong>剧情预知度：</strong>{{ player.剧情预知度 }}</p>
              <p><strong>猎杀魂兽：</strong>{{ player.hunted }}次 | <strong>修炼次数：</strong>{{ player.trained }}次</p>
              <p><strong>完成事务：</strong>{{ player.tasksCompleted }}个</p>
            </div>
          </div>

          <!-- 地图 -->
          <div v-if="currentTab === 'map'" class="tab-content map-tab">
            <div class="map-header">
              <span class="map-title-icon">📖</span>
              <span class="map-title">斗罗大陆</span>
            </div>

            <!-- 当前位置信息 -->
            <div class="current-location-card">
              <div class="location-breadcrumb">
                <span v-for="(loc, idx) in player.location" :key="idx" class="breadcrumb-item" @click="goBackTo(idx)">
                  {{ loc }}
                  <span v-if="idx < player.location.length - 1" class="breadcrumb-sep">›</span>
                </span>
              </div>
              <div class="location-desc">{{ currentLocationDesc }}</div>

              <!-- 子地点 -->
              <div v-if="currentLocationChildren.length > 0" class="sub-locations">
                <button v-for="sub in currentLocationChildren" :key="sub"
                  class="sub-location-btn"
                  :class="{ locked: isLocationLocked(sub) }"
                  :disabled="isLocationLocked(sub)"
                  @click="!isLocationLocked(sub) && handleNavigate(sub)">
                  <span class="sub-loc-icon">{{ isLocationLocked(sub) ? '🔒' : '🎯' }}</span>
                  <span>{{ sub }}</span>
                  <span v-if="isLocationLocked(sub)" class="sub-lock-msg">{{ getLockMessage(sub) }}</span>
                </button>
              </div>
            </div>

            <!-- 快速前往 -->
            <div class="quick-travel-section">
              <div class="section-header">
                <span class="section-icon">📍</span>
                <span class="section-title">快速前往</span>
              </div>
              <div class="quick-travel-grid">
                <div v-for="loc in quickTravelLocations" :key="loc.name"
                  class="travel-card"
                  :class="{ current: loc.name === player.location?.[player.location.length - 1], locked: loc.locked }"
                  @click="!loc.locked && handleNavigate(loc.name)">
                  <div class="travel-name">
                    <span class="travel-icon">📍</span>
                    {{ loc.name }}
                  </div>
                  <div v-if="loc.locked" class="travel-lock-msg">
                    {{ loc.lockMessage }}
                  </div>
                  <div v-else-if="loc.cost" class="travel-cost">
                    💰 {{ loc.cost }}金币
                  </div>
                </div>
              </div>
            </div>

            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 人物 -->
          <div v-if="currentTab === 'npc'" class="tab-content">
            <h3>👥 人物列表</h3>
            <p class="hint">在各地探索时有概率遇到NPC</p>
            <div v-if="metNpcs.length === 0" class="empty">还没有认识任何人，去各地探索吧！</div>
            <div class="npc-list">
              <div class="npc-card" v-for="npc in metNpcs" :key="npc.name">
                <div class="npc-header">
                  <span class="npc-icon">{{ npc.icon }}</span>
                  <span class="npc-name">{{ npc.name }}</span>
                  <span class="npc-hearts">{{ npc.hearts }}</span>
                </div>
                <div class="npc-info">
                  <p>{{ npc.desc }}</p>
                  <p class="npc-like">好感度：{{ npc.like }}/100</p>
                  <p v-if="npc.isPartner" class="partner-tag">💕 情缘</p>
                  <p v-if="npc.isSpouse" class="spouse-tag">💍 伴侣</p>
                </div>
                <div class="npc-actions">
                  <button class="btn-sm" @click="handleTalk(npc.name)">💬 对话</button>
                  <button v-if="npc.canMarry" class="btn-sm btn-primary" @click="handleMarry(npc.name)">💍 求婚</button>
                </div>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 情缘 -->
          <div v-if="currentTab === 'love'" class="tab-content">
            <h3>💕 情缘关系</h3>
            <p class="hint">好感度达到60进入情缘，达到90可结为伴侣</p>
            <div v-if="partners.length === 0" class="empty">还没有情缘关系，多与NPC对话提升好感度吧！</div>
            <div class="npc-list">
              <div class="npc-card" v-for="npc in partners" :key="npc.name">
                <div class="npc-header">
                  <span class="npc-icon">{{ npc.icon }}</span>
                  <span class="npc-name">{{ npc.name }}</span>
                  <span class="npc-hearts">{{ npc.hearts }}</span>
                </div>
                <div class="npc-info">
                  <p>{{ npc.desc }}</p>
                  <p class="npc-like">好感度：{{ npc.like }}/100</p>
                  <p v-if="npc.isSpouse" class="spouse-tag">💍 已结为伴侣</p>
                </div>
                <div class="npc-actions">
                  <button class="btn-sm" @click="handleTalk(npc.name)">💬 对话</button>
                  <button v-if="npc.canMarry" class="btn-sm btn-primary" @click="handleMarry(npc.name)">💍 求婚</button>
                </div>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 修炼 -->
          <div v-if="currentTab === 'cultivate'" class="tab-content">
            <h3>🧘 修炼</h3>
            <div class="action-area">
              <p>当前魂力等级：<strong>{{ player.魂力等级 }}级</strong>（{{ soulTitle }}）</p>
              <p>魂环数量：<strong>{{ player.魂环配置?.length || 0 }}/{{ maxRings }}</strong></p>
              <p>每天可修炼一次，固定增加0.2级，有50%概率暴击</p>
              
              <div v-if="needMoreRings" class="ring-warning">
                <p>⚠️ <strong>魂力停滞！</strong></p>
                <p>当前等级需要 {{ maxRings }} 个魂环才能继续突破，你只有 {{ player.魂环配置?.length || 0 }} 个魂环。</p>
                <p>前往星斗大森林或落日森林猎魂，吸收魂环后才能正常修炼！</p>
                <p>未吸收足够魂环时，修炼获取经验效率仅为正常的 0.0001%。</p>
              </div>
              
              <button class="action-btn" @click="handleCultivate" :disabled="!player.canTrain">
                {{ player.canTrain ? '🧘 修炼魂力' : '⏳ 今天已修炼' }}
              </button>
              <div v-if="player.魂力等级 >= 99 && !player.ended" class="god-section">
                <div class="god-divider"></div>
                <p class="god-hint">⚡ 达到99级，可以尝试成神突破！</p>
                <p class="god-detail">需要魂环已满（单武魂9个/双生10个），成功率0.1%</p>
                <button class="action-btn god-btn" @click="handleGod">⚡ 尝试成神突破</button>
                <p v-if="player.godAttempts" class="god-attempts">已尝试 {{ player.godAttempts }} 次</p>
              </div>
              <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
            </div>
          </div>

          <!-- 探索 -->
          <div v-if="currentTab === 'explore'" class="tab-content">
            <h3>🔍 探索</h3>
            <div class="action-area">
              <p>当前位置：<strong>{{ player.location?.[player.location.length - 1] }}</strong></p>
              <p v-if="isInSoulBeastForest" class="hint">⚠️ 这里是魂兽森林，探索时有概率碰到魂兽！</p>
              <p>在周围探索，可能遇到各种事件、宝物、NPC或魂兽</p>
              <button class="action-btn" @click="handleExplore">🔍 开始探索</button>

              <!-- 战斗结果 -->
              <div v-if="lastExploreHuntResult" class="hunt-result">
                <p><strong>{{ lastExploreHuntResult.won ? '猎杀成功！' : '猎杀失败！' }}</strong></p>
                <p>魂兽：{{ lastExploreHuntResult.beast.name }}（{{ lastExploreHuntResult.beast.year }}年）</p>
                <p v-if="lastExploreHuntResult.won">获得金币：{{ lastExploreHuntResult.gold }}</p>
                <p v-else>损失健康值：{{ lastExploreHuntResult.damage }}</p>
                <button v-if="lastExploreHuntResult.won && lastExploreHuntResult.canAbsorbRing" class="btn-sm btn-primary" @click="handleAbsorbRing(lastExploreHuntResult.beast.year, lastExploreHuntResult.beast.name)">💍 吸收魂环</button>
                <p v-if="lastExploreHuntResult.won && !lastExploreHuntResult.canAbsorbRing" class="warning">当前无法吸收魂环（需要每10级才能吸收一个）</p>
              </div>

              <div v-if="actionResult && !lastExploreHuntResult" class="result-msg">{{ actionResult }}</div>
            </div>
          </div>

          <!-- 事务 -->
          <div v-if="currentTab === 'tasks'" class="tab-content">
            <h3>📋 事务悬赏</h3>
            <div class="task-header">
              <span>已完成：{{ player.tasksCompleted }}个</span>
              <button class="btn-sm" @click="handleRefreshTasks">🔄 刷新(5金币)</button>
            </div>
            <div class="task-list">
              <div class="task-card" v-for="task in player.availableTasks" :key="task.id">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.desc }}</div>
                <div class="task-info">
                  <span class="difficulty" :class="'diff-' + task.difficulty">{{ task.difficulty }}</span>
                  <span class="reward">奖励：{{ task.reward.gold }}金币</span>
                </div>
                <button class="btn-sm btn-primary" @click="handleDoTask(task.id)">接取并完成</button>
              </div>
            </div>
            <div v-if="player.availableTasks?.length === 0" class="empty">暂无事务，点击刷新获取新事务</div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 集市 -->
          <div v-if="currentTab === 'shop'" class="tab-content">
            <h3>🛒 集市</h3>
            <p class="gold-display">当前金币：💰 {{ player.money }}</p>
            <div class="shop-list">
              <div class="shop-item" v-for="item in shopItems" :key="item.name">
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-desc">{{ item.desc }}</div>
                  <div class="item-type">{{ item.type }}</div>
                </div>
                <div class="item-price">💰 {{ item.price }}</div>
                <button class="btn-sm btn-primary" @click="handleBuy(item.name)" :disabled="player.money < item.price">购买</button>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 背包 -->
          <div v-if="currentTab === 'backpack'" class="tab-content">
            <h3>🎒 背包</h3>
            <div v-if="player.inventory?.length === 0" class="empty">背包空空如也</div>
            <div class="inventory-list">
              <div class="inventory-item" v-for="(item, index) in player.inventory" :key="index">
                <div class="item-info">
                  <div class="item-name">{{ item.name }} <span v-if="item.count > 1">x{{ item.count }}</span></div>
                  <div class="item-desc">{{ item.desc || item.type }}</div>
                </div>
                <div class="item-actions">
                  <button v-if="item.type === '消耗品' || item.type === '食物'" class="btn-sm" @click="handleUse(index)">使用</button>
                  <button v-if="['武器','防具','鞋子','饰品'].includes(item.type)" class="btn-sm btn-primary" @click="handleEquip(index)">装备</button>
                  <button class="btn-sm btn-danger" @click="handleSell(index)">出售</button>
                </div>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 魂骨 -->
          <div v-if="currentTab === 'soulbone'" class="tab-content">
            <h3>🦴 魂骨</h3>
            <!-- 魂骨装备槽位 -->
            <div class="soulbone-equip-section">
              <h4>已装备魂骨</h4>
              <div class="soulbone-equip-grid">
                <div class="soulbone-equip-slot" v-for="slot in soulBoneSlots" :key="slot" @click="handleUnequipSoulBone(slot)">
                  <div class="soulbone-slot-type">{{ slot }}</div>
                  <div class="soulbone-slot-name">{{ player.soulBones?.[slot]?.name || '空' }}</div>
                  <div v-if="player.soulBones?.[slot]?.year" class="soulbone-slot-year">{{ player.soulBones[slot].year }}年</div>
                  <div v-if="player.soulBones?.[slot]" class="soulbone-slot-unequip">点击卸下</div>
                </div>
              </div>
            </div>
            <!-- 魂骨背包 -->
            <div class="soulbone-backpack-section">
              <h4>魂骨背包</h4>
              <div v-if="!player.soulBoneInventory || player.soulBoneInventory.length === 0" class="empty">暂无魂骨，去猎魂获取吧！</div>
              <div v-else class="soulbone-inventory-list">
                <div class="soulbone-inventory-item" v-for="(bone, index) in player.soulBoneInventory" :key="index">
                  <div class="soulbone-item-info">
                    <div class="soulbone-item-name">{{ bone.name }}</div>
                    <div class="soulbone-item-desc">部位：{{ bone.slot }} | 年份：{{ bone.year }}年</div>
                    <div class="soulbone-item-bonus" v-if="bone.bonus">
                      <span v-for="(val, key) in bone.bonus" :key="key" class="bonus-tag">{{ key }}+{{ val }}</span>
                    </div>
                  </div>
                  <div class="soulbone-item-actions">
                    <button class="btn-sm btn-primary" @click="handleEquipSoulBone(index)">装备</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 家 -->
          <div v-if="currentTab === 'home'" class="tab-content">
            <h3>🏡 家</h3>
            <div v-if="!player.hasHome" class="empty">
              你是一个孤儿，没有家。但你走到哪里，哪里就是家。
            </div>
            <div v-else>
              <div class="home-card">
                <div class="home-title">🏡 家 · {{ player.family }}</div>
                <div class="home-story">{{ homeStory }}</div>
                <div v-if="player.familyStory" class="home-family-story">{{ player.familyStory }}</div>
                <div class="home-relation">🏠 家庭关系：{{ player.familyRelation || '无' }}</div>
              </div>

              <div class="home-actions">
                <div class="home-actions-title">🛏️ 家中日常</div>
                <div class="home-buttons">
                  <button class="action-btn" @click="handleRest">😴 在家休息</button>
                  <button class="action-btn" @click="handleCultivate">🧘 在家修炼</button>
                  <button class="action-btn" @click="showHomeStory">📖 家的故事</button>
                </div>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 兑换 -->
          <div v-if="currentTab === 'exchange'" class="tab-content">
            <h3>💱 魂币兑换</h3>
            <div class="exchange-card">
              <div class="exchange-rate">1 金魂币 = 10 银魂币 = 100 铜魂币</div>
              <div class="currency-display">
                <span class="currency gold">🪙 金：{{ player.money || 0 }}</span>
                <span class="currency silver">🥈 银：{{ player.silver || 0 }}</span>
                <span class="currency copper">🥉 铜：{{ player.copper || 0 }}</span>
              </div>
              <div class="exchange-buttons">
                <button class="exchange-btn" @click="handleExchange('gold','silver',1)">⬇️ 1 金 → 10 银</button>
                <button class="exchange-btn" @click="handleExchange('gold','copper',1)">⬇️ 1 金 → 100 铜</button>
                <button class="exchange-btn" @click="handleExchange('silver','gold',10)">⬆️ 10 银 → 1 金</button>
                <button class="exchange-btn" @click="handleExchange('silver','copper',1)">⬇️ 1 银 → 10 铜</button>
                <button class="exchange-btn" @click="handleExchange('copper','silver',10)">⬆️ 10 铜 → 1 银</button>
                <button class="exchange-btn" @click="handleExchange('copper','gold',100)">⬆️ 100 铜 → 1 金</button>
              </div>
            </div>
            <div v-if="actionResult" class="result-msg">{{ actionResult }}</div>
          </div>

          <!-- 设置 -->
          <div v-if="currentTab === 'settings'" class="tab-content">
            <h3>⚙️ 设置</h3>
            
            <!-- 游戏信息 -->
            <div class="settings-section">
              <h4>📊 游戏信息</h4>
              <div class="settings-info">
                <div class="info-row"><span>角色名：</span><span>{{ player.name }}</span></div>
                <div class="info-row"><span>性别：</span><span>{{ player.gender }}</span></div>
                <div class="info-row"><span>年龄：</span><span>{{ Math.floor(player.ageYears) }}岁</span></div>
                <div class="info-row"><span>武魂：</span><span>{{ player.wuhunList?.join('、') || '未知' }}</span></div>
                <div class="info-row"><span>魂力等级：</span><span>{{ player.魂力等级?.toFixed(1) }}级</span></div>
                <div class="info-row"><span>魂师称号：</span><span>{{ soulTitle }}</span></div>
                <div class="info-row"><span>魂环数量：</span><span>{{ player.魂环配置?.length || 0 }}个</span></div>
                <div class="info-row"><span>游戏时间：</span><span>第{{ player.turn }}月第{{ player.day }}天</span></div>
              </div>
            </div>

            <!-- 操作说明 -->
            <div class="settings-section">
              <h4>📖 操作说明</h4>
              <div class="settings-help">
                <p><strong>🧘 修炼：</strong>每天可修炼一次，固定增加0.2魂力，有50%概率暴击</p>
                <p><strong>🔍 探索：</strong>在当前地区探索，可能遇到NPC、魂兽或获得物品</p>
                <p><strong>💍 魂环：</strong>每10级可吸收一个魂环，在星斗大森林/落日森林猎魂获取</p>
                <p><strong>🦴 魂骨：</strong>猎魂时有概率获得魂骨，可装备提升属性</p>
                <p><strong>💕 好感度：</strong>与NPC对话提升好感度，每20点一个爱心，60进入情缘，90可结为伴侣</p>
                <p><strong>📋 事务：</strong>完成事务获得金币，难度越高奖励越多但成功率越低</p>
                <p><strong>🌙 结束今日：</strong>休息回复体质和健康，推进到下一天</p>
                <p><strong>📆 推进一月：</strong>直接跳到下个月第一天</p>
              </div>
            </div>

            <!-- 数据管理 -->
            <div class="settings-section">
              <h4>💾 数据管理</h4>
              <div class="settings-actions">
                <button class="settings-btn" @click="handleSave">💾 保存游戏</button>
                <button class="settings-btn" @click="handleLoad">📂 读取存档</button>
                <button class="settings-btn danger" @click="handleResetConfirm">🔄 重置游戏</button>
              </div>
              <p v-if="resetConfirm" class="reset-warning">
                ⚠️ 确定要重置游戏吗？所有进度将丢失！
                <button class="btn-sm btn-danger" @click="handleReset">确定重置</button>
                <button class="btn-sm" @click="resetConfirm = false">取消</button>
              </p>
            </div>

            <!-- 游戏说明 -->
            <div class="settings-section">
              <h4>📖 游戏说明</h4>
              
              <div class="guide-subtitle">魂师等级</div>
              <div class="level-table">
                <div class="level-row header">
                  <span>等级</span>
                  <span>称号</span>
                  <span>魂力区间</span>
                  <span>魂环数量</span>
                </div>
                <div class="level-row"><span>一环</span><span>魂士</span><span>1-9级</span><span>0</span></div>
                <div class="level-row"><span>二环</span><span>魂师</span><span>10-19级</span><span>1</span></div>
                <div class="level-row"><span>三环</span><span>大魂师</span><span>20-29级</span><span>2</span></div>
                <div class="level-row"><span>四环</span><span>魂尊</span><span>30-39级</span><span>3</span></div>
                <div class="level-row"><span>五环</span><span>魂宗</span><span>40-49级</span><span>4</span></div>
                <div class="level-row"><span>六环</span><span>魂王</span><span>50-59级</span><span>5</span></div>
                <div class="level-row"><span>七环</span><span>魂帝</span><span>60-69级</span><span>6</span></div>
                <div class="level-row"><span>八环</span><span>魂圣</span><span>70-79级</span><span>7</span></div>
                <div class="level-row"><span>九环</span><span>魂斗罗</span><span>80-89级</span><span>8</span></div>
                <div class="level-row"><span>十环</span><span>封号斗罗</span><span>90-99级</span><span>9</span></div>
              </div>
              <div class="guide-note">
                <p>99级为极限斗罗，已触及成神的临界点。</p>
                <p>封号斗罗又分为：普通封号斗罗(91-95级)、超级斗罗(96-98级)、极限斗罗(99级)。</p>
              </div>

              <div class="guide-subtitle">魂环颜色</div>
              <div class="ring-color-table">
                <div class="ring-color-row">
                  <span class="ring-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#ffffff" stroke-width="2"/>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
                    </svg>
                  </span>
                  <span class="ring-name">十年魂环</span>
                  <span class="ring-range">10-99年</span>
                  <span class="ring-skill">1个魂技</span>
                </div>
                <div class="ring-color-row">
                  <span class="ring-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#fff277" stroke-width="2"/>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="#fff277" stroke-width="1" opacity="0.6"/>
                    </svg>
                  </span>
                  <span class="ring-name">百年魂环</span>
                  <span class="ring-range">100-999年</span>
                  <span class="ring-skill">1个魂技</span>
                </div>
                <div class="ring-color-row">
                  <span class="ring-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#8700ee" stroke-width="2"/>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="#8700ee" stroke-width="1" opacity="0.6"/>
                    </svg>
                  </span>
                  <span class="ring-name">千年魂环</span>
                  <span class="ring-range">1000-9999年</span>
                  <span class="ring-skill">1个魂技</span>
                </div>
                <div class="ring-color-row">
                  <span class="ring-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#000000" stroke-width="2"/>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="#000000" stroke-width="1" opacity="0.6"/>
                    </svg>
                  </span>
                  <span class="ring-name">万年魂环</span>
                  <span class="ring-range">10000-99999年</span>
                  <span class="ring-skill">1个魂技</span>
                </div>
                <div class="ring-color-row">
                  <span class="ring-icon-wrap">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#ff0a27" stroke-width="2"/>
                      <circle cx="12" cy="12" r="6" fill="none" stroke="#ff0a27" stroke-width="1" opacity="0.6"/>
                    </svg>
                  </span>
                  <span class="ring-name">十万年魂环</span>
                  <span class="ring-range">100000年以上</span>
                  <span class="ring-skill">2个魂技</span>
                </div>
              </div>
              <div class="guide-note">
                <p>最佳魂环配置通常为：黄、黄、紫、紫、黑、黑、黑、黑、黑。</p>
                <p>但天赋异禀者可越级吸收更高年限的魂环，十万年魂环极为稀有。</p>
                <p>魂环的吸收有年限限制，魂师的承受能力决定了能够吸收的魂环上限，强行吸收超出承受范围的魂环可能导致爆体而亡。</p>
              </div>
            </div>

            <!-- 关于 -->
            <div class="settings-section">
              <h4>ℹ️ 关于</h4>
              <div class="settings-about">
                <p><strong>斗罗大陆1模拟器</strong></p>
                <p>版本：Vue前后端分离版</p>
                <p>基于斗罗大陆世界观的文字模拟游戏</p>
                <p>穿越到斗罗大陆，开启你的魂师之路！</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 日志面板 -->
        <div class="log-panel">
          <div class="log-title">📜 日志</div>
          <div class="log-list">
            <div class="log-item" v-for="(log, idx) in recentLogs" :key="idx">
              <span class="log-time">{{ log.time }}</span>
              {{ log.msg }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右栏 -->
      <div class="right-panel">
        <div class="panel-section">
          <div class="section-title">🏠 当前位置</div>
          <div class="current-location">
            <div class="loc-name">{{ player.location?.[player.location.length - 1] }}</div>
            <div class="loc-desc">{{ locationDesc }}</div>
          </div>
        </div>

        <div class="panel-section">
          <div class="section-title">📍 快速前往</div>
          <div class="location-list">
            <button v-for="loc in quickLocations" :key="loc"
              class="location-item-btn"
              :class="{ current: loc === player.location?.[player.location.length - 1], locked: isLocationLocked(loc) }"
              :disabled="isLocationLocked(loc)"
              :title="isLocationLocked(loc) ? getLockMessage(loc) : ''"
              @click="!isLocationLocked(loc) && handleNavigate(loc)">
              <span v-if="isLocationLocked(loc)" class="lock-icon">🔒</span>
              <span v-else>📍</span>
              <span class="loc-name">{{ loc }}</span>
              <span v-if="isLocationLocked(loc)" class="lock-desc">{{ getLockMessage(loc) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="footer-actions">
      <button class="footer-btn" @click="handleEndDay">🌙 结束今日</button>
      <button class="footer-btn" @click="handleAdvanceMonth">📆 推进一月</button>
      <button class="footer-btn" @click="handleSave">💾 存档</button>
      <button class="footer-btn" @click="handleLoad">📂 读档</button>
      <button class="footer-btn danger" @click="handleReset">🔄 重置</button>
    </div>

    <!-- 魂环吸收弹窗 -->
    <div v-if="showRingAbsorbModal" class="modal-overlay" @click.self="closeRingAbsorbModal">
      <div class="modal-content ring-absorb-modal">
        <div class="modal-header">
          <h3>💍 魂环吸收</h3>
          <button class="modal-close" @click="closeRingAbsorbModal">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="currentHuntedBeast" class="ring-absorb-info">
            <div class="beast-ring-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <circle cx="12" cy="12" r="10" fill="none" :stroke="getRingColor(currentHuntedBeast.year)" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" fill="none" :stroke="getRingColor(currentHuntedBeast.year)" stroke-width="1" opacity="0.6"/>
              </svg>
            </div>
            <div class="beast-name">{{ currentHuntedBeast.name }}</div>
            <div class="beast-year">{{ currentHuntedBeast.year }}年 {{ getRingName(currentHuntedBeast.year) }}</div>
            <div class="ring-absorb-tip">
              <p v-if="canAbsorbRing">是否吸收此魂环？</p>
              <p v-else class="warning">⚠️ 你当前无法吸收更多魂环（每10级可吸收一个）</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="closeRingAbsorbModal">放弃</button>
          <button class="modal-btn confirm" :disabled="!canAbsorbRing" @click="handleAbsorbRingFromModal">吸收魂环</button>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  cultivate, explore, rest, advanceDay, advanceMonth, navigate,
  talkToNpc, marryNpc, huntBeast, absorbRing, doTask, refreshTasks,
  buyItem, sellItem, equipItem, unequipItem, useItem, exchangeCurrency, attemptGod,
  equipSoulBone, unequipSoulBone,
  getMetNpcs as getNpcs, getPartners, getShopItems, saveGame, loadGame, resetGame
} from '../api-local'

const props = defineProps({
  sessionId: String,
  player: Object,
  logs: Array
})

const emit = defineEmits(['update'])

const currentTab = ref('dashboard')
const actionResult = ref('')
const toast = ref('')
const metNpcs = ref([])
const partners = ref([])
const shopItems = ref([])
const lastHuntResult = ref(null)
const lastExploreHuntResult = ref(null)
const isDead = ref(false)
const resetConfirm = ref(false)
const showRingAbsorbModal = ref(false)
const currentHuntedBeast = ref(null)

const tabs = [
  { id: 'dashboard', name: '大陆', icon: '🌍' },
  { id: 'player', name: '魂师', icon: '👤' },
  { id: 'map', name: '地图', icon: '🗺️' },
  { id: 'npc', name: '人物', icon: '👥' },
  { id: 'love', name: '情缘', icon: '💕' },
  { id: 'cultivate', name: '修炼', icon: '🧘' },
  { id: 'explore', name: '探索', icon: '🔍' },
  { id: 'tasks', name: '事务', icon: '📋' },
  { id: 'shop', name: '集市', icon: '🛒' },
  { id: 'backpack', name: '背包', icon: '🎒' },
  { id: 'soulbone', name: '魂骨', icon: '🦴' },
  { id: 'home', name: '家', icon: '🏡' },
  { id: 'exchange', name: '兑换', icon: '💱' },
  { id: 'settings', name: '设置', icon: '⚙️' }
]

const locations = ['圣魂村', '诺丁城', '天斗城', '武魂城', '星斗大森林', '外围区', '混合区', '核心区', '落日森林', '落日外围', '落日深处', '瀑布', '山洞', '矿洞', '古战场']
const quickLocations = ['圣魂村', '诺丁城', '天斗城', '武魂城', '星斗大森林', '落日森林', '瀑布', '山洞', '矿洞']

const equipSlots = ['武器', '防具', '饰品', '鞋子']
const soulBoneSlots = ['头部', '躯干', '左手', '右手', '左腿', '右腿']

const attrs = computed(() => [
  { label: '力量', val: props.player.力量 },
  { label: '速度', val: props.player.速度 },
  { label: '防御', val: props.player.防御 },
  { label: '精神', val: props.player.精神力 }
])

const soulTitle = computed(() => {
  const level = props.player.魂力等级 || 0
  if (level < 10) return '魂士'
  if (level < 20) return '魂师'
  if (level < 30) return '大魂师'
  if (level < 40) return '魂尊'
  if (level < 50) return '魂宗'
  if (level < 60) return '魂王'
  if (level < 70) return '魂帝'
  if (level < 80) return '魂圣'
  if (level < 90) return '魂斗罗'
  if (level < 95) return '封号斗罗'
  if (level < 99) return '超级斗罗'
  if (level < 100) return '极限斗罗'
  return '神级'
})

const maxRings = computed(() => Math.floor((props.player.魂力等级 || 0) / 10))
const canAbsorbRing = computed(() => (props.player.魂环配置?.length || 0) < maxRings.value)
const needMoreRings = computed(() => {
  const required = Math.floor((props.player.魂力等级 || 0) / 10)
  const current = props.player.魂环配置?.length || 0
  return current < required
})

// 获取魂环颜色
function getRingColor(year) {
  if (year < 100) return '#ffffff' // 十年 - 白色
  if (year < 1000) return '#fff277' // 百年 - 黄色
  if (year < 10000) return '#8700ee' // 千年 - 紫色
  if (year < 100000) return '#000000' // 万年 - 黑色
  return '#ff0a27' // 十万年 - 红色
}

// 获取魂环名称
function getRingName(year) {
  if (year < 100) return '十年魂环'
  if (year < 1000) return '百年魂环'
  if (year < 10000) return '千年魂环'
  if (year < 100000) return '万年魂环'
  return '十万年魂环'
}
const canHuntHere = computed(() => {
  const loc = props.player.location?.[props.player.location.length - 1]
  return ['外围区', '混合区', '核心区', '落日外围', '落日深处', '星斗大森林', '落日森林'].includes(loc)
})
const isInSoulBeastForest = computed(() => {
  const loc = props.player.location?.[props.player.location.length - 1]
  const allLocs = props.player.location || []
  return ['星斗大森林', '落日森林', '外围区', '混合区', '核心区', '落日外围', '落日深处', '冰火两仪眼'].includes(loc) ||
    allLocs.some(l => ['星斗大森林', '落日森林'].includes(l))
})

const recentLogs = computed(() => {
  return (props.logs || []).slice(-5).reverse()
})

const locationDesc = computed(() => {
  const loc = props.player.location?.[props.player.location.length - 1]
  const descs = {
    '圣魂村': '唐三与唐昊隐居的村子',
    '诺丁城': '诺丁初级魂师学院所在',
    '天斗城': '天斗帝国首都，大陆最繁华的城市',
    '武魂城': '武魂殿总部，教皇殿矗立中央',
    '星斗大森林': '大陆最凶险的魂兽森林',
    '外围区': '星斗大森林外围，十年至百年魂兽',
    '混合区': '星斗大森林混合区，百年至万年魂兽',
    '核心区': '星斗大森林核心区，千年至十万年魂兽',
    '落日森林': '天斗城附近的魂兽森林',
    '落日外围': '落日森林外围，十年至百年魂兽',
    '落日深处': '落日森林深处，百年至万年魂兽',
    '瀑布': '山间一道壮丽的瀑布，水声如雷',
    '山洞': '一个深邃的山洞，可能有魂兽或宝物',
    '矿洞': '一座废弃的矿洞，石壁上有暗红色晶石',
    '古战场': '一片荒芜的古战场，散落着残破的兵器'
  }
  return descs[loc] || '一片神秘的土地'
})

// 地图数据（硬编码，与后端保持一致）
const mapData = {
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
}

// 当前位置描述
const currentLocationDesc = computed(() => {
  const loc = props.player.location?.[props.player.location.length - 1]
  return mapData[loc]?.desc || '一片神秘的土地'
})

// 当前位置的子地点
const currentLocationChildren = computed(() => {
  const loc = props.player.location?.[props.player.location.length - 1]
  return mapData[loc]?.children || []
})

// 快速前往的主要地区
const quickTravelLocations = computed(() => {
  const mainLocs = ['圣魂村', '诺丁城', '天斗城', '武魂城', '星斗大森林', '落日森林', '星罗帝国', '杀戮之都', '天脊山脉', '海神岛', '瀑布', '山洞', '矿洞', '古战场', '昊天宗', '七宝琉璃宗']
  return mainLocs.map(name => {
    const data = mapData[name] || {}
    let locked = false
    let lockMessage = ''
    if (data.unlock === 'level') {
      locked = (props.player.魂力等级 || 0) < data.unlockVal
      if (locked) lockMessage = `需要魂力${data.unlockVal}级（当前${Math.floor(props.player.魂力等级)}级）`
    } else if (data.unlock === 'age') {
      locked = (props.player.ageYears || 0) < data.unlockVal
      if (locked) lockMessage = `需要${data.unlockVal}岁（当前${Math.floor(props.player.ageYears)}岁）`
    }
    return {
      name,
      locked,
      lockMessage,
      cost: data.cost || 0
    }
  })
})

// 家的故事
const homeStory = computed(() => {
  const stories = {
    '单亲父亲': '你的父亲是一个沉默而坚韧的人。他每天早出晚归，用双手撑起了这个家。',
    '单亲母亲': '你的母亲是一个温柔而坚强的人。她每天忙里忙外，用她的爱撑起了这个家。',
    '相爱的父母': '你的父母感情深厚，他们常常一起做饭、一起散步。你在这个充满爱的家庭里长大。',
    '不相爱的父母': '你的父母感情冷淡，他们常常因为小事争吵。你学会了在吵闹声中安静地做自己的事。'
  }
  return stories[props.player.familyRelation] || '你的家虽然简单，却很温暖。'
})

function showToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}

function updateState(data) {
  emit('update', data)
  actionResult.value = data.result?.message || ''
  if (data.result?.message) showToast(data.result.message)
  // 刷新NPC和商店数据
  loadNpcs()
  loadPartners()
}

async function loadNpcs() {
  try {
    const res = await getNpcs(props.sessionId)
    metNpcs.value = res.data.npcs || []
  } catch (e) { console.error(e) }
}

async function loadPartners() {
  try {
    const res = await getPartners(props.sessionId)
    partners.value = res.data.partners || []
  } catch (e) { console.error(e) }
}

async function loadShop() {
  try {
    const res = await getShopItems()
    shopItems.value = res.data.items || []
  } catch (e) { console.error(e) }
}

async function handleCultivate() {
  try {
    const res = await cultivate(props.sessionId)
    updateState(res.data)
    const result = res.data.result || {}
    if (result.ringPenalty) {
      showToast(`⚠️ 魂力停滞！需要${result.requiredRings}个魂环（已有${result.currentRings}个）`)
    }
  } catch (e) { showToast('修炼失败') }
}

async function handleExplore() {
  try {
    const res = await explore(props.sessionId)
    updateState(res.data)
    const result = res.data.result || {}
    if (result.isHunt && result.huntResult) {
      lastExploreHuntResult.value = result.huntResult
      actionResult.value = ''
      // 成功猎杀魂兽，显示魂环吸收弹窗
      if (result.huntResult.success && result.huntResult.beast) {
        currentHuntedBeast.value = result.huntResult.beast
        showRingAbsorbModal.value = true
      }
    } else {
      lastExploreHuntResult.value = null
      actionResult.value = result.message || ''
    }
  } catch (e) { showToast('探索失败') }
}

async function handleRest() {
  try {
    const res = await rest(props.sessionId)
    updateState(res.data)
  } catch (e) { showToast('休息失败') }
}

async function handleEndDay() {
  try {
    // 先休息
    const restRes = await rest(props.sessionId)
    updateState(restRes.data)
    // 再推进一天
    const dayRes = await advanceDay(props.sessionId, 1)
    updateState(dayRes.data)
    showToast('今日已结束，新的一天开始了！')
  } catch (e) { showToast('结束今日失败') }
}

async function handleAdvanceDay() {
  try {
    const res = await advanceDay(props.sessionId, 1)
    updateState(res.data)
  } catch (e) { showToast('推进失败') }
}

async function handleAdvanceMonth() {
  try {
    const res = await advanceMonth(props.sessionId)
    updateState(res.data)
  } catch (e) { showToast('推进失败') }
}

async function handleNavigate(loc) {
  if (isLocationLocked(loc)) {
    showToast(getLockMessage(loc))
    return
  }
  try {
    const res = await navigate(props.sessionId, loc)
    updateState(res.data)
  } catch (e) { showToast('导航失败') }
}

function goBackTo(index) {
  if (index >= (props.player.location?.length || 0) - 1) return
  const targetLoc = props.player.location[index]
  handleNavigate(targetLoc)
}

function isLocationLocked(locName) {
  const data = mapData[locName]
  if (!data || !data.unlock) return false
  if (data.unlock === 'level') {
    return (props.player.魂力等级 || 0) < data.unlockVal
  } else if (data.unlock === 'age') {
    return (props.player.ageYears || 0) < data.unlockVal
  }
  return false
}

function getLockMessage(locName) {
  const data = mapData[locName]
  if (!data || !data.unlock) return ''
  if (data.unlock === 'level') {
    return `需要魂力${data.unlockVal}级（当前${Math.floor(props.player.魂力等级)}级）`
  } else if (data.unlock === 'age') {
    return `需要${data.unlockVal}岁（当前${Math.floor(props.player.ageYears)}岁）`
  }
  return ''
}

async function handleTalk(npcName) {
  try {
    const res = await talkToNpc(props.sessionId, npcName)
    updateState(res.data)
    if (res.data.result?.dialogue) showToast(res.data.result.dialogue)
  } catch (e) { showToast('对话失败') }
}

async function handleMarry(npcName) {
  if (!confirm(`确定要与${npcName}结为伴侣吗？`)) return
  try {
    const res = await marryNpc(props.sessionId, npcName)
    updateState(res.data)
  } catch (e) { showToast('求婚失败') }
}

async function handleHunt() {
  try {
    const res = await huntBeast(props.sessionId)
    updateState(res.data)
    lastHuntResult.value = res.data.result
    // 成功猎杀魂兽，显示魂环吸收弹窗
    if (res.data.result && res.data.result.success && res.data.result.beast) {
      currentHuntedBeast.value = res.data.result.beast
      showRingAbsorbModal.value = true
    }
  } catch (e) { showToast('猎魂失败') }
}

async function handleAbsorbRing(beastYear, beastName) {
  try {
    const res = await absorbRing(props.sessionId, beastYear, beastName)
    updateState(res.data)
    lastHuntResult.value = null
    showRingAbsorbModal.value = false
    currentHuntedBeast.value = null
    showToast('魂环吸收成功！')
  } catch (e) { showToast('吸收魂环失败') }
}

function handleAbsorbRingFromModal() {
  if (currentHuntedBeast.value) {
    handleAbsorbRing(currentHuntedBeast.value.year, currentHuntedBeast.value.name)
  }
}

function closeRingAbsorbModal() {
  showRingAbsorbModal.value = false
  currentHuntedBeast.value = null
}

async function handleDoTask(taskId) {
  try {
    const res = await doTask(props.sessionId, taskId)
    updateState(res.data)
  } catch (e) { showToast('完成事务失败') }
}

async function handleRefreshTasks() {
  try {
    const res = await refreshTasks(props.sessionId)
    updateState(res.data)
  } catch (e) { showToast('刷新失败') }
}

async function handleBuy(itemName) {
  try {
    const res = await buyItem(props.sessionId, itemName)
    updateState(res.data)
  } catch (e) { showToast('购买失败') }
}

async function handleSell(itemIndex) {
  try {
    const res = await sellItem(props.sessionId, itemIndex)
    updateState(res.data)
  } catch (e) { showToast('出售失败') }
}

async function handleEquip(itemIndex) {
  try {
    const res = await equipItem(props.sessionId, itemIndex)
    updateState(res.data)
  } catch (e) { showToast('装备失败') }
}

async function handleUnequip(slot) {
  try {
    const res = await unequipItem(props.sessionId, slot)
    updateState(res.data)
  } catch (e) { showToast('卸下失败') }
}

async function handleEquipSoulBone(boneIndex) {
  try {
    const res = await equipSoulBone(props.sessionId, boneIndex)
    updateState(res.data)
    if (res.data.message) showToast(res.data.message)
  } catch (e) { showToast('装备魂骨失败') }
}

async function handleUnequipSoulBone(slot) {
  try {
    const res = await unequipSoulBone(props.sessionId, slot)
    updateState(res.data)
    if (res.data.message) showToast(res.data.message)
  } catch (e) { showToast('卸下魂骨失败') }
}

async function handleUse(itemIndex) {
  try {
    const res = await useItem(props.sessionId, itemIndex)
    updateState(res.data)
  } catch (e) { showToast('使用失败') }
}

async function handleExchange(from, to, amount) {
  try {
    const res = await exchangeCurrency(props.sessionId, from, to, amount)
    updateState(res.data)
  } catch (e) { showToast('兑换失败') }
}

function showHomeStory() {
  showToast('家是温暖的港湾。无论走多远，你都知道有一个地方可以回去。')
}

async function handleGod() {
  try {
    const res = await attemptGod(props.sessionId)
    updateState(res.data)
    if (res.data.god) {
      showToast('🏆 成神突破成功！')
    } else if (res.data.died) {
      showToast('💀 成神失败，陨落...')
    }
  } catch (e) { showToast('成神突破失败') }
}

async function handleSave() {
  try {
    const res = await saveGame(props.sessionId)
    showToast(res.data.message || '存档成功')
  } catch (e) { showToast('存档失败') }
}

async function handleLoad() {
  try {
    const res = await loadGame(props.sessionId)
    if (res.data.success) {
      emit('update', res.data)
      showToast(res.data.message)
      loadNpcs()
      loadPartners()
    } else {
      showToast(res.data.message || '读档失败')
    }
  } catch (e) { showToast('读档失败') }
}

function handleResetConfirm() {
  resetConfirm.value = true
}

async function handleReset(skipConfirm = false) {
  if (!skipConfirm && !confirm('确定重置？所有进度将丢失。')) return
  try {
    isDead.value = false
    resetConfirm.value = false
    await resetGame(props.sessionId)
    location.reload()
  } catch (e) { showToast('重置失败') }
}

// 监听健康值，为0时判定死亡
watch(() => props.player.健康值, (newVal) => {
  if (newVal <= 0 && !isDead.value) {
    isDead.value = true
  }
})

onMounted(() => {
  loadNpcs()
  loadPartners()
  loadShop()
})
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
  position: relative;
}

/* 顶部状态栏 */
.top-bar {
  background: #fff;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  border-radius: 8px;
  margin: 0 12px 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.player-name {
  font-weight: 700;
  color: #4a6cf7;
  font-size: 20px;
  letter-spacing: 0.5px;
}
.player-tag {
  padding: 6px 14px;
  background: #f5f6f8;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}
.top-stats {
  display: flex;
  gap: 10px;
  align-items: center;
}
.stat-tag {
  padding: 6px 14px;
  background: #f5f6f8;
  border-radius: 6px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

/* 主布局 */
.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 16% 1fr 16%;
  gap: 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  min-height: 0;
}

.left-panel,
.right-panel {
  overflow-y: auto;
  padding-right: 4px;
}

.center-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* 面板通用 */
.panel-section {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a5a7a;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}

/* 左栏 */
.status-bars {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.status-bar-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.status-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
}
.status-bar-bg {
  width: 100%;
  height: 10px;
  background: #e8e8e8;
  border-radius: 5px;
  overflow: hidden;
}
.status-bar-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease;
}
.health-bar {
  background: #4caf50;
}
.soul-bar {
  background: #2196f3;
}

.attr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.attr-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 6px;
  background: #f8f9fa;
  border-radius: 4px;
}
.attr-label { color: #666; }
.attr-val { color: #333; font-weight: 600; }

.soul-ring-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.soul-ring-slot {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background: #f8f9fa;
  border-radius: 50%;
  border: 1px dashed #ddd;
  cursor: pointer;
}
.soul-ring-slot.filled {
  background: #fff;
  border: 1px solid #e0e0e0;
}
.ring-svg {
  display: block;
}
.ring-empty {
  color: #ccc;
  font-size: 18px;
}
.ring-hint {
  margin-top: 8px;
  font-size: 10px;
  color: #999;
  text-align: center;
}

.equip-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.equip-slot {
  padding: 6px;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}
.equip-slot:hover {
  background: #e8f0fe;
}
.equip-name {
  font-size: 11px;
  color: #333;
  font-weight: 600;
}
.equip-type {
  font-size: 10px;
  color: #999;
  margin-top: 2px;
}

/* 魂骨系统 */
.soul-bone-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  margin-bottom: 10px;
}
.soul-bone-slot {
  padding: 5px;
  background: #f0f4ff;
  border: 1px solid #d0d8f0;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.soul-bone-slot:hover {
  background: #e0e8ff;
  border-color: #5b8def;
}
.bone-name {
  font-size: 10px;
  color: #333;
  font-weight: 600;
  line-height: 1.2;
}
.bone-type {
  font-size: 9px;
  color: #666;
  margin-top: 2px;
}
.bone-year {
  font-size: 9px;
  color: #8b5cf6;
  font-weight: 600;
  margin-top: 1px;
}
.soul-bone-backpack {
  border-top: 1px solid #e0e0e0;
  padding-top: 8px;
}
.backpack-title {
  font-size: 11px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 600;
}
.empty-small {
  font-size: 10px;
  color: #999;
  text-align: center;
  padding: 8px 0;
}
.bone-inventory-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  max-height: 120px;
  overflow-y: auto;
}
.bone-inventory-item {
  padding: 4px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.bone-inventory-item:hover {
  background: #e8f0fe;
  border-color: #5b8def;
}
.bone-item-name {
  font-size: 9px;
  color: #333;
  font-weight: 600;
  line-height: 1.2;
}
.bone-item-slot {
  font-size: 8px;
  color: #666;
  margin-top: 1px;
}
.bone-item-year {
  font-size: 8px;
  color: #8b5cf6;
  font-weight: 600;
  margin-top: 1px;
}

/* 中栏 */
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.nav-tabs {
  display: flex;
  gap: 4px;
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  flex-wrap: wrap;
}
.nav-tabs button {
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}
.nav-tabs button:hover {
  background: #f0f2f5;
}
.nav-tabs button.active {
  background: #5b8def;
  color: #fff;
}

.content-area {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  min-height: 350px;
}
.tab-content h3 {
  font-size: 16px;
  color: #4a5a7a;
  margin-bottom: 12px;
}
.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  line-height: 2;
  font-size: 13px;
}
.info-card p {
  color: #555;
}
.info-card strong {
  color: #333;
}

.action-area {
  text-align: center;
  padding: 20px;
}
.action-area p {
  margin: 8px 0;
  font-size: 13px;
  color: #666;
}
.action-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #5b8def;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn:hover:not(:disabled) {
  background: #4a7de0;
}
.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 魂环警告 */
.ring-warning {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  text-align: left;
}
.ring-warning p {
  margin: 6px 0;
  font-size: 12px;
  color: #856404;
}
.ring-warning p:first-child {
  font-size: 14px;
  font-weight: 700;
  color: #856404;
}

/* 成神突破 */
.god-section {
  margin-top: 24px;
  padding-top: 20px;
}
.god-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #f5a623, transparent);
  margin-bottom: 16px;
}
.god-hint {
  font-size: 14px !important;
  font-weight: 600;
  color: #f5a623 !important;
}
.god-detail {
  font-size: 11px !important;
  color: #999 !important;
}
.god-btn {
  background: #f5a623 !important;
}
.god-btn:hover:not(:disabled) {
  background: #e09612 !important;
}
.god-attempts {
  font-size: 11px !important;
  color: #999 !important;
  margin-top: 8px !important;
}
.result-msg {
  margin-top: 16px;
  padding: 10px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
  font-size: 13px;
}
.warning {
  color: #e67e22;
  font-weight: 600;
}

/* 地图 */
.map-tab {
  padding: 0;
}
.map-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
.map-title-icon {
  font-size: 16px;
}
.map-title {
  font-size: 14px;
  font-weight: 600;
  color: #4a5a7a;
}

/* 当前位置卡片 */
.current-location-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #e8e8e8;
}
.location-breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}
.breadcrumb-item {
  display: inline;
  cursor: pointer;
}
.breadcrumb-item:hover {
  color: #5b8def;
}
.breadcrumb-sep {
  color: #999;
  margin: 0 4px;
  cursor: default;
}
.location-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.6;
}

/* 子地点 */
.sub-locations {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.sub-location-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 80px;
  justify-content: center;
}
.sub-location-btn:hover {
  background: #e8f0fe;
  border-color: #5b8def;
  color: #5b8def;
}
.sub-location-btn.locked {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
  flex-direction: column;
  gap: 2px;
}
.sub-location-btn.locked:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #999;
}
.sub-lock-msg {
  font-size: 9px;
  color: #b0b0b0;
  line-height: 1.2;
}
.sub-loc-icon {
  font-size: 12px;
}

/* 快速前往 */
.quick-travel-section {
  margin-bottom: 12px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}
.section-icon {
  font-size: 14px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.quick-travel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.travel-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.travel-card:hover:not(.locked) {
  background: #e8f0fe;
  border-color: #5b8def;
}
.travel-card.current {
  background: #5b8def;
  border-color: #5b8def;
}
.travel-card.current .travel-name {
  color: #fff;
}
.travel-card.locked {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
.travel-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}
.travel-icon {
  font-size: 12px;
}
.travel-lock-msg {
  font-size: 10px;
  color: #999;
  line-height: 1.4;
}
.travel-cost {
  font-size: 11px;
  color: #f5a623;
  font-weight: 600;
}

/* 事件模块 */
.event-list {
  margin-bottom: 16px;
}
.event-item {
  background: #f8f9fa;
  border-left: 3px solid #5b8def;
  padding: 8px 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #333;
  border-radius: 0 4px 4px 0;
}
.event-more {
  font-size: 11px;
  color: #999;
  text-align: center;
  margin-top: 8px;
}
.event-actions {
  margin-bottom: 20px;
}
.stats-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}
.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 8px;
  background: #fff;
  border-radius: 4px;
}
.stat-label {
  color: #666;
}
.stat-val {
  color: #333;
  font-weight: 600;
}

/* 家模块 */
.home-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e8e8e8;
}
.home-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.home-story {
  font-size: 13px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 12px;
}
.home-family-story {
  font-size: 12px;
  color: #777;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.home-relation {
  font-size: 12px;
  color: #4a5a7a;
  font-weight: 600;
}
.home-actions {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}
.home-actions-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}
.home-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 兑换模块 */
.exchange-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8e8e8;
}
.exchange-rate {
  font-size: 13px;
  color: #555;
  text-align: center;
  margin-bottom: 16px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}
.currency-display {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
}
.currency {
  font-size: 13px;
  font-weight: 600;
}
.currency.gold { color: #f5a623; }
.currency.silver { color: #999; }
.currency.copper { color: #cd7f32; }
.exchange-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.exchange-btn {
  padding: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}
.exchange-btn:hover {
  background: #e8f0fe;
  border-color: #5b8def;
  color: #5b8def;
}

/* 设置模块 */
.settings-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 14px;
  border: 1px solid #e8e8e8;
}
.settings-section h4 {
  font-size: 14px;
  color: #4a5a7a;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e0e0e0;
}
.settings-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 12px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
}
.info-row span:first-child {
  color: #666;
}
.info-row span:last-child {
  color: #333;
  font-weight: 600;
}
.settings-help {
  font-size: 12px;
  color: #555;
  line-height: 1.8;
}
.settings-help p {
  margin: 4px 0;
}
.settings-help strong {
  color: #4a5a7a;
}
.settings-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.settings-btn {
  padding: 8px 16px;
  background: #5b8def;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.settings-btn:hover {
  background: #4a7de0;
}
.settings-btn.danger {
  background: #e74c3c;
}
.settings-btn.danger:hover {
  background: #c0392b;
}
.reset-warning {
  margin-top: 12px;
  padding: 10px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  font-size: 12px;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.settings-about {
  font-size: 12px;
  color: #666;
  line-height: 1.8;
  text-align: center;
}
.settings-about p {
  margin: 4px 0;
}
.settings-about strong {
  color: #4a5a7a;
  font-size: 14px;
}

/* 游戏说明 */
.guide-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: #4a5a7a;
  margin: 14px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}
.level-table {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.level-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr 1fr;
  padding: 6px 8px;
  font-size: 11px;
  border-bottom: 1px solid #f0f0f0;
}
.level-row:last-child {
  border-bottom: none;
}
.level-row.header {
  background: #f0f2f5;
  font-weight: 600;
  color: #4a5a7a;
}
.guide-note {
  font-size: 11px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}
.guide-note p {
  margin: 4px 0;
}
.ring-color-table {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.ring-color-row {
  display: grid;
  grid-template-columns: 30px 1fr 1fr 1fr;
  padding: 8px;
  font-size: 11px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}
.ring-color-row:last-child {
  border-bottom: none;
}
.ring-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring-name {
  font-weight: 600;
  color: #333;
}
.ring-range {
  color: #666;
}
.ring-skill {
  color: #888;
  text-align: right;
}

/* NPC列表 */
.hint {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}
.empty {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}
.npc-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.npc-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e8e8e8;
}
.npc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.npc-icon {
  font-size: 20px;
}
.npc-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  flex: 1;
}
.npc-hearts {
  font-size: 14px;
}
.npc-info p {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
}
.npc-like {
  color: #5b8def !important;
  font-weight: 600;
}
.partner-tag {
  color: #e91e63 !important;
  font-weight: 600;
}
.spouse-tag {
  color: #f5a623 !important;
  font-weight: 600;
}
.npc-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

/* 按钮 */
.btn-sm {
  padding: 4px 10px;
  font-size: 11px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-sm:hover {
  background: #f0f2f5;
}
.btn-sm.btn-primary {
  background: #5b8def;
  color: #fff;
  border-color: #5b8def;
}
.btn-sm.btn-primary:hover {
  background: #4a7de0;
}
.btn-sm.btn-danger {
  background: #e74c3c;
  color: #fff;
  border-color: #e74c3c;
}
.btn-sm.btn-danger:hover {
  background: #c0392b;
}

/* 猎魂结果 */
.hunt-result {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}
.hunt-result p {
  margin: 6px 0;
  font-size: 13px;
}

/* 事务 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.task-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 1px solid #e8e8e8;
}
.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.task-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}
.task-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
}
.difficulty {
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}
.diff-简单 { background: #e8f5e9; color: #2e7d32; }
.diff-普通 { background: #e3f2fd; color: #1565c0; }
.diff-中级 { background: #fff3e0; color: #e65100; }
.diff-高级 { background: #ffebee; color: #c62828; }
.reward {
  color: #f5a623;
}

/* 商店 */
.gold-display {
  font-size: 14px;
  margin-bottom: 12px;
  color: #f5a623;
  font-weight: 600;
}
.shop-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.shop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
}
.shop-item .item-info {
  flex: 1;
}
.shop-item .item-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.shop-item .item-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
.shop-item .item-type {
  font-size: 10px;
  color: #5b8def;
  margin-top: 2px;
}
.shop-item .item-price {
  font-size: 14px;
  font-weight: 600;
  color: #f5a623;
  min-width: 80px;
  text-align: right;
}

/* 背包 */
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.inventory-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
}
.inventory-item .item-info {
  flex: 1;
}
.inventory-item .item-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.inventory-item .item-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
.item-actions {
  display: flex;
  gap: 6px;
}

/* 魂骨模块 */
.soulbone-equip-section {
  margin-bottom: 20px;
}
.soulbone-equip-section h4,
.soulbone-backpack-section h4 {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e8e8e8;
}
.soulbone-equip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.soulbone-equip-slot {
  background: #f0f4ff;
  border: 2px solid #d0d8f0;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.soulbone-equip-slot:hover {
  background: #e0e8ff;
  border-color: #5b8def;
}
.soulbone-slot-type {
  font-size: 11px;
  color: #666;
  font-weight: 600;
  margin-bottom: 4px;
}
.soulbone-slot-name {
  font-size: 12px;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}
.soulbone-slot-year {
  font-size: 11px;
  color: #8b5cf6;
  font-weight: 600;
  margin-top: 4px;
}
.soulbone-slot-unequip {
  font-size: 10px;
  color: #e74c3c;
  margin-top: 4px;
}
.soulbone-inventory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.soulbone-inventory-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
}
.soulbone-item-info {
  flex: 1;
}
.soulbone-item-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
.soulbone-item-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
.soulbone-item-bonus {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.bonus-tag {
  font-size: 10px;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 2px 6px;
  border-radius: 4px;
}
.soulbone-item-actions {
  display: flex;
  gap: 6px;
}

/* 装备详情 */
.equip-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.equip-slot-detail {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e8e8e8;
}
.slot-name {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
.slot-item {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}
.slot-stats {
  font-size: 11px;
  color: #5b8def;
  margin-bottom: 8px;
}
.slot-stats span {
  margin: 0 4px;
}

/* 日志面板 */
.log-panel {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  max-height: 250px;
  overflow-y: auto;
}
.log-title {
  font-size: 13px;
  font-weight: 600;
  color: #4a5a7a;
  margin-bottom: 8px;
}
.log-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.log-item {
  font-size: 11px;
  color: #666;
  line-height: 1.6;
  padding: 4px 0;
  border-bottom: 1px solid #f5f5f5;
}
.log-time {
  color: #999;
  margin-right: 6px;
}

/* 右栏 */
.location-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.location-item-btn {
  padding: 6px 8px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.location-item-btn:hover {
  background: #e8f0fe;
}
.location-item-btn.current {
  background: #5b8def;
  color: #fff;
  border-color: #5b8def;
}
.location-item-btn.locked {
  background: #f0f0f0;
  color: #999;
  border-color: #ddd;
  cursor: not-allowed;
  opacity: 0.7;
}
.location-item-btn.locked:hover {
  background: #f0f0f0;
}
.lock-icon {
  margin-right: 4px;
}
.loc-name {
  flex: 1;
}
.lock-desc {
  font-size: 9px;
  color: #bbb;
  margin-left: 4px;
}

.current-location {
  text-align: center;
}
.loc-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.loc-desc {
  font-size: 11px;
  color: #999;
  line-height: 1.5;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.quick-btn {
  padding: 8px 4px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-btn:hover {
  background: #e8f0fe;
  border-color: #5b8def;
}

/* 底部操作栏 */
.footer-actions {
  background: #fff;
  padding: 10px 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  border-top: 1px solid #e8e8e8;
  flex-wrap: wrap;
}
.footer-btn {
  padding: 8px 16px;
  background: #5b8def;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.footer-btn:hover {
  background: #4a7de0;
}
.footer-btn.danger {
  background: #e74c3c;
}
.footer-btn.danger:hover {
  background: #c0392b;
}

/* Toast */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  z-index: 1000;
  animation: fadeIn 0.3s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 响应式 */
@media (max-width: 1000px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .left-panel, .right-panel {
    display: none;
  }
  .location-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .npc-list {
    grid-template-columns: 1fr;
  }
}

/* 死亡界面 */
.death-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.death-content {
  background: #1a1a1a;
  border: 2px solid #444;
  border-radius: 12px;
  padding: 40px 60px;
  text-align: center;
  color: #fff;
  max-width: 400px;
}
.death-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
.death-title {
  font-size: 28px;
  color: #e74c3c;
  margin-bottom: 12px;
}
.death-desc {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 20px;
  line-height: 1.6;
}
.death-stats {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}
.death-stats p {
  margin: 6px 0;
  font-size: 13px;
  color: #ccc;
}
.death-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.death-btn:hover {
  background: #c0392b;
}

/* 弹窗通用样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}
.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}
.modal-close:hover {
  background: #e8e8e8;
  color: #333;
}
.modal-body {
  padding: 24px 20px;
}
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  justify-content: flex-end;
}
.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-btn.cancel {
  background: #f0f0f0;
  color: #666;
}
.modal-btn.cancel:hover {
  background: #e0e0e0;
}
.modal-btn.confirm {
  background: #5b8def;
  color: #fff;
}
.modal-btn.confirm:hover:not(:disabled) {
  background: #4a7de0;
}
.modal-btn.confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 魂环吸收弹窗 */
.ring-absorb-info {
  text-align: center;
}
.beast-ring-icon {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}
.beast-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}
.beast-year {
  font-size: 14px;
  color: #8b5cf6;
  font-weight: 600;
  margin-bottom: 12px;
}
.ring-absorb-tip {
  font-size: 13px;
  color: #666;
}
.ring-absorb-tip .warning {
  color: #e74c3c;
  font-weight: 600;
}
</style>
