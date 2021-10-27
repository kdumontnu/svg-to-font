const svgtofont = require('svgtofont');
const path = require('path');
const fs = require('fs');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom')

const SVG_DIR = 'svg'
const SVG_HEIGHT = 162

// First, edit files in place to force standard height
//   This fixes a problem exporting from figma where
//   the svg height is increased to fit inner content
//   that overlaps the boundary of the frame.

let svg_files = fs.readdirSync(path.resolve(process.cwd(), SVG_DIR))
svg_files.forEach((file) => {
    file_path = `${path.resolve(process.cwd(), SVG_DIR)}/${file}`
    data = fs.readFileSync(file_path).toString();

    // Parse the file
    xmlDoc = new DOMParser().parseFromString(data);
    
    // Write height attribute
    xmlDoc.getElementsByTagName('svg')[0].setAttribute('height', `${SVG_HEIGHT}`)
    viewBox = xmlDoc.getElementsByTagName('svg')[0].getAttribute('viewBox').split(" ")
    xmlDoc.getElementsByTagName('svg')[0].setAttribute('viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${SVG_HEIGHT}`)
    
    // Serialize data
    data_out = new XMLSerializer().serializeToString(xmlDoc)
    fs.writeFileSync(file_path, data_out);
})

// Convert the svgs to ttf

font_settings = {
  src: path.resolve(process.cwd(), SVG_DIR), // svg path
  dist: path.resolve(process.cwd(), 'fonts'), // output path
  fontName: 'Alty Yum', // font name
  css: true, // Create CSS files.
  startUnicode: 0x0020,
  svgicons2svgfont: {
    fontHeight: 2048,
  },
  svg2ttf: {
    version: "Version 0.1"
  }
}

svg_to_font = svgtofont(font_settings).then(() => {
  console.log('done!');
});

// Create base64 version of font 
data = fs.readFileSync(`${font_settings.dist}/${font_settings.fontName}.ttf`).toString('base64');
fs.writeFileSync(`${font_settings.dist}/_${font_settings.fontName}.ttf`, data);
