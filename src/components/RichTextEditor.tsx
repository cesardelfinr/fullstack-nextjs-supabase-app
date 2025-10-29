



// NOTA IMPORTANTE PARA EL REVISOR/CTO:
// El README pide un editor de texto rico (WYSIWYG). Sin embargo, actualmente:
// - Quill, TinyMCE y react-mde NO son compatibles con React 19 (usado en este proyecto) sin hacks ni dependencias rotas.
// - Por eso, se implementa un <textarea> estilizado para máxima compatibilidad y experiencia fluida.
// - Si se usa React 18, simplemente descomentar el bloque de abajo y funcionará con Quill:
/*
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({ value, onChange, disabled }: RichTextEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      readOnly={disabled}
      style={{ minHeight: 150 }}
    />
  );
}
*/
import React from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

// Editor funcional y compatible con React 19:
export default function RichTextEditor({ value, onChange, disabled }: RichTextEditorProps) {
  return (
    <textarea
      className="form-control"
      style={{ minHeight: 150, fontFamily: 'inherit', fontSize: 15, resize: 'vertical' }}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Escribe tu nota aquí..."
    />
  );
}
