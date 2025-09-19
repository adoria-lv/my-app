'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import 'quill/dist/quill.snow.css'
import { createReadMoreMarker } from '@/lib/contentParser'
import { BookOpen } from 'lucide-react'

interface QuillEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
}

export interface QuillEditorRef {
  getContent: () => string
  setContent: (content: string) => void
  focus: () => void
}

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(({
  value = '',
  onChange,
  placeholder = 'Sāciet rakstīt...',
  readOnly = false,
  className = ''
}, ref) => {
  const quillRef = useRef<HTMLDivElement>(null)
  const quillInstance = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillInstance.current) {
        return quillInstance.current.root.innerHTML
      }
      return ''
    },
    setContent: (content: string) => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = content
      }
    },
    focus: () => {
      if (quillInstance.current) {
        quillInstance.current.focus()
      }
    }
  }))

  useEffect(() => {
    if (typeof window !== 'undefined' && quillRef.current && !quillInstance.current) {
      import('quill').then(({ default: Quill }) => {
        if (quillRef.current && !quillRef.current.classList.contains('ql-container')) {
          quillInstance.current = new Quill(quillRef.current, {
            theme: 'snow',
            readOnly,
            placeholder,
            modules: {
              toolbar: {
                container: '#editor-toolbar',
                handlers: {
                  image: function() {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = () => {
                      if (input.files && input.files[0]) {
                        const file = input.files[0];

                        // Check if it's a valid image format including webp
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                        if (!validTypes.includes(file.type)) {
                          alert('Lūdzu izvēlieties derīgu attēla formātu (JPEG, PNG, GIF, WebP, SVG)');
                          return;
                        }

                        // Here you could upload to S3 and get URL
                        // For now, create a local URL
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const range = (this as any).quill.getSelection();
                          (this as any).quill.insertEmbed(range.index, 'image', e.target?.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                  },
                  'readmore': function() {
                    const range = (this as any).quill.getSelection();
                    if (range) {
                      const marker = createReadMoreMarker();
                      (this as any).quill.insertText(range.index, marker);
                    }
                  }
                }
              }
            }
          })

          // Set initial content
          if (value) {
            quillInstance.current.root.innerHTML = value
          }

          // Listen for changes
          quillInstance.current.on('text-change', () => {
            if (onChange && quillInstance.current) {
              const content = quillInstance.current.root.innerHTML
              onChange(content)
            }
          })

          // Show/hide toolbar based on selection and focus
          quillInstance.current.on('selection-change', (range: any) => {
            const toolbar = document.getElementById('editor-toolbar')
            if (toolbar) {
              // Use setTimeout to prevent hiding toolbar when clicking on toolbar elements
              setTimeout(() => {
                if (range) {
                  // Editor has focus (either with or without text selection)
                  toolbar.style.display = 'flex'
                } else {
                  // Check if a toolbar element is being interacted with
                  const activeElement = document.activeElement
                  const isToolbarInteraction = activeElement && (
                    toolbar.contains(activeElement) ||
                    activeElement.closest('#editor-toolbar') ||
                    activeElement.classList.contains('ql-picker-options') ||
                    activeElement.closest('.ql-picker-options')
                  )

                  // Check if editor still has focus
                  const editorHasFocus = quillInstance.current.hasFocus()

                  if (!isToolbarInteraction && !editorHasFocus) {
                    // No toolbar interaction and editor lost focus, hide toolbar
                    toolbar.style.display = 'none'
                  }
                }
              }, 100)
            }
          })

          // Also show toolbar when editor gets focus (even if empty)
          quillInstance.current.on('focus', () => {
            const toolbar = document.getElementById('editor-toolbar')
            if (toolbar) {
              toolbar.style.display = 'flex'
            }
          })

          // Hide toolbar when editor loses focus (with delay to allow toolbar interactions)
          quillInstance.current.on('blur', () => {
            const toolbar = document.getElementById('editor-toolbar')
            if (toolbar) {
              setTimeout(() => {
                const activeElement = document.activeElement
                const isToolbarInteraction = activeElement && (
                  toolbar.contains(activeElement) ||
                  activeElement.closest('#editor-toolbar') ||
                  activeElement.classList.contains('ql-picker-options') ||
                  activeElement.closest('.ql-picker-options')
                )

                if (!isToolbarInteraction && !quillInstance.current?.hasFocus()) {
                  toolbar.style.display = 'none'
                }
              }, 200)
            }
          })
        }
      })
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null
      }
      if (quillRef.current) {
        quillRef.current.innerHTML = ''
      }
    }
  }, [])

  // Update content when value prop changes
  useEffect(() => {
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value
    }
  }, [value])

  // Update readOnly state
  useEffect(() => {
    if (quillInstance.current) {
      quillInstance.current.enable(!readOnly)
    }
  }, [readOnly])

  return (
    <div className={`${className}`}>
      <div id="editor-toolbar">
        <select className="ql-header" defaultValue="" data-tooltip="Virsraksta izmērs">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="">Normāls</option>
        </select>
        <button className="ql-bold" data-tooltip="Treknraksts (Ctrl+B)" />
        <button className="ql-italic" data-tooltip="Slīpraksts (Ctrl+I)" />
        <button className="ql-underline" data-tooltip="Pasvītrojums (Ctrl+U)" />
        <button className="ql-strike" data-tooltip="Pārsvītrojums" />
        <select className="ql-color" data-tooltip="Teksta krāsa">
          <option value="">Noklusējuma krāsa</option>
          <option value="#5A4F42">Tumši brūna</option>
          <option value="#706152">Vidēji brūna</option>
          <option value="#B7AB96">Gaiši brūna</option>
        </select>
        <select className="ql-background" data-tooltip="Fona krāsa" />
        <button className="ql-list" value="ordered" data-tooltip="Numurēts saraksts" />
        <button className="ql-list" value="bullet" data-tooltip="Punktu saraksts" />
        <button className="ql-indent" value="-1" data-tooltip="Samazināt atkāpi" />
        <button className="ql-indent" value="+1" data-tooltip="Palielināt atkāpi" />
        <select className="ql-align" data-tooltip="Teksta izlīdzināšana" />
        <button className="ql-link" data-tooltip="Pievienot saiti (Ctrl+K)" />
        <button className="ql-image" data-tooltip="Pievienot attēlu" />
        <button className="ql-readmore" data-tooltip="Pievienot 'Lasīt vairāk' pogu">
          <BookOpen size={16} strokeWidth={2} />
        </button>
        <button className="ql-blockquote" data-tooltip="Citāts" />
        <button className="ql-code-block" data-tooltip="Koda bloks" />
        <button className="ql-clean" data-tooltip="Noņemt formatējumu" />
      </div>
      <div
        ref={quillRef}
        style={{
          minHeight: '200px',
          backgroundColor: 'white'
        }}
      />
      <style jsx global>{`
        #editor-toolbar {
          background-color: #f9f9f7;
          border: 1px solid #B7AB96 !important;
          border-bottom: 1px solid #B7AB96 !important;
          border-radius: 6px 6px 0 0;
          position: fixed;
          top: 120px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 700px;
          z-index: 2000;
          display: none;
          align-items: center;
          padding: 10px 12px;
          gap: 4px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .ql-container {
          border: 1px solid #B7AB96 !important;
          border-top: none !important;
          border-radius: 0 0 6px 6px;
          font-family: inherit;
        }
        .ql-editor {
          min-height: 200px;
          font-size: 16px;
          line-height: 1.6;
          padding-bottom: 80px !important;
        }
        .ql-editor.ql-blank::before {
          color: #706152;
          opacity: 0.6;
        }
        .ql-snow .ql-picker-options {
          z-index: 3000;
        }
        .ql-snow .ql-tooltip {
          z-index: 3000 !important;
          background: white !important;
          border: 2px solid #B7AB96 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          transform: translateY(-100%) !important;
          margin-top: -10px !important;
        }
        .ql-snow .ql-tooltip input {
          border: 1px solid #B7AB96 !important;
          border-radius: 4px !important;
          padding: 8px !important;
          font-size: 14px !important;
        }
        .ql-snow .ql-tooltip .ql-action {
          background: #B7AB96 !important;
          color: white !important;
          border-radius: 4px !important;
          padding: 6px 12px !important;
          margin-left: 8px !important;
        }
        .ql-snow .ql-tooltip .ql-action:hover {
          background: #706152 !important;
        }
        .ql-snow .ql-stroke {
          stroke: #706152;
        }
        .ql-snow .ql-fill {
          fill: #706152;
        }
        .ql-snow .ql-picker-label:hover,
        .ql-snow .ql-picker-item:hover {
          color: #B7AB96;
        }
        .ql-snow.ql-toolbar button:hover .ql-stroke {
          stroke: #B7AB96;
        }
        .ql-snow.ql-toolbar button:hover .ql-fill {
          fill: #B7AB96;
        }
        .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: #B7AB96;
        }
        .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: #B7AB96;
        }

        /* Uniform button and icon sizes */
        .ql-snow .ql-toolbar button,
        .ql-snow .ql-toolbar .ql-picker {
          height: 32px;
          width: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .ql-snow .ql-toolbar select.ql-picker {
          width: auto;
          min-width: 60px;
          padding: 0 8px;
        }

        .ql-snow .ql-toolbar button:hover,
        .ql-snow .ql-toolbar .ql-picker:hover {
          background-color: #B7AB96;
          border-color: #B7AB96;
        }

        .ql-snow .ql-toolbar button svg,
        .ql-snow .ql-toolbar .ql-picker svg {
          width: 16px;
          height: 16px;
        }

        .ql-snow .ql-toolbar button.ql-active {
          background-color: #B7AB96;
          border-color: #B7AB96;
        }

        .ql-snow .ql-toolbar button.ql-readmore {
          width: auto;
          min-width: 80px;
          padding: 0 8px;
          font-size: 11px;
          font-weight: 600;
          height: 32px;
          position: relative;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        /* Custom instant tooltips for toolbar buttons */
.ql-toolbar button[data-tooltip],
.ql-toolbar .ql-picker[data-tooltip] {
  position: relative;
}

.ql-toolbar button[data-tooltip]:hover::after,
.ql-toolbar .ql-picker[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: #706152;
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 1px solid #5A4F42;
  /* Add these properties to fix the width issue */
  display: block;
  width: max-content;
  min-width: fit-content;
}

/* Tooltip arrow */
.ql-toolbar button[data-tooltip]:hover::before,
.ql-toolbar .ql-picker[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 2px;
  border: 4px solid transparent;
  border-bottom-color: #706152;
  z-index: 10001;
  pointer-events: none;
}

        .ql-editor ul,
        .ql-editor ol {
          list-style: none !important;
          padding-left: 1.2em !important;
        }

        .ql-editor li::before {
          display: none !important;
        }
          
        .ql-editor ol li::marker {
          display: none !important;
        }
      `}</style>
    </div>
  )
})

QuillEditor.displayName = 'QuillEditor'

export default QuillEditor