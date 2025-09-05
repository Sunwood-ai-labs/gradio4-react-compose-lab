import { useState, FormEvent } from "react";
import { client } from "@gradio/client";

export function TextService() {
  const [text, setText] = useState("和モダンの世界観で短い詩を書いて");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultText(null);
    setDownloadUrl(null);

    try {
      const app = await client(`${window.location.origin}/apps/text/`);
      const result = await app.predict("/predict", [text]);

      if (result?.data && Array.isArray(result.data)) {
        setResultText(result.data[0] as string);
        const filePath = (result.data[1] as any).path;
        setDownloadUrl(`/apps/text/file=${filePath}`);
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
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="actions">
          <button type="submit" disabled={loading} className="btn primary">
            {loading ? "処理中..." : "テキストを反転"}
          </button>
        </div>
      </form>
      {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
      {resultText && (
        <div className="result-box">
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{resultText}</pre>
        </div>
      )}
      {downloadUrl && <div className="download-action"><a href={downloadUrl} download className="btn">結果をダウンロード</a></div>}
    </div>
  );
}
