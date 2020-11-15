var plugins = [{
      plugin: require('/Users/alexkim/Documents/Development/tomas/website/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/alexkim/Documents/Development/tomas/website/node_modules/gatsby-plugin-firebase/gatsby-ssr'),
      options: {"plugins":[],"features":{"auth":true,"database":false,"firestore":true,"storage":false,"messaging":false,"functions":false,"performance":false},"credentials":{"apiKey":"<YOUR_FIREBASE_API_KEY>","authDomain":"<YOUR_FIREBASE_AUTH_DOMAIN>","databaseURL":"<YOUR_FIREBASE_DATABASE_URL>","projectId":"<YOUR_FIREBASE_PROJECT_ID>","storageBucket":"<YOUR_FIREBASE_STORAGE_BUCKET>","messagingSenderId":"<YOUR_FIREBASE_MESSAGING_SENDER_ID>","appId":"<YOUR_FIREBASE_APP_ID>"}},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
