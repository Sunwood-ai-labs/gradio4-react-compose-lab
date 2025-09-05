import os
import gradio as gr


def mirror_image(img):
    return img[:, ::-1]


demo = gr.Interface(fn=mirror_image, inputs=gr.Image(), outputs=gr.Image(), title="Vision Demo")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
