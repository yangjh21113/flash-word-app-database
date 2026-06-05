/**
 * 本地 Mock 数据（多级别词库结构）
 * 结构：分类 -> 词库 -> 季/子分类 -> 集/单元
 */

// 分类列表
const categories = [
	{ key: 'all', name: '全部' },
	{ key: 'exam', name: '考试' },
	{ key: 'tv', name: '影视' },
	{ key: 'interest', name: '兴趣' },
	{ key: 'other', name: '其他' },
]

// 词库列表（支持 series 和 category 两种类型）
const mockLibraries = [
	// === 考试类 ===
	{
		_id: 'lib_ielts',
		name: '雅思核心词汇',
		desc: '雅思考试高频核心词汇，覆盖听说读写四大场景',
		cover: '',
		category: 'exam',
		type: 'category',
		total: 3200,
		seasons: [
			{ _id: 'ielts_s1', name: '听力场景词汇', total: 800 },
			{ _id: 'ielts_s2', name: '阅读核心词汇', total: 1200 },
			{ _id: 'ielts_s3', name: '写作高频词汇', total: 600 },
			{ _id: 'ielts_s4', name: '口语话题词汇', total: 600 },
		],
	},
	{
		_id: 'lib_cet4',
		name: '大学英语四级词汇',
		desc: 'CET-4 考试大纲词汇，按词频排序',
		cover: '',
		category: 'exam',
		type: 'category',
		total: 4500,
		seasons: [
			{ _id: 'cet4_s1', name: '高频词汇 1', total: 500 },
			{ _id: 'cet4_s2', name: '高频词汇 2', total: 500 },
			{ _id: 'cet4_s3', name: '中频词汇', total: 1500 },
			{ _id: 'cet4_s4', name: '低频词汇', total: 2000 },
		],
	},
	// === 影视类 ===
	{
		_id: 'lib_tbbt',
		name: '生活大爆炸',
		desc: '美剧《生活大爆炸》场景词汇，在幽默中掌握日常口语表达',
		cover: '',
		category: 'tv',
		type: 'series',
		total: 2400,
		seasons: [
			{ _id: 'tbbt_s1', name: '第一季', total: 240, episodes: 17 },
			{ _id: 'tbbt_s2', name: '第二季', total: 320, episodes: 23 },
			{ _id: 'tbbt_s3', name: '第三季', total: 360, episodes: 23 },
			{ _id: 'tbbt_s4', name: '第四季', total: 380, episodes: 24 },
			{ _id: 'tbbt_s5', name: '第五季', total: 400, episodes: 24 },
			{ _id: 'tbbt_s6', name: '第六季', total: 420, episodes: 24 },
		],
	},
	{
		_id: 'lib_friends',
		name: '老友记',
		desc: '经典美剧《Friends》场景词汇，轻松掌握地道美式英语',
		cover: '',
		category: 'tv',
		type: 'series',
		total: 3000,
		seasons: [
			{ _id: 'friends_s1', name: '第一季', total: 280, episodes: 24 },
			{ _id: 'friends_s2', name: '第二季', total: 320, episodes: 24 },
			{ _id: 'friends_s3', name: '第三季', total: 350, episodes: 25 },
		],
	},
	{
		_id: 'lib_breaking_bad',
		name: '绝命毒师',
		desc: '美剧《Breaking Bad》场景词汇，学习紧张刺激的对话表达',
		cover: '',
		category: 'tv',
		type: 'series',
		total: 1800,
		seasons: [
			{ _id: 'bb_s1', name: '第一季', total: 200, episodes: 7 },
			{ _id: 'bb_s2', name: '第二季', total: 300, episodes: 13 },
		],
	},
	// === 兴趣类 ===
	{
		_id: 'lib_harry_potter',
		name: '哈利波特',
		desc: '《Harry Potter》系列小说词汇，在魔法世界中提升英语阅读能力',
		cover: '',
		category: 'interest',
		type: 'series',
		total: 4800,
		seasons: [
			{ _id: 'hp_b1', name: '魔法石', total: 500, episodes: 1 },
			{ _id: 'hp_b2', name: '密室', total: 600, episodes: 1 },
			{ _id: 'hp_b3', name: '阿兹卡班的囚徒', total: 700, episodes: 1 },
			{ _id: 'hp_b4', name: '火焰杯', total: 800, episodes: 1 },
		],
	},
	{
		_id: 'lib_economist',
		name: '经济学人精读',
		desc: '《The Economist》高频词汇与表达，提升商业英语阅读能力',
		cover: '',
		category: 'interest',
		type: 'category',
		total: 2000,
		seasons: [
			{ _id: 'econ_s1', name: '政治类文章', total: 500 },
			{ _id: 'econ_s2', name: '商业类文章', total: 600 },
			{ _id: 'econ_s3', name: '科技类文章', total: 500 },
			{ _id: 'econ_s4', name: '文化类文章', total: 400 },
		],
	},
	// === 其他 ===
	{
		_id: 'lib_daily',
		name: '日常口语高频词',
		desc: '日常生活中最常用的 1000 个英语高频词汇',
		cover: '',
		category: 'other',
		type: 'category',
		total: 1000,
		seasons: [
			{ _id: 'daily_s1', name: '基础词汇 Top250', total: 250 },
			{ _id: 'daily_s2', name: '进阶词汇 Top500', total: 250 },
			{ _id: 'daily_s3', name: '拓展词汇 Top750', total: 250 },
			{ _id: 'daily_s4', name: '挑战词汇 Top1000', total: 250 },
		],
	},
]

