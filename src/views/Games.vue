<template>
  <!-- 小游戏页面 - 4399风格游戏盒 -->
  <div class="games-container">
    <!-- 页面标题 -->
    <div class="games-header">
      <h1 class="games-title">🎮 小游戏中心</h1>
      <p class="games-subtitle">海量休闲小游戏，即点即玩！</p>
    </div>

    <!-- 游戏列表视图 -->
    <div v-if="!isPlaying" class="games-list-view">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-btn"
          :class="{ active: currentCategory === cat.id }"
          @click="currentCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- 游戏卡片网格 -->
      <div class="games-grid">
        <div
          v-for="game in filteredGames"
          :key="game.id"
          class="game-box-card"
          @click="selectGame(game.id)"
        >
          <!-- 游戏封面 -->
          <div class="game-box-cover" :style="{ background: game.gradient }">
            <span class="game-box-icon">{{ game.icon }}</span>
            <div class="game-box-overlay">
              <button class="play-btn">开始游戏</button>
            </div>
          </div>
          <!-- 游戏信息 -->
          <div class="game-box-info">
            <h3 class="game-box-title">{{ game.name }}</h3>
            <p class="game-box-desc">{{ game.description }}</p>
            <div class="game-box-tags">
              <span v-for="tag in game.tags" :key="tag" class="game-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏进行视图 -->
    <div v-else class="game-play-view">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="exitGame">
        <span class="back-icon">←</span>
        返回游戏列表
      </button>

      <!-- 游戏内容区域 -->
      <div class="game-play-area">
        <!-- 猜数字游戏 -->
        <div v-if="currentGame === 'guess'" class="play-card guess-play-card">
          <div class="play-header">
            <div class="play-title-group">
              <span class="play-icon">🔢</span>
              <span class="play-name">猜数字</span>
            </div>
            <div class="play-stats">
              <span class="stat-badge">已猜 {{ guessCount }} 次</span>
            </div>
          </div>
          <div class="play-content">
            <div class="guess-intro">
              <div class="guess-number-display">?</div>
              <p class="play-desc">我想了一个 1-100 的数字，你来猜！</p>
            </div>
            <div class="guess-input-area">
              <div class="guess-input-wrapper">
                <input
                  v-model.number="guessNumberInput"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="输入 1-100 的数字"
                  class="guess-input"
                  @keyup.enter="makeGuess"
                >
                <button class="guess-btn" @click="makeGuess">
                  <span class="btn-icon">🎯</span>
                  猜测
                </button>
              </div>
            </div>
            <transition name="fade">
              <div v-if="guessResult" class="guess-result-box" :class="guessResultType">
                <span class="result-icon">{{ guessResultType === 'correct' ? '🎉' : (guessResultType === 'low' ? '⬆️' : '⬇️') }}</span>
                <p class="guess-result-text">{{ guessResult }}</p>
              </div>
            </transition>
            <button v-if="guessResultType === 'correct'" class="restart-btn" @click="initGuessNumber">
              <span class="btn-icon">🔄</span>
              再玩一次
            </button>
          </div>
        </div>

        <!-- 记忆翻牌游戏 -->
        <div v-if="currentGame === 'memory'" class="play-card memory-play-card">
          <div class="play-header">
            <div class="play-title-group">
              <span class="play-icon">🧠</span>
              <span class="play-name">记忆翻牌</span>
            </div>
            <div class="play-stats">
              <span class="stat-badge">步数 {{ memoryMoves }}</span>
            </div>
          </div>
          <div class="play-content">
            <div class="memory-status-bar">
              <p class="memory-status-text">{{ memoryStatus }}</p>
              <div class="memory-progress">
                <div class="memory-progress-bar" :style="{ width: (memoryCards.filter(c => c.matched).length / memoryCards.length * 100) + '%' }"></div>
              </div>
            </div>
            <div class="memory-grid">
              <div
                v-for="(card, index) in memoryCards"
                :key="index"
                class="memory-card"
                :class="{ 'flipped': card.flipped || card.matched, 'matched': card.matched }"
                @click="flipCard(index)"
              >
                <div class="card-inner">
                  <span class="card-front">{{ card.emoji }}</span>
                  <span class="card-back">?</span>
                </div>
              </div>
            </div>
            <transition name="fade">
              <div v-if="memoryWon" class="memory-win-box">
                <span class="win-icon">🏆</span>
                <p class="win-text">恭喜完成！用了 {{ memoryMoves }} 步</p>
                <button class="restart-btn" @click="initMemoryGame">
                  <span class="btn-icon">🔄</span>
                  再玩一次
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- 点击挑战游戏 -->
        <div v-if="currentGame === 'click'" class="play-card click-play-card">
          <div class="play-header">
            <div class="play-title-group">
              <span class="play-icon">👆</span>
              <span class="play-name">点击挑战</span>
            </div>
          </div>
          <div class="play-content">
            <div class="click-stats-board">
              <div class="click-stat-item">
                <span class="click-stat-label">剩余时间</span>
                <span class="click-stat-value timer" :class="{ 'warning': clickTimeLeft <= 3 }">{{ clickTimeLeft }}s</span>
              </div>
              <div class="click-stat-divider"></div>
              <div class="click-stat-item">
                <span class="click-stat-label">点击次数</span>
                <span class="click-stat-value score">{{ clickScore }}</span>
              </div>
            </div>
            <div class="click-game-area">
              <button
                v-if="clickGameActive"
                class="click-main-btn"
                @click="handleClick"
              >
                <span class="click-btn-text">点我！</span>
                <span class="click-btn-hint">疯狂点击</span>
              </button>
              <div v-else class="click-idle-state">
                <div v-if="clickScore === 0" class="click-start-panel">
                  <p class="click-intro">10秒极限挑战，测试你的手速！</p>
                  <button class="click-start-btn" @click="startClickGame">
                    <span class="btn-icon">▶️</span>
                    开始挑战
                  </button>
                </div>
                <div v-else class="click-result-panel">
                  <span class="result-emoji">{{ clickScore >= 80 ? '🏆' : (clickScore >= 50 ? '👍' : '💪') }}</span>
                  <p class="click-result-text">{{ clickScore >= 80 ? '手速惊人！' : (clickScore >= 50 ? '不错的成绩！' : '继续加油！') }}</p>
                  <p class="click-final-score">最终成绩: {{ clickScore }} 次</p>
                  <button class="restart-btn" @click="startClickGame">
                    <span class="btn-icon">🔄</span>
                    再玩一次
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 俄罗斯方块游戏 -->
        <div v-if="currentGame === 'tetris'" class="play-card tetris-play-card">
          <!-- 顶部信息栏 -->
          <div class="tetris-top-bar">
            <div class="tetris-title-section">
              <span class="tetris-game-icon">🧱</span>
              <span class="tetris-game-name">俄罗斯方块</span>
            </div>
            <div class="tetris-stats-row">
              <div class="tetris-stat-box">
                <span class="tetris-stat-icon">💎</span>
                <div class="tetris-stat-info">
                  <span class="tetris-stat-label">分数</span>
                  <span class="tetris-stat-num">{{ tetrisScore }}</span>
                </div>
              </div>
              <div class="tetris-stat-box">
                <span class="tetris-stat-icon">⭐</span>
                <div class="tetris-stat-info">
                  <span class="tetris-stat-label">等级</span>
                  <span class="tetris-stat-num level">{{ tetrisLevel }}</span>
                </div>
              </div>
              <div class="tetris-stat-box">
                <span class="tetris-stat-icon">🔥</span>
                <div class="tetris-stat-info">
                  <span class="tetris-stat-label">消除</span>
                  <span class="tetris-stat-num lines">{{ tetrisLines }}</span>
                </div>
              </div>
            </div>
            <button v-if="tetrisGameActive && !tetrisGamePaused" class="tetris-pause-btn" @click="pauseTetrisGame">
              <span class="pause-icon">⏸</span>
            </button>
          </div>

          <!-- 游戏主体区域 -->
          <div class="tetris-game-body">
            <!-- 左侧：下一个方块预览 -->
            <div class="tetris-preview-panel">
              <h4 class="preview-title">下一个</h4>
              <div class="preview-box">
                <canvas ref="nextPieceCanvas" class="next-piece-canvas" width="100" height="100"></canvas>
              </div>
            </div>

            <!-- 中间：游戏画布 -->
            <div class="tetris-canvas-area">
              <div class="tetris-canvas-wrapper">
                <canvas ref="tetrisCanvas" class="tetris-canvas" width="300" height="600" style="width: 300px; height: 600px;"></canvas>

                <!-- 开始遮罩 -->
                <div v-if="!tetrisGameActive" class="tetris-overlay">
                  <div class="tetris-overlay-content">
                    <div class="tetris-logo">🎮</div>
                    <h3 class="tetris-overlay-title">俄罗斯方块</h3>
                    <p class="tetris-overlay-subtitle">经典永不过时</p>
                    <div class="tetris-overlay-buttons">
                      <button class="tetris-btn tetris-btn-primary" @click="startTetrisGame">
                        <span>▶</span> 开始游戏
                      </button>
                      <button v-if="tetrisScore > 0" class="tetris-btn tetris-btn-secondary" @click="resetTetrisGame">
                        <span>↻</span> 重新开始
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 暂停遮罩 -->
                <div v-if="tetrisGamePaused" class="tetris-overlay tetris-pause-overlay">
                  <div class="tetris-overlay-content">
                    <div class="tetris-logo">⏸</div>
                    <h3 class="tetris-overlay-title">游戏暂停</h3>
                    <div class="tetris-overlay-buttons">
                      <button class="tetris-btn tetris-btn-primary" @click="resumeTetrisGame">
                        <span>▶</span> 继续游戏
                      </button>
                      <button class="tetris-btn tetris-btn-danger" @click="endTetrisGame">
                        <span>✕</span> 结束游戏
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 游戏结束遮罩 -->
                <div v-if="tetrisGameOver" class="tetris-overlay tetris-gameover-overlay">
                  <div class="tetris-overlay-content">
                    <div class="tetris-logo">💀</div>
                    <h3 class="tetris-overlay-title">游戏结束</h3>
                    <div class="tetris-final-score">
                      <span class="final-score-label">最终得分</span>
                      <span class="final-score-value">{{ tetrisScore }}</span>
                    </div>
                    <div class="tetris-overlay-buttons">
                      <button class="tetris-btn tetris-btn-primary" @click="resetTetrisGame">
                        <span>↻</span> 再来一局
                      </button>
                      <button class="tetris-btn tetris-btn-secondary" @click="endTetrisGame">
                        <span>←</span> 返回
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：操作说明 -->
            <div class="tetris-controls-panel">
              <h4 class="controls-title">🎮 操作说明</h4>
              <div class="controls-list">
                <div class="control-item">
                  <div class="control-keys">
                    <kbd class="control-key">←</kbd>
                    <kbd class="control-key">→</kbd>
                  </div>
                  <span class="control-desc">左右移动</span>
                </div>
                <div class="control-item">
                  <div class="control-keys">
                    <kbd class="control-key">↑</kbd>
                  </div>
                  <span class="control-desc">旋转方块</span>
                </div>
                <div class="control-item">
                  <div class="control-keys">
                    <kbd class="control-key">↓</kbd>
                  </div>
                  <span class="control-desc">加速下落</span>
                </div>
                <div class="control-item">
                  <div class="control-keys">
                    <kbd class="control-key wide">空格</kbd>
                  </div>
                  <span class="control-desc">直接落地</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 大鱼吃小鱼游戏 -->
        <div v-if="currentGame === 'fish'" class="play-card fish-play-card">
          <!-- 顶部信息栏 -->
          <div class="fish-top-bar ocean-gradient">
            <div class="fish-title-section">
              <span class="fish-game-icon">🐟</span>
              <span class="fish-game-name">深海大冒险</span>
            </div>
            <div class="fish-stats-row">
              <div class="fish-stat-box">
                <span class="fish-stat-icon">💎</span>
                <div class="fish-stat-info">
                  <span class="fish-stat-label">分数</span>
                  <span class="fish-stat-num">{{ fishScore }}</span>
                </div>
              </div>
              <div class="fish-stat-box">
                <span class="fish-stat-icon">📏</span>
                <div class="fish-stat-info">
                  <span class="fish-stat-label">大小</span>
                  <span class="fish-stat-num size">{{ fishSize }}/{{ MAX_FISH_SIZE }}</span>
                </div>
              </div>
              <div class="fish-stat-box">
                <span class="fish-stat-icon">⭐</span>
                <div class="fish-stat-info">
                  <span class="fish-stat-label">关卡</span>
                  <span class="fish-stat-num level">{{ fishLevel }}/{{ LEVELS.length }}</span>
                </div>
              </div>
            </div>
            <button v-if="fishGameActive && !fishGamePaused" class="fish-pause-btn" @click="pauseFishGame">
              <span class="pause-icon">⏸</span>
            </button>
          </div>

          <!-- 游戏主体区域 -->
          <div class="fish-game-body">
            <!-- 中间：游戏画布 -->
            <div class="fish-canvas-area">
              <div class="fish-canvas-wrapper">
                <canvas
                  ref="fishCanvas"
                  class="fish-canvas"
                  width="600"
                  height="350"
                  @mousemove="handleFishMousemove"
                  @mouseenter="handleFishMouseEnter"
                  @mouseleave="handleFishMouseLeave"
                ></canvas>

                <!-- 开始遮罩 -->
                <div v-if="!fishGameActive && fishScore === 0" class="fish-overlay ocean-start-overlay">
                  <div class="fish-overlay-content">
                    <div class="ocean-waves">🌊</div>
                    <h3 class="fish-overlay-title ocean-title">深海大冒险</h3>
                    <p class="fish-overlay-subtitle">在神秘的海底世界，控制小鱼成长，<br>吃掉比你小的鱼，避开危险的大鱼！</p>
                    <div class="fish-overlay-buttons">
                      <button class="fish-btn fish-btn-primary" @click="startFishGame">
                        <span>▶</span> 开始游戏
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 暂停遮罩 -->
                <div v-if="fishGamePaused" class="fish-overlay fish-pause-overlay">
                  <div class="fish-overlay-content">
                    <div class="fish-logo">⏸</div>
                    <h3 class="fish-overlay-title">游戏暂停</h3>
                    <div class="fish-overlay-buttons">
                      <button class="fish-btn fish-btn-primary" @click="resumeFishGame">
                        <span>▶</span> 继续游戏
                      </button>
                      <button class="fish-btn fish-btn-danger" @click="endFishGame">
                        <span>✕</span> 结束游戏
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 游戏结束遮罩 -->
                <div v-if="!fishGameActive && fishScore > 0 && !fishGameWon" class="fish-overlay fish-gameover-overlay">
                  <div class="fish-overlay-content compact">
                    <div class="fish-logo gameover-icon">💀</div>
                    <h3 class="fish-overlay-title tiny">游戏结束</h3>
                    <p class="fish-overlay-subtitle tiny">被大鱼吃掉了！</p>
                    <div class="fish-final-score-box compact gameover-box">
                      <span class="final-score-label">最终得分</span>
                      <span class="final-score-value gameover-score">{{ fishScore }}</span>
                    </div>
                    <div class="fish-overlay-buttons horizontal">
                      <button class="fish-btn fish-btn-primary tiny" @click="resetFishGame">
                        <span>↻</span> 再来
                      </button>
                      <button class="fish-btn fish-btn-secondary tiny" @click="endFishGame">
                        <span>←</span> 返回
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 游戏胜利遮罩 -->
                <div v-if="fishGameWon" class="fish-overlay fish-win-overlay">
                  <!-- 礼花容器 -->
                  <div class="fireworks-container">
                    <div v-for="n in 20" :key="n" class="firework" :style="getFireworkStyle(n)"></div>
                  </div>
                  <div class="fish-overlay-content compact">
                    <div class="fish-logo large victory-icon">🏆</div>
                    <h3 class="fish-overlay-title tiny victory-title">恭喜通关！</h3>
                    <p class="fish-overlay-subtitle tiny">你已成为海洋霸主！</p>
                    <div class="fish-final-score-box compact victory-box">
                      <span class="final-score-label">最终得分</span>
                      <span class="final-score-value victory-score">{{ fishScore }}</span>
                    </div>
                    <div class="fish-overlay-buttons horizontal">
                      <button class="fish-btn fish-btn-primary tiny" @click="resetFishGame">
                        <span>↻</span> 再玩
                      </button>
                      <button class="fish-btn fish-btn-secondary tiny" @click="endFishGame">
                        <span>←</span> 返回
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 关卡过渡遮罩 -->
                <div v-if="fishLevelComplete" class="fish-overlay fish-level-overlay">
                  <div class="fish-overlay-content compact">
                    <div class="fish-logo large">🎉</div>
                    <h3 class="fish-overlay-title tiny">第 {{ fishLevel }} 关完成！</h3>
                    <p class="fish-overlay-subtitle tiny">得分: {{ fishScore }}</p>
                    <div class="fish-level-info">
                      <div class="level-info-item">
                        <span class="info-label">下一关</span>
                        <span class="info-value">第 {{ fishLevel + 1 }} 关</span>
                      </div>
                      <div class="level-info-item">
                        <span class="info-label">速度</span>
                        <span class="info-value">↑ 提升</span>
                      </div>
                      <div class="level-info-item">
                        <span class="info-label">目标</span>
                        <span class="info-value">{{ LEVELS[Math.min(fishLevel, LEVELS.length - 1)].targetScore }}分</span>
                      </div>
                    </div>
                    <div class="fish-overlay-buttons horizontal">
                      <button class="fish-btn fish-btn-primary tiny" @click="nextLevel">
                        <span>▶</span> 下一关
                      </button>
                      <button class="fish-btn fish-btn-secondary tiny" @click="endFishGame">
                        <span>✕</span> 结束
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- 底部游戏规则说明 -->
          <div class="fish-rules-bottom">
            <div class="rules-header">
              <span class="rules-icon">📜</span>
              <h4 class="rules-title">游戏规则</h4>
            </div>
            <!-- 第一行：四个规则口 -->
            <div class="rules-row">
              <!-- 能吃 -->
              <div class="rule-box edible-box">
                <div class="rule-emoji-group">
                  <span class="rule-emoji">🐟</span>
                  <span class="rule-emoji">🐠</span>
                  <span class="rule-emoji">🦐</span>
                </div>
                <div class="rule-content">
                  <span class="rule-label green">✅ 可以吃</span>
                  <span class="rule-desc">得分+体型</span>
                </div>
              </div>

              <!-- 不能吃 -->
              <div class="rule-box danger-box">
                <div class="rule-emoji-group">
                  <span class="rule-emoji">🦈</span>
                  <span class="rule-emoji">🐋</span>
                  <span class="rule-emoji">🐊</span>
                </div>
                <div class="rule-content">
                  <span class="rule-label red">❌ 不能吃</span>
                  <span class="rule-desc">碰到即死</span>
                </div>
              </div>

              <!-- 炸弹 -->
              <div class="rule-box bomb-box">
                <div class="rule-emoji-group">
                  <span class="rule-emoji bomb">💣</span>
                </div>
                <div class="rule-content">
                  <span class="rule-label orange">💥 炸弹</span>
                  <span class="rule-desc">3秒爆炸</span>
                </div>
              </div>

              <!-- 操作 -->
              <div class="rule-box control-box">
                <div class="rule-emoji-group">
                  <span class="rule-emoji">🖱️</span>
                </div>
                <div class="rule-content">
                  <span class="rule-label blue">🎮 操作</span>
                  <span class="rule-desc">鼠标移动</span>
                </div>
              </div>
            </div>
            <!-- 第二行：分隔线 -->
            <div class="rules-dividers">
              <div class="rule-divider"></div>
              <div class="rule-divider"></div>
              <div class="rule-divider"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 小游戏页面 - 4399风格游戏盒
 * 功能：提供多种休闲小游戏（猜数字、记忆翻牌、点击挑战、俄罗斯方块、大鱼吃小鱼）
 */
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

