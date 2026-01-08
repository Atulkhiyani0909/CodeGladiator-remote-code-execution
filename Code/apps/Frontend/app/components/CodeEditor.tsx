import Editor from '@monaco-editor/react';
import React, { useState } from 'react';

const Props = {}


interface Props {
    language: string,
    theme: string,
    fontSize: number,
    functionEditorValue:any,
    submissionCode:string
}


export function CodeEditor(props: Props) {

    const { language, theme, fontSize , functionEditorValue,submissionCode} = props;

    

    return (
        <div >   
            <Editor
                height="80vh"
                width="100%"
                language={language}
                theme={theme}
                onChange={functionEditorValue}
                options={{
                    fontSize: fontSize,
                    minimap: { enabled: false },
                    padding: { top: 16 },
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                }}
                value={submissionCode}
                
                defaultValue={`// Welcome, Code Gladiator 🗡️
// Start writing your  code here`}      
            />
        </div>
    )
}

export default CodeEditor
