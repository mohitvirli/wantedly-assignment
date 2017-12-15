export const removeDuplicates = (a) => {
	return a.filter(function (item, pos) {
		return a.indexOf(item) === pos;
	});
};

