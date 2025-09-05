import os
import gradio as gr


def echo_audio(audio):
    # Pass-through, keeping filepath so Gradio serves a downloadable file
    return audio

# ↓ inputsの gr.Audio(...) から source="upload" の部分を削除します
demo = gr.Interface(
    fn=echo_audio,
    inputs=gr.Audio(type="filepath"),
    outputs=gr.Audio(type="filepath"),
    title="Audio Upload Demo",
    description="音声ファイルをアップロードすると、その音声が再生・ダウンロードできます。",
)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
