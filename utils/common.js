/**
 * remove the duplicate elements in a array
 * @param a, the array
 */

export const removeDuplicates = (a) => {
	return a.filter(function (item, pos) {
		return a.indexOf(item) === pos;
	});
};

