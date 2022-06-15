const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");
const path = require("path");

const THUMB = 400;
const LARGE = 1000;
const FULL = 1500;

async function generateImages() {

  const defaultOpts = {
    widths: [THUMB,LARGE,FULL],
    formats: [null],
    filenameFormat: function (id, imgSrc, width, format, options) {
      let origFilename = imgSrc.split('/').pop();
      //strip off the file type, this could probably be one line of fancier JS
      let parts = origFilename.split('.');
      parts.pop();
      origFilename = parts.join('.');

      if(width === THUMB) return `thumb-${origFilename}.${format}`;
      else return `${origFilename}-w${width}.${format}`;
    }
  };
  const IMG_SRC = './src/images/';

  let files = await glob('./src/images/**/*.*');
  for(const src of files) {
    //console.log('doing src',src);

    let outputDir = './img/';
    let urlPath = '/img/';

    const dir = path.dirname(src.slice(IMG_SRC.length));
    outputDir = `${outputDir}${dir}`;
    urlPath = `${urlPath}${dir}`;
   
    const opts = {
      ...defaultOpts,
      outputDir,
      urlPath,
    };

    let md = await Image(src, opts);

    //let props = stats[].pop();

  };
};

module.exports = function (config) {

  config.addCollection('gallery', async collectionApi => {

    let files = await glob('./img/gallery/*.{jpg,jpeg,png}');
    //Now filter to 1000px width versions
    let images = files.filter(f => {
      return f.indexOf('-w1000') !== -1;
    });

    let collection = images.map(i => {
      return {
        w1000path: i,
        thumbpath: i.replace('-w1000', '').replace('./img/gallery/', './img/gallery/thumb-')
      }
    });

    return collection;

  });

  config.on('beforeBuild', async () => {
    console.log('beforeBuild');
    await generateImages();
    console.log('images done');
  });

  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('img');

  config.addWatchTarget("./src/styles/");

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: "src",
      output: "public",
    },
  };
};
