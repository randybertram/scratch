/*


1. Copy the current Google Drive tree on your hard drive into another directory.
    This is your oneDrivePath; it will be copied to OneDrive when it is finished.
2. Use Google Takeout to get the Google Drive exported.
    Download the zip and unzip it to make a new tree - your takeoutPath.
    This "takeout tree" is similar to the tree copied in step 1, EXCEPT
    - The gdoc/gsheet/gslides files are converted to docx/xlsx/pptx. This is the point.
    - All timestamps are set to the time of export (not desired).
    - Deeper than 5(?) levels of directories are not exported.
3. Use this program to check for missing MS files in the takeoutPath. 
    Handle them and repeat step 2.
    For example, this will catch files with invalid characters in their names.
    Or files too deeply nested in subdirectories.
4. Run this program to copy the converted Google Workspace files from the takeoutPath into oneDrivePath.
    - It will adjust the date to match the original Google Workspace files.
    - It will delete the original Google Workspace files. 
    (Don't run this on your active Google Drive tree.)
5. Verify with a folder comparison tool like WinMerge.
6. Move the oneDrivePath into your active OneDrive directory.

> put this in github

*/

// TODO: Make these into command parameters
const oneDrivePath = 'C:\\Users\\Public\\Documents\\L-OneDrive';
const takeoutPath = 'C:\\Users\\Public\\Documents\\L-Takeout'
const reallyDoIt = true; // set false for testing

_numTransferred = _numMissing = 0;

const fs = require('fs');
const path = require('path');

function listFilesRecursive(dir) {
  fs.readdirSync(dir).forEach(file => {
    const googleFilePath = path.join(dir, file);
    if (fs.lstatSync(googleFilePath).isDirectory()) {
      listFilesRecursive(googleFilePath);
    } else {
      
      let msFilePath = takeoutPath + googleFilePath.slice(oneDrivePath.length);
      let gExt = path.extname(googleFilePath);

      let iExt = ['.gdoc', '.gsheet', '.gslides'].indexOf(gExt);
      // we only want to process the Google Workspace files, skip others
      if(iExt < 0)
        return;
      // So now we know googleFilePath is a .gdoc, .gsheet, or a .gslides
      // For the Google Workspace file, find the new Microsoft file in takeoutPath
      let msExt = ['.docx', '.xlsx', '.pptx'][iExt];
      msFilePath = takeoutPath + googleFilePath.slice(oneDrivePath.length, 0-gExt.length) + msExt;

      // Get the timestamp from the original .gdoc/etc. file.
      stats = fs.statSync(googleFilePath);

      if (fs.existsSync(msFilePath)) {
        // msOneFilepath is the new MS file, in the location that currently holds the Google file
        let msOneFilePath = googleFilePath.slice(0, 0-gExt.length) + msExt;
        console.log(`Copy ${msFilePath} to ${msOneFilePath}`);
        if(reallyDoIt) {
          // set the timestamp on the Microsoft file to match the Google Workspace file
          fs.utimesSync(msFilePath, stats.atime, stats.mtime);
          // Copy it over to where the Google Workspace file is
          fs.copyFileSync(msFilePath, msOneFilePath);
          // And delete the Google Workspace file
          fs.unlinkSync(googleFilePath);
        }
        console.log(`${++_numTransferred}: ${stats.mtime}: ${msFilePath}`);
      } else {
        console.log(`${++_numMissing}: Missing: ${msFilePath}`);
      }


    }
  });

}

const files = listFilesRecursive(oneDrivePath);

console.log(`${_numTransferred} documents transferred`);
console.log(`${_numMissing} documents missing`);