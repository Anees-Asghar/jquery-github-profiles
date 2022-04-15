let client_id = config.CLIENT_ID;
let client_secret = config.CLIENT_SECRET;

$(document).ready(function(){
	let $searchBar = $("#searchBar");

	// event listener for search bar
	$searchBar.on("keyup", function(e){
		// ignore if key isn't 'Enter'
		if (e.key != 'Enter') {
			return;
		}

		// get user data
		let username = e.target.value;
		getUserProfile(username);
	});
});

function getUserProfile(username) {
	// api call to get profile
	$.ajax({
		url: 'https://api.github.com/users/' + username,
		data: {
			client_id: client_id,
			client_secret: client_secret
		},
	})
	.done(user => {
		// display user profile
		$('#profile').html(`
			<div class="card border-primary mb-3" style="max-width: 100rem;">
				<div class="card-header bg-primary text-white"><strong>${user.name ? user.name : 'Unknown'}</strong></div>
				<div class="card-body">
					<div class='row'>
						<div class='col-md-3'>
							<img src='${user.avatar_url}' class='thumbnail avatar'>
						</div>
						<div class='col-md-9'>
							<span class="badge badge-warning">Public Repos: ${user.public_repos}</span>
							<span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
							<span class="badge badge-success">Followers: ${user.followers}</span>
							<span class="badge badge-danger">Following: ${user.following}</span>
							<br><br>

							<ul class='list-group'>
								<li class='list-group-item'>Company: ${user.company ? user.company : 'Unknown'}</li>
								<li class='list-group-item'>Website/Blog: 
									${user.blog ? "<a target='_blank' href='" + user.blog +"'>" + user.blog + "</a>" : 'Unknown'}
								</li>
								<li class='list-group-item'>Location: ${user.location ? user.location : 'Unknown'}</li>
								<li class='list-group-item'>Member Since: ${user.created_at.slice(0, 10)}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<h3 class='page-header mt-5'>Latest Repos</h3>
			<div id='repos'></div>
		`);

		// get user repos
		getUserRepos(username);
	})
	.fail(() => {
		$('#profile').html(`
			<p class="mt-3 text-muted text-center">
				Couldn't retrieve user data. Make user the username is correct or try again later.
			</p>
		`);
	});
}

function getUserRepos(username) {
	let $reposDiv = $('#repos');

	// api call to get user repos
	$.ajax({
		url: 'https://api.github.com/users/' + username + '/repos',
		data: {
		client_id: client_id,
		client_secret: client_secret,
		sort: 'created: asc',
		per_page: 10
		},
	})
	.done(repos => {

		if (repos.length === 0) {
			$reposDiv.append(`
				<p class="mt-3 text-muted">Nothing to show here.</p>
			`);
			return;
		}

		// display each repo
		$.each(repos, (index, repo) => {
			$reposDiv.append(`
				<div class="row p-2 my-3 border border-success border-left-0 border-top-0">
					<div class="col-md-7">
						<strong>${repo.name}</strong>: ${repo.description}
					</div>
					<div class="col-md-3">
						<span class="badge badge-warning">Forks: ${repo.forks_count}</span>
						<span class="badge badge-primary">Watchers: ${repo.watchers_count}</span>
						<span class="badge badge-success">Stars: ${repo.stargazers_count}</span>
					</div>
					<div class="col-md-2">
						<a href="${repo.html_url}" target="_blank" class="btn btn-outline-dark">
						Visit Repo
						</a>
					</div>
				</div>
			`);
		});
	})
	.fail(() => {
		$reposDiv.append(`
			<p class="mt-3 text-muted">Couldn't retrieve user repos, try again later.</p>
		`);
	});
}