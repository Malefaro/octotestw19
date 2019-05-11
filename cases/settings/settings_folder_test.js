import main from '../../steps/main';
import folder from '../../steps/settings-folder';
import PasswordObj from '../../store/passwordObj';

import {assert, expect, should} from 'chai';


const password = process.env.TP_PASSWORD;
const username = process.env.TP_USERNAME;

describe("test removing:", () => {
    let folderName;
    let base_folder_name;
    let passwd = new PasswordObj('test_password', 'test_question', 'test_answer', password);
    before(() => {
        base_folder_name = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);
    });
    beforeEach(() => {
        folderName = base_folder_name + Math.floor(Math.random() * 1000);
        main.open('https://e.mail.ru/settings/folders');
    });
    it('removing simple', () => {
        folder.createFolder({name: folderName});
        assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists after creating');
        folder.removeFolder(folderName);
        assert.equal(folder.page.checkFolder({name: folderName}), false, 'folder still exists after removing');
    });
    it('removing folder with password', () => {
        folder.createFolder({name: folderName, passwordObj: passwd});
        assert.equal(folder.page.checkFolder({
            name: folderName,
            passwordObj: passwd
        }), true, 'folder does not exists after creating');
        folder.removeFolder(folderName);
        assert.equal(folder.page.checkFolder({name: folderName}), false, 'folder still exists after removing');
    });
    it('removing sub-folder', () => {
        const parentFolderName = "parentFolder" + Math.floor(Math.random() * 1000);
        folder.createFolder({name: parentFolderName});
        folder.createFolder({name: folderName, location: parentFolderName});
        assert.equal(
            folder.page.checkFolder({name: folderName}),
            true, 'folder does not exists'
        );
        folder.removeFolder(folderName);
        assert.equal(folder.page.checkFolder({name: folderName}), false, 'folder still exists after removing');
        folder.removeFolder(parentFolderName);
    });
    // BUG: this test failed dut to bug
    // в баг-репорте описана ошибка связанная с этим тестом, в ходе которого папка,
    // созданная изначально как архив и измененная на обычную не может быть удалена
    // it('removing folder created as Archive and dearchived after', () => {
    //     folder.createFolder({name: folderName, isArchive: true});
    //     assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists after creating');
    //     folder.changeFolder(folderName, {isArchive: true});
    //     assert.equal(folder.page.checkFolder({name: folderName, isArchive: true, reversed: true}), true, 'folder still archive or not exists')
    //     folder.removeFolder(folderName);
    //     assert.equal(folder.page.checkFolder({name: folderName}), false, 'folder should be removed');
    // });
    after(() => {
        main.logout();
    });
});

describe("test creating:", () => {
    let folderName;
    let base_folder_name;
    let passwd = new PasswordObj('test_password', 'test_question', 'test_answer', password);
    before(() => {
        base_folder_name = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);
    });
    beforeEach(() => {
        folderName = base_folder_name + Math.floor(Math.random() * 1000);
        main.open('https://e.mail.ru/settings/folders');
    });
    it('create simple folder', () => {
        folder.createFolder({name: folderName});
        assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists');
    });
    it('create folder with OnlyWeb and password', () => {
        folder.createFolder({name: folderName, isWebOnly: true, passwordObj: passwd});
        assert.equal(
            folder.page.checkFolder({name: folderName, isWebOnly: true, passwordObj: true}),
            true, 'folder does not exists or not isWebOnly, or no isPrivate '
        );
    });
    it('create folder with password and isArchive', () => {
        folder.createFolder({name: folderName, isArchive: true, passwordObj: passwd});
        assert.equal(
            folder.page.checkFolder({name: folderName, isArchive: true, passwordObj: true}),
            true, 'folder does not exists or not isArchive, or no isPrivate '
        );
    });

    // BUG: This test failed due to bug (if you create folder with POP3 and Archive it create folder only with archive flag)
    // it('create folder with isWebOnly and isArchive', () => {
    //     folder.createFolder({name: folderName, isArchive: true, isWebOnly: true});
    //     assert.equal(
    //         folder.page.checkFolder({name: folderName, isArchive: true, isWebOnly: true}),
    //         true, 'folder does not exists or not isArchive, or no isPrivate '
    //     );
    // });

    it('create sub-folder and Archive', () => {
        const parentFolderName = "parentFolder" + Math.floor(Math.random() * 1000);
        folder.createFolder({name: parentFolderName});
        folder.createFolder({name: folderName, location: parentFolderName, isArchive: true});
        assert.equal(
            folder.page.checkFolder({name: folderName, isArchive: true}),
            true, 'folder does not exists or not archive'
        );

        folder.removeFolder(folderName);
        folder.removeFolder(parentFolderName);
    });

    it('create sub-folder and pop3', () => {
        const parentFolderName = "parentFolder" + Math.floor(Math.random() * 1000);
        folder.createFolder({name: parentFolderName});
        folder.createFolder({name: folderName, location: parentFolderName, isWebOnly: true});
        assert.equal(
            folder.page.checkFolder({name: folderName, isWebOnly: true}),
            true, 'folder does not exists or not pop3'
        );

        folder.removeFolder(folderName);
        folder.removeFolder(parentFolderName);
    });

    afterEach(() => {
        try {
            folder.removeFolder(folderName);
        } catch (e) {
            // if folder not exists it's ok because we can remove folders in tests
        }
    });
    after(() => {
        main.logout();
    })
});

describe("test changing:", () => {
    let folderName;
    let base_folder_name;
    let passwd = new PasswordObj('test_password', 'test_question', 'test_answer', password);
    before(() => {
        base_folder_name = 'testFolder';
        main.open('https://mail.ru');
        main.login(username, password);
    });
    beforeEach(() => {
        folderName = base_folder_name + Math.floor(Math.random() * 1000);
        main.open('https://e.mail.ru/settings/folders');
    });
    it("change simple folder to archive:", () => {
        folder.createFolder({name: folderName});
        assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists');
        folder.changeFolder(folderName, {isArchive: true});
        assert.equal(folder.page.checkFolder({
            name: folderName,
            isArchive: true
        }), true, "folder must exists and be archive");
    });
    it("change archive folder to simple:", () => {
        // TODO:
        // в баг-репорте описана ошибка связанная с этим тестом, в ходе которого папка,
        // созданная изначально как архив и измененная на обычную не может быть удалена
        folder.createFolder({name: folderName, isArchive: true});
        assert.equal(folder.page.checkFolder({name: folderName, isArchive: true}), true, 'folder does not exists');
        folder.changeFolder(folderName, {isArchive: true});
        assert.equal(folder.page.checkFolder({
            name: folderName,
            isArchive: true,
            reversed: true
        }), true, "folder must exists and not be archive");
    });
    it("change simple folder name:", () => {
        const new_name = "new_test_name" + Math.floor(Math.random() * 1000);
        folder.createFolder({name: folderName});
        assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists');
        folder.changeFolder(folderName, {new_name: new_name});
        assert.equal(folder.page.checkFolder({name: new_name}), true, "folder must exists");
        folder.removeFolder(new_name);
    });
    it("remove folder password", () => {
        folder.createFolder({name: folderName, passwordObj: passwd});
        assert.equal(folder.page.checkFolder({name: folderName}), true, 'folder does not exists');
        folder.changeFolder(folderName, {isPrivate: true, passwordObj: passwd});
        assert.equal(folder.page.checkFolder({name: folderName,}), true, "folder must exists and be archive");
    });
    afterEach(() => {
        try {
            folder.removeFolder(folderName);
        } catch (e) {
            // if folder not exists it's ok because we can remove folders in tests
        }
    });
    after(() => {
        main.logout();
    });
});