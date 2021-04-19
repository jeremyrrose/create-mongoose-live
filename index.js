#! /usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')
const addScript = require('npm-add-script')
const {prompt} = require('inquirer')

const main = async () => {

    console.log('Creating REPL for Mongoose project...')
    let {path} = await prompt({
        type: "input",
        name: "path",
        message: "Please enter the path to your models directory:\nExample: ./models\n"
    })

    const filenames = []
    try {
        fs.readdir(path, (err, files) => {
            if (err) {
                throw new Error(err)
            } else {
                filenames.concat(...files)
            }
        })
    } catch (error) {
        throw error
    }
    console.log(filenames)

    const {models} = prompt({
        type: "checkbox",
        name: "models",
        message: "Select models to include in REPL context:\(All available files selected by default.)",
        loop: false
    })


    const {proceed} = await prompt({
        type: "confirm",
        name: "proceed",
        message: "This will create repl.js, add a small node module, and add a script to package.json.\nProceed?",
        default: false
    })

    if (proceed === true) {
        await exec("npm i mongoose-live")
        addScript({key: "repl", value: "node --experimental-repl-await repl.js"})
    }

}

main()
