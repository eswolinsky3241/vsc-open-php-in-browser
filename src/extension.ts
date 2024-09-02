import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.openInBrowser",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const document = editor.document;
      const filePath = document.uri.fsPath;

      // Ensure the file is a PHP file
      if (path.extname(filePath) !== ".php") {
        vscode.window.showErrorMessage(
          "This extension only works with PHP files."
        );
        return;
      }

      let workspaceRoot = "";
      if (vscode.workspace.workspaceFolders) {
        workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
      }

      // Retrieve the hostname setting
      const config = vscode.workspace.getConfiguration("phpServer");
      let hostname = config.get<string>("hostname", "localhost");
      const protocol = config.get<string>("protocol", "http");
      const port = config.get<string>("port", "80");
      let documentRoot = config.get<string | null>("documentRoot", null);

      let webUrl = documentRoot ?? workspaceRoot;

      hostname = replaceEnvironmentVariables(hostname);

      // Open the PHP script in the browser
      let relativePath = filePath.replace(webUrl, "");
      if (relativePath.endsWith("/")) {
        relativePath = relativePath.slice(0, -1);
      }
      const url = `${protocol}://${hostname}:${port}${relativePath}`;

      vscode.env.openExternal(vscode.Uri.parse(url));
    }
  );

  context.subscriptions.push(disposable);
}

function replaceEnvironmentVariables(input: string): string {
  return input.replace(/\$\{([^}]+)\}/g, (_, envVarName) => {
    const envValue = process.env[envVarName];
    if (envValue) {
      return envValue;
    } else {
      vscode.window.showErrorMessage(
        `Environment variable ${envVarName} is not defined.`
      );
      return "";
    }
  });
}
