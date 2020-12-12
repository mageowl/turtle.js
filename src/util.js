export default {
	range(length, offset = 0) {
		return Array(length).map((v, i) => offset + i);
	}
};
