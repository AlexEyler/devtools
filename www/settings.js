import * as monaco from 'monaco-editor';

export const setDarkMode = (enableDarkMode) => {
    monaco.editor.setTheme(enableDarkMode ? 'dark' : 'light');
    if (enableDarkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

export const defineThemes = () => {
    monaco.editor.defineTheme('dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            {
                token: "identifier",
                foreground: "9CDCFE"
            },
            {
                token: "identifier.function",
                foreground: "DCDCAA"
            },
            {
                token: "type",
                foreground: "1AAFB0"
            }
        ],
        colors: {}
    });

    monaco.editor.defineTheme('light', {
        base: 'vs',
        inherit: true,
        rules: [
            {
                token: "identifier",
                foreground: "9CDCFE"
            },
            {
                token: "identifier.function",
                foreground: "DCDCAA"
            },
            {
                token: "type",
                foreground: "1AAFB0"
            }
        ],
        colors: {}
    });
};

export const registerSettingCallbacks = (inputEditor, outputEditor) => {
    // Global
    document.getElementById('dark-mode').addEventListener('change', (event) => {
        setDarkMode(event.currentTarget.checked)
    });

    // Input
    document.getElementById('input-word-wrap').addEventListener('change', (event) => {
        inputEditor.updateOptions({
            wordWrap: event.target.checked ? 'on' : 'off'
        })
    })

    document.getElementById('input-line-numbers').addEventListener('change', (event) => {
        inputEditor.updateOptions({
            lineNumbers: event.target.checked ? 'on' : 'off'
        })
    })

    // Output
    document.getElementById('output-line-numbers').addEventListener('change', (event) => {
        outputEditor.updateOptions({
            lineNumbers: event.target.checked ? 'on' : 'off'
        })
    })
}