// 剧集/单元列表（用于第三级页面）
const mockEpisodes = {
	// 生活大爆炸 各季的剧集
	tbbt_s1: [
		{ _id: 'tbbt_s1e01', name: 'E01 试播集', total: 14 },
		{ _id: 'tbbt_s1e02', name: 'E02 大鱼 hypothesis', total: 15 },
		{ _id: 'tbbt_s1e03', name: 'E03  tangent 偏转', total: 13 },
		{ _id: 'tbbt_s1e04', name: 'E04  luminous fish', total: 16 },
	],
	tbbt_s2: [
		{ _id: 'tbbt_s2e01', name: 'E01 坏肉', total: 15 },
		{ _id: 'tbbt_s2e02', name: 'E02 饼干与酷', total: 14 },
		{ _id: 'tbbt_s2e03', name: 'E03  barbarian', total: 13 },
		{ _id: 'tbbt_s2e04', name: 'E04 Griffin 等效', total: 16 },
		{ _id: 'tbbt_s2e05', name: 'E05 欧几里得', total: 12 },
		{ _id: 'tbbt_s2e06', name: 'E06 Cooper-Nowitzki', total: 14 },
	],
	tbbt_s3: [
		{ _id: 'tbbt_s3e01', name: 'E01 电机器人', total: 16 },
		{ _id: 'tbbt_s3e02', name: 'E02 嫉妒', total: 15 },
		{ _id: 'tbbt_s3e03', name: 'E03  Goth 女孩', total: 14 },
	],
	tbbt_s4: [
		{ _id: 'tbbt_s4e01', name: 'E01 机器人', total: 16 },
		{ _id: 'tbbt_s4e02', name: 'E02 蟑螂', total: 15 },
	],
	tbbt_s5: [
		{ _id: 'tbbt_s5e01', name: 'E01  Skank  reflex', total: 16 },
		{ _id: 'tbbt_s5e02', name: 'E02 清洁', total: 15 },
	],
	tbbt_s6: [
		{ _id: 'tbbt_s6e01', name: 'E01 日期', total: 16 },
		{ _id: 'tbbt_s6e02', name: 'E02 分解', total: 15 },
	],
	// 老友记 各季的剧集
	friends_s1: [
		{ _id: 'friends_s1e01', name: 'E01 Pilot', total: 12 },
		{ _id: 'friends_s1e02', name: 'E02 The One with Sonogram', total: 11 },
		{ _id: 'friends_s1e03', name: 'E03 The One with Thumb', total: 13 },
		{ _id: 'friends_s1e04', name: 'E04 George Stephanopoulos', total: 12 },
	],
	friends_s2: [
		{ _id: 'friends_s2e01', name: 'E01 The One with Ross New Girlfriend', total: 13 },
		{ _id: 'friends_s2e02', name: 'E02 The One with Breast', total: 12 },
	],
	friends_s3: [
		{ _id: 'friends_s3e01', name: 'E01 The One with Princess Leia', total: 14 },
	],
	// 绝命毒师
	bb_s1: [
		{ _id: 'bb_s1e01', name: 'E01 Pilot', total: 28 },
		{ _id: 'bb_s1e02', name: 'E02 Cat in the Bag', total: 25 },
		{ _id: 'bb_s1e03', name: 'E03 And the Bag\'s in the River', total: 30 },
	],
	bb_s2: [
		{ _id: 'bb_s2e01', name: 'E01 Seven Thirty-Seven', total: 23 },
		{ _id: 'bb_s2e02', name: 'E02 Grilled', total: 25 },
	],
}