// ==================== 游戏列表数据 ====================
const categories = [
  { id: 'all', name: '全部游戏' },
  { id: 'puzzle', name: '益智' },
  { id: 'action', name: '动作' },
  { id: 'casual', name: '休闲' }
]

const currentCategory = ref('all')

const gameList = [
  {
    id: 'guess',
    name: '猜数字',
    icon: '🔢',
    description: '经典猜数字游戏，挑战你的逻辑思维',
    category: 'puzzle',
    tags: ['益智', '数字'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'memory',
    name: '记忆翻牌',
    icon: '🧠',
    description: '考验记忆力，找出相同的配对',
    category: 'puzzle',
    tags: ['益智', '记忆'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'click',
    name: '点击挑战',
    icon: '👆',
    description: '10秒极限挑战，测试你的手速',
    category: 'action',
    tags: ['动作', '手速'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    icon: '🧱',
    description: '经典方块消除，永恒的乐趣',
    category: 'puzzle',
    tags: ['益智', '经典'],
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'fish',
    name: '大鱼吃小鱼',
    icon: '🐟',
    description: '海洋生存法则，从小鱼成长为大鱼',
    category: 'action',
    tags: ['动作', '生存'],
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
]

// 根据分类筛选游戏
const filteredGames = computed(() => {
  if (currentCategory.value === 'all') {
    return gameList
  }
  return gameList.filter(game => game.category === currentCategory.value)
})

// ==================== 游戏状态管理 ====================
const isPlaying = ref(false)
const currentGame = ref('')

// 选择游戏
const selectGame = (gameId: string) => {
  currentGame.value = gameId
  isPlaying.value = true

  // 初始化对应游戏
  nextTick(() => {
    if (gameId === 'tetris') {
      initTetrisCanvas()
    } else if (gameId === 'fish') {
      initFishCanvas()
    }
  })
}

// 退出游戏
/**
 * 退出游戏，返回游戏列表
 * 功能：清理当前游戏状态，重置视图到游戏列表
 */
const exitGame = () => {
  // 清理游戏状态
  if (currentGame.value === 'tetris') {
    endTetrisGame()
  } else if (currentGame.value === 'fish') {
    endFishGame()
  } else if (currentGame.value === 'click') {
    if (clickTimer) {
      clearInterval(clickTimer)
      clickTimer = null
    }
    clickGameActive.value = false
  }

  isPlaying.value = false
  currentGame.value = ''
}

// ==================== 猜数字游戏 ====================
const targetNumber = ref(0)
const guessNumberInput = ref<number | null>(null)
const guessResult = ref('')
const guessResultType = ref('')
const guessCount = ref(0)

/**
 * 初始化猜数字游戏
 */
const initGuessNumber = () => {
  targetNumber.value = Math.floor(Math.random() * 100) + 1
  guessNumberInput.value = null
  guessResult.value = ''
  guessResultType.value = ''
  guessCount.value = 0
}

/**
 * 进行猜测
 */
const makeGuess = () => {
  if (!guessNumberInput.value) return

  guessCount.value++
  const guess = guessNumberInput.value

  if (guess < targetNumber.value) {
    guessResult.value = '太小了！再试试'
    guessResultType.value = 'low'
  } else if (guess > targetNumber.value) {
    guessResult.value = '太大了！再试试'
    guessResultType.value = 'high'
  } else {
    guessResult.value = `🎉 恭喜你猜对了！答案就是 ${targetNumber.value}`
    guessResultType.value = 'correct'
  }
}

// ==================== 记忆翻牌游戏 ====================
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
const memoryCards = ref<{ emoji: string; flipped: boolean; matched: boolean }[]>([])
const memoryMoves = ref(0)
const memoryWon = ref(false)
const memoryStatus = ref('点击卡片开始游戏')
let flippedCards: number[] = []

/**
 * 初始化记忆翻牌游戏
 */
const initMemoryGame = () => {
  const cards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map(emoji => ({ emoji, flipped: false, matched: false }))
  memoryCards.value = cards
  memoryMoves.value = 0
  memoryWon.value = false
  memoryStatus.value = '点击卡片开始游戏'
  flippedCards = []
}

/**
 * 翻牌逻辑
 */
const flipCard = (index: number) => {
  if (memoryCards.value[index].flipped || memoryCards.value[index].matched || flippedCards.length >= 2) return

  memoryCards.value[index].flipped = true
  flippedCards.push(index)

  if (flippedCards.length === 2) {
    memoryMoves.value++
    const [first, second] = flippedCards

    if (memoryCards.value[first].emoji === memoryCards.value[second].emoji) {
      memoryCards.value[first].matched = true
      memoryCards.value[second].matched = true
      flippedCards = []
      memoryStatus.value = '找到一对！继续加油！'

      if (memoryCards.value.every(card => card.matched)) {
        memoryWon.value = true
        memoryStatus.value = `🎉 恭喜完成！用了 ${memoryMoves.value} 步`
      }
    } else {
      memoryStatus.value = '不匹配，再试试'
      setTimeout(() => {
        memoryCards.value[first].flipped = false
        memoryCards.value[second].flipped = false
        flippedCards = []
        memoryStatus.value = '继续游戏'
      }, 1000)
    }
  }
}

// ==================== 点击挑战游戏 ====================
const clickScore = ref(0)
const clickTimeLeft = ref(10)
const clickGameActive = ref(false)
let clickTimer: number | null = null

/**
 * 开始点击游戏
 */
const startClickGame = () => {
  clickScore.value = 0
  clickTimeLeft.value = 10
  clickGameActive.value = true

  if (clickTimer) clearInterval(clickTimer)

  clickTimer = window.setInterval(() => {
    clickTimeLeft.value--
    if (clickTimeLeft.value <= 0) {
      if (clickTimer) {
        clearInterval(clickTimer)
        clickTimer = null
      }
      clickGameActive.value = false
    }
  }, 1000)
}

/**
 * 处理点击
 */
const handleClick = () => {
  if (clickGameActive.value) {
    clickScore.value++
  }
}

// ==================== 俄罗斯方块游戏 ====================
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 30
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]]
]

const tetrisCanvas = ref<HTMLCanvasElement | null>(null)
const nextPieceCanvas = ref<HTMLCanvasElement | null>(null)
let tetrisCtx: CanvasRenderingContext2D | null = null
let nextPieceCtx: CanvasRenderingContext2D | null = null
const tetrisScore = ref(0)
const tetrisLevel = ref(1)
const tetrisLines = ref(0)
const tetrisGameActive = ref(false)
const tetrisGamePaused = ref(false)
const tetrisGameOver = ref(false)
let tetrisGameLoop: number | null = null
let tetrisDropInterval: number | null = null
let board: number[][] = []
let currentPiece: { shape: number[][]; color: string; x: number; y: number } | null = null
let nextPiece: { shape: number[][]; color: string } | null = null
let gameOverAlerted = false

/**
 * 初始化俄罗斯方块画布
 */
const initTetrisCanvas = () => {
  if (tetrisCanvas.value) {
    tetrisCtx = tetrisCanvas.value.getContext('2d')
    initTetrisBoard()
  }
  if (nextPieceCanvas.value) {
    nextPieceCtx = nextPieceCanvas.value.getContext('2d')
  }
}

/**
 * 初始化游戏板
 */
const initTetrisBoard = () => {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
  tetrisScore.value = 0
  tetrisLevel.value = 1
  tetrisLines.value = 0
  gameOverAlerted = false
}

/**
 * 开始俄罗斯方块游戏
 */
const startTetrisGame = () => {
  if (tetrisGameActive.value) return

  initTetrisBoard()
  tetrisGameActive.value = true
  tetrisGamePaused.value = false
  tetrisGameOver.value = false
  nextPiece = null
  spawnPiece()

  tetrisDropInterval = window.setInterval(() => {
    if (!tetrisGamePaused.value) {
      movePiece(0, 1)
    }
  }, 1000 / tetrisLevel.value)

  tetrisUpdate()
}

/**
 * 暂停游戏
 */
const pauseTetrisGame = () => {
  tetrisGamePaused.value = true
  if (tetrisDropInterval) {
    clearInterval(tetrisDropInterval)
    tetrisDropInterval = null
  }
}

/**
 * 继续游戏
 */
const resumeTetrisGame = () => {
  tetrisGamePaused.value = false
  tetrisDropInterval = window.setInterval(() => {
    if (!tetrisGamePaused.value) {
      movePiece(0, 1)
    }
  }, 1000 / tetrisLevel.value)
  tetrisUpdate()
}

/**
 * 结束游戏
 */
const endTetrisGame = () => {
  tetrisGameActive.value = false
  tetrisGamePaused.value = false
  tetrisGameOver.value = false
  if (tetrisGameLoop) {
    cancelAnimationFrame(tetrisGameLoop)
    tetrisGameLoop = null
  }
  if (tetrisDropInterval) {
    clearInterval(tetrisDropInterval)
    tetrisDropInterval = null
  }
  currentPiece = null
  nextPiece = null
}

/**
 * 重置游戏
 */
const resetTetrisGame = () => {
  endTetrisGame()
  initTetrisBoard()
  drawTetrisBoard()
}

/**
 * 生成新方块
 */
const spawnPiece = () => {
  // 如果有下一个方块，使用它
  if (nextPiece) {
    currentPiece = {
      shape: nextPiece.shape,
      color: nextPiece.color,
      x: Math.floor(COLS / 2) - Math.floor(nextPiece.shape[0].length / 2),
      y: 0
    }
  } else {
    // 第一次生成
    const shapeIndex = Math.floor(Math.random() * SHAPES.length)
    const color = COLORS[shapeIndex]
    currentPiece = {
      shape: SHAPES[shapeIndex],
      color: color,
      x: Math.floor(COLS / 2) - Math.floor(SHAPES[shapeIndex][0].length / 2),
      y: 0
    }
  }

  // 生成下一个方块
  const nextShapeIndex = Math.floor(Math.random() * SHAPES.length)
  nextPiece = {
    shape: SHAPES[nextShapeIndex],
    color: COLORS[nextShapeIndex]
  }
  drawNextPiece()

  if (isCollision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    tetrisGameOver.value = true
    tetrisGameActive.value = false
    if (tetrisDropInterval) {
      clearInterval(tetrisDropInterval)
      tetrisDropInterval = null
    }
  }
}

/**
 * 绘制下一个方块预览
 */
const drawNextPiece = () => {
  if (!nextPieceCtx || !nextPiece) return

  nextPieceCtx.fillStyle = '#0a0a1a'
  nextPieceCtx.fillRect(0, 0, 100, 100)

  const blockSize = 20
  const offsetX = (100 - nextPiece.shape[0].length * blockSize) / 2
  const offsetY = (100 - nextPiece.shape.length * blockSize) / 2

  for (let row = 0; row < nextPiece.shape.length; row++) {
    for (let col = 0; col < nextPiece.shape[row].length; col++) {
      if (nextPiece.shape[row][col]) {
        const x = offsetX + col * blockSize
        const y = offsetY + row * blockSize

        // 绘制方块
        nextPieceCtx.fillStyle = nextPiece.color
        nextPieceCtx.fillRect(x, y, blockSize - 2, blockSize - 2)

        // 绘制高光
        nextPieceCtx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        nextPieceCtx.fillRect(x, y, blockSize - 2, 3)
        nextPieceCtx.fillRect(x, y, 3, blockSize - 2)
      }
    }
  }
}

/**
 * 碰撞检测
 */
const isCollision = (shape: number[][], x: number, y: number) => {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col
        const newY = y + row

        if (newX < 0 || newX >= COLS || newY >= ROWS) return true
        if (newY >= 0 && board[newY][newX]) return true
      }
    }
  }
  return false
}

