## Deployment

To deploy the app to github pages simply run `npm run deploy`. This will update the `dist` folder with the latest assets, and push it to the `gh-pages` branch. Github will then deploy the site at `https://seanblair.github.io/sudoku/`.

### Issue with vscode debugger confused when using es6 imports:

- It might be related to typescript setup? When I used imports in the default project setup with svelte-kit that included typescript and tests, directly using .js files as the imported modules resulted in the same behaviour. Renaming them to .ts resulted in the debugger stopping on the expected line...???
Also, ran the tests via the Vitest plugin.
Also, commented out the contents of the launch.json file...

- Js Tooling is hard to configure!!

When running tests via the Vitest vscode extension in Sudoku, a process is started at a port on localhost. 
When I put a breakpoint on the file i am looking for, it puts it on the wrong line, but
another file is displayed that doesn't actually exist on my file system, this one correctly
puts the breakpoints on the desired line.

Looks like the vitest vscode extension is kind of broken. Could simply debug unit tests via a debug current
file config as indicated in https://vitest.dev/guide/debugging.html. Would need to figure out how to 
run individual test cases without simply commenting out the rest of them. Does not seem to be immediately working that well though. Have to debug the tests via the vscode ui, step into the call to find the weird file that is not on my filesystem, very confusing!!!

Or could port the whole project to a the latest svelte kit setup with typscript as it appears to work as expected.


