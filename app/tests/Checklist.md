# Browser Functionality Testing Checklist

## Check beaker-plugin-safe-app
- Run `yarn test-safe-app` to run our test page server.
  - Visit `localhost://p:3001` and run all tests.

## Basic Manual Testing

- Does a `safe:` site load without being logged in?
- Can you log in? 
- When you log in, do your saved bookmarks load?
- When you log in, do you have your previous history?
- Visit a `safe:` site. Is it now in your history?
- Save a new bookmark.
- Delete an old bookmark.
- Save the browser state to the network.
- Close and reopen the browser.
- Do your new bookmarks load?
- Is your updated history there?

## Further testing 

- `safe-logs:list` works?
- Toggle `safe-browsing`, can you now access the clearnet?
- Toggle `safe-browsing`, can you no longer access the clearnet?
