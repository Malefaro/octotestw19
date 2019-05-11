import main from '../../steps/main';

import {assert, expect, should} from 'chai';

const password = process.env.TP_PASSWORD;
const username = process.env.TP_USERNAME;

describe('test id', () => {
    it('Авторизоваться', () => {
        main.open('https://mail.ru');
        main.login(username, password);
    });
    after(() => {
        main.logout();
    })
});