// 单词数据
const mockWords = [
	// 雅思 - 听力场景
	{ library_id: 'ielts_s1', word: 'accommodation', phonetic_us: '/əˌkɑməˈdeɪʃn/', phonetic_uk: '/əˌkɒməˈdeɪʃn/', pos: ['n.'], meaning: { zh: 'n. 住宿、膳宿', en: 'n. a place to stay' }, roots: { note: '基础词汇' }, examples: [{ en: 'Student accommodation is available near campus.', zh: '校园附近有学生住宿。' }], tags: ['IELTS', 'Listening'], sort: 1 },
	{ library_id: 'ielts_s1', word: 'appointment', phonetic_us: '/əˈpɔɪntmənt/', phonetic_uk: '/əˈpɔɪntmənt/', pos: ['n.'], meaning: { zh: 'n. 约会、预约', en: 'n. a scheduled meeting' }, roots: { note: '基础词汇' }, examples: [{ en: 'I have an appointment with the doctor.', zh: '我和医生有个预约。' }], tags: ['IELTS', 'Listening'], sort: 2 },
	{ library_id: 'ielts_s1', word: 'budget', phonetic_us: '/ˈbʌdʒɪt/', phonetic_uk: '/ˈbʌdʒɪt/', pos: ['n.', 'adj.'], meaning: { zh: 'n. 预算 adj. 便宜的', en: 'n. a plan for spending' }, roots: { note: '基础词汇' }, examples: [{ en: 'We need to stick to our budget.', zh: '我们需要遵守预算。' }], tags: ['IELTS', 'Listening'], sort: 3 },
	{ library_id: 'ielts_s1', word: 'reservation', phonetic_us: '/ˌrezərˈveɪʃn/', phonetic_uk: '/ˌrezəˈveɪʃn/', pos: ['n.'], meaning: { zh: 'n. 预订、预约', en: 'n. the action of booking' }, roots: { note: 're-: 回 · serv: 保留' }, examples: [{ en: 'I made a reservation at the restaurant.', zh: '我在餐厅预订了位子。' }], tags: ['IELTS', 'Listening'], sort: 4 },
	{ library_id: 'ielts_s1', word: 'deposit', phonetic_us: '/dɪpɑːzɪt/', phonetic_uk: '/dɪˈpɒzɪt/', pos: ['n.', 'v.'], meaning: { zh: 'n. 押金 v. 存放', en: 'n. a sum placed as security' }, roots: { note: 'de-: 下 · posit: 放置' }, examples: [{ en: 'You need to pay a deposit.', zh: '你需要交押金。' }], tags: ['IELTS', 'Listening'], sort: 5 },
	{ library_id: 'ielts_s1', word: 'facility', phonetic_us: '/fəˈsɪləti/', phonetic_uk: '/fəˈsɪləti/', pos: ['n.'], meaning: { zh: 'n. 设施、设备', en: 'n. a place or equipment for a purpose' }, roots: { note: '基础词汇' }, examples: [{ en: 'The gym has excellent facilities.', zh: '健身房设施很好。' }], tags: ['IELTS', 'Listening'], sort: 6 },
	{ library_id: 'ielts_s1', word: 'enrollment', phonetic_us: '/ɪnˈrolmənt/', phonetic_uk: '/nˈrəʊlmənt/', pos: ['n.'], meaning: { zh: 'n. 注册、入学', en: 'n. the act of enrolling' }, roots: { note: 'en-: 进入 · roll: 名册' }, examples: [{ en: 'Enrollment opens next month.', zh: '注册下月开放。' }], tags: ['IELTS', 'Listening'], sort: 7 },
	{ library_id: 'ielts_s1', word: 'orientation', phonetic_us: '/ˌɔːriənˈteɪʃn/', phonetic_uk: '/ˌɔːriənˈteɪʃn/', pos: ['n.'], meaning: { zh: 'n. 方向、迎新', en: 'n. introduction to a new environment' }, roots: { note: 'orient: 东方' }, examples: [{ en: 'New student orientation is on Monday.', zh: '新生迎新在周一。' }], tags: ['IELTS', 'Listening'], sort: 8 },
	// 生活大爆炸
	{ library_id: 'tbbt_s2e01', word: 'yogurt', phonetic_us: '/ˈjoʊɡərt/', phonetic_uk: '', pos: ['n.'], meaning: { zh: 'n. 酸奶、酸乳酪', en: 'n. a semi-solid sourish food prepared from milk' }, roots: { note: '基础词汇' }, examples: [{ en: 'I eat a cup of yogurt for breakfast.', zh: '我早餐吃一杯酸奶。' }], tags: ['S2', 'E1'], sort: 1 },
	{ library_id: 'tbbt_s2e01', word: 'yoga', phonetic_us: '/ˈjoʊɡə/', phonetic_uk: '', pos: ['n.'], meaning: { zh: 'n. 瑜伽', en: 'n. a spiritual and ascetic discipline' }, roots: { note: '基础词汇' }, examples: [{ en: 'She does yoga every morning.', zh: '她每天做瑜伽。' }], tags: ['S2', 'E1'], sort: 2 },
	{ library_id: 'tbbt_s2e01', word: 'pivot', phonetic_us: '/ˈpɪvət/', phonetic_uk: '', pos: ['n.', 'v.'], meaning: { zh: 'n. 枢轴 v. 以...为中心', en: 'n. central point; v. turn on' }, roots: { note: '基础词汇' }, examples: [{ en: 'Ross is the pivot of the group.', zh: 'Ross 是核心人物。' }], tags: ['S2', 'E1'], sort: 3 },
	{ library_id: 'tbbt_s2e01', word: 'sarcastic', phonetic_us: '/sɑːrˈkæstɪk/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 讽刺的', en: 'adj. mocking' }, roots: { note: '基础词汇' }, examples: [{ en: 'Chandler is always sarcastic.', zh: 'Chandler 总是很讽刺。' }], tags: ['S2', 'E1'], sort: 4 },
	{ library_id: 'tbbt_s2e01', word: 'obsessed', phonetic_us: '/əbˈsest/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 着迷的', en: 'adj. unable to stop thinking about' }, roots: { note: '基础词汇' }, examples: [{ en: 'Monica is obsessed with cleaning.', zh: 'Monica 对清洁很着迷。' }], tags: ['S2', 'E1'], sort: 5 },
	{ library_id: 'tbbt_s2e01', word: 'awkward', phonetic_us: '/ˈɔːkwərd/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 尴尬的', en: 'adj. causing difficulty' }, roots: { note: '基础词汇' }, examples: [{ en: 'That was an awkward silence.', zh: '一段尴尬的沉默。' }], tags: ['S2', 'E1'], sort: 6 },
	{ library_id: 'tbbt_s2e01', word: 'deliberately', phonetic_us: '/dɪˈlɪbərətli/', phonetic_uk: '', pos: ['adv.'], meaning: { zh: 'adv. 故意地', en: 'adv. on purpose' }, roots: { note: '基础词汇' }, examples: [{ en: 'He deliberately ignored her.', zh: '他故意无视她。' }], tags: ['S2', 'E1'], sort: 7 },
	{ library_id: 'tbbt_s2e01', word: 'inevitable', phonetic_us: '/ɪnˈevɪtəbl/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 不可避免的', en: 'adj. certain to happen' }, roots: { note: 'in-: 不 · evitable: 避免的' }, examples: [{ en: 'Change is inevitable.', zh: '改变是不可避免的。' }], tags: ['S2', 'E1'], sort: 8 },
	{ library_id: 'tbbt_s2e01', word: 'hypothesis', phonetic_us: '/haɪˈpɑθəsɪs/', phonetic_uk: '/haɪˈpɒθəsɪs/', pos: ['n.'], meaning: { zh: 'n. 假设、假说', en: 'n. a proposed explanation' }, roots: { note: 'hypo-: 下面 · thesis: 论点' }, examples: [{ en: 'The big bang hypothesis.', zh: '大爆炸假说。' }], tags: ['S2', 'E1'], sort: 9 },
	{ library_id: 'tbbt_s2e01', word: 'quintessence', phonetic_us: '/kwɪnˈtesns/', phonetic_uk: '/kwɪnˈtesns/', pos: ['n.'], meaning: { zh: 'n. 精髓、典范', en: 'n. the most perfect example' }, roots: { note: 'quint-: 五 · essence: 本质' }, examples: [{ en: 'She is the quintessence of elegance.', zh: '她是优雅的典范。' }], tags: ['S2', 'E1'], sort: 10 },
]

