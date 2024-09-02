# Open PHP in Browser

This extension adds an editor action and corresponding command to open PHP scripts in your web browser. The extension assumes you are already configuring and running a web server to host your PHP project, such as Apache or the built-in PHP development server.

By default, the extension will open `http://localhost` port 80 in your browser, using the currently open script filename relative to the workspace folder as the HTTP path. Users can modify the http protocol, hostname, port, or web document root. For example, if you are working on a remote server using the VSCode remote SSH extension, you can instead open your PHP script using TLS encryption and a custom DNS hostname by editing the following settings:

- phpServer.protocol: 'https'
- phpServer.hostname: 'www.example.com'
- phpServer.port: 443

The `hostname` setting may reference environment variables for dynamic server names:

```
${MY_SUBDOMAIN}.${MY_DOMAIN}.com