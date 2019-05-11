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

    checkFolder({name, location, isWebOnly, isArchive, passwordObj, reversed}) {
        let elem = $(this.locators.folder(name).container);
        let result = elem.isExisting();
        result = true;
        // let result = this.page.isExisting(this.locators.folder(name).container);
        // if (!result) {
        //     return false
        // }
        try {
            this.page.waitForEnabled(this.locators.folder(name).editFolderBtn, 2000);
        } catch (e) {
            return false
        }
        this.page.moveToObject(this.locators.folder(name).editFolderBtn);
        this.page.click(this.locators.folder(name).editFolderBtn);
        let checkFunc = (locator) => {
            this.page.waitForVisible(locator, 5000);
            if (!reversed) {
                result = result && (this.page.isSelected(locator));
            } else {
                result = result && !(this.page.isSelected(locator));
            }
            return result
        };
        if (passwordObj) {
            checkFunc(this.locators.editFolderPopup.Private.isPrivateCheckbox);
        }
        if (isWebOnly) {
            checkFunc(this.locators.editFolderPopup.isOnlyWebCheckbox);
        }
        if (isArchive) {
            checkFunc(this.locators.editFolderPopup.isArchiveCheckbox);
        }

        this.page.waitForVisible(this.locators.editFolderPopup.cancelBtn);
        this.page.click(this.locators.editFolderPopup.cancelBtn);
        return result
    }

    removeFolder(name) {
        this.page.waitForEnabled(this.locators.folder(name).removeFolderBtn, 2500);
        this.page.moveToObject(this.locators.folder(name).removeFolderBtn);
        this.page.click(this.locators.folder(name).removeFolderBtn);
        this.page.waitForVisible(this.locators.removeFolderPopup.submitBtn);
        this.page.click(this.locators.removeFolderPopup.submitBtn);
    }

    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.waitForVisible(this.locators.addFolderBtn);
        this.page.click(this.locators.addFolderBtn);
        this.page.waitForVisible(this.locators.addFolderPopup.submitBtn);
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
            this.page.waitForVisible(popup.location.itemByText(location));
            this.page.click(popup.location.itemByText(location));
            // this.page.setValue(popup.location.itemByText(location));
        }
        if (isWebOnly) {
            this.page.click(popup.isOnlyWebCheckbox);
            this.page.waitForSelected(popup.isOnlyWebCheckbox);
        }
        if (isArchive) {
            this.page.click(popup.isArchiveCheckbox);
            this.page.waitForSelected(popup.isArchiveCheckbox);
        }
        if (passwordObj) {
            this.page.click(popup.Private.isPrivateCheckbox);
            this.setPassword(passwordObj);
            this.page.waitForSelected(popup.Private.isPrivateCheckbox);
        }
    }

    changeFolder(name, {isWebOnly, isArchive, isPrivate, passwordObj, new_name}) {
        this.page.waitForEnabled(this.locators.folder(name).editFolderBtn, 1000);
        this.page.moveToObject(this.locators.folder(name).editFolderBtn);
        this.page.click(this.locators.folder(name).editFolderBtn);
        this.page.waitForVisible(this.locators.editFolderPopup.cancelBtn);
        if (isWebOnly) {
            this.page.waitForVisible(this.locators.editFolderPopup.isOnlyWebCheckbox);
            this.page.click(this.locators.editFolderPopup.isOnlyWebCheckbox);
            // this.page.waitForSelected(this.locators.editFolderPopup.isOnlyWebCheckbox);
        }
        if (isArchive) {
            this.page.waitForVisible(this.locators.editFolderPopup.isArchiveCheckbox);
            this.page.click(this.locators.editFolderPopup.isArchiveCheckbox);
            // this.page.waitForSelected(this.locators.editFolderPopup.isArchiveCheckbox);
        }
        if (isPrivate) {
            const {password, question, answer, userPassword} = passwordObj;
            if (this.page.isSelected(this.locators.editFolderPopup.Private.isPrivateCheckbox)) {
                this.page.waitForVisible(this.locators.editFolderPopup.Private.isPrivateCheckbox);
                this.page.click(this.locators.editFolderPopup.Private.isPrivateCheckbox);
                this.page.setValue(this.locators.editFolderPopup.Private.userPassword, userPassword);
                // this.page.click(this.locators.editFolderPopup.submitBtn);
            } else {
                this.page.waitForVisible(this.locators.editFolderPopup.Private.isPrivateCheckbox);
                this.page.click(this.locators.editFolderPopup.Private.isPrivateCheckbox);
                this.setPassword(passwordObj);
                // this.page.click(this.locators.editFolderPopup.submitBtn);
            }
            // this.page.waitForSelected(this.locators.editFolderPopup.Private.isPrivateCheckbox);
        }
        if (new_name) {
            this.page.setValue(this.locators.editFolderPopup.folderName, new_name);
        }
        this.page.waitForVisible(this.locators.editFolderPopup.submitBtn);
        this.page.click(this.locators.editFolderPopup.submitBtn);
    }
}

export default new SettingsFolderPage();