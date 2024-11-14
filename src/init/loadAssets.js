import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

/**
 * 파일을 비동기 병렬로 읽는 함수
 *
 * loadGameAssets 에서 게임에셋을 불러올 때 쓰기 위한 헬퍼 함수로 사용
 * @param {string} filename 파일명
 * @returns {Promise}
 */
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/**
 * 로드한 게임에셋
 * @type {{base: {}, monsters: {}, towers: {}}}
 */
export let gameAssets = {};

/**
 * 전체 게임에셋을 불러오는 함수
 *
 * 게임 시작시 실행
 * @returns {{base: {}, monsters: {}, towers: {}}} JSON화된 모든 게임에셋
 */
export const loadGameAssets = async () => {
  const [base, monsters, towers] = await Promise.all([
    readFileAsync('base.json'),
    readFileAsync('monster.json'),
    readFileAsync('tower.json'),
  ]);

  gameAssets = { base, monsters, towers };
  logger.info(`GameAsset Initialized : ${Object.keys(gameAssets).length}`);
  return gameAssets;
};
