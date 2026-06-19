# MatchTree

Vue 3 足球淘汰赛对阵树源码组件，适合展示 16 强到决赛的杯赛晋级路径。


## 效果图

![MatchTree 效果图](docs/images/match-tree-preview.png)

## 源码集成

把下面文件复制到目标项目中，建议保持目录结构不变：

```text
src/components/BracketMatch.vue
src/components/FinalCard.vue
src/components/MatchPickerModal.vue
src/components/TeamBadge.vue
src/components/TournamentBracket.vue
src/data/createBracketData.js
src/data/sampleBracketData.js
src/styles.css
```

如果目标项目想统一从一个入口导入，也可以一并复制：

```text
src/index.js
```

目标项目需要已经安装 Vue 3。

## 基础用法

假设你把组件复制到目标项目的 `src/vendor/match-tree/`：

```vue
<script setup>
import { TournamentBracket, createBracketData } from '@/vendor/match-tree';
import '@/vendor/match-tree/styles.css';

const bracketData = createBracketData();
</script>

<template>
  <TournamentBracket :data="bracketData" />
</template>
```

也可以直接引用组件文件：

```vue
<script setup>
import TournamentBracket from '@/vendor/match-tree/components/TournamentBracket.vue';
import { createBracketData } from '@/vendor/match-tree/data/createBracketData';
import '@/vendor/match-tree/styles.css';

const bracketData = createBracketData();
</script>

<template>
  <TournamentBracket :data="bracketData" />
</template>
```

## 传入自定义数据

```vue
<script setup>
import TournamentBracket from '@/vendor/match-tree/components/TournamentBracket.vue';
import '@/vendor/match-tree/styles.css';

const data = {
  teams: {
    home: {
      name: '主队',
      short: 'HOM',
      colors: ['#15376f', '#ffffff'],
    },
    away: {
      name: '客队',
      short: 'AWY',
      colors: ['#d81f32', '#ffffff'],
    },
  },
  matches: [
    {
      id: 'match-1',
      phase: '上半区',
      round: '1/8 决赛',
      x: 5,
      y: 18,
      width: 96,
      teamIds: ['home', 'away'],
      scores: ['2-1', '1-1'],
      winnerId: 'home',
    },
  ],
  finalMatch: {
    id: 'final',
    date: '05/31',
    title: '决赛',
    homeLabel: '第1场半决赛胜者',
    awayLabel: '第2场半决赛胜者',
  },
};
</script>

<template>
  <TournamentBracket
    :data="data"
    title="杯赛对阵"
    subtitle="2026 赛季"
    @select-match="(match) => console.log(match)"
  />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Object` | 内置示例数据 | 完整对阵数据，包含 `teams`、`matches`、`finalMatch` |
| `teams` | `Object` | `null` | 单独覆盖球队字典 |
| `matches` | `Array` | `null` | 单独覆盖比赛节点列表 |
| `finalMatch` | `Object` | `null` | 单独覆盖决赛卡片 |
| `title` | `String` | `淘汰赛对阵` | 头部标题 |
| `subtitle` | `String` | `2025 冠军杯` | 头部副标题 |
| `showHeader` | `Boolean` | `true` | 是否显示头部 |
| `interactive` | `Boolean` | `true` | 是否允许点击比赛节点 |
| `modalEnabled` | `Boolean` | `true` | 点击后是否显示赛事选择弹窗 |

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `select-match` | `match` | 点击比赛节点时触发 |

## 数据结构

### Team

```js
{
  name: '巴黎圣曼',
  short: 'PSG',
  colors: ['#15376f', '#e31d3b'],
}
```

### Match

```js
{
  id: 'top-1',
  phase: '上半区',
  round: '1/8 决赛',
  x: 5,
  y: 18,
  width: 96,
  teamIds: ['psg', 'chelsea'],
  scores: ['5-2', '3-0'],
  winnerId: 'psg',
  wideTeams: false,
  featured: false,
}
```

`x`、`y`、`width` 控制节点在对阵图中的位置和宽度。当前组件主要面向固定 16 队淘汰赛布局，如果要支持 8 队、32 队或自动布局，建议先在业务侧生成对应节点坐标。

## 导出内容

如果复制了 `src/index.js`，可以这样统一导入：

```js
import {
  TournamentBracket,
  createBracketData,
  sampleBracketData,
  teams,
  matches,
  finalMatch,
} from '@/vendor/match-tree';
```

`createBracketData()` 会返回一份内置示例数据的深拷贝，适合作为业务数据模板。

## 本地预览

```bash
npm install
npm run dev
```