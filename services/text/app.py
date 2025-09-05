import os
import tempfile
from datetime import datetime
import gradio as gr


def flip_text(text: str):
    """Return reversed text and a downloadable .txt file path."""
    out = text[::-1]
    fd, path = tempfile.mkstemp(suffix=".txt", prefix="text_out_")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(out)
    return out, path


demo = gr.Interface(
    fn=flip_text,
    inputs=gr.Textbox(label="input"),
    outputs=[gr.Textbox(label="output"), gr.File(label="download")],
    title="Text Demo",
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
