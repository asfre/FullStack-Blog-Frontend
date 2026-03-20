<template>
  <!-- 纯前端休闲小游戏组件 -->
  <div class="mini-games-section">
    <div class="section-header">
      <h3 class="section-title">
        <span class="title-icon">🎮</span>
        休闲小游戏
      </h3>
    </div>

    <div class="games-grid">
      <!-- 猜数字游戏 -->
      <div class="game-card" :class="{ 'active': activeGame === 'guessNumber' }">
        <div class="game-header" @click="toggleGame('guessNumber')">
          <span class="game-icon">🔢</span>
          <span class="game-name">猜数字</span>
          <el-icon class="expand-icon"><ArrowDown /></el-icon>
        </div>
        <div v-if="activeGame === 'guessNumber'" class="game-content">
          <p class="game-desc">我想了一个 1-100 的数字，你来猜！</p>
          <div class="guess-area">
            <input
              v-model.number="guessNumberInput"
              type="number"
              min="1"
              max="100"
              placeholder="输入数字"
              class="guess-input"
              @keyup.enter="makeGuess"
            >
            <button class="guess-btn" @click="makeGuess">猜测</button>
          </div>
          <p v-if="guessResult" class="guess-result" :class="guessResultType">
            {{ guessResult }}
          </p>
          <p class="guess-count">已猜次数: {{ guessCount }}</p>
          <button v-if="guessResultType === 'correct'" class="restart-btn" @click="initGuessNumber">
            再玩一次
          </button>
        </div>
      </div>

      <!-- 记忆翻牌游戏 -->
      <div class="game-card" :class="{ 'active': activeGame === 'memory' }">
        <div class="game-header" @click="toggleGame('memory')">
          <span class="game-icon">🧠</span>
          <span class="game-name">记忆翻牌</span>
          <el-icon class="expand-icon"><ArrowDown /></el-icon>
        </div>
        <div v-if="activeGame === 'memory'" class="game-content">
          <p class="game-desc">找出相同的 emoji 配对！</p>
          <div class="memory-grid">
            <div
              v-for="(card, index) in memoryCards"
              :key="index"
              class="memory-card"
              :class="{ 'flipped': card.flipped || card.matched, 'matched': card.matched }"
              @click="flipCard(index)"
            >
              <span class="card-front">{{ card.emoji }}</span>
              <span class="card-back">?</span>
            </div>
          </div>
          <p class="game-status">{{ memoryStatus }}</p>
          <p class="move-count">步数: {{ memoryMoves }}</p>
          <button v-if="memoryWon" class="restart-btn" @click="initMemoryGame">
            再玩一次
          </button>
        </div>
      </div>

      <!-- 点击挑战游戏 -->
      <div class="game-card" :class="{ 'active': activeGame === 'clickChallenge' }">
        <div class="game-header" @click="toggleGame('clickChallenge')">
          <span class="game-icon">👆</span>
          <span class="game-name">点击挑战</span>
          <el-icon class="expand-icon"><ArrowDown /></el-icon>
        </div>
        <div v-if="activeGame === 'clickChallenge'" class="game-content">
          <p class="game-desc">10秒内尽可能多地点击按钮！</p>
          <div class="click-area">
            <div class="timer-display">{{ clickTimeLeft }}s</div>
            <div class="score-display">{{ clickScore }} 次</div>
            <button
              class="click-btn"
              :class="{ 'disabled': !clickGameActive }"
              @click="handleClick"
              :disabled="!clickGameActive"
            >
              {{ clickGameActive ? '点我！' : (clickScore > 0 ? '游戏结束' : '开始游戏') }}
            </button>
            <button
              v-if="!clickGameActive && clickScore === 0"
              class="start-game-btn"
              @click="startClickGame"
            >
              开始
            </button>
            <button
              v-if="!clickGameActive && clickScore > 0"
              class="restart-btn"
              @click="startClickGame"
            >
              再玩一次
            </button>
          </div>
          <p v-if="clickResult" class="click-result">{{ clickResult }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

type GameType = 'guessNumber' | 'memory' | 'clickChallenge' | null

const activeGame = ref<GameType>(null)

// 切换游戏
const toggleGame = (game: GameType) => {
  activeGame.value = activeGame.value === game ? null : game
}

// ========== 猜数字游戏 ==========
const targetNumber = ref(0)
const guessNumberInput = ref<number | null>(null)
const guessResult = ref('')
const guessResultType = ref('')
const guessCount = ref(0)

const initGuessNumber = () => {
  targetNumber.value = Math.floor(Math.random() * 100) + 1
  guessNumberInput.value = null
  guessResult.value = ''
  guessResultType.value = ''
  guessCount.value = 0
}

const makeGuess = () => {
  if (!guessNumberInput.value) return

  guessCount.value++
  const guess = guessNumberInput.value

  if (guess < targetNumber.value) {
    guessResult.value = '太小了！再大一点 👆'
    guessResultType.value = 'low'
  } else if (guess > targetNumber.value) {
    guessResult.value = '太大了！再小一点 👇'
    guessResultType.value = 'high'
  } else {
    guessResult.value = `🎉 恭喜你猜对了！答案就是 ${targetNumber.value}`
    guessResultType.value = 'correct'
  }
}

// 初始化猜数字游戏
initGuessNumber()

// ========== 记忆翻牌游戏 ==========
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊']
const memoryCards = ref<Array<{ emoji: string; flipped: boolean; matched: boolean }>>([])
const flippedCards = ref<number[]>([])
const memoryMoves = ref(0)
const memoryWon = ref(false)
const memoryStatus = ref('找出所有配对！')

const initMemoryGame = () => {
  const cards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map(emoji => ({ emoji, flipped: false, matched: false }))
  memoryCards.value = cards
  flippedCards.value = []
  memoryMoves.value = 0
  memoryWon.value = false
  memoryStatus.value = '找出所有配对！'
}

const flipCard = (index: number) => {
  const card = memoryCards.value[index]
  if (card.flipped || card.matched || flippedCards.value.length >= 2) return

  card.flipped = true
  flippedCards.value.push(index)

  if (flippedCards.value.length === 2) {
    memoryMoves.value++
    const [first, second] = flippedCards.value

    if (memoryCards.value[first].emoji === memoryCards.value[second].emoji) {
      memoryCards.value[first].matched = true
      memoryCards.value[second].matched = true
      flippedCards.value = []

      // 检查是否获胜
      if (memoryCards.value.every(c => c.matched)) {
        memoryWon.value = true
        memoryStatus.value = '🎉 恭喜你完成挑战！'
      }
    } else {
      setTimeout(() => {
        memoryCards.value[first].flipped = false
        memoryCards.value[second].flipped = false
        flippedCards.value = []
      }, 1000)
    }
  }
}

// 初始化记忆游戏
initMemoryGame()

// ========== 点击挑战游戏 ==========
const clickScore = ref(0)
const clickTimeLeft = ref(10)
const clickGameActive = ref(false)
const clickResult = ref('')
let clickTimer: ReturnType<typeof setInterval> | null = null

const startClickGame = () => {
  clickScore.value = 0
  clickTimeLeft.value = 10
  clickGameActive.value = true
  clickResult.value = ''

  clickTimer = setInterval(() => {
    clickTimeLeft.value--
    if (clickTimeLeft.value <= 0) {
      endClickGame()
    }
  }, 1000)
}

const handleClick = () => {
  if (!clickGameActive.value) return
  clickScore.value++
}

const endClickGame = () => {
  if (clickTimer) {
    clearInterval(clickTimer)
    clickTimer = null
  }
  clickGameActive.value = false

  // 评价
  if (clickScore.value >= 80) {
    clickResult.value = `🏆 神级手速！${clickScore.value} 次点击！`
  } else if (clickScore.value >= 50) {
    clickResult.value = `⭐ 高手！${clickScore.value} 次点击！`
  } else if (clickScore.value >= 30) {
    clickResult.value = `👍 不错！${clickScore.value} 次点击！`
  } else {
    clickResult.value = `💪 继续加油！${clickScore.value} 次点击！`
  }
}
</script>

<style scoped>
.mini-games-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.title-icon {
  font-size: 20px;
}

/* 游戏卡片 */
.games-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-card {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.game-card.active {
  border-color: #667eea;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-header:hover {
  background: #f3f4f6;
}

.game-icon {
  font-size: 20px;
}

.game-name {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.expand-icon {
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.game-card.active .expand-icon {
  transform: rotate(180deg);
}

/* 游戏内容 */
.game-content {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.game-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

/* 猜数字游戏 */
.guess-area {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.guess-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.guess-input:focus {
  border-color: #667eea;
}

.guess-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guess-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.guess-result {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 8px;
}

.guess-result.low {
  background: #fef3c7;
  color: #92400e;
}

.guess-result.high {
  background: #fee2e2;
  color: #991b1b;
}

.guess-result.correct {
  background: #d1fae5;
  color: #065f46;
}

.guess-count {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 记忆翻牌游戏 */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.memory-card {
  aspect-ratio: 1;
  background: #667eea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  transform-style: preserve-3d;
}

.memory-card:hover:not(.flipped):not(.matched) {
  transform: scale(1.05);
}

.memory-card.flipped,
.memory-card.matched {
  background: #e0e7ff;
  transform: rotateY(180deg);
}

.memory-card.matched {
  background: #d1fae5;
}

.card-front,
.card-back {
  position: absolute;
  font-size: 28px;
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}

.card-back {
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.game-status {
  font-size: 14px;
  color: #374151;
  margin: 0 0 8px 0;
}

.move-count {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 点击挑战游戏 */
.click-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.timer-display {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
}

.score-display {
  font-size: 18px;
  color: #374151;
}

.click-btn {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.click-btn:active:not(.disabled) {
  transform: scale(0.95);
}

.click-btn.disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
}

.start-game-btn,
.restart-btn {
  padding: 10px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-game-btn:hover,
.restart-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.click-result {
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
  margin: 0;
}
</style>
