# Create Mongoose Live

### A template generator for [Mongoose Live REPL](https://www.npmjs.com/package/mongoose-live)

## Usage
```bash
npx create-mongoose-live
```
Follow the prompts and edit `repl.js` as needed. After installation, run `npm run repl` to enter the [Mongoose Live REPL](https://www.npmjs.com/package/mongoose-live).

## Output

The script will install the `mongoose-live` Node module, create a `repl.js` file configured to operate in your Mongoose environment, and add the `repl` script to `package.json`.

## Prompts

### 1. Database Connection
If your project includes a file that exports a [`Mongoose.connection` object](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connection), you can provide a path to that file here.

>Alternately, you may add this path in `repl.js` after the installer is complete, or edit `repl.js` to build a `Mongoose.connection` object directly in that file.

### 2. Models
If your project includes a `models` directory that contains a file for each Mongoose model, you may provide a path to that directory here.

This will open a checkbox menu that includes _all_ files in that directory. Please select the models you wish to include.

Each file will be included in the REPL context under a key matching the _title case_ version of the file name. (Example: The model exported by `userProfile.js` will be available as `UserProfile` in the REPL context.)

>Alternately, you may configure models in `repl.js` after the installer is complete.

## Additional configuration

The new `repl.js` file can be configured to include other variables in the REPL context. Please consult the documentation for [Mongoose Live](https://www.npmjs.com/package/mongoose-live) to make configuration adjustments or to add additional variables to the REPL context.

## Known Issues
Invalid file paths can cause errors. If you are unsure of the path to your `mongoose.connection` object or to your models directory, simply press Enter, then adjust configuration in `repl.js`.
