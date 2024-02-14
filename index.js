const simpleGit = require('simple-git');

function lazyGit(message = 'Initial commit', options = {}) {
  const { b: branch = 'main', r: remote = 'origin' } = options;
  const git = simpleGit();

  git.add('.')
    .commit(message)
    .push(remote, branch, (err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Changes committed and pushed successfully!');
      }
    });
}

module.exports = lazyGit;
module.exports.lg = lazyGit; // Exporting the function with a shorter alias 'lg'
