$(document).ready(() => {

	const getUserName = () => {
		$.get(`/users/${localStorage.getItem('userId')}`, (data) => {
			$('.user-name').text(data.name);
		})
	};
	$('.my-profile').hide();
	if (localStorage.getItem('userId')) {
		getUserName();
		$('.my-profile').show();
	}
});