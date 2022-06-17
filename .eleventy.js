const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");
const htmlmin = require("html-minifier");

const THUMB = 400;
const LARGE = 1000;
const FULL = 1500;

function generateCSSImages(src, widths){
  let options = {
    widths: widths,
    formats: ['jpeg',],
    outputDir: "./public/img/",
  };
  // genrate images, ! dont wait
  Image(src, options);
  // get metadata even the image are not fully generated
  return Image.statsSync(src, options);
}

function imageCssBackground (src, selector, widths){
  const metadata = generateCSSImages(src, widths);
  let markup = [`${selector} { background-image: url(${metadata.jpeg[0].url});} `];
  // i use always jpeg for backgrounds
  metadata.jpeg.slice(1).forEach((image, idx) => {
    markup.push(`@media (min-width: ${metadata.jpeg[idx].width}px) { ${selector} {background-image: url(${image.url});}}`);
  });
  return markup.join("");
}


function generateGallery(src, alt) {
  let options = {
    widths: [THUMB,LARGE],
    formats: [null],
    outputDir: './public/img/gallery/',
    urlPath: '/img/gallery/',
  };
  // genrate images, ! dont wait
  Image(src, options);
  // get metadata even the image are not fully generated
  return Image.statsSync(src, options);
};

async function galleryShortcode(src, alt, size) {
  const metadata = generateGallery(src, alt);
  let sizeSrc = metadata["jpeg"][0];
  if(size == "full") {
     sizeSrc = metadata["jpeg"][1];
  }
  return `<img src="${sizeSrc.url}" width="${sizeSrc.width}" height="${sizeSrc.height}" alt="${alt}" loading="lazy">`;
}


async function imageShortcode(src, alt, sizes, loading="lazy") {
  let metadata = await Image(src, {
    widths: [THUMB,LARGE,FULL, null],
    formats: ['webp', 'jpeg'],
    outputDir: "./public/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: "async",
  };



  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}


module.exports = function (eleventyConfig) {


  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("galleryImage", galleryShortcode);
  eleventyConfig.addNunjucksShortcode("cssBackground", imageCssBackground);

  eleventyConfig.addPassthroughCopy('src/fonts');

  eleventyConfig.addWatchTarget("./src/styles/");

  eleventyConfig.addCollection('gallery', async collectionApi => {
    let files = await glob('./src/images/gallery/*');
    let collection = files.map(i => {
      return {
        thumbpath: i,
      }
    });
    return collection;
  });

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      });
      return minified;
    }

    return content;
  });


  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: "src",
      output: "public",
    },
  };
};