/**
 * 移动方块
 */
const movePiece = (dx: number, dy: number) => {
  if (!currentPiece) return

  const newX = currentPiece.x + dx
  const newY = currentPiece.y + dy

  if (!isCollision(currentPiece.shape, newX, newY)) {
    currentPiece.x = newX
    currentPiece.y = newY
  } else if (dy > 0) {
    lockPiece()
  }
}

/**
 * 旋转方块
 */
const rotatePiece = () => {
  if (!currentPiece) return

  const rotated = currentPiece.shape[0].map((_, i) =>
    currentPiece!.shape.map(row => row[i]).reverse()
  )

  if (!isCollision(rotated, currentPiece.x, currentPiece.y)) {
    currentPiece.shape = rotated
  }
}

/**
 * 锁定方块
 */
const lockPiece = () => {
  if (!currentPiece) return

  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const y = currentPiece.y + row
        const x = currentPiece.x + col
        if (y >= 0) {
          board[y][x] = COLORS.indexOf(currentPiece.color) + 1
        }
      }
    }
  }

  clearLines()
  spawnPiece()
}

/**
 * 清除完整行
 */
const clearLines = () => {
  let linesCleared = 0

  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1)
      board.unshift(Array(COLS).fill(0))
      linesCleared++
      row++
    }
  }

  if (linesCleared > 0) {
    tetrisLines.value += linesCleared
    tetrisScore.value += linesCleared * 100 * tetrisLevel.value
    tetrisLevel.value = Math.floor(tetrisLines.value / 10) + 1
  }
}

