$(document).ready(function () {
	$.get('/users/', data => {
		let html = '';
		data.forEach(d => {
			html += `<a href="" class="user" data="${d._id}">
						<div class="user-image"></div>
						<div class="user-name">${d.name}</div>
					</a>`;
		});
		$('.user-collection').html(html);
		$('.user').click(e => {
			e.preventDefault();
			let target = $(e.target);
			while (!target.hasClass('user')) {
				target = target.parent();
			}
			localStorage.setItem('userId', target.attr('data'));
			window.location.href = '/profile';
		})
	});
});