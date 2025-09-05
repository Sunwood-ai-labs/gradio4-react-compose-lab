import { TextService } from "./components/TextService";
import { VisionService } from "./components/VisionService";
import { AudioService } from "./components/AudioService";
import { ToolsService } from "./components/ToolsService";

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
