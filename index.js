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
    if (matches) {
        matches.forEach(match => {

            const fileName = `${match.replace('@:', '')}.html`;
            if (!existsSync(`${source}${fileName}`)) {
                fileContent = fileContent.replace(match, '');
                return;
            }

            const content = openFile(source, fileName);
            fileContent = fileContent.replace(match, content);
        });
    }

    const _extends = fileContent.match(/@extend:[\w\/]*/gm);
    if (_extends) {
        _extends.forEach(match => {

            const fileName = `${match.replace('@extend:', '')}.html`;
            if (!existsSync(`${source}${fileName}`)) {
                fileContent = fileContent.replace(match, '');
                return;
            }

            const extendContent = openFile(source, fileName);
            fileContent = extendContent.replace('@show', fileContent.replace(match, ''));
        });
    }

    return fileContent.toString();
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