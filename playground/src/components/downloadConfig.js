import '../assets/installationSection.scss';
import { getById, addEvent } from "./utils";
import { getCurrentUserConfig, getState } from './stateManager';
import { saveAs } from 'file-saver';

/**
 * @type {HTMLAnchorElement}
 */
const downloadBtn = getById('downloadConfigBtn');
const pluginVersion = 'v3.0.0-rc.13';

const configAsString = ({minify=false} = {}) => {

    let scriptStr = `import { run } from 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@${pluginVersion}/dist/cookieconsent.esm.js';\n\n`;

    const state = getState();
    const config = getCurrentUserConfig(state);
    const darkModeEnabled = state._theme === 'cc--darkmode';

    if(darkModeEnabled) {
        scriptStr += `// Enable dark mode\n`;
        scriptStr += `document.documentElement.classList.add('cc--darkmode');\n\n`;
    }

    /**
     * config. as string
     */
    const configStr = minify
        ? JSON.stringify(config)
        : JSON.stringify(config, null, 4);

    /**
     * Append config.
     */
    scriptStr += `run(${configStr});`;

    return scriptStr;
}

addEvent(downloadBtn, 'click', () => {

    const config = configAsString();

    const blob = new Blob([config], {type: 'text/javascript;charset=utf-8'});
    saveAs(blob, 'cookieconsent-config.js');
});