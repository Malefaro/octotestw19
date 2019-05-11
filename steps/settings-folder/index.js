import settingsPage from '../../pages/settings-folder'
import DefaultSteps from '../default';



class SettingsFolderStep extends DefaultSteps{
    constructor() {
        super(settingsPage);
    }

    checkFolder({name, location, isWebOnly, isArchive, passwordObj, reversed}) {
        return this.page.checkFolder({name, location, isWebOnly, isArchive, passwordObj, reversed})
    }

    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.createFolder({name, location, isWebOnly, isArchive, passwordObj});
    }

    removeFolder(name) {
        this.page.removeFolder(name);
    }

    changeFolder(name, {isWebOnly, isArchive, isPrivate, passwordObj, new_name}) {
        this.page.changeFolder(name, {isWebOnly, isArchive, isPrivate, passwordObj, new_name});
    }
}

export default new SettingsFolderStep();