/**
 * 绘制俄罗斯方块游戏
 */
const drawTetrisBoard = () => {
  if (!tetrisCtx) return

  tetrisCtx.fillStyle = '#1a1a2e'
  tetrisCtx.fillRect(0, 0, tetrisCanvas.value!.width, tetrisCanvas.value!.height)

  // 绘制网格
  tetrisCtx.strokeStyle = '#2a2a4e'
  tetrisCtx.lineWidth = 1
  for (let i = 0; i <= COLS; i++) {
    tetrisCtx.beginPath()
    tetrisCtx.moveTo(i * BLOCK_SIZE, 0)
    tetrisCtx.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE)
    tetrisCtx.stroke()
  }
  for (let i = 0; i <= ROWS; i++) {
    tetrisCtx.beginPath()
    tetrisCtx.moveTo(0, i * BLOCK_SIZE)
    tetrisCtx.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE)
    tetrisCtx.stroke()
  }

  // 绘制已锁定的方块
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        tetrisCtx.fillStyle = COLORS[board[row][col] - 1]
        tetrisCtx.fillRect(col * BLOCK_SIZE + 1, row * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
        tetrisCtx.strokeStyle = '#fff'
        tetrisCtx.lineWidth = 2
        tetrisCtx.strokeRect(col * BLOCK_SIZE + 1, row * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
      }
    }
  }

  // 绘制当前方块
  if (currentPiece) {
    tetrisCtx.fillStyle = currentPiece.color
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const x = (currentPiece.x + col) * BLOCK_SIZE
          const y = (currentPiece.y + row) * BLOCK_SIZE
          tetrisCtx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
          tetrisCtx.strokeStyle = '#fff'
          tetrisCtx.lineWidth = 2
          tetrisCtx.strokeRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
        }
      }
    }
  }
}

/**
 * 俄罗斯方块游戏更新
 */
const tetrisUpdate = () => {
  if (!tetrisGameActive.value || tetrisGamePaused.value) return

  drawTetrisBoard()
  tetrisGameLoop = requestAnimationFrame(tetrisUpdate)
}

/**
 * 键盘控制
 */
const handleTetrisKeydown = (e: KeyboardEvent) => {
  if (!tetrisGameActive.value || tetrisGamePaused.value) return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      movePiece(-1, 0)
      break
    case 'ArrowRight':
      e.preventDefault()
      movePiece(1, 0)
      break
    case 'ArrowDown':
      e.preventDefault()
      movePiece(0, 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      rotatePiece()
      break
    case ' ':
      e.preventDefault()
      hardDrop()
      break
  }
}

/**
 * 直接落地（硬降）
 */
const hardDrop = () => {
  if (!currentPiece) return
  while (!isCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y++
  }
  lockPiece()
}

// ==================== 大鱼吃小鱼游戏 ====================
const fishCanvas = ref<HTMLCanvasElement | null>(null)
let fishCtx: CanvasRenderingContext2D | null = null
const fishScore = ref(0)
const fishSize = ref(20)
const fishGameActive = ref(false)
const fishGamePaused = ref(false)
const fishLevel = ref(1)
const fishGameWon = ref(false)
const fishLevelComplete = ref(false)
const MAX_FISH_SIZE = 100 // 增加最大尺寸限制
// 大幅增加难度：更高目标分数、更快敌人速度、更高生成率、更多敌人类型
const LEVELS = [
  { level: 1, targetScore: 300, enemySpeed: 1.5, spawnRate: 0.04, maxEnemies: 12, bigFishChance: 0.3 },
  { level: 2, targetScore: 800, enemySpeed: 2.2, spawnRate: 0.055, maxEnemies: 15, bigFishChance: 0.4 },
  { level: 3, targetScore: 1500, enemySpeed: 2.8, spawnRate: 0.07, maxEnemies: 20, bigFishChance: 0.5 },
  { level: 4, targetScore: 2500, enemySpeed: 3.5, spawnRate: 0.085, maxEnemies: 25, bigFishChance: 0.6 },
  { level: 5, targetScore: 4000, enemySpeed: 4.5, spawnRate: 0.1, maxEnemies: 30, bigFishChance: 0.7 }
]
let fishGameLoop: number | null = null
let playerFish: { x: number; y: number; size: number } | null = null
let enemyFishes: { x: number; y: number; size: number; speedX: number; speedY: number; color: string }[] = []
let mouseX = 0
let mouseY = 0

// 海洋气泡
let bubbles: { x: number; y: number; size: number; speed: number; opacity: number }[] = []

// 敌人类型定义 - 简化为三种：能吃、不能吃、炸弹
interface EnemyFish {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  emoji: string
  type: 'edible' | 'dangerous' | 'bomb'
  bombTimer?: number // 炸弹倒计时
  bombMaxTime?: number // 炸弹最大时间
}

// 可吃的鱼emoji列表
const EDIBLE_EMOJIS = ['🐟', '🐠', '🦐', '🦑', '🐡', '🦀']
// 危险的鱼emoji列表
const DANGEROUS_EMOJIS = ['🦈', '🐋', '🐊', '🦖', '🐙', '🦞']
// 炸弹emoji
const BOMB_EMOJI = '💣'

