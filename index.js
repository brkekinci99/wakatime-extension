const express = require('express');
const app = express();
const axios = require('axios').default;
const db = require('./models');
const nodeCron = require('node-cron');
const expressHbs = require('express-handlebars');
const basicAuth = require('express-basic-auth');

const Op = db.Sequelize.Op;
const USER = db.user;
const DAILY = db.daily;
const PROJECT = db.project;
const LANGUAGE = db.language;

const seeder = require('./seeder/index.seeder');
const notifyFunction = require('./functions/notify.function');

const userController = require('./controllers/user.controller');

db.sequelize
	.sync({
		// force: true,
	})
	.then(() => {
		console.log('Synced db.');
		// seeder();
		// console.log('Seeded the database');
	})
	.catch((err) => {
		console.log('Failed to sync db: ' + err.message);
	});

app.engine(
	'handlebars',
	expressHbs.engine({
		layoutsDir: `${__dirname}/views/`,
	})
);

app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const authOptions = {
	users: {
		saportif: '4621264',
	},
	challenge: true,
};

async function getData() {
	const today = new Date().toISOString().split('T')[0];
	// const start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 Days ago
	console.log('Pulling Data ', new Date().toISOString());
	// console.log('Date specs: ', today, start_date);
	let errors = [];

	DAILY.destroy({
		where: {
			date: today,
		},
	})
		.then(async (num) => {
			console.log('Cleared ' + num + ' day rows');
			PROJECT.destroy({
				where: {
					day_id: {
						[Op.eq]: null,
					},
				},
			})
				.then((num) => console.log('Cleared ' + num + ' project rows'))
				.catch((err) => console.log(err));

			LANGUAGE.destroy({
				where: {
					day_id: {
						[Op.eq]: null,
					},
				},
			})
				.then((num) => console.log('Cleared ' + num + ' project rows'))
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err))
		.finally(() => {
			USER.findAll({ raw: true })
				.then(async (users) => {
					// console.log(users);

					for await (const user of users) {
						console.log(user.name);

						axios
							.get(`https://wakatime.com/api/v1/users/current/summaries?start=${today}&end=${today}`, {
								headers: { Authorization: `Basic ${user.api_key_base64}` },
							})
							.then(async (res) => {
								for await (const day of res.data.data) {
									DAILY.create({
										date: day.range.date,
										date_start: day.range.start,
										date_end: day.range.end,
										total_text: day.grand_total.text || '0',
										total_digital: day.grand_total.digital || '0:00:00',
										total_seconds: day.grand_total.total_seconds || 0,
										user_id: user.user_id,
									})
										.then(async (daily) => {
											for await (const project of day.projects) {
												PROJECT.create({
													name: project.name,
													date_text: project.text,
													percent: project.percent,
													digital: project.digital,
													total_seconds: project.total_seconds,
													day_id: daily.day_id,
												})
													.then((data) => console.log('Added Project:', data.name))
													.catch((err) => {
														errors.push(err);
														console.log(err);
													});
											}

											for await (const language of day.languages) {
												LANGUAGE.create({
													name: language.name,
													date_text: language.text,
													percent: language.percent,
													digital: language.digital,
													total_seconds: language.total_seconds,
													day_id: daily.day_id,
												})
													.then((data) => console.log('Added Language:', data.name))
													.catch((err) => {
														errors.push(err);
														console.log(err);
													});
											}
										})
										.catch((err) => {
											errors.push(err);
											console.log(err);
										});
								}
							})
							.catch((err) => {
								{
									errors.push(err);
									console.log(err);
								}
							});
					}
					return { users, errors };
				})
				.then(({ users, errors }) => {
					if (errors.length > 0) {
						notifyFunction({ users, errors });
					}
				});
		});
}

const job = nodeCron.schedule('0 * * * *', () => {
	console.log('Running hourly data fetch');
	console.log(new Date().toLocaleString());
	getData();
});

app.get('/get-data', (req, res) => {
	getData();
	res.send({ message: 'Started data pull' });
});

app.get('/users', basicAuth(authOptions), (req, res) => {
	USER.findAll({ raw: true }).then(async (users) => {
		res.render('users', {
			layout: 'users',
			users: users,
		});
	});
});

app.post('/users', (req, res) => {
	userController.create(req.body);
	res.redirect('/users');
});

app.post('/delete-user', (req, res) => {
	console.log('delete ulasildi');
	console.log(req.body);
	userController.delete(req.body.id);
	res.redirect('/users');
});

app.post('/update-user', (req, res) => {
	console.log(req.body);
	userController.update(req.body);
	res.redirect('/users');
});

app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to Wakatime Extension for Saportif Technology ' + new Date().toISOString(),
	});
});

const port = process.env.PORT || '4000';
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
	console.log(`http://localhost:${port}/`);
});
