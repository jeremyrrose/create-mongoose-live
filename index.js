#! /usr/bin/env node

const main = async () => {
    
    console.log('adklajsdklsjgioefjlkafas')

    const { exec } = require('child_process')
    const addScript = require('npm-add-script')

    await exec("npm i mongoose-live")
    addScript({key: "repl", value: "node --experimental-repl-await repl.js"})

}

main()
