import main from '../../steps/main';
import folder from '../../steps/settings-folder';
import PasswordObj from '../../store/passwordObj';
import mainPage from '../../pages/main'
import layout from '../../steps/layout'
import folders from '../../steps/sidebar/folders';
import letters from '../../steps/letters';

// const webdriver = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// const firefox = require('selenium-webdriver/firefox');
//
// let driver = new webdriver.Builder()
// 	.forBrowser('chrome')
// 	.build();
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

describe("test creating", () => {
    let folderName;
    before(() => {
        folderName = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);
    });
    beforeEach(() => {
        main.open('https://e.mail.ru/settings/folders');
    });
    it('create simple folder', () => {
        // let passobj = PasswordObj("testpass", "testquestion", "testans", this.password);
        folder.createFolder("testFolder")
    });
    afterEach(() => {
        folder.removeFolder(folderName);
        // try {
        // 	folder.removeFolder(folderName + "12");
        // } catch(err) {
        //
        // }
    })
});
