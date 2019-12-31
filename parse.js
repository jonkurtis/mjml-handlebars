const hrstart = process.hrtime();
const mjml2html = require('mjml');
const fs = require('fs');
const fileIn = 'index'; // Put the name of your MJML template here (without the .mjml extension)
// let mjml = (fs.readFileSync(`./src/${fileIn}.mjml`)).toString();
const path = require('path')
const mjml = path.join(__dirname, './src/index.mjml');

// Read the Index.mjml file using the fs module, then compile the mjml to html and return the html as a promise.

const compileTemplate = (templatePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(
      templatePath,
      { encoding: 'utf8' },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        let compiledTemplate = mjml2html(data, { minify: true });
        let output = compiledTemplate.html;
        return resolve(output);
      }
    );
  });

// Inject the data into the HTML output from compileTemplate function using a regex replace for each key in the data object.

function inject(template, vars = {}) {
 return new Promise((resolve, reject) => {
   let finalTemplate;
    Object.keys(vars).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalTemplate = template.replace(regex, vars[key]);
    });
    return resolve(finalTemplate);
  });
};

// Write the HTML output from the inject function to the build folder and call process.hrtime to see how long the execution time was.

function build(finalTemplate) {
    fs.writeFile(`./build/${fileIn}.html`, finalTemplate, (err) => {
      if (err) {
          throw(err);
      }
  });
  const hrend = process.hrtime(hrstart);
  console.info('Execution time: %ds %dms', hrend[0], hrend[1] / 1000000);
}

compileTemplate(mjml)
.then(output => (
  inject(output, {message: 'Hello Jane'})
)).then(finalTemplate => {
   build(finalTemplate);
});