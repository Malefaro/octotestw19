import DefaultSteps from './default';
import page from '../pages/main';

class MainPageSteps extends DefaultSteps {
	constructor() {
		super(page);
	}

	login(username, password) {
		this.page.fillLoginForm(username, password);
		this.page.submit();
		this.page.waitForUrl("https://e.mail.ru/messages/inbox/")
	}

	logout() {
		this.page.page.waitForVisible(this.page.locators.logout);
		this.page.page.click(this.page.locators.logout);
	}
}

export default new MainPageSteps();
