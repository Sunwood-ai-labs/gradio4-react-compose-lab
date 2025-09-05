import os
import gradio as gr


def flip_text(text: str) -> str:
    return text[::-1]


demo = gr.Interface(fn=flip_text, inputs="text", outputs="text", title="Text Demo")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
