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
    # プレビューとダウンロード用に同じパスを2つ返す
    return path, path


demo = gr.Interface(
    fn=mirror_image,
    inputs=gr.Image(label="img"),
    # outputsをリストにし、gr.Imageとgr.Fileの両方を出力する
    outputs=[gr.Image(type="filepath", label="output"), gr.File(label="download")],
    title="Vision Demo",
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
