
import path from 'path';
import { DOWNLOAD_DIR, HTML_DIR } from 'src/constants';
import unzipper from 'unzipper';
import { createReadStream } from 'fs';
import { IState } from 'src/apiRouter';
import del from 'del';


export const extractFiles = (file: string, dest: string) => {
    const extractStream = unzipper.Extract({ path: dest });
    const readStream = createReadStream(file);
    readStream.pipe(extractStream);
    return new Promise((res, rej) => {
        readStream.on('close', async () => {
            await del(file);
            res(null);
        })
        extractStream.on('error', (err) => rej(err));
    })
}

export const handleExtraction = async (filename: string, key: string, state: IState) => {
    const file = path.resolve(DOWNLOAD_DIR, filename);
    const filenamewithoutext = path.basename(filename).split('.zip')[0];
    try {
        await extractFiles(file, path.resolve(HTML_DIR,filenamewithoutext ));
        state[key].status = 'deployed';
        state[key].folder = filenamewithoutext;
        return filenamewithoutext;
    } catch (e) {
        state[key].status = 'failed';
    }
}