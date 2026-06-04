'use strict';

const db = uniCloud.database();

exports.main = async (event, context) => {
	const { page = 1, pageSize = 20 } = event;

	const collection = db.collection('library');

	const totalRes = await collection.count();
	const total = totalRes.total || 0;

	const res = await collection
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
