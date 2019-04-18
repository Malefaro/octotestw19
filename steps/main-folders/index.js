import settingsPage from '../../pages/main-folders'
import DefaultSteps from '../default';



class MainFoldersStep extends DefaultSteps{
    constructor() {
        super(settingsPage);
    }

    createFolder(name, location, isWebOnly, isArchive, passwordObj) {
        this.page.createFolder({name, location, isWebOnly, isArchive, passwordObj})
    }

    openFolderMenu() {
        this.page.openFolderMenu();
    }

    lookUpForLetters(letters, folderName) {
        this.page.lookUpForLetters(letters, folderName);
    }

    removeFolder(name) {
        this.page.removeFolder(name);
    }

}

export default new MainFoldersStep();