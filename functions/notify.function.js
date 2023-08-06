const axios = require('axios').default;

module.exports = async ({ users, errors }) => {
	axios
		.post(`https://mailing-microservice.azurewebsites.net/`, {
			name: 'Saportif WakaTime Extension',
			email: 'dogukan@saportif.com',
			subject: 'Saportif WakaTime Extension',
			message:
				'Extension runned at ' +
				new Date().toISOString() +
				'for users: ' +
				users.map((user) => user.name) +
				' errors if any: ' +
				errors,
			clientInfo: '',
			sendTo: 'dogukan@saportif.com',
		})
		.then(function (response) {
			if (response.status == 200) {
				console.log('Email Sent');
			} else {
				console.log('error');
			}
		})
		.catch(function (error) {
			console.log(error);
		});
};