// 烟花粒子类型
interface FireworkParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

// 烟花爆炸效果数组
let fireworks: FireworkParticle[] = []

/**
 * 初始化气泡
 */
const initBubbles = () => {
  bubbles = []
  for (let i = 0; i < 15; i++) {
    bubbles.push({
      x: Math.random() * 700,
      y: Math.random() * 450,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    })
  }
}

/**
 * 更新气泡位置
 */
const updateBubbles = () => {
  bubbles.forEach(bubble => {
    bubble.y -= bubble.speed
    if (bubble.y < -10) {
      bubble.y = 460
      bubble.x = Math.random() * 700
    }
  })
}

/**
 * 绘制气泡
 */
const drawBubbles = (ctx: CanvasRenderingContext2D) => {
  bubbles.forEach(bubble => {
    ctx.beginPath()
    ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`
    ctx.fill()
    // 气泡高光
    ctx.beginPath()
    ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 1.5})`
    ctx.fill()
  })
}

/**
 * 生成礼花样式
 */
const getFireworkStyle = (n: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#00b894']
  const color = colors[n % colors.length]
  const angle = (n / 20) * Math.PI * 2
  const distance = 100 + Math.random() * 150
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance
  const left = 50 + (Math.random() - 0.5) * 60
  const top = 40 + (Math.random() - 0.5) * 40
  const delay = Math.random() * 0.5

  return {
    backgroundColor: color,
    left: `${left}%`,
    top: `${top}%`,
    '--tx': `${tx}px`,
    '--ty': `${ty}px`,
    animationDelay: `${delay}s`,
    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`
  }
}

/**
 * 创建炸弹烟花爆炸效果
 * 功能：在指定位置生成烟花粒子
 */
const createFirework = (x: number, y: number) => {
  const colors = ['#ff0000', '#ff6600', '#ffcc00', '#ff3300', '#ff9900', '#ffff00']
  const particleCount = 30

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
    const speed = 2 + Math.random() * 4
    fireworks.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
      maxLife: 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 4
    })
  }
}

/**
 * 更新烟花粒子
 * 功能：更新粒子位置、生命值，移除死亡粒子
 */
const updateFireworks = () => {
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const p = fireworks[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.1 // 重力
    p.life--

    if (p.life <= 0) {
      fireworks.splice(i, 1)
    }
  }
}

/**
 * 绘制烟花粒子
 * 功能：在画布上绘制所有活跃的烟花粒子
 */
const drawFireworks = (ctx: CanvasRenderingContext2D) => {
  fireworks.forEach(p => {
    const alpha = p.life / p.maxLife
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '')
    // 处理十六进制颜色
    const r = parseInt(p.color.slice(1, 3), 16)
    const g = parseInt(p.color.slice(3, 5), 16)
    const b = parseInt(p.color.slice(5, 7), 16)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    ctx.fill()

    // 发光效果
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha * 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`
    ctx.fill()
  })
}

/**
 * 初始化大鱼吃小鱼画布
 */
const initFishCanvas = () => {
  if (fishCanvas.value) {
    fishCtx = fishCanvas.value.getContext('2d')
    drawFishGame()
  }
}

/**
 * 开始大鱼吃小鱼游戏
 */
const startFishGame = () => {
  if (fishGameActive.value) return

  // 先重置游戏状态
  fishScore.value = 0
  fishSize.value = 20
  fishLevel.value = 1
  fishGamePaused.value = false
  fishGameWon.value = false
  fishLevelComplete.value = false
  playerFish = { x: 350, y: 225, size: 20 }
  enemyFishes = []
  mouseX = 350
  mouseY = 225

  // 初始化气泡
  initBubbles()

  // 清空画布
  drawFishGame()

  // 延迟一点再开始游戏，确保玩家准备好
  setTimeout(() => {
    fishGameActive.value = true
    fishGamePaused.value = false
    fishLevelComplete.value = false
    fishUpdate()
  }, 100)
}

/**
 * 暂停大鱼吃小鱼游戏
 */
const pauseFishGame = () => {
  if (!fishGameActive.value) return
  fishGamePaused.value = true
  // 暂停时停止游戏循环
  if (fishGameLoop) {
    cancelAnimationFrame(fishGameLoop)
    fishGameLoop = null
  }
}

/**
 * 继续大鱼吃小鱼游戏
 */
const resumeFishGame = () => {
  if (!fishGameActive.value || !fishGamePaused.value) return
  fishGamePaused.value = false
  fishUpdate()
}

/**
 * 结束大鱼吃小鱼游戏
 */
const endFishGame = () => {
  fishGameActive.value = false
  fishGamePaused.value = false
  fishGameWon.value = false
  fishLevelComplete.value = false
  if (fishGameLoop) {
    cancelAnimationFrame(fishGameLoop)
    fishGameLoop = null
  }
  fishScore.value = 0
  fishSize.value = 20
  fishLevel.value = 1
  playerFish = null
  enemyFishes = []
  drawFishGame()
}

/**
 * 进入下一关
 */
const nextLevel = () => {
  fishLevelComplete.value = false
  fishGamePaused.value = false
  isLevelUpPending = false // 重置升级标志位
  // 清空当前敌人鱼，给玩家准备时间
  enemyFishes = []
  // 继续游戏循环
  fishUpdate()
}

/**
 * 重置大鱼吃小鱼游戏（再来一局）
 */
const resetFishGame = () => {
  endFishGame()
  // 延迟后自动开始新游戏
  setTimeout(() => {
    startFishGame()
  }, 100)
}

/**
 * 绘制大鱼吃小鱼游戏
 */
const drawFishGame = () => {
  if (!fishCtx || !fishCanvas.value) return

  const ctx = fishCtx
  const width = fishCanvas.value.width
  const height = fishCanvas.value.height

  // 绘制海洋渐变背景
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, height)
  oceanGradient.addColorStop(0, '#006994') // 浅海蓝
  oceanGradient.addColorStop(0.3, '#005a7a')
  oceanGradient.addColorStop(0.6, '#003d5c')
  oceanGradient.addColorStop(1, '#001f3f') // 深海蓝
  ctx.fillStyle = oceanGradient
  ctx.fillRect(0, 0, width, height)

  // 绘制海底光线效果
  ctx.save()
  ctx.globalCompositeOperation = 'overlay'
  for (let i = 0; i < 5; i++) {
    const rayGradient = ctx.createLinearGradient(
      i * 150 + 50, 0,
      i * 150 - 50, height
    )
    rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
    rayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)')
    rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = rayGradient
    ctx.beginPath()
    ctx.moveTo(i * 150 + 30, 0)
    ctx.lineTo(i * 150 + 70, 0)
    ctx.lineTo(i * 150 + 20, height)
    ctx.lineTo(i * 150 - 20, height)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  // 绘制海底沙地
  const sandGradient = ctx.createLinearGradient(0, height - 40, 0, height)
  sandGradient.addColorStop(0, 'rgba(194, 178, 128, 0.3)')
  sandGradient.addColorStop(1, 'rgba(194, 178, 128, 0.6)')
  ctx.fillStyle = sandGradient
  ctx.fillRect(0, height - 40, width, 40)

  // 绘制气泡
  drawBubbles(ctx)

  // 绘制玩家鱼 - 使用emoji，固定大小
  if (playerFish) {
    const { x, y, size } = playerFish

    // 玩家光晕
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8)
    gradient.addColorStop(0, 'rgba(46, 204, 64, 0.4)')
    gradient.addColorStop(1, 'rgba(46, 204, 64, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2)
    ctx.fill()

    // 绘制玩家emoji - 固定大小
    ctx.font = '40px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐳', x, y)
  }

  // 绘制敌人鱼 - 使用emoji，固定大小
  enemyFishes.forEach(fish => {
    const enemy = fish as EnemyFish
    const { x, y, size, emoji, type, bombTimer, bombMaxTime } = enemy

    if (type === 'bomb') {
      // 炸弹绘制 - 带倒计时
      const countdown = bombTimer !== undefined ? Math.ceil(bombTimer / 60) : 3

      // 炸弹警告光晕
      const pulseIntensity = bombTimer !== undefined && bombMaxTime !== undefined
        ? (bombTimer / bombMaxTime) * 0.5 + 0.2
        : 0.5
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      gradient.addColorStop(0, `rgba(255, 0, 0, ${pulseIntensity})`)
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fill()

      // 绘制炸弹emoji - 固定大小
      ctx.font = '36px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, x, y)

      // 绘制倒计时数字
      ctx.font = 'bold 20px Arial'
      ctx.fillStyle = countdown <= 1 ? '#ff0000' : '#ffff00'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.strokeText(String(countdown), x, y - 15)
      ctx.fillText(String(countdown), x, y - 15)
    } else if (type === 'dangerous') {
      // 危险鱼 - 红色警告光晕
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5)
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // 绘制危险鱼emoji - 固定大小
      ctx.font = '40px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, x, y)
    } else {
      // 可吃的鱼 - 绿色光晕
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.3)
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 255, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, size * 1.3, 0, Math.PI * 2)
      ctx.fill()

      // 绘制可吃鱼emoji - 固定大小
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, x, y)
    }
  })

  // 绘制烟花效果
  drawFireworks(ctx)
}

/**
 * 获取当前关卡配置
 */
const getCurrentLevel = () => {
  return LEVELS[Math.min(fishLevel.value - 1, LEVELS.length - 1)]
}

/**
 * 检查是否升级 - 使用标志位防止重复触发
 */
