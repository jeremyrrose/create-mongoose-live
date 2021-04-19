#! /usr/bin/env node

const { exec } = require('child_process')
const addScript = require('npm-add-script')
const {prompt, checkbox} = require('inquirer')

const main = async () => {

    console.log('Creating REPL for Mongoose project...')
    await prompt({
        type: "input",
        name: "pathToModels",
        message: "Please enter the path to your models directory:"
    })
    await prompt({
        type: "confirm",
        name: "proceed",
        message: "This will create repl.js, add a small node module, and add a script to package.json.\nProceed?",
        default: false
    })
    console.log(prompt)
    console.log(prompt.answers)
    if (prompt.answers.proceed === true) {
        await exec("npm i mongoose-live")
        addScript({key: "repl", value: "node --experimental-repl-await repl.js"})
    }

}

main()
