const simpleGit = require('simple-git');

let isFirstPush = true;

function lazyGit(message = 'Initial commit', options = {}) {
  const { b: branch = 'main', r: remote = 'origin' } = options;
  const git = simpleGit();

  // Define ANSI escape codes for colors
  const colorReset = '\x1b[0m';
  const colorSuccess = '\x1b[32m'; // Green color for success
  const colorError = '\x1b[31m';   // Red color for error

  // Define a function to print animated dots
  const printDots = () => {
    let dots = '';
    const interval = setInterval(() => {
      dots += '.';
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`Committing and pushing${dots}`);
      if (dots.length === 3) {
        clearInterval(interval);
        console.log(''); // Add a new line after the animation is complete
      }
    }, 500);
  };

  // Define a callback function for the push operation
  const pushCallback = (err) => {
    if (err) {
      if (isFirstPush) {
        console.error(colorError, 'Please push manually using "git push" command for the first time.', colorReset);
        isFirstPush = false;
      } else {
        console.error(colorError, 'Error:', err, colorReset);
      }
    } else {
      console.log(colorSuccess, `Changes committed and pushed successfully to branch ${branch}!`, colorReset);
    }
  };

  // Add, commit, and push changes
  git.add('.')
    .commit(message)
    .then(() => {
      printDots(); // Print animated dots while committing and pushing
      return git.push(remote, branch, pushCallback);
    })
    .catch((err) => {
      console.error(colorError, 'Error committing or pushing changes:', err, colorReset);
    });

  // Set isFirstPush to false after the commit attempt
  if (isFirstPush) {
    isFirstPush = false;
  }
}

module.exports = lazyGit;
module.exports.lg = lazyGit;
