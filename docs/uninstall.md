# Uninstall

To remove files created by aict init, run this from the project where you initialized the toolkit:

~~~bash
aict init --uninstall
~~~

The command reads .aict/install-manifest.json and removes only files listed there. It will not remove user-created files that are not in the manifest.

Preview first:

~~~bash
aict init --uninstall --dry-run
~~~

Package uninstall is handled by npm:

~~~bash
npm uninstall -g ai-collab-toolkit
~~~
