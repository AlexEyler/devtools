import * as monaco from 'monaco-editor';
import * as wasm from 'devtools';
import { defineThemes, setDarkMode, registerSettingCallbacks } from './settings';

const value = `{ "propertyasdf12321": "{\\"test\\":\\"value\\"}",
  "test": 3 }`

let outputTabs = {
    "main": {
        content: wasm.prettify(value)
    }
};
document.getElementById("output-tabs").add(new Option("main", "main"))

defineThemes();
setDarkMode(document.getElementById('dark-mode').checked)


const getCommonSettings = (isInputEditor) => {
    const prefix = isInputEditor ? 'input' : 'output';
    return {
        language: "json",
        automaticLayout: true,
        codeLens: false,
        folding: false,
        inlineSuggest: {
            enabled: false
        },
        lightbulb: {
            enabled: false
        },
        lineNumbers: document.getElementById(`${prefix}-line-numbers`).checked ? 'on' : 'off',
        minimap: {
            enabled: false
        },
        suggestOnTriggerCharacters: false,
        quickSuggestions: false,
        wordWrap: document.getElementById(`${prefix}-word-wrap`).checked ? 'on' : 'off'
    }
}

// Hover on each property to see its docs!
const inputEditor = monaco.editor.create(document.getElementById('input-container'), {
    ...getCommonSettings(),
    value,
    snippetSuggestions: "none",
    wordBasedSuggestions: false,
    inlineSuggest: {
        enabled: false
    },
    suggestOnTriggerCharacters: false,
    suggest: {
        showModules: false, // disables Empty Object
        showValues: false, // disables Empty Array
    },
});

inputEditor.getModel().onDidChangeContent(e => {
    let prettified;
    try {
        prettified = wasm.prettify(inputEditor.getModel().getValue());
    } catch (error) {
        console.error(error);
        return;
    }
    console.log(prettified);
    outputEditor.getModel().setValue(prettified)
    const outputTabsElement = document.getElementById("output-tabs");
    outputTabsElement.hidden = true;
    for (var i = outputTabsElement.length - 1; i >= 0; i--) {
        outputTabsElement.remove(i)
    }
    outputTabs = {
        main: {
            content: prettified
        }
    };
    outputTabsElement.add(new Option("main", "main"))
})

const expand = (editor) => {
    const position = editor.getPosition();
    const lineContent = editor.getModel().getLineContent(position.lineNumber);
    try {
        const { content, property_name: propertyName } = wasm.expand(lineContent);
        const outputTabsElement = document.getElementById("output-tabs");
        if (!outputTabs.hasOwnProperty(propertyName)) {
            outputTabsElement.add(new Option(propertyName, propertyName))
            outputTabsElement.hidden = false;
        }

        outputTabsElement.value = propertyName;
        outputTabs[propertyName] = {
            content
        }

        switchTab(propertyName)

    } catch (e) {
        console.error("An error occurred while expanding the current line:", e)
    }
}

const outputEditor = monaco.editor.create(document.getElementById('output-container'), {
    ...getCommonSettings(),
    value: outputTabs["main"].content,
    readOnly: true,
});

outputEditor.addAction({
    id: 'expand-json-string',
    label: 'Expand JSON string',
    run: expand,
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1.5
});

registerSettingCallbacks(inputEditor, outputEditor);

const switchTab = (propertyName) => {
    outputEditor.getModel().setValue(outputTabs[propertyName].content)
}

document.getElementById("output-tabs").addEventListener('change', (event) => {
    const propertyName = event.currentTarget.value;
    switchTab(propertyName)
})