module.exports = [
`// Template for Mongoose Live REPL.
// Generated by npx create-mongoose-live.
// For full documentation, visit: https://www.npmjs.com/package/mongoose-live

// Imports the Mongoose Live REPL package
const live = require('mongoose-live')

const main = async () => {
    const db = `,
`
    // Import or establish a mongoose.connection object here.
    // Many projects export this object from a file; this may be imported here.
    // For more information, see: 
    // https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connection

    const models = {
`,
`
        // Import any models you wish to have available in the REPL here.
        // Keys in this object will be available as variables in the REPL.
        // Example:
        // User : require('./models/user.js')
    }

    const context = {
        // Add additional variables/functions/etc. here.
        // Each key will be available in the REPL context.
    }

    live(db, models, context)
}

main()
// type "npm run repl" to start
`
]