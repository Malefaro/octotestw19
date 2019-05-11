function BuildPopUp(container) {
    let addFolderPopupContainer = container;
    return {
        container: addFolderPopupContainer,
        folderName: addFolderPopupContainer + ' input[name="name"]',
        location: {
            container: addFolderPopupContainer + ' div.b-select__dropdown',
            itemByText: (text) => { return addFolderPopupContainer +
                ` div.b-select__dropdown a[data-name="item"][data-text="${text}"]`},
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
}

export default BuildPopUp;