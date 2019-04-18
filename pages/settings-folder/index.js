import DefaultPage from '../default';

class SettingsFolderPage extends DefaultPage{
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
        const addFolderPopup = {
            container: addFolderPopupContainer,
            folderName: addFolderPopupContainer + ' input[name="name"]',
            location: {
                container: addFolderPopupContainer + ' div.b-select__dropdown',
                itemByText: (text) => addFolderPopupContainer +
                    ` div.b-select__dropdown a.[data-name="item"][data-text="${text}"]`,
                first: addFolderPopupContainer + ` div.b-select__dropdown a.[data-name="item"][data-num="0"]`
            },
            isOnlyWebCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="only_web"]',
            isArchiveCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="archive"]',
            Private: {
                isPrivateCheckbox: addFolderPopupContainer + ' input[type="checkbox"][name="secret"]',
                password: addFolderPopupContainer + ' input[name="folder_password"]',
                passwordRepeat: addFolderPopupContainer + ' input[name="password_repeat"]',
                secretQuestion: addFolderPopupContainer + ' input[name="question"]',
                answerQuestion: addFolderPopupContainer + ' input[name="answer"]',
                userPassword: addFolderPopupContainer + ' input[name="user_password"]',
            },
            submitBtn: addFolderPopupContainer + ' button[data-name="submit"]',
            cancelBtn: addFolderPopupContainer + ' button[data-name="close"]',
        };
        const removeFolderPopup = {
            container: removeFolderPopupContainer,
            submitBtn: removeFolderPopupContainer + ' [data-name="submit"]',
            closeBtn: removeFolderPopupContainer + ' [data-name="close"]',
        };
        return {
            container,
            addFolderPopup,
            addFolderBtn: container + ' [data-name="newFolder"]',
            removeFolderByName: (name) => `//*[@class="${container.replace(".", "")}"]//div[@class="b-folders__item"]//div[text()="${name}"]/following-sibling::div/div[@data-name="remove"]`,
            removeFolderPopup,
        }
    }
    removeFolder(name) {
        this.page.waitForEnabled(this.locators.removeFolderByName(name));
        this.page.moveToObject(this.locators.removeFolderByName(name));
        this.page.click(this.locators.removeFolderByName(name));
        this.page.waitForVisible(this.locators.removeFolderPopup.submitBtn);
        this.page.click(this.locators.removeFolderPopup.submitBtn);
    }
    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.waitForVisible(this.locators.addFolderBtn);
        this.page.click(this.locators.addFolderBtn);
        this.fillAddFolderForm({name, location, isWebOnly, isArchive, passwordObj});
        this.page.click(this.locators.addFolderPopup.submitBtn);
    }
    fillAddFolderForm({name, location, isWebOnly, isArchive, passwordObj}) {
        const popup = this.locators.addFolderPopup;
        this.page.waitForVisible(popup.cancelBtn);
        console.log("name = "+ name);
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