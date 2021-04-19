#! /usr/bin/env node

const fs = require('fs')
const { exec } = require('child_process')
const addScript = require('npm-add-script')
const {prompt} = require('inquirer')
const fileContents = require('./repl-template.js')

const main = async () => {

    console.log('\nCreating REPL for Mongoose project...\n')
    let {db} = await prompt({
        type: "input",
        name: "db",
        message: "\n\nCONFIGURE DATABASE:\nDoes your project include a file or directory that exports a Mongoose.connection object?\nIf so, please enter the path to that file here:\nExample: ./db\n(Press Enter to skip and configure later.)"
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
                throw new Error("The path provided does not export a Mongoose.connection object.")
            }
        } catch (error) {
            console.error(error)
            console.error("\nThe DB connection could not be established. Please configure in repl.js.")
        }
    } else {
        console.log('\n\nPlease configure your DB connection later in repl.js.\n')
    }

    let {path} = await prompt({
        type: "input",
        name: "path",
        message: "\n\nCONFIGURE MODELS:\nPlease enter the path to your models directory:\nExample: ./models\n(Press Enter to skip.)"
    })

    if (path[0].match(/[A-Za-z]/)) {
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

            fileContents.splice(1,0, dbPath ? `require('${dbPath}')` : `null`)
        
            if (path) {
                fileContents.splice(3,0,models.map(key => `    ${key} : require('${path}/${modelFiles[key]}'),\n`).join(''))
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
