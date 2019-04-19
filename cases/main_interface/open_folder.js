/*import main from '../../steps/main';
import folder from '../../steps/main-folders';
//import PasswordObj from '../../store/passwordObj';
//import mainPage from '../../pages/main'
import layout from '../../steps/layout'
//import folders from '../../steps/sidebar/folders';
//import letters from '../../steps/letters';

const password = process.env.TP_PASSWORD;
const username = process.env.TP_USERNAME;

describe("open folder", () => {
    let folderName;
    before(() => {
        folderName = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);
    });
    it('opening empty folder', () => {
        folder.openFolderMenu();
        folder.createFolder("testFolder " + Math.random()); // To avoid name collision because of not deleting
        folder.openFolderMenu();
        folder.goToFolder(folderName);
        folder.lookUpForLetters(null, null);
    });
    afterEach(() => {
        //folder.removeFolder(folderName);
    })
});*/
