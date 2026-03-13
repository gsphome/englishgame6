import React, { useRef, useEffect } from 'react';

interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

/**
 * EditableInput - A contenteditable div that behaves like an input
 * Used to avoid iOS password autofill bar that appears on <input> elements
 */
export const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  onFocus,
  placeholder = '',
  disabled = false,
  className = '',
  style = {},
  autoFocus = false,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  // Track whether the div currently has focus to avoid cursor-reset on mobile
  const isFocused = useRef(false);

  // Update div content only when value changes externally AND div is not focused.
  // On mobile (iOS/Android), setting textContent while the element has focus
  // resets the cursor to position 0, causing the "cursor behind first letter" bug.
  useEffect(() => {
    if (divRef.current && !isFocused.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  }, [value]);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && divRef.current && !disabled) {
      setTimeout(() => divRef.current?.focus(), 100);
    }
  }, [autoFocus, disabled]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || '';
    onChange(newValue);
  };

  const handleFocus = () => {
    isFocused.current = true;
    onFocus?.();
  };

  const handleBlur = () => {
    isFocused.current = false;
    // Sync content on blur in case external value differs
    if (divRef.current && divRef.current.textContent !== value) {
      divRef.current.textContent = value;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent Enter key from creating new lines
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Prevent pasting formatted text
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={divRef}
      contentEditable={!disabled}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={className}
      style={style}
      data-placeholder={placeholder}
      data-empty={!value ? 'true' : 'false'}
      role="textbox"
      aria-label={placeholder}
      suppressContentEditableWarning
      // Prevent iOS form navigation bar
      data-form-type="other"
    />
  );
};
