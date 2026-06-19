# Uninstall

To remove files created by aict init, run this from the project where you initialized the toolkit:

~~~bash
aict init --uninstall
~~~

The command reads .aict/install-manifest.json and removes only files listed there. Two safety gates apply to every entry before deletion: the path must resolve inside the current project directory (an entry with `../` or an absolute path is refused, never deleted), and the path must be one that `aict init` actually creates (a file aict does not manage is refused). So a tampered or stale manifest cannot make uninstall delete arbitrary files. Refused entries are listed in the output.

Preview first:

~~~bash
aict init --uninstall --dry-run
~~~

Package uninstall is handled by npm:

~~~bash
npm uninstall -g ai-collab-toolkit
~~~
