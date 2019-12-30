const hrstart = process.hrtime();
const mjml2html = require('mjml');
const fs = require('fs');
const fileIn = 'index'; // Put the name of your MJML template here (without the .mjml extension)
// let mjml = (fs.readFileSync(`./src/${fileIn}.mjml`)).toString();
const path = require('path')
const mjml = path.join(__dirname, './src/index.mjml');

const inject = (template, vars = {}) =>
  new Promise((resolve, reject) => {
    fs.readFile(
      template,
      { encoding: 'utf8' },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        let finalTemplate = data;

        Object.keys(vars).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          finalTemplate = finalTemplate.replace(regex, vars[key]);
        });

        return resolve(finalTemplate);
      }
    );
  });

function compileTemplate(template) {
 
  let output = mjml2html(template, { minify: true });
  fs.writeFile(`./build/${fileIn}.html`, output.html, (err) => {
      if (err) {
          throw err;
      }
  })
  const hrend = process.hrtime(hrstart);
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

};

inject(mjml, {
  message: 'Goodbye Bob',
})
.then(finalTemplate => {
  // finalTemplate is an HTML string containing the template with all occurrences
  // of `{name}` replaced with "bob", and all occurrences of `{profileURL}`
  // replaced with "https://app.com/bob".
  compileTemplate(finalTemplate);
});