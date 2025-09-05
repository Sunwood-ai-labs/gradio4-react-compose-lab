import { useState, FormEvent } from "react";
import { client } from "@gradio/client";
import { useFileHandler } from "../hooks/useFileHandler";

export function VisionService() {
  const { file, fileName, handleFileChange } = useFileHandler();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("画像ファイルを選択してください。");
      return;
    }
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const app = await client(`${window.location.origin}/apps/vision/`);
      const result = await app.predict("/predict", [new Blob([file], { type: file.type })]);

      if (result?.data && Array.isArray(result.data)) {
        const imagePath = (result.data[0] as any).path;
        setResultImage(`/apps/vision/file=${imagePath}`);
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
          <label htmlFor="vision-file" className="btn">ファイルを選択</label>
          <input
            id="vision-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span className="file-name-display">{fileName || "画像ファイルが選択されていません"}</span>
        </div>
        <div className="actions">
          <button type="submit" disabled={!file || loading} className="btn primary">
            {loading ? "処理中..." : "画像を反転"}
          </button>
        </div>
      </form>
       {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
      {resultImage && (
        <div className="result-box" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={resultImage} alt="Processed result" style={{ width: '100%', display: 'block' }} />
        </div>
      )}
      {resultImage && <div className="download-action"><a href={resultImage} download className="btn">画像をダウンロード</a></div>}
    </div>
  );
}
