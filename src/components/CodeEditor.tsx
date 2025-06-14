import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  theme: 'vs-light' | 'vs-dark';
}

export default function CodeEditor({ code, language, onChange, theme }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add collaborative cursor decorations
    const decorations = editor.createDecorationsCollection([
      {
        range: new monaco.Range(1, 1, 1, 1),
        options: {
          className: 'collaborative-cursor',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ]);

    // Simulate other users' cursors
    setTimeout(() => {
      const randomLine = Math.floor(Math.random() * 10) + 1;
      const randomColumn = Math.floor(Math.random() * 20) + 1;
      
      decorations.set([
        {
          range: new monaco.Range(randomLine, randomColumn, randomLine, randomColumn),
          options: {
            className: 'collaborative-cursor-other',
            after: {
              content: ' User2',
              inlineClassName: 'collaborative-cursor-label',
            },
          },
        },
      ]);
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          fontSize: 14,
          lineHeight: 21,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          minimap: { enabled: true },
          wordWrap: 'off',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            bracketPairsHorizontal: true,
            highlightActiveIndentation: true,
          },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          cursorBlinking: 'smooth',
          cursorStyle: 'line',
          renderLineHighlight: 'all',
          renderIndentGuides: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: true,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            verticalSliderSize: 6,
            horizontalSliderSize: 6,
          },
        }}
      />
    </div>
  );
}