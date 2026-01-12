import React, { useRef, useEffect } from 'react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && value && !isInitialized.current) {
      editorRef.current.innerHTML = value;
      isInitialized.current = true;
    }
  }, [value]);

  const execCommand = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
  };

  const applyBold = () => execCommand('bold');
  const applyItalic = () => execCommand('italic');
  const applyUnderline = () => execCommand('underline');
  const insertBulletList = () => execCommand('insertUnorderedList');
  const insertNumberedList = () => execCommand('insertOrderedList');
  const increaseIndent = () => execCommand('indent');
  const decreaseIndent = () => execCommand('outdent');

  const handleInput = (e) => {
    const html = e.currentTarget.innerHTML;
    onChange(html);
  };

  return (
    <div className="rich-text-editor-wrapper">
      <div className="rich-text-toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={applyBold}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={applyItalic}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={applyUnderline}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
        >
          <u>U</u>
        </button>
        <div className="toolbar-separator" />
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertBulletList}
          title="Bullet List"
          aria-label="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertNumberedList}
          title="Numbered List"
          aria-label="Numbered List"
        >
          1. List
        </button>
        <div className="toolbar-separator" />
        <button
          type="button"
          className="toolbar-btn"
          onClick={increaseIndent}
          title="Indent (Tab)"
          aria-label="Indent"
        >
          ⇢ Indent
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={decreaseIndent}
          title="Outdent (Shift+Tab)"
          aria-label="Outdent"
        >
          ⇠ Outdent
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-text-editor"
        contentEditable={true}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        role="textbox"
        aria-label={placeholder}
      />
    </div>
  );
}
