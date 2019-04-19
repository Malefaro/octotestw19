import DefaultPage from '../default';
import PopUpMenu from './popup';

class SettingsFolderPage extends DefaultPage {
    constructor() {
        super('settings-folders');
        this.baseURL = "https://e.mail.ru/settings/folders";
    }

    setPassword(passwordObj) {
        const shortcut = this.locators.addFolderPopup.Private;
        const {password, question, answer, userPassword} = passwordObj;
        this.page.setValue(shortcut.password, password);
        this.page.setValue(shortcut.passwordRepeat, password);
        this.page.setValue(shortcut.secretQuestion, question);
        this.page.setValue(shortcut.answerQuestion, answer);
        this.page.setValue(shortcut.userPassword, userPassword);
    }

    get locators() {
        const container = '.js-settings-folders';
        const addFolderPopupContainer = '.is-folder-add_in';
        const removeFolderPopupContainer = ".is-folder-remove_in";
        // const addFolderPopup = {
        //     container: addFolderPopupContainer,
        //     folderName: addFolderPopupContainer + ' input[name="name"]',
        //     location: {
        //         container: addFolderPopupContainer + ' div.b-select__dropdown',
        //         itemByText: (text) => addFolderPopupContainer +
        //             ` div.b-select__dropdown a.[data-name="item"][data-text="${text}"]`,
        //         first: addFolderPopupContainer + ` div.b-select__dropdown a.[data-name="item"][data-num="0"]`
        //     },
        //     isOnlyWebCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="only_web"]',
        //     isArchiveCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="archive"]',
        //     Private: {
        //         isPrivateCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="secret"]',
        //         password: addFolderPopupContainer + ' input[name="folder_password"]',
        //         passwordRepeat: addFolderPopupContainer + ' input[name="password_repeat"]',
        //         secretQuestion: addFolderPopupContainer + ' input[name="question"]',
        //         answerQuestion: addFolderPopupContainer + ' input[name="answer"]',
        //         userPassword: addFolderPopupContainer + ' input[name="user_password"]',
        //     },
        //     submitBtn: addFolderPopupContainer + ' button[data-name="submit"]',
        //     cancelBtn: addFolderPopupContainer + ' button[data-name="close"]',
        // };
        const removeFolderPopup = {
            container: removeFolderPopupContainer,
            submitBtn: removeFolderPopupContainer + ' [data-name="submit"]',
            closeBtn: removeFolderPopupContainer + ' [data-name="close"]',
        };
        return {
            container,
            addFolderPopup: PopUpMenu(addFolderPopupContainer),
            editFolderPopup: PopUpMenu('.is-folder-edit_in'),
            addFolderBtn: container + ' [data-name="newFolder"]',
            folder: (name) => {
                const folderContainer = `//*[@class="${container.replace(".", "")}"]//div[@class="b-folders__item"]//div[text()="${name}"]`;
                const removeFolderBtn = folderContainer + '/following-sibling::div/div[@data-name="remove"]';
                const editFolderBtn = folderContainer + '/following-sibling::div/div[@data-name="edit"]';
                return {
                    container: folderContainer,
                    removeFolderBtn,
                    editFolderBtn,
                }
            },
            removeFolderPopup,
        }
    }

    checkFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        let result = this.page.isExisting(this.locators.folder(name).container);
        if (isWebOnly) {
            this.page.waitForEnabled(this.locators.folder(name).editFolderBtn);
            this.page.moveToObject(this.locators.folder(name).editFolderBtn);
            this.page.click(this.locators.folder(name).editFolderBtn);
            this.page.waitForVisible(this.locators.editFolderPopup.isOnlyWebCheckbox);
            result = result && (this.page.isSelected(this.locators.editFolderPopup.isOnlyWebCheckbox));
            this.page.waitForVisible(this.locators.editFolderPopup.cancelBtn);
            this.page.click(this.locators.editFolderPopup.cancelBtn);
        }
        return result
    }

    removeFolder(name) {
        this.page.waitForEnabled(this.locators.folder(name).removeFolderBtn);
        this.page.moveToObject(this.locators.folder(name).removeFolderBtn);
        this.page.click(this.locators.folder(name).removeFolderBtn);
        this.page.waitForVisible(this.locators.removeFolderPopup.submitBtn);
        this.page.click(this.locators.removeFolderPopup.submitBtn);
    }

    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.waitForVisible(this.locators.addFolderBtn);
        this.page.click(this.locators.addFolderBtn);
        this.fillAddFolderForm({name, location, isWebOnly, isArchive, passwordObj});
        this.page.waitForVisible(this.locators.addFolderPopup.submitBtn);
        this.page.click(this.locators.addFolderPopup.submitBtn);
        this.page.waitForVisible(this.locators.folder(name).container);
    }

    fillAddFolderForm({name, location, isWebOnly, isArchive, passwordObj}) {
        const popup = this.locators.addFolderPopup;
        this.page.waitForVisible(popup.cancelBtn);
        this.page.setValue(popup.folderName, name);
        if (location) {
            this.page.click(popup.location.container);
            this.page.setValue(popup.itemByText(location));
        }
        if (isWebOnly) {
            this.page.click(popup.isOnlyWebCheckbox)
        }
        if (isArchive) {
            this.page.click(popup.isArchiveCheckbox)
        }
        if (passwordObj) {
            this.page.click(popup.Private.isPrivateCheckbox);
            this.setPassword(passwordObj)
        }
    }
}

export default new SettingsFolderPage();