const teams = {
  psg: {
    name: '巴黎圣曼',
    short: 'PSG',
    logo: 'https://crests.football-data.org/524.png',
  },
  chelsea: {
    name: '切尔西',
    short: 'CHE',
    logo: 'https://crests.football-data.org/61.png',
  },
  gala: {
    name: '加拉塔萨',
    short: 'GAL',
    logo: 'https://crests.football-data.org/610.png',
  },
  liverpool: {
    name: '利物浦',
    short: 'LIV',
    logo: 'https://crests.football-data.org/64.png',
  },
  madrid: {
    name: '皇马',
    short: 'RMA',
    logo: 'https://crests.football-data.org/86.png',
  },
  city: {
    name: '曼城',
    short: 'MCI',
    logo: 'https://crests.football-data.org/65.png',
  },
  atalanta: {
    name: '亚特兰大',
    short: 'ATA',
    logo: 'https://crests.football-data.org/102.png',
  },
  bayern: {
    name: '拜仁',
    short: 'BAY',
    logo: 'https://crests.football-data.org/5.png',
  },
  atletico: {
    name: '马竞',
    short: 'ATM',
    logo: 'https://crests.football-data.org/78.png',
  },
  arsenal: {
    name: '阿森纳',
    short: 'ARS',
    logo: 'https://crests.football-data.org/57.png',
  },
  barca: {
    name: '巴塞罗那',
    short: 'BAR',
    logo: 'https://crests.football-data.org/81.png',
  },
  newcastle: {
    name: '纽卡斯尔',
    short: 'NEW',
    logo: 'https://crests.football-data.org/67.png',
  },
  sporting: {
    name: '里斯本',
    short: 'SCP',
    logo: 'https://crests.football-data.org/498.png',
  },
  bodo: {
    name: '博德闪耀',
    short: 'BOD',
    logo: 'https://crests.football-data.org/2011.png',
  },
  feyenoord: {
    name: '费耶诺德',
    short: 'FEY',
    logo: 'https://crests.football-data.org/675.png',
  },
  hotspur: {
    name: '热刺',
    short: 'TOT',
    logo: 'https://crests.football-data.org/73.png',
  },
};

const matches = {
  top1: {
    teamIds: ['psg', 'chelsea'],
    scores: ['5-2', '3-0'],
    winnerId: 'psg',
  },
  top2: {
    teamIds: ['gala', 'liverpool'],
    scores: ['1-0', '0-4'],
    winnerId: 'liverpool',
  },
  top3: {
    teamIds: ['madrid', 'city'],
    scores: ['3-0', '2-1'],
    winnerId: 'madrid',
  },
  top4: {
    teamIds: ['atalanta', 'bayern'],
    scores: ['1-6', '1-4'],
    winnerId: 'bayern',
  },
  topQuarter1: {
    teamIds: ['psg', 'liverpool'],
    scores: ['2-0', '2-0'],
    winnerId: 'psg',
  },
  topQuarter2: {
    teamIds: ['madrid', 'bayern'],
    scores: ['1-2', '3-4'],
    winnerId: 'bayern',
  },
  topSemi: {
    teamIds: ['psg', 'bayern'],
    scores: ['5-4', '05/07'],
    winnerId: 'psg',
  },
  bottomSemi: {
    teamIds: ['atletico', 'arsenal'],
    scores: ['1-1', '05/06'],
    winnerId: null,
  },
  bottomQuarter1: {
    teamIds: ['barca', 'atletico'],
    scores: ['0-2', '2-1'],
    winnerId: 'atletico',
  },
  bottomQuarter2: {
    teamIds: ['sporting', 'arsenal'],
    scores: ['0-1', '0-0'],
    winnerId: 'arsenal',
  },
  bottom1: {
    teamIds: ['newcastle', 'barca'],
    scores: ['1-1', '2-7'],
    winnerId: 'barca',
  },
  bottom2: {
    teamIds: ['atletico', 'hotspur'],
    scores: ['5-2', '2-3'],
    winnerId: 'atletico',
  },
  bottom3: {
    teamIds: ['bodo', 'sporting'],
    scores: ['3-0', '0-3'],
    winnerId: 'sporting',
  },
  bottom4: {
    teamIds: ['feyenoord', 'arsenal'],
    scores: ['1-1', '0-2'],
    winnerId: 'arsenal',
  },
};

const finalMatch = {
  date: '05/31',
  title: '决赛',
  homeLabel: '第1场半决赛胜者',
  awayLabel: '第2场半决赛胜者',
};

export const sampleBracketData = {
  teams,
  matches,
  finalMatch,
};

export { finalMatch, matches, teams };
