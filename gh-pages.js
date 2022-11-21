var ghpages = require('gh-pages');

ghpages.publish(
    'dist', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/SeanBlair/sudoku.git', // Update to point to your repository  
        user: {
            name: 'Sean Blair', // update to use your name
            email: 'seanblairx@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)