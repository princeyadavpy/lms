import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode, language, theme, onMount }) => {
    const handleEditorChange = (value, event) => {
        setCode(value);
    };

    return (
        <div className="h-full w-full relative flex flex-col min-h-0 min-w-0">
            <div className="flex-1 w-full h-full min-h-0 min-w-0">
                <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={onMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        padding: { top: 16 },
                        contextmenu: false,
                        automaticLayout: true
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
