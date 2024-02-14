const simpleGit = require('simple-git');

let isFirstPush = true;

function lazyGit(message = 'Initial commit', options = {}) {
  const { b: branch = 'main', r: remote = 'origin' } = options;
  const git = simpleGit();

  // Define ANSI escape codes for colors
  const colorReset = '\x1b[0m';
  const colorSuccess = '\x1b[32m'; // Green color for success
  const colorError = '\x1b[31m';   // Red color for error

  // Define an ASCII art for Git logo
  const gitLogo = `
  _______   _______   _______   _______ 
 / ___   ) (  ____ ) (  ____ ) (  ____ )
| /   ) | | (    ) | | (    ) | | (    )|
| |   | | | (____) | | (____) | | (____)|
| |   | | |  _____) | |     __) |  _____)
| |   ) | | (        | (| (     | (      
| (___) | | )        | (| (____/| )      
(_______) |/         (_______/ |/       

`;

  // Print the Git logo
  console.log(gitLogo);

  // Define a function to print a progress bar animation
  const printProgressBar = () => {
    const progressBarWidth = 50;
    let progress = 0;
    const interval = setInterval(() => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      const progressBar = '[' + '='.repeat(progress) + '>'.repeat(1) + ' '.repeat(progressBarWidth - progress - 1) + ']';
      process.stdout.write(`Pushing changes: ${progressBar} ${progress}%`);
      progress++;
      if (progress > progressBarWidth) {
        clearInterval(interval);
        console.log('\n'); // Add a new line after the progress bar animation is complete
      }
    }, 50);
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
      printProgressBar(); // Print progress bar animation while pushing
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
