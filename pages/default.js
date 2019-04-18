export default class DefaultPage {
	constructor(name) {
		this.name = name;
	}

	get locators() {
		return {
			container: 'body'
		};
	}

	get location() {
		return '/';
	}

	get page() {
		return browser;
	}

	// redirectToQa() {
	// 	browser.url('/bundles/page.qa.html')
	// }

	waitForUrl(value, timeout=10000, revert) {
		let url, actual;
		try {
			return browser.waitUntil(() => {
				url = browser.getUrl();
	
				// Возвращаем адрес без / на конце, который добавляет Selenium
				// Было бы проще получить адрес через window.location.href,
				// но если страница недоступна, то тест упадет, а нам нужно именно проверить переход
				if (typeof value === 'string' && !value.endsWith('/')) {
					url = url.replace(/\/$/, '');
				}
	
				// actual = value === url;
				actual = url.includes(value);
	
				if (typeof value === 'function') {
					actual = value(url);
				} else if (value[Symbol.match]) {
					actual = value.test(url);
				}
	
				if (revert) {
					actual = !actual;
				}
	
				return value && actual;
			}, timeout, '');
		} catch (error) {
			let message = 'Could not wait for required url:';
				message += `\n\tActual: ${url}`;
				message += `\n\tExpected: ${value}`;
	
			throw new Error(message);
		}
	}
	waitForLoad() {
		// while(!(browser.isEnabled('html') && browser.isEnabled('body') && browser.isEnabled('head')) ) {}
		while (true) {
			let source = browser.getSource();
			// console.log(`start\n${source}end\n`);

			console.log("step");
			if (source.includes('</body>')) {
				console.log("breaked");
				break;
			}
		}
	}
	hasClass(selector, name) {
		let attribute;

		if (selector && name) {
			attribute = browser.getAttribute(selector, 'class');
		} else if (selector) {
			// получение из контекста, для chained вызова element.hasClass()
			attribute = browser.elementIdAttribute(this.lastResult.ELEMENT, 'class').value;

			name = selector;
		}

		if (!attribute) {
			throw new Error('Element not found');
		}

		const actual = attribute.split(' ');

		return actual.includes(name);
	}

}
