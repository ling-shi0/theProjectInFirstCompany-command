module.exports = {
    "presets": [
        ["@babel/env", { "modules": false, "targets": { "ie": 11 } }],
        "@vue/babel-preset-jsx"
    ],
    "plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties", "@babel/plugin-syntax-dynamic-import"]
}
