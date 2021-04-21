#! /usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')
const addScript = require('npm-add-script')
const { prompt } = require('inquirer')
const fileContents = require('./repl-template.js')
const style = require('ansi-styles')

const main = async () => {

    console.log(`\n\n${style.magenta.open}Creating REPL for Mongoose project${style.magenta.close}...\n`)
    let { db } = await prompt({
        type: "input",
        name: "db",
        message: `${style.green.open}CONFIGURE DATABASE:${style.green.close}\nDoes your project include a file or directory that exports a ${style.green.open}Mongoose.connection${style.green.close} object?\n${style.blue.open}If so, please enter the path to that file below:${style.blue.close}\nExample: ./db\n${style.dim.open}(Press Enter to skip and configure later.)${style.dim.close}\n`
    })

    let dbPath = null
    if (db) {
        const dbShort = db.slice(db.match(/[A-Za-z]/).index)
        try {
            const dbObject = await require(process.cwd() + '/' + dbShort)
            if (dbObject.constructor.name == "NativeConnection") {
                if (db[0].match(/[A-Za-z]/)) {
                    db = './' + db
                }
                dbPath = db
                await dbObject.close()
            } else {
                throw new Error(`${style.red.open}The path provided does not export a Mongoose.connection object.${style.red.close}`)
            }
        } catch (error) {
            console.error(error)
            console.error(`${style.red.open}The DB connection could not be established. Please configure in repl.js.${style.red.close}`)
        }
    } else {
        console.log('Please configure your DB connection later in repl.js.')
    }

    console.log('\n\n')

    let { path } = await prompt({
        type: "input",
        name: "path",
        message: `${style.green.open}CONFIGURE MODELS:${style.green.close}\nPlease enter the path to your models directory:\nExample: ./models\n${style.dim.open}(Press Enter to skip.)${style.dim.close}`
    })

    if (path && path[0].match(/[A-Za-z]/)) {
        path = './' + path
    }

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
                if (name[0]){
                    modelFiles[name[0].toUpperCase() + name.slice(1)] = file
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

        console.log('\n\n')

        var { models } = await prompt({
            type: "checkbox",
            name: "models",
            message: `${style.blue.open}Select models to include in REPL context and press ${style.dim.open}ENTER${style.dim.close} to continue:${style.blue.close}\n${style.dim.open}(All available files selected by default.)${style.dim.close}\n`,
            loop: false,
            choices: Object.keys(modelFiles).map(key => {
                return {name: `${key} : ${modelFiles[key]}`, value: key, checked: true}
            })
        })
    } else {
        console.log('\nNo models directory provided. Please edit repl.js to configure.\n')
    }

    console.log('\n\n')

    const { proceed } = await prompt({
        type: "confirm",
        name: "proceed",
        message: `${style.yellow.open}Warning:${style.yellow.close}\nThis will create ${style.green.open}repl.js${style.green.close}, add a small node module, and add a script to ${style.green.open}package.json${style.green.close}.\nProceed?`,
        default: false
    })

    if (proceed === true) {
        try {

            await exec("npm i mongoose-live")
            addScript({key: "repl", value: "node --experimental-repl-await repl.js", force: true})

            fileContents.splice(1,0, dbPath ? `await require('${dbPath}')` : `null // You MUST include a DB connection here to connect.`)
        
            if (path) {
                fileContents.splice(3,0,models.map(key => `    ${key} : require('${path}/${modelFiles[key]}'),\n`).join(''))
            }

            fs.writeFileSync('repl.js', fileContents.join(''))

            console.log('\n\nREPL files created!\nEdit repl.js as needed, then type "npm run repl" to start.\n')

        } catch (error) {
            console.error(error)
            process.exit()
        }
    }

}

main()