let isLevelUpPending = false
const checkLevelUp = () => {
  // 如果已经有待处理的升级，直接返回
  if (isLevelUpPending) return false

  const currentLevel = getCurrentLevel()
  // 检查是否达到当前关卡目标分数，且还有下一关
  if (fishScore.value >= currentLevel.targetScore && fishLevel.value < LEVELS.length) {
    isLevelUpPending = true
    fishLevel.value++
    // 显示关卡完成界面，暂停游戏
    fishLevelComplete.value = true
    fishGamePaused.value = true
    if (fishGameLoop) {
      cancelAnimationFrame(fishGameLoop)
      fishGameLoop = null
    }
    return true
  }
  return false
}

/**
 * 检查是否获胜
 */
const checkWin = () => {
  // 达到最大尺寸且达到最后一关目标分数
  const currentLevel = getCurrentLevel()
  if (fishSize.value >= MAX_FISH_SIZE && fishScore.value >= currentLevel.targetScore) {
    fishGameWon.value = true
    fishGameActive.value = false
    if (fishGameLoop) {
      cancelAnimationFrame(fishGameLoop)
      fishGameLoop = null
    }
    return true
  }
  return false
}

/**
 * 更新大鱼吃小鱼游戏
 */
const fishUpdate = () => {
  // 如果游戏未激活或已暂停，不更新
  if (!fishGameActive.value || fishGamePaused.value || !playerFish) return

  // 检查是否获胜
  if (checkWin()) {
    return
  }

  // 更新气泡位置
  updateBubbles()

  const currentLevel = getCurrentLevel()

  // 玩家鱼跟随鼠标
  const dx = mouseX - playerFish.x
  const dy = mouseY - playerFish.y
  playerFish.x += dx * 0.05
  playerFish.y += dy * 0.05

  // 限制玩家在画布内
  playerFish.x = Math.max(playerFish.size, Math.min(fishCanvas.value!.width - playerFish.size, playerFish.x))
  playerFish.y = Math.max(playerFish.size, Math.min(fishCanvas.value!.height - playerFish.size, playerFish.y))

  // 生成敌人鱼 - 限制最大数量，根据关卡调整生成率和速度
  if (enemyFishes.length < currentLevel.maxEnemies && Math.random() < currentLevel.spawnRate && playerFish) {
    const canvasHeight = fishCanvas.value!.height
    const canvasWidth = fishCanvas.value!.width

    const fromLeft = Math.random() < 0.5

    // 决定敌人类型
    const rand = Math.random()
    let enemyType: EnemyFish['type'] = 'normal'
    let size: number
    let speedMultiplier = 1
    let color: string

    if (rand < 0.15) {
      // 15% 概率生成追踪型敌人（紫色）
      enemyType = 'chaser'
      // 20% 概率生成炸弹
      enemyType = 'bomb'
      size = 25
      speedMultiplier = 1.2
      const bombEmoji = BOMB_EMOJI
      const startX = fromLeft ? -size : canvasWidth + size

      // 随机Y位置，但避开玩家附近区域
      let y: number
      let attempts = 0
      do {
        y = Math.random() * (canvasHeight - size * 2) + size
        attempts++
      } while (attempts < 5 && Math.abs(y - playerFish.y) < 80)

      enemyFishes.push({
        x: startX,
        y: y,
        size: size,
        speedX: (fromLeft ? 1 : -1) * (Math.random() * currentLevel.enemySpeed + 0.5) * speedMultiplier,
        speedY: (Math.random() - 0.5) * 0.3,
        emoji: bombEmoji,
        type: enemyType,
        bombTimer: 180, // 3秒倒计时 (60fps * 3)
        bombMaxTime: 180
      } as EnemyFish)
    } else if (rand < currentLevel.bigFishChance + 0.2) {
      // 生成危险的鱼（不能吃）
      enemyType = 'dangerous'
      size = Math.random() * 15 + 25 // 较大的鱼
      speedMultiplier = 0.7
      const emoji = DANGEROUS_EMOJIS[Math.floor(Math.random() * DANGEROUS_EMOJIS.length)]

      const startX = fromLeft ? -size : canvasWidth + size

      let y: number
      let attempts = 0
      do {
        y = Math.random() * (canvasHeight - size * 2) + size
        attempts++
      } while (attempts < 5 && Math.abs(y - playerFish.y) < 80)

      enemyFishes.push({
        x: startX,
        y: y,
        size: size,
        speedX: (fromLeft ? 1 : -1) * (Math.random() * currentLevel.enemySpeed + 0.5) * speedMultiplier,
        speedY: (Math.random() - 0.5) * 0.3,
        emoji: emoji,
        type: enemyType
      } as EnemyFish)
    } else {
      // 生成可吃的鱼
      enemyType = 'edible'
      size = Math.random() * 12 + 10 // 较小的鱼
      const emoji = EDIBLE_EMOJIS[Math.floor(Math.random() * EDIBLE_EMOJIS.length)]

      const startX = fromLeft ? -size : canvasWidth + size

      let y: number
      let attempts = 0
      do {
        y = Math.random() * (canvasHeight - size * 2) + size
        attempts++
      } while (attempts < 5 && Math.abs(y - playerFish.y) < 80)

      enemyFishes.push({
        x: startX,
        y: y,
        size: size,
        speedX: (fromLeft ? 1 : -1) * (Math.random() * currentLevel.enemySpeed + 0.5) * speedMultiplier,
        speedY: (Math.random() - 0.5) * 0.3,
        emoji: emoji,
        type: enemyType
      } as EnemyFish)
    }
  }

  // 更新敌人鱼位置
  enemyFishes.forEach(fish => {
    const enemy = fish as EnemyFish

    // 炸弹倒计时
    if (enemy.type === 'bomb' && enemy.bombTimer !== undefined) {
      enemy.bombTimer--
      // 炸弹爆炸
      if (enemy.bombTimer <= 0) {
        // 创建烟花爆炸效果
        createFirework(enemy.x, enemy.y)

        // 检查玩家是否在爆炸范围内
        if (playerFish) {
          const dx = enemy.x - playerFish.x
          const dy = enemy.y - playerFish.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          // 爆炸范围伤害
          if (distance < enemy.size + playerFish.size + 80) {
            fishGameActive.value = false
            if (fishGameLoop) {
              cancelAnimationFrame(fishGameLoop)
              fishGameLoop = null
            }
            return
          }
        }

        // 移除炸弹
        enemyFishes.splice(enemyFishes.indexOf(fish), 1)
      }
    }

    enemy.x += enemy.speedX
    enemy.y += enemy.speedY
  })

  // 碰撞检测 - 单独处理避免在遍历时修改数组
  if (playerFish) {
    for (let i = enemyFishes.length - 1; i >= 0; i--) {
      const enemy = enemyFishes[i] as EnemyFish
      const dx = enemy.x - playerFish.x
      const dy = enemy.y - playerFish.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < enemy.size + playerFish.size) {
        if (enemy.type === 'bomb') {
          // 碰到炸弹直接游戏结束
          fishGameActive.value = false
          if (fishGameLoop) {
            cancelAnimationFrame(fishGameLoop)
            fishGameLoop = null
          }
          return
        } else if (enemy.type === 'edible') {
          // 可吃的鱼 - 直接吃掉
          fishScore.value += Math.floor(enemy.size * 2)

          // 限制最大尺寸
          if (playerFish.size < MAX_FISH_SIZE) {
            playerFish.size = Math.min(MAX_FISH_SIZE, playerFish.size + 1)
          }
          fishSize.value = Math.floor(playerFish.size)
          enemyFishes.splice(i, 1)

          // 检查升级
          checkLevelUp()

          // 再次检查是否获胜
          if (checkWin()) {
            return
          }
        } else if (enemy.type === 'dangerous') {
          // 危险的鱼 - 直接游戏结束
          fishGameActive.value = false
          if (fishGameLoop) {
            cancelAnimationFrame(fishGameLoop)
            fishGameLoop = null
          }
          return
        }
      }
    }
  }

  // 移除超出边界的鱼
  enemyFishes = enemyFishes.filter(fish => fish.x > -fish.size * 3 && fish.x < fishCanvas.value!.width + fish.size * 3)

  // 更新烟花
  updateFireworks()

  drawFishGame()
  fishGameLoop = requestAnimationFrame(fishUpdate)
}

/**
 * 大鱼吃小鱼鼠标控制
 */
