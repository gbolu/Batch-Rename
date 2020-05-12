let fs = require('fs');
let path = require('path');
let readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let dirPath = './';

let readDir = (filePath, toReplace, replaceWith, callback) => {
    let filesToRename = [];
    fs.readdir(filePath, ((err, items) => {
        if (err) {
            console.log(err);
        }

        if (items) {
            items.forEach(item => {
                filesToRename.push(String(fs.realpathSync(path.join(__dirname, dirPath, item))));
            })
            filesToRename = filesToRename.filter(file => !file.includes('batch-rename.js' && !file.includes('-x-')));
            console.log(filesToRename);
            if (typeof (callback) == 'function') {
                callback(filesToRename, toReplace, replaceWith);
            }
        } else {
            console.log('No files in selected directory.');
        }

    }));
};

let renameFile = (filePathArray, filter, replacement) => {
    let filesRenamed = 0;
    filePathArray.forEach(filePath => {
        try {
            if (filePath.includes(filter)) {
                fs.renameSync(filePath, filePath.replace(filter, replacement));
                filesRenamed = filesRenamed + 1;
            }
        }

        catch (error) {
            console.log(error);
        }
    })
    console.log(`${filesRenamed} file(s) renamed.`);
    process.exit(0);
}

rl.question('EXACT word to replace: ', toReplace => {
    rl.question('Replace with: ', replaceWith => {
        readDir(dirPath, toReplace, replaceWith, renameFile);
    });
})