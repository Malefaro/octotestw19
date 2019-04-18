import DefaultPage from '../default';

class MainFoldersPage extends DefaultPage{
    constructor() {
        super('main-folders');
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
        const container = '[class="sidebar-folders js-tooltip-direction_right"]';
        const addFolderPopupContainer = '[class="layer-create-folder"]';
        const removeFolderPopupContainer = '[class="layer-create-folder"]';
        const lettersContainer = '[class="letter-list"]'
        const lettersFragment = {
            conatiner : lettersContainer,
            emptyList : lettersContainer + ' [class="dataset__empty"]'
        };
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
            submitBtn: addFolderPopupContainer + ' button[data-test-id="submit"]',
            cancelBtn: addFolderPopupContainer + ' button[data-test-id="submit"]',
        };
        const removeFolderPopup = {
            container: removeFolderPopupContainer,
            submitBtn: removeFolderPopupContainer + ' [data-test-id="submit"]',
            closeBtn: removeFolderPopupContainer + ' [data-test-id="close"]',
        };
        return {
            container,
            lettersFragment,
            foldersMenu: container + ' [class="sidebar__menu-item"] ',
            addFolderPopup,
            addFolderBtn: '[class="new-folder-btn__button-wrapper"]',
            removeFolderByName: (name) => `//*[@class="${container.replace(".", "")}"]//div[@class="b-folders__item"]//div[text()="${name}"]/following-sibling::div/div[@data-name="remove"]`,
            removeFolderPopup,
        }
    }
    openFolderMenu() {
        this.page.waitForEnabled(this.locators.foldersMenu);
        try { // IS not clickable at point (109, 518) ..
            this.page.click(this.locators.foldersMenu);
        } catch(err) {}
    }

    lookUpForLetters(letters, folderName) {
        this.page.waitForVisible(this.locators.lettersFragment.emptyList);
    }

    removeFolder(name) {
        this.page.waitForEnabled(this.locators.removeFolderByName(name));
        this.page.moveToObject(this.locators.removeFolderByName(name));
        this.page.click(this.locators.removeFolderByName(name));
        this.page.waitForVisible(this.locators.removeFolderPopup.submitBtn);
        this.page.click(this.locators.removeFolderPopup.submitBtn);
    }
    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.waitForEnabled(this.locators.addFolderBtn);
        try {
            this.page.click(this.locators.addFolderBtn);
        } catch(err) { this.page.click(this.locators.addFolderBtn);}
        this.fillAddFolderForm({name, location, isWebOnly, isArchive, passwordObj});
        this.page.click(this.locators.addFolderPopup.submitBtn);
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

export default new MainFoldersPage();