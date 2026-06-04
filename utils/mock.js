/**
 * 本地 Mock 数据（云端额度耗尽时使用）
 */

const mockLibraries = [
	{ _id: 'lib_tbbt_s2_ep1', name: '生活大爆炸 S2E1', desc: '生活大爆炸第2季第1集', total: 47, sort: 201 },
	{ _id: 'lib_tbbt_s2_ep2', name: '生活大爆炸 S2E2', desc: '生活大爆炸第2季第2集', total: 67, sort: 202 },
	{ _id: 'lib_tbbt_s2_ep3', name: '生活大爆炸 S2E3', desc: '生活大爆炸第2季第3集', total: 65, sort: 203 },
	{ _id: 'lib_tbbt_s2_ep4', name: '生活大爆炸 S2E4', desc: '生活大爆炸第2季第4集', total: 64, sort: 204 },
	{ _id: 'lib_tbbt_s2_ep5', name: '生活大爆炸 S2E5', desc: '生活大爆炸第2季第5集', total: 35, sort: 205 },
	{ _id: 'lib_tbbt_s2_ep6', name: '生活大爆炸 S2E6', desc: '生活大爆炸第2季第6集', total: 49, sort: 206 },
]

const mockWords = [
	{ library_id: 'lib_tbbt_s2_ep1', word: 'yogurt', phonetic_us: '/ˈjoʊɡərt/', phonetic_uk: '', pos: ['n.'], meaning: { zh: 'n. 酸奶、酸乳酪', en: 'n. a semi-solid sourish food prepared from milk' }, roots: { note: '基础词汇' }, examples: [{ en: 'I eat a cup of yogurt for breakfast.', zh: '我早餐吃一杯酸奶。' }], tags: ['S2', 'E1'], sort: 1 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'yoga', phonetic_us: '/ˈjoʊɡə/', phonetic_uk: '', pos: ['n.'], meaning: { zh: 'n. 瑜伽', en: 'n. a spiritual and ascetic discipline' }, roots: { note: '基础词汇' }, examples: [{ en: 'She does yoga every morning.', zh: '她每天做瑜伽。' }], tags: ['S2', 'E1'], sort: 2 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'pivot', phonetic_us: '/ˈpɪvət/', phonetic_uk: '', pos: ['n.', 'v.'], meaning: { zh: 'n. 枢轴 v. 以...为中心', en: 'n. central point; v. turn on' }, roots: { note: '基础词汇' }, examples: [{ en: 'Ross is the pivot of the group.', zh: 'Ross 是核心人物。' }], tags: ['S2', 'E1'], sort: 3 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'sarcastic', phonetic_us: '/sɑːrˈkæstɪk/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 讽刺的', en: 'adj. mocking' }, roots: { note: '基础词汇' }, examples: [{ en: 'Chandler is always sarcastic.', zh: 'Chandler 总是很讽刺。' }], tags: ['S2', 'E1'], sort: 4 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'obsessed', phonetic_us: '/əbˈsest/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 着迷的', en: 'adj. unable to stop thinking about' }, roots: { note: '基础词汇' }, examples: [{ en: 'Monica is obsessed with cleaning.', zh: 'Monica 对清洁很着迷。' }], tags: ['S2', 'E1'], sort: 5 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'awkward', phonetic_us: '/ˈɔːkwərd/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 尴尬的', en: 'adj. causing difficulty' }, roots: { note: '基础词汇' }, examples: [{ en: 'That was an awkward silence.', zh: '一段尴尬的沉默。' }], tags: ['S2', 'E1'], sort: 6 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'deliberately', phonetic_us: '/dɪˈlɪbərətli/', phonetic_uk: '', pos: ['adv.'], meaning: { zh: 'adv. 故意地', en: 'adv. on purpose' }, roots: { note: '基础词汇' }, examples: [{ en: 'He deliberately ignored her.', zh: '他故意无视她。' }], tags: ['S2', 'E1'], sort: 7 },
	{ library_id: 'lib_tbbt_s2_ep1', word: 'inevitable', phonetic_us: '/ɪnˈevɪtəbl/', phonetic_uk: '', pos: ['adj.'], meaning: { zh: 'adj. 不可避免的', en: 'adj. certain to happen' }, roots: { note: 'in-: 不 · evitable: 避免的' }, examples: [{ en: 'Change is inevitable.', zh: '改变是不可避免的。' }], tags: ['S2', 'E1'], sort: 8 },
]

export function getMockLibraryList() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve({ list: mockLibraries, total: mockLibraries.length, page: 1, pageSize: 20 })
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
