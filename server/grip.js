import fs from 'fs';
import path from 'path';
import { reject } from 'underscore';
import * as logger from './logger';
import ServerUtils from './serverUtils';

export default class Grip {
    constructor() {
        this.indexPage = '';
    }

    executeSetup() {
        const weakSelf = this;
        return new Promise((resolve) => {
            // Load up the index page.
            weakSelf.indexPage = fs.readFileSync(
                (process.env.NODE_ENV === 'development')
                ? './build/index.html'
                : path.join(__dirname, 'index.html'), 'utf8',
            );

            resolve(null);
        }).catch((error) => {
            logger.log2_e('An error occurred while loading up {{ GRIP }}');
            logger.log2_e(error);

            reject(error);
        });
    }

    getDefaultInfo() {
        return {
            title: 'Dashboard',
            description: '',
            keywords: '',
        };
    }

    getHomepageInfo() {
        return {
            title: 'Dashboard',
            description: '',
            keywords: '',
        };
    }

    getLoginPageInfo() {
        return {
            title: 'Dashboard - Sign In',
            description: '',
            keywords: '',
        };
    }

    getLoginFailureInfo() {
        return {
            title: 'Login failure',
            description: '',
            keywords: '',
        };
    }

    getLogoutInfo() {
        return {
            title: 'Logged out',
            description: '',
            keywords: '',
        };
    }

    getDevicesInfo() {
        return {
            title: 'Devices',
            description: '',
            keywords: '',
        };
    }

    render(item) {
        const pageItem = item === null ? this.getDefaultInfo() : item;

        const renderedTitle = ServerUtils.IsNullOrEmpty(pageItem.title) ? 'Dashboard' : pageItem.title;
        const renderedDescription = ServerUtils.IsNullOrEmpty(pageItem.description) ? '' : pageItem.description;
        const renderedKeywords = ServerUtils.IsNullOrEmpty(pageItem.keywords) ? '' : pageItem.keywords;

        let renderedHtmlPage = this.indexPage.replace('{{TITLE}}', renderedTitle);
        renderedHtmlPage = renderedHtmlPage.replace('{{DESCRIPTION}}', renderedDescription);
        renderedHtmlPage = renderedHtmlPage.replace('{{KEYWORDS}}', renderedKeywords);

        return renderedHtmlPage;
    }
}
