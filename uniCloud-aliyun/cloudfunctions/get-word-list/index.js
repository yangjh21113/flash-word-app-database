'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	const { library_id, page = 1, pageSize = 50 } = event;

	if (!library_id) {
		return { code: -1, msg: '缺少 library_id 参数' };
	}

	const collection = db.collection('word');

	const countRes = await collection
		.where({ library_id })
		.count();
	const total = countRes.total || 0;

	const res = await collection
		.where({ library_id })
		.orderBy('sort', 'asc')
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.get();

	return {
		code: 0,
		data: {
			list: res.data,
			total,
			page,
			pageSize
		}
	};
};
