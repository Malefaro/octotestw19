import settingsPage from '../../pages/settings-folder'
import DefaultSteps from '../default';



class SettingsFolderStep extends DefaultSteps{
    constructor() {
        super(settingsPage);
    }

    checkFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        return this.page.checkFolder({name, location, isWebOnly, isArchive, passwordObj})
    }

    createFolder({name, location, isWebOnly, isArchive, passwordObj}) {
        this.page.createFolder({name, location, isWebOnly, isArchive, passwordObj});
    }

    removeFolder(name) {
        this.page.removeFolder(name);
    }

}

export default new SettingsFolderStep();