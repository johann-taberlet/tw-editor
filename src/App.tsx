import { useState } from "react";
import Editor from "./Editor";

function App() {
  const [html, setHtml] = useState("");

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tailwind Editor</h1>

      <div className="space-y-4">
        <Editor onChange={setHtml} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Preview (Rendered HTML):
          </h2>
          <div
            className="p-4 border rounded bg-white min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Raw HTML:</h2>
          <pre className="p-4 border rounded bg-gray-50 overflow-x-auto">
            {html}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
