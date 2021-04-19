#! /usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')
const addScript = require('npm-add-script')
const {prompt} = require('inquirer')
const replTemplate = require('./repl-template')

const main = async () => {

    console.log('Creating REPL for Mongoose project...')
    let {path} = await prompt({
        type: "input",
        name: "path",
        message: "\n\nPlease enter the path to your models directory:\nExample: ./models\n(Press Enter to skip.)"
    })

    const modelFiles = {}
    if (path) {
        try {
            const fileList = fs.readdirSync(path, (err, files) => {
                if (err) {
                    throw new Error(err)
                } else {
                    return files
                }
            })

            fileList.forEach(file => {
                const name = file.split('.')[0]
                modelFiles[name[0].toUpperCase() + name.slice(1)] = file
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

        var {models} = await prompt({
            type: "checkbox",
            name: "models",
            message: "\n\nSelect models to include in REPL context:\n(All available files selected by default.)\n",
            loop: false,
            choices: Object.keys(modelFiles).map(key => {
                return {name: `${key} : ${modelFiles[key]}`, value: key, checked: true}
            })
        })
    } else {
        console.log('\nNo models directory provided. Please edit repl.js to configure.\n')
    }

    const {proceed} = await prompt({
        type: "confirm",
        name: "proceed",
        message: "\n\nWarning:\nThis will create repl.js, add a small node module, and add a script to package.json.\nProceed?",
        default: false
    })

    if (proceed === true) {
        try {

            await exec("npm i mongoose-live")
            addScript({key: "repl", value: "node --experimental-repl-await repl.js", force: true})

            const fileContents = require('repl-template.js')
        
            if (path) {
                fileContents.splice(1,0,models.map(key => `    ${key} : require('${path}/${modelFiles[key]}'),\n`).join(''))
            }

            fs.writeFileSync('repl.js', fileContents.join(''))

            console.log('\n\nREPL files created!\nEdit repl.js in your root directory to add a DB connection, then type "npm run repl" to start.\n')

        } catch (error) {
            console.error(error)
            process.exit()
        }
    }

}

main()