const handleFishMousemove = (e: MouseEvent) => {
  if (!fishGameActive.value || fishGamePaused.value) return
  const rect = fishCanvas.value?.getBoundingClientRect()
  if (rect) {
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
}

/**
 * 鼠标进入画布
 */
const handleFishMouseEnter = () => {
  if (fishCanvas.value) {
    fishCanvas.value.style.cursor = 'none'
  }
}

/**
 * 鼠标离开画布
 */
const handleFishMouseLeave = () => {
  if (fishCanvas.value) {
    fishCanvas.value.style.cursor = 'default'
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化猜数字游戏
  initGuessNumber()
  // 初始化记忆翻牌游戏
  initMemoryGame()

  // 俄罗斯方块键盘事件
  window.addEventListener('keydown', handleTetrisKeydown)
})

onUnmounted(() => {
  // 清理定时器
  if (clickTimer) {
    clearInterval(clickTimer)
  }
  if (tetrisGameLoop) {
    cancelAnimationFrame(tetrisGameLoop)
  }
  if (tetrisDropInterval) {
    clearInterval(tetrisDropInterval)
  }
  if (fishGameLoop) {
    cancelAnimationFrame(fishGameLoop)
  }

  // 移除事件监听
  window.removeEventListener('keydown', handleTetrisKeydown)
})
</script>

<style scoped>
/* 页面容器 */
.games-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 页面标题 */
.games-header {
  text-align: center;
  margin-bottom: 40px;
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.games-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.games-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* ==================== 游戏列表视图 ==================== */

/* 分类标签 */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 10px 24px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 游戏卡片网格 - 4399风格 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px 0;
}

/* 游戏盒子卡片 */
.game-box-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.game-box-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

/* 游戏封面 */
.game-box-cover {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.game-box-icon {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.game-box-card:hover .game-box-icon {
  transform: scale(1.1);
}

/* 悬停遮罩层 */
.game-box-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-box-card:hover .game-box-overlay {
  opacity: 1;
}

.play-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.game-box-card:hover .play-btn {
  transform: translateY(0);
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* 游戏信息 */
.game-box-info {
  padding: 20px;
}

.game-box-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.game-box-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.5;
}

/* 游戏标签 */
.game-box-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.game-tag {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.1);
  color: var(--accent-color);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ==================== 游戏进行视图 ==================== */

/* 返回按钮 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.back-btn:hover {
  border-color: var(--accent-color);
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.back-icon {
  font-size: 1.2rem;
}

/* 游戏进行区域 */
.game-play-area {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 游戏进行卡片 */
.play-card {
  background: var(--card-bg);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 800px;
  animation: cardAppear 0.5s ease-out;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.play-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.play-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-icon {
  font-size: 2.2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.play-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
}

.play-stats {
  display: flex;
  gap: 10px;
}

.stat-badge {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-badge.size {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.play-desc {
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
}

/* 通用按钮样式 */
.btn-icon {
  margin-right: 6px;
}

.restart-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ==================== 猜数字游戏样式 ==================== */
.guess-play-card {
  max-width: 500px;
}

.guess-intro {
  text-align: center;
  margin-bottom: 28px;
}

.guess-number-display {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.guess-input-area {
  margin-bottom: 24px;
}

.guess-input-wrapper {
  display: flex;
  gap: 12px;
}

.guess-input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: 14px;
  font-size: 1.2rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
  text-align: center;
}

.guess-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.guess-btn {
  padding: 16px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.guess-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.guess-result-box {
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  text-align: center;
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.result-icon {
  font-size: 2.5rem;
}

.guess-result-text {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.guess-result-box.low,
.guess-result-box.high {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(245, 124, 0, 0.15) 100%);
  color: #f57c00;
}

.guess-result-box.correct {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(56, 142, 60, 0.15) 100%);
  color: #388e3c;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== 记忆翻牌游戏样式 ==================== */
.memory-play-card {
  max-width: 500px;
}

.memory-status-bar {
  margin-bottom: 24px;
}

.memory-status-text {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-size: 1rem;
}

.memory-progress {
  height: 8px;
  background: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.memory-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
  perspective: 1000px;
}

.memory-card {
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.memory-card.flipped .card-inner,
.memory-card.matched .card-inner {
  transform: rotateY(180deg);
}

.memory-card:hover .card-inner {
  transform: translateY(-4px);
}

.memory-card.flipped:hover .card-inner,
.memory-card.matched:hover .card-inner {
  transform: rotateY(180deg) translateY(-4px);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  font-size: 1.8rem;
}

.card-front {
  background: var(--bg-primary);
  border: 3px solid var(--accent-color);
  transform: rotateY(180deg);
  font-size: 2.2rem;
}

.memory-card.matched .card-front {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.2) 100%);
  border: 3px solid #4caf50;
  animation: matchPulse 0.5s ease;
}

@keyframes matchPulse {
  0%, 100% {
    transform: rotateY(180deg) scale(1);
  }
  50% {
    transform: rotateY(180deg) scale(1.15);
  }
}

.memory-win-box {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(76, 175, 80, 0.3);
}

.win-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.win-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #388e3c;
  margin-bottom: 16px;
}

/* ==================== 点击挑战游戏样式 ==================== */
.click-play-card {
  max-width: 500px;
}

.click-stats-board {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 32px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 20px;
}

.click-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.click-stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.click-stat-value {
  font-size: 2.5rem;
  font-weight: 700;
}

.click-stat-value.timer {
  color: var(--accent-color);
}

.click-stat-value.timer.warning {
  color: #f5576c;
  animation: pulse 0.5s infinite;
}

.click-stat-value.score {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.click-stat-divider {
  width: 2px;
  height: 60px;
  background: var(--border-color);
}

.click-game-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.click-main-btn {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  transition: all 0.15s ease;
  animation: clickBtnPulse 1s infinite;
}

@keyframes clickBtnPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
  }
}

.click-main-btn:active {
  transform: scale(0.92);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.click-btn-text {
  font-size: 1.8rem;
  font-weight: 700;
}

.click-btn-hint {
  font-size: 0.85rem;
  opacity: 0.9;
}

.click-idle-state {
  text-align: center;
}

.click-start-panel,
.click-result-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.click-intro {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.click-start-btn {
  padding: 18px 40px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.3);
}

.click-start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
}

.result-emoji {
  font-size: 4rem;
}

.click-result-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.click-final-score {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* ==================== 俄罗斯方块游戏样式 - 全新设计 ==================== */
.tetris-play-card {
  max-width: 750px;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 顶部信息栏 */
.tetris-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tetris-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tetris-game-icon {
  font-size: 2rem;
}

.tetris-game-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.tetris-stats-row {
  display: flex;
  gap: 16px;
}

.tetris-stat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tetris-stat-icon {
  font-size: 1.3rem;
}

.tetris-stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tetris-stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tetris-stat-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
}

.tetris-stat-num.level {
  color: #ff6b6b;
}

.tetris-stat-num.lines {
  color: #4ecdc4;
}

.tetris-pause-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.tetris-pause-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

/* 游戏主体区域 */
.tetris-game-body {
  display: flex;
  gap: 20px;
  padding: 24px;
  align-items: flex-start;
}

/* 左侧预览面板 */
.tetris-preview-panel {
  width: 120px;
  flex-shrink: 0;
}

.preview-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.preview-box {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.next-piece-canvas {
  display: block;
}

/* 中间画布区域 */
.tetris-canvas-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.tetris-canvas-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 212, 255, 0.15), inset 0 0 60px rgba(0, 0, 0, 0.5);
  border: 3px solid rgba(0, 212, 255, 0.3);
}

.tetris-canvas {
  display: block;
  background: #0a0a1a;
}

/* 遮罩层通用样式 */
.tetris-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.tetris-overlay-content {
  text-align: center;
  padding: 40px;
}

.tetris-logo {
  font-size: 5rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.tetris-overlay-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.tetris-overlay-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
}

.tetris-overlay-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.tetris-btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  justify-content: center;
}

.tetris-btn span {
  font-size: 1.2rem;
}

.tetris-btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
}

.tetris-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.5);
}

.tetris-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.tetris-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.tetris-btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.tetris-btn-danger:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
}

/* 游戏结束遮罩特殊样式 */
.tetris-gameover-overlay .tetris-logo {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.tetris-final-score {
  margin: 24px 0;
  padding: 16px 32px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.final-score-label {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.final-score-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
}

/* 右侧控制面板 */
.tetris-controls-panel {
  width: 140px;
  flex-shrink: 0;
}

.controls-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.controls-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-keys {
  display: flex;
  gap: 6px;
}

.control-key {
  padding: 6px 10px;
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.4);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #00d4ff;
  font-family: monospace;
  min-width: 28px;
  text-align: center;
}

.control-key.wide {
  padding: 6px 16px;
}

.control-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 暂停遮罩特殊样式 */
.tetris-pause-overlay .tetris-logo {
  animation: logo-pulse 2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ==================== 大鱼吃小鱼游戏样式 - 海洋主题设计 ==================== */
.fish-play-card {
  max-width: 750px;
  background: linear-gradient(180deg, #001f3f 0%, #003366 50%, #001a33 100%);
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 50, 100, 0.5), inset 0 0 80px rgba(0, 100, 150, 0.2);
  border: 2px solid rgba(0, 150, 200, 0.3);
}

/* 海洋渐变顶部栏 */
.ocean-gradient {
  background: linear-gradient(90deg, #006994 0%, #005a7a 50%, #004a6a 100%) !important;
  position: relative;
  overflow: hidden;
}

.ocean-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  right: -100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: wave-shimmer 3s ease-in-out infinite;
}

@keyframes wave-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 顶部信息栏 */
.fish-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid rgba(0, 200, 255, 0.3);
}

.fish-game-icon {
  font-size: 1.5rem;
}

.fish-game-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.fish-stats-row {
  display: flex;
  gap: 12px;
}

.fish-stat-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.fish-stat-icon {
  font-size: 1.1rem;
}

.fish-stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.fish-stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.fish-stat-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4facfe;
  font-family: 'Courier New', monospace;
}

.fish-stat-num.size {
  color: #43e97b;
}

.fish-pause-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.fish-pause-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.fish-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fish-game-icon {
  font-size: 2rem;
}

.fish-game-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.fish-stats-row {
  display: flex;
  gap: 16px;
}

.fish-stat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.fish-stat-icon {
  font-size: 1.3rem;
}

.fish-stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 游戏主体区域 */
.fish-game-body {
  display: flex;
  justify-content: center;
  padding: 16px;
}

/* 海洋开始界面 */
.ocean-start-overlay {
  background: linear-gradient(180deg, rgba(0, 105, 148, 0.98) 0%, rgba(0, 60, 90, 0.98) 100%) !important;
}

.ocean-waves {
  font-size: 5rem;
  animation: wave-float 2s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(0, 200, 255, 0.5));
  margin-bottom: 16px;
}

