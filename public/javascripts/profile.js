

$(document).ready(function () {
	let userId = localStorage.getItem('userId');
	if (window.location.search)
		userId = window.location.search.substr(1);

	const getInitials = (name) => {
		return name.split(' ').map(d => d.charAt(0)).join('').toUpperCase();
	};

	const getUserDetails = () => {

	};

	const endorseSkill = (skillId, endorse) => {
		$.ajax({
			url : '/skills/endorse',
			type: 'POST',
			data: JSON.stringify({
				userId: userId,
				ownerId: localStorage.getItem('userId'),
				skillId: skillId,
				endorse: endorse
			}),
			contentType: "application/json",
			success: (data) => {
				if (data) {
					getSkills();
				}
			}
		});
	};

	const getSkillUsers = skill => {
		let html = '';
		skill.users.forEach(user => {
			html += `<div class="user">
					${getInitials(user.name)}
				</div>`;
		});
		return html;
	};

	const ifEndorsed = (skill) => {
		return skill.users.filter(user => {
			return user._id === localStorage.getItem('userId');
		}).length
	};


	const getSkills = () => {
		$.get(`/skills/${userId}`, skills => {
			let fhtml = '', shtml = '';
			skills.sort((a, b) => {
				return Object.keys(b.users).length - Object.keys(a.users).length;
			});
			skills.slice(0, 6).forEach(skill => {
				fhtml += `
					<div class="skill">
                        <div class="skill-count ${ifEndorsed(skill) ? 'added' : ''}" data="${skill.skill._id}">
                            ${Object.keys(skill.users).length}
                            <div class="add-btn">+</div>
                        </div>
                        <div class="skill-name">${skill.skill.name}</div>
                        <div class="skill-border"></div>
                        <div class="skill-users">
                        	${getSkillUsers(skill)}
                        </div>
                    </div>`;
			});

			skills.slice(6, skills.length).forEach(skill => {
				shtml += `
					<div class="skill short-width">
                        <div class="skill-count ${ifEndorsed(skill) ? 'added' : ''}" data="${skill.skill._id}">
                            ${Object.keys(skill.users).length}
                            <div class="add-btn">+</div>
                        </div>
                        <div class="skill-name">${skill.skill.name}</div>
                    </div>`;
			});
			$('.skills-full-width').html(fhtml);
			$('.skills-short-width').html(shtml);

			$('.skill-count').on('click', e => {
				let target = $(e.target);
				while (!target.hasClass('skill-count')) {
					target = target.parent();
				}
				endorseSkill(target.attr('data'), !target.hasClass('added'));
			})
		});
	};

	getSkills();
});