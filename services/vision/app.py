import os
import tempfile
import gradio as gr
import numpy as np
from PIL import Image


def mirror_image(img):  # 型ヒントを削除
    """Mirror the image horizontally and return a file path."""
    mirrored = img[:, ::-1]
    # Save to a temp file and return path
    fd, path = tempfile.mkstemp(suffix=".png", prefix="vision_out_")
    os.close(fd)
    Image.fromarray(mirrored).save(path)
    return path  # タプルではなく直接パスを返す


demo = gr.Interface(
    fn=mirror_image,
    inputs=gr.Image(label="img"),
    outputs=gr.Image(type="filepath", label="output"),
    title="Vision Demo",
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