@keyframes wave-float {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.ocean-title {
  background: linear-gradient(90deg, #00d4ff, #7ee8fa, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem !important;
  font-weight: 800;
  letter-spacing: 3px;
  text-shadow: none !important;
  animation: title-glow 2s ease-in-out infinite;
}

@keyframes title-glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 25px rgba(0, 212, 255, 0.8)); }
}

/* 中间画布区域 */
.fish-canvas-area {
  display: flex;
  justify-content: center;
}

.fish-canvas-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(79, 172, 254, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(79, 172, 254, 0.3);
}

.fish-canvas {
  display: block;
  background: #001f3f;
  cursor: none;
  width: 600px;
  height: 350px;
}

/* 底部游戏规则栏 */
.fish-rules-bottom {
  padding: 14px 20px;
  background: linear-gradient(180deg, rgba(0, 40, 80, 0.6) 0%, rgba(0, 20, 40, 0.9) 100%);
  border-top: 2px solid rgba(0, 200, 255, 0.3);
}

.rules-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rules-icon {
  font-size: 1.2rem;
}

.rules-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 3px;
}

/* 规则行 - 四个口 */
.rules-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.rule-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-width: 100px;
}

.rule-box:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.edible-box {
  border-color: rgba(67, 233, 123, 0.3);
}

.danger-box {
  border-color: rgba(255, 107, 107, 0.3);
}

.bomb-box {
  border-color: rgba(255, 165, 2, 0.3);
}

.control-box {
  border-color: rgba(79, 172, 254, 0.3);
}

/* 分隔线行 */
.rules-dividers {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 50px;
}

.rules-dividers .rule-divider {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.5), transparent);
  max-width: 100px;
}

.rule-emoji-group {
  display: flex;
  gap: 4px;
}

.rule-emoji {
  font-size: 1.4rem;
}

.rule-emoji.bomb {
  font-size: 1.6rem;
  font-weight: bold;
}

.rule-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rule-label {
  font-size: 0.8rem;
  font-weight: 700;
}

.rule-label.green {
  color: #43e97b;
}

.rule-label.red {
  color: #ff6b6b;
}

.rule-label.orange {
  color: #ffa502;
}

.rule-label.blue {
  color: #4facfe;
}

.rule-desc {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 规则分隔符 */
.rule-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(0, 200, 255, 0.4), transparent);
}

.fish-canvas {
  display: block;
  background: #001f3f;
  cursor: none;
  width: 700px;
  height: 450px;
}

/* 遮罩层通用样式 */
.fish-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 31, 63, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.fish-overlay-content {
  text-align: center;
  padding: 40px;
}

.fish-logo {
  font-size: 5rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.fish-overlay-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.fish-overlay-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
}

.fish-overlay-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.fish-btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  justify-content: center;
}

.fish-btn span {
  font-size: 1.2rem;
}

.fish-btn-primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.fish-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.5);
}

.fish-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.fish-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.fish-btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.fish-btn-danger:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
}

/* 游戏结束遮罩特殊样式 */
.fish-gameover-overlay {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(50, 30, 30, 0.98) 100%) !important;
}

.fish-gameover-overlay .gameover-icon {
  font-size: 4rem;
  animation: skull-shake 0.8s ease-in-out;
  filter: drop-shadow(0 0 20px rgba(255, 100, 100, 0.5));
}

@keyframes skull-shake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  20% { transform: rotate(-10deg) scale(1.1); }
  40% { transform: rotate(10deg) scale(1.1); }
  60% { transform: rotate(-5deg) scale(1.05); }
  80% { transform: rotate(5deg) scale(1.05); }
}

.fish-gameover-overlay .gameover-box {
  background: rgba(255, 100, 100, 0.1);
  border-color: rgba(255, 100, 100, 0.3);
}

.fish-gameover-overlay .gameover-score {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.fish-final-score-box {
  margin: 24px 0;
  padding: 16px 32px;
  background: rgba(79, 172, 254, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(79, 172, 254, 0.3);
}

/* 暂停遮罩特殊样式 */
.fish-pause-overlay .fish-logo {
  animation: logo-pulse 2s ease-in-out infinite;
}

/* 胜利遮罩特殊样式 */
.fish-win-overlay .fish-logo {
  animation: trophy-bounce 1s ease-in-out infinite;
}

@keyframes trophy-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-15px) scale(1.1); }
}

.fish-win-overlay {
  background: linear-gradient(135deg, rgba(0, 80, 0, 0.98) 0%, rgba(0, 60, 80, 0.98) 100%) !important;
  overflow: hidden;
}

/* 礼花容器 */
.fireworks-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.firework {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: firework-explode 1.5s ease-out forwards;
}

@keyframes firework-explode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}

.fish-win-overlay .victory-icon {
  animation: trophy-glow 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
}

@keyframes trophy-glow {
  0%, 100% { 
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
  }
  50% { 
    transform: scale(1.1);
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1));
  }
}

.fish-win-overlay .victory-title {
  background: linear-gradient(90deg, #ffd700, #ffed4a, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.fish-win-overlay .victory-box {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.fish-win-overlay .victory-score {
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  font-size: 1.5rem;
}

.fish-stat-num.level {
  color: #ffd700;
}

/* 紧凑版遮罩内容 */
.fish-overlay-content.compact {
  padding: 24px;
  max-width: 320px;
}

.fish-logo.small {
  font-size: 3rem;
  margin-bottom: 8px;
}

.fish-overlay-title.small {
  font-size: 1.4rem;
  margin-bottom: 4px;
}

.fish-overlay-subtitle.small {
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.fish-final-score-box.compact {
  margin: 12px 0;
  padding: 12px 20px;
}

.fish-overlay-buttons.horizontal {
  flex-direction: row;
  gap: 12px;
}

.fish-btn.small {
  padding: 10px 20px;
  font-size: 0.95rem;
  min-width: auto;
}

/* 超小按钮 */
.fish-btn.tiny {
  padding: 8px 16px;
  font-size: 0.85rem;
  min-width: auto;
}

/* 大图标 */
.fish-logo.large {
  font-size: 4rem;
  margin-bottom: 12px;
}

/* 超小标题 */
.fish-overlay-title.tiny {
  font-size: 1.1rem;
  margin-bottom: 2px;
}

.fish-overlay-subtitle.tiny {
  font-size: 0.8rem;
  margin-bottom: 12px;
}

/* 关卡过渡遮罩 */
.fish-level-overlay {
  background: rgba(102, 126, 234, 0.95) !important;
}

.fish-level-overlay .fish-logo {
  animation: bounce-in 0.5s ease-out;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.fish-level-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.level-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.info-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffd700;
}

.info-value {
  color: #ffd700;
}

/* 右侧控制面板 */
.fish-controls-panel {
  width: 160px;
  flex-shrink: 0;
}

.fish-controls-panel .controls-title {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.fish-controls-panel .controls-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fish-controls-panel .control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.fish-controls-panel .control-icon {
  font-size: 1.5rem;
}

.fish-controls-panel .control-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .games-page {
    padding: 16px;
  }

  .games-header {
    padding: 24px 16px;
    margin-bottom: 24px;
  }

  .games-title {
    font-size: 2rem;
  }

  .games-subtitle {
    font-size: 1rem;
  }

  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .game-card {
    height: 200px;
  }

  .game-icon {
    font-size: 3rem;
  }

  .game-name {
    font-size: 1.1rem;
  }

  .play-card {
    padding: 20px;
  }

  .play-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .play-icon {
    font-size: 1.8rem;
  }

  .play-name {
    font-size: 1.3rem;
  }

  /* 猜数字响应式 */
  .guess-number-display {
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
  }

  .guess-input-wrapper {
    flex-direction: column;
  }

  /* 记忆翻牌响应式 */
  .memory-grid {
    gap: 10px;
  }

  .card-front,
  .card-back {
    font-size: 1.8rem;
  }

  /* 点击挑战响应式 */
  .click-stats-board {
    flex-direction: row;
    gap: 20px;
    padding: 16px;
  }

  .click-stat-value {
    font-size: 2rem;
  }

  .click-main-btn {
    width: 150px;
    height: 150px;
  }

  /* 俄罗斯方块响应式 */
  .tetris-play-card {
    border-radius: 16px;
  }

  .tetris-top-bar {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }

  .tetris-stats-row {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .tetris-stat-box {
    padding: 8px 12px;
  }

  .tetris-stat-num {
    font-size: 1.1rem;
  }

  .tetris-game-body {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .tetris-preview-panel,
  .tetris-controls-panel {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .preview-title,
  .controls-title {
    margin-bottom: 0;
    white-space: nowrap;
  }

  .preview-box {
    flex: 1;
    max-width: 100px;
  }

  .controls-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    flex: 1;
  }

  .control-item {
    flex-direction: row;
    padding: 8px 12px;
  }

  .tetris-canvas-wrapper {
    border-width: 2px;
  }

  .tetris-canvas {
    width: 100%;
    max-width: 280px;
    height: auto;
  }

  .tetris-overlay-content {
    padding: 24px;
  }

  .tetris-logo {
    font-size: 3.5rem;
  }

  .tetris-overlay-title {
    font-size: 1.5rem;
  }

  .tetris-btn {
    padding: 12px 24px;
    font-size: 1rem;
    min-width: 150px;
  }

  /* 大鱼吃小鱼响应式 */
  .fish-canvas {
    max-width: 100%;
    height: auto;
  }

  .fish-controls-bar {
    flex-wrap: wrap;
  }

  .fish-tips {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
