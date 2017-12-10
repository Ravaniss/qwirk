import * as indicative from 'indicative'

const database: any = {
	host: 'localhost',
	port: 28015,
	db: 'qwirk'
}

const redis: any = {
	host: 'localhost',
	port: '6379'
}

const JWT: string = 'Qw1rkS3rv3r'

const userRules: indicative.Rules = {
	pseudo: 'alpha_numeric|required|min:2|max:40',
	email: 'email|required|max:100',
	password: 'required|max:200'
}

export { database, redis, JWT, userRules }