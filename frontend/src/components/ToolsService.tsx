import { useState, FormEvent } from "react";
import { client } from "@gradio/client";
import { useFileHandler } from "../hooks/useFileHandler";

export function ToolsService() {
  const { file, fileName, handleFileChange } = useFileHandler();
  const [action, setAction] = useState('embed');
  const [text, setText] = useState('sample text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const app = await client(`${window.location.origin}/apps/tools/`);
      const payload = [action, text, file ? new Blob([file], { type: file.type }) : null];
      const result = await app.predict("/predict", payload as any[]);

      if (result?.data && Array.isArray(result.data)) {
        const downloadPath = (result.data[0] as any).path;
        setDownloadUrl(`/apps/tools/file=${downloadPath}`);
      }
    } catch (e: any) {
      setError(`エラー: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-body">
      <form onSubmit={handleSubmit}>
        <input type="text" value={action} onChange={e => setAction(e.target.value)} placeholder="Action" />
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Text (任意)" />
        <div className="file-input-container">
          <label htmlFor="tools-file" className="btn">ファイルを選択</label>
          <input
            id="tools-file"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span className="file-name-display">{fileName || "ファイルが選択されていません"}</span>
        </div>
        <div className="actions">
          <button type="submit" disabled={loading} className="btn primary">
            {loading ? "処理中..." : "実行"}
          </button>
        </div>
      </form>
      {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
      {downloadUrl && <div className="download-action"><a href={downloadUrl} download className="btn">JSONレポートをダウンロード</a></div>}
    </div>
  );
}
