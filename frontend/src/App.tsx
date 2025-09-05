import { useState, FormEvent, ChangeEvent } from "react";
import { client } from "@gradio/client";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card"; // これは使いませんが念のため残します

// ========== 汎用的なファイル処理フック ==========
function useFileHandler() {
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };
  return { file, handleFileChange };
}

// ========== 各サービスコンポーネント ==========

function TextService() {
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
      {downloadUrl && <a href={downloadUrl} download className="btn">結果をダウンロード</a>}
    </div>
  );
}

function VisionService() {
  const { file, handleFileChange } = useFileHandler();
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
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
      {resultImage && <a href={resultImage} download className="btn">画像をダウンロード</a>}
    </div>
  );
}

function AudioService() {
    const { file, handleFileChange } = useFileHandler();
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
            <input type="file" accept="audio/*" onChange={handleFileChange} />
             <div className="actions">
                <button type="submit" disabled={!file || loading} className="btn primary">
                    {loading ? "処理中..." : "音声をエコー"}
                </button>
            </div>
        </form>
        {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
        {resultAudio && <audio controls src={resultAudio} style={{ width: '100%' }} />}
        {resultAudio && <a href={resultAudio} download className="btn">音声をダウンロード</a>}
      </div>
    );
}

function ToolsService() {
    const { file, handleFileChange } = useFileHandler();
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
          <input type="file" onChange={handleFileChange} />
          <div className="actions">
            <button type="submit" disabled={loading} className="btn primary">
                {loading ? "処理中..." : "実行"}
            </button>
          </div>
        </form>
        {error && <p className="note" style={{ color: 'var(--brand2)' }}>{error}</p>}
        {downloadUrl && <a href={downloadUrl} download className="btn">JSONレポートをダウンロード</a>}
      </div>
    );
}

// ========== メインアプリケーション ==========
export default function App() {
  return (
    <>
      <header>
        <div className="header-inner">
          <div className="brand">
            <div className="logo kaisei-decol-bold"><span>G4</span></div>
            <div>
              <h1 className="kaisei-decol-bold">gradio4-react-compose-lab</h1>
              <div className="subtitle zen-kurenaido-regular">Reactフロント × 4つのGradioアプリ</div>
            </div>
          </div>
          <nav className="nav">
            <a href="https://github.com/Sunwood-ai-labs/gradio4-react-compose-lab" target="_blank" rel="noopener">GitHub</a>
          </nav>
        </div>
      </header>
      <main>
        <div className="grid">
          <section className="card col-6">
            <div className="card-head">
              <h2 className="card-title kaisei-decol-bold">Text Lab</h2>
            </div>
            <div className="card-sub">テキスト反転（POST: <code>/apps/text/api/predict</code>）</div>
            <TextService />
          </section>

          <section className="card col-6">
            <div className="card-head">
              <h2 className="card-title kaisei-decol-bold">Vision Lab</h2>
            </div>
            <div className="card-sub">画像反転（POST: <code>/apps/vision/api/predict</code>）</div>
            <VisionService />
          </section>

          <section className="card col-6">
            <div className="card-head">
              <h2 className="card-title kaisei-decol-bold">Audio Lab</h2>
            </div>
            <div className="card-sub">音声エコー（POST: <code>/apps/audio/api/predict</code>）</div>
            <AudioService />
          </section>

          <section className="card col-6">
            <div className="card-head">
              <h2 className="card-title kaisei-decol-bold">Tools Lab</h2>
            </div>
            <div className="card-sub">JSONレポート生成（POST: <code>/apps/tools/api/predict</code>）</div>
            <ToolsService />
          </section>
        </div>
      </main>
    </>
  );
}
