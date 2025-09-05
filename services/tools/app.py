import os
import json
import tempfile
from typing import Optional, Tuple
import gradio as gr


def tools(action: Optional[str], text: Optional[str], file: Optional[str]) -> Tuple[str]:
    """Simple utility endpoint:
    - If file provided, just return it (acts like passthrough convert)
    - Else, write a small JSON report to a temp file and return its path
    """
    if file:
        return (file,)
    payload = {
        "action": action or "none",
        "text": text or "",
    }
    fd, path = tempfile.mkstemp(suffix=".json", prefix="tools_out_")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return (path,)


demo = gr.Interface(
    fn=tools,
    inputs=[
        gr.Textbox(label="action"),
        gr.Textbox(label="text"),
        gr.File(label="file", type="filepath"),
    ],
    outputs=gr.File(label="result"),
    title="Tools Demo",
    description="ファイルがあればパススルー、無ければJSONレポートを生成して返します。",
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