// 封面色块颜色映射（用不同颜色区分不同词库）
const coverColors = {
	lib_ielts: '#EBF0FF',
	lib_cet4: '#ECF9EC',
	lib_tbbt: '#EBEDFA',
	lib_friends: '#FFF0E6',
	lib_breaking_bad: '#F0F0F0',
	lib_harry_potter: '#F3EBFF',
	lib_economist: '#FFECEC',
	lib_daily: '#FFF5E0',
}

// 封面文字颜色（深色版本，配合浅色背景）
const coverTextColors = {
	lib_ielts: '#4A6BD9',
	lib_cet4: '#4A9A4A',
	lib_tbbt: '#6380e8',
	lib_friends: '#C97A3A',
	lib_breaking_bad: '#666666',
	lib_harry_potter: '#8B5CF6',
	lib_economist: '#D94A4A',
	lib_daily: '#C99A2A',
}

export function getCategories() {
	return categories
}

export function getMockLibraryList(category = 'all') {
	return new Promise(resolve => {
		setTimeout(() => {
			const list = category === 'all'
				? mockLibraries
				: mockLibraries.filter(lib => lib.category === category)
			resolve({ list, total: list.length, page: 1, pageSize: 50 })
		}, 300)
	})
}

export function getMockLibraryDetail(libraryId) {
	return new Promise(resolve => {
		setTimeout(() => {
			const lib = mockLibraries.find(l => l._id === libraryId)
			if (lib) {
				resolve({ data: lib })
			} else {
				reject(new Error('Library not found'))
			}
		}, 300)
	})
}

export function getMockEpisodes(seasonId) {
	return new Promise(resolve => {
		setTimeout(() => {
			const episodes = mockEpisodes[seasonId] || []
			resolve({ list: episodes, total: episodes.length })
		}, 300)
	})
}

export function getMockWordList(libraryId) {
	return new Promise(resolve => {
		setTimeout(() => {
			const words = mockWords.filter(w => w.library_id === libraryId)
			resolve({ list: words, total: words.length, page: 1, pageSize: 50 })
		}, 300)
	})
}

export function getCoverColor(libraryId) {
	return coverColors[libraryId] || '#F0F0F0'
}

export function getCoverTextColor(libraryId) {
	return coverTextColors[libraryId] || '#666666'
}
