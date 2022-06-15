const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");
const path = require("path");
const fg = require('fast-glob');

const THUMB = 400;
const LARGE = 1000;
const FULL = 1500;

const outputFormat = "jpeg";
/*
const defaultOpts = {
    widths: [THUMB,LARGE,FULL, null],
    formats: [outputFormat],
    filenameFormat: function (id, imgSrc, width, format, options) {
      let origFilename = imgSrc.split('/').pop();
      //strip off the file type, this could probably be one line of fancier JS
      let parts = origFilename.split('.');
      parts.pop();
      origFilename = parts.join('.');

      if(width === THUMB) return `thumb-${origFilename}.${format}`;
      else return `${origFilename}-${width}.${format}`;
    }
  };
*/

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


async function generateGallery() {

  let files = await glob('./src/images/gallery/*.*');
  for(const src of files) {
   
    const opts = {
      widths: [THUMB,LARGE],
      formats: [null],
      outputDir: './public/img/gallery/',
      urlPath: '/img/gallery/',
    };

    let md = await Image(src, opts);
  };
};



async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [THUMB,LARGE,FULL, null],
    formats: ['webp', 'jpeg'],
    outputDir: "./public/img/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

/*
async function galleryShortcode(src, alt, sizes) {

  let files = await glob('./public/img/gallery/*.*');

  let metadata = await Image(files, {
    statsOnly: true,
  });

  let imageAttributes = {
    alt,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
 return Image.generateHTML(metadata, imageAttributes);

  //let props = stats[outputFormat].pop();

  //return `<img src="${metadata.url}" width="${metadata.width}" height="${metadata.height}" alt="${alt}">`;
}

*/


module.exports = function (eleventyConfig) {


  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
 // eleventyConfig.addNunjucksAsyncShortcode("galleryImage", galleryShortcode);

 eleventyConfig.addNunjucksShortcode("cssBackground", imageCssBackground);


  eleventyConfig.addPassthroughCopy('src/fonts');
  //eleventyConfig.addPassthroughCopy('img');

  eleventyConfig.addWatchTarget("./src/styles/");


  
  /*eleventyConfig.addNunjucksAsyncShortcode("galleryImage", async function(src, alt) {
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    let stats = await Image(src, {
      ...defaultOpts,
      formats: [outputFormat],
      urlPath: "/img/",
      outputDir: "./img/"
    });


    let props = stats[outputFormat].pop();

    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}">`;
  });
*/






 /*
  eleventyConfig.addCollection('gallery', async collectionApi => {

    let files = await glob('./public/img/gallery/*');
    //Now filter to 1000px width versions
    let images = files.filter(f => {
      return f.indexOf('-1000') !== -1;
    });

    let collection = images.map(i => {
      return {
        w1000path: i.replace('./public', ''),
        thumbpath: i.replace('./public', '').replace('-1000', '-400'),
      }
    });

    return collection;

  });
*/


  eleventyConfig.addCollection('gallery', async collectionApi => {

    let files = await glob('./public/img/gallery/*');
    //Now filter to 1000px width versions
    let images = files.filter(f => {
      return f.indexOf('-1000') !== -1;
    });

    let collection = images.map(i => {
      return {
        path: i,
        w1000path: i.replace('./public', ''),
        thumbpath: i.replace('./public', '').replace('-1000', '-400'),
      }
    });

    return collection;

  });

  
  eleventyConfig.on('beforeBuild', async () => {
    console.log('beforeBuild');
    await generateGallery();
    console.log('images done');
  });


  /*eleventyConfig.addNunjucksAsyncShortcode("myResponsiveImage", async function(src, alt) {
    
    if(alt === undefined) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on myResponsiveImage from: ${src}`);
    }

    let stats = await Image(src, {
      widths: [THUMB,LARGE,FULL, null],
      formats: ['webp', 'jpeg'],
      outputDir: "./public/img/",
    });
    let lowestSrc = stats[outputFormat][0];
    let sizes = "100vw"; // Make sure you customize this!

    // Iterate over formats and widths
    return `<picture>
      ${Object.values(stats).map(imageFormat => {
        return `  <source type="image/${imageFormat[0].format}" srcset="${imageFormat.map(entry => `${entry.url} ${entry.width}w`).join(", ")}" sizes="${sizes}">`;
      }).join("\n")}
        <img
          src="${lowestSrc.url}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}"
          alt="${alt}">
      </picture>`;
  });*/


  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: "src",
      output: "public",
    },
  };
};
