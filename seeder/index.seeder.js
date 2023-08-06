const db = require('../models');
const Op = db.Sequelize.Op;
const USER = db.user;

module.exports = async () => {
	USER.bulkCreate([
		{
			name: 'Doğukan Karabeyin',
			api_key: '22441ccb-5424-4d78-8ec3-01a6410d48bc',
			api_key_base64: Buffer.from('22441ccb-5424-4d78-8ec3-01a6410d48bc').toString('base64'),
		},
		{
			name: 'Mevlüt Yıldırım',
			api_key: 'f0adee9d-8e19-46c4-bbed-bb1c1d752e28',
			api_key_base64: Buffer.from('f0adee9d-8e19-46c4-bbed-bb1c1d752e28').toString('base64'),
		},
		{
			name: 'Miraç Durhan',
			api_key: '5f57dcb8-c82e-47cf-963f-dd37f4e80848',
			api_key_base64: Buffer.from('5f57dcb8-c82e-47cf-963f-dd37f4e80848').toString('base64'),
		},
		{
			name: 'Burak Ekinci',
			api_key: 'ce7232a0-e703-47fc-85c6-9ea1a6325050',
			api_key_base64: Buffer.from('ce7232a0-e703-47fc-85c6-9ea1a6325050').toString('base64'),
		},
		{
			name: 'Enes Sevim',
			api_key: '872cfc08-d03d-44a7-be35-6e83442a4344',
			api_key_base64: Buffer.from('872cfc08-d03d-44a7-be35-6e83442a4344').toString('base64'),
		},
		{
			name: 'Mehmet Çağrı Tarakçıoğlu',
			api_key: '1c7d35bf-4742-44df-b1d8-32f31dc53f36',
			api_key_base64: Buffer.from('1c7d35bf-4742-44df-b1d8-32f31dc53f36').toString('base64'),
		},
		{
			name: 'Yahya Yeşilyurt',
			api_key: 'ab56ffaa-cfcb-42db-b955-f6f5d129f030',
			api_key_base64: Buffer.from('ab56ffaa-cfcb-42db-b955-f6f5d129f030').toString('base64'),
		},
	])
		.then((data) => {
			console.log('Seeded User');
		})
		.catch((err) => console.log(err));
};
