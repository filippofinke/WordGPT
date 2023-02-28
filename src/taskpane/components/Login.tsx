import * as React from "react";
import { DefaultButton, TextField } from "@fluentui/react";
import Center from "./Center";

interface LoginProps {
  onSave: (token: string) => void;
}
export default function Login({ onSave }: LoginProps) {
  const [token, setToken] = React.useState<string>("");

  return (
    <>
      <TextField
        style={{
          width: "100%",
        }}
        value={token}
        onChange={(_, newValue: string) => setToken(newValue || "")}
        placeholder={"Insert your OpenAI API key here"}
      />
      <Center
        style={{
          marginTop: "10px",
        }}
      >
        <DefaultButton
          iconProps={{
            iconName: "Save",
          }}
          onClick={() => onSave(token)}
        >
          Save API key
        </DefaultButton>
      </Center>
    </>
  );
}
