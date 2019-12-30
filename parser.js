const hrstart = process.hrtime();

const hb = require('handlebars');
const mjml2html = require('mjml');
const fs = require('fs');

const fileIn = 'index'; // Put the name of your MJML template here (without the .mjml extension)
// let mjml = (fs.readFileSync(`./src/${fileIn}.mjml`)).toString();
const path = require('path')
const mjml = path.join(__dirname, './src/index.mjml');


let data = {
    message: 'Hello Bob',
}

const inject = (template, vars = {}) =>
  new Promise((resolve, reject) => {
    fs.readFile(
      template,
      { encoding: 'utf8' },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        // let finalTemplate = data;

        // Object.keys(vars).forEach((key) => {
        //   const regex = new RegExp(`{{${key}}}`, 'g');
        //   finalTemplate = finalTemplate.replace(regex, vars[key]);
        // });

        let t = hb.compile(data);
        let finalTemplate = t(vars);

        return resolve(finalTemplate);
      }
    );
  });


function compileTemplate(template, /* data */) {
    // let t = hb.compile(template);
    // template = t(data);
    let output = mjml2html(template, { minify: true });
    fs.writeFile(`./build/${fileIn}.html`, output.html, (err) => {
        if (err) {
            throw err;
        }
    })
    const hrend = process.hrtime(hrstart);
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
};

// compileTemplate(mjml, data)

inject(mjml, data).then(finalTemplate => {
    compileTemplate(finalTemplate);
});