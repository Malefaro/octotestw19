import main from '../../steps/main';
import folder from '../../steps/main-folders';
//import PasswordObj from '../../store/passwordObj';
//import mainPage from '../../pages/main'
import layout from '../../steps/layout'
//import folders from '../../steps/sidebar/folders';
//import letters from '../../steps/letters';

const password = process.env.TP_PASSWORD;
const username = process.env.TP_USERNAME;

describe("creating folder", () => {
    let folderName;
    before(() => {
        folderName = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);folder.openFolderMenu();
    });
    it('create simple folder', () => {
        folder.openFolderMenu();
        folder.createFolder("testFolder" + Math.round());
    });
    afterEach(() => {
        //folder.removeFolder(folderName);
        // TODO: removeFolder locators
    })
});
