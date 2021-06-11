const { readFileSync, existsSync, readdirSync, mkdirSync, writeFile } = require('fs');

module.exports = function (source, dest) {
    const files = readdirSync(source).filter((name) => name.endsWith('.html'));

    if (!existsSync(dest)){
        mkdirSync(dest);
    }

    files.forEach(file => {
        const data = openFile(source, file)
        if (typeof data === 'string') {
            writeFile(`${dest}${file}`, data, () => {});
        }
    });
}

function openFile(source, file) {
    let fileContent = read(source + file);
    if (!fileContent) return;

    const matches = fileContent.match(/@:[\w\/]*/gm);
    if (!matches) return;

    matches.forEach(match => {
        const fileName = `${source}${match.replace('@:', '')}.html`;

        if (!existsSync(fileName)) {
            fileContent = fileContent.replace(match, '');
            return;
        }

        const include = read(fileName);

        fileContent = fileContent.replace(match, include);
    });

    return fileContent;
}

function read(path) {
    if (existsSync(path)) {
        return readFileSync(path, 'utf8');
    }
    else
    {
        return null;
    }
}