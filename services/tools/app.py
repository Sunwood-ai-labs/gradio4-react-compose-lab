import os
import gradio as gr


def respond(message, history):
    history = history + [(message, f"echo: {message}")]
    return "", history


with gr.Blocks(title="Tools Demo") as demo:
    chat = gr.Chatbot()
    msg = gr.Textbox(placeholder="Say something")
    btn = gr.Button("Send")
    btn.click(respond, [msg, chat], [msg, chat])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(server_name="0.0.0.0", server_port=port)
