import os
import gradio as gr


def echo_audio(audio):
    return audio


demo = gr.Interface(fn=echo_audio, inputs=gr.Audio(sources=["microphone"], type="filepath"), outputs="audio", title="Audio Demo")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
