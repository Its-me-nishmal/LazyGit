const simpleGit = require('simple-git');

let isFirstPush = true;

function lazyGit(message = 'Initial commit', options = {}) {
  const { b: branch = 'main', r: remote = 'origin' } = options;
  const git = simpleGit();

  git.add('.')
    .commit(message)
    .push(remote, branch, (err) => {
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
    });
}

module.exports = lazyGit;
module.exports.lg = lazyGit;
