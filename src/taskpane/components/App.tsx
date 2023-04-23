import * as React from "react";
import { DefaultButton, MessageBar, MessageBarType, ProgressIndicator, TextField } from "@fluentui/react";
import { Configuration, OpenAIApi } from "openai";
import Center from "./Center";
import Container from "./Container";
import Login from "./Login";
/* global Word, localStorage, navigator */

export default function App() {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generatedText, setGeneratedText] = React.useState<string>("");

  React.useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

  const openai = React.useMemo(() => {
    return new OpenAIApi(
      new Configuration({
        apiKey,
      })
    );
  }, [apiKey]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("apiKey", key);
    setError("");
  };

  const onClick = async () => {
    setGeneratedText("");
    setLoading(true);
    let completion;
    try {
      completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.7,
      });
    } catch (error) {
      setError(error.message);
      setApiKey("");
    }
    setLoading(false);
    setGeneratedText(completion.data.choices[0].text);
  };

  const onInsert = async () => {
    await Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.insertText(generatedText, "Start");
      await context.sync();
    });
  };

  const onCopy = async () => {
    navigator.clipboard.writeText(generatedText);
  };

  return (
    <Container>
      {apiKey ? (
        <>
          <TextField
            placeholder="Enter prompt here"
            value={prompt}
            rows={5}
            multiline={true}
            onChange={(_, newValue: string) => setPrompt(newValue || "")}
          ></TextField>
          <Center
            style={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <DefaultButton iconProps={{ iconName: "Robot" }} onClick={onClick}>
              Generate
            </DefaultButton>
          </Center>
          {loading && <ProgressIndicator label="Generating text..." />}
          {generatedText && (
            <div>
              <p
                style={{
                  textAlign: "justify",
                }}
              >
                {generatedText}
              </p>
              <Center>
                <DefaultButton iconProps={{ iconName: "Add" }} onClick={onInsert}>
                  Insert text
                </DefaultButton>
                <DefaultButton iconProps={{ iconName: "Copy" }} onClick={onCopy}>
                  Copy text
                </DefaultButton>
              </Center>
            </div>
          )}
        </>
      ) : (
        <Login onSave={saveApiKey} />
      )}
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
    </Container>
  );
}
