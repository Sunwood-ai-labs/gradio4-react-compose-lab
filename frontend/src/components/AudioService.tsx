import { useState, FormEvent } from "react";
import { client } from "@gradio/client";
import { useFileHandler } from "../hooks/useFileHandler";

export function AudioService() {
  const { file, fileName, handleFileChange } = useFileHandler();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultAudio, setResultAudio] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("音声ファイルを選択してください。");
      return;
    }
    setLoading(true);
    setError(null);
    setResultAudio(null);

    try {
      const app = await client(`${window.location.origin}/apps/audio/`);
      const result = await app.predict("/predict", [new Blob([file], { type: file.type })]);

      if (result?.data && Array.isArray(result.data)) {
        const audioPath = (result.data[0] as any).path;
        setResultAudio(`/apps/audio/file=${audioPath}`);
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
        <div className="file-input-container">
          <label htmlFor="audio-file" className="btn">ファイルを選択</label>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span className="file-name-display">{fileName || "音声ファイルが選択されていません"}</span>
        </div>
        <div className="actions">
          <button type="submit" disabled={!file || loading} className="btn primary">
            {loading ? "処理中..." : "音声をエコー"}
          </button>
        </div>
      </form>
      {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
      {resultAudio && <audio controls src={resultAudio} style={{ width: '100%' }} />}
      {resultAudio && <div className="download-action"><a href={resultAudio} download className="btn">音声をダウンロード</a></div>}
    </div>
  );
}
