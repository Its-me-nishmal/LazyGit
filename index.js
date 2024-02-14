const simpleGit = require('simple-git');

let isFirstPush = true;

function lazyGit(message = 'Initial commit', options = {}) {
  const { b: branch = 'main', r: remote = 'origin' } = options;
  const git = simpleGit();

  // Define a callback function for the push operation
  const pushCallback = (err) => {
    if (err) {
      if (isFirstPush) {
        console.error('Please push manually using "git push" command for the first time.');
        isFirstPush = false;
      } else {
        console.error('Error:', err);
      }
    } else {
      console.log('Changes committed and pushed successfully!');
    }
  };

  // Add and commit changes
  git.add('.')
    .commit(message)
    .then(() => {
      // Push changes only if it's not the first push attempt
      if (!isFirstPush) {
        git.push(remote, branch, pushCallback);
      }
    })
    .catch((err) => {
      console.error('Error committing changes:', err);
    });

  // Set isFirstPush to false after the commit attempt
  if (isFirstPush) {
    isFirstPush = false;
  }
}

module.exports = lazyGit;
module.exports.lg = lazyGit;
