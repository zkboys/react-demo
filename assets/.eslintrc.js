module.exports =
{
    "extends": ["eslint-config-airbnb"],
    "env": {
        "browser": true,
        "node": true,
        "mocha": true,
        "jest": true,
        "es6": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        }
    },
    "plugins": [
        "markdown",
        "react",
        "babel"
    ],
    "rules": {
        "global-require": 0,
        "func-names": 0,
        "prefer-const": 0,
        "arrow-body-style": 0,
        "react/sort-comp": 0,
        "react/prop-types": 0,
        "react/jsx-closing-bracket-location": 0,
        "react/jsx-first-prop-new-line": 0,
        "import/no-unresolved": 0,
        "import/prefer-default-export": 0,
        "no-param-reassign": 0,
        "no-return-assign": 0,
        "max-len": 0,
        "consistent-return": 0,
        // 和ide的format冲突，这里改一下。
        "indent": [2, 4],
        "object-curly-spacing": 0, // { 内侧空格 }
        "no-underscore-dangle": 0, // 下划线命名，数据库返回的 _id 总是报错
        "react/jsx-indent": [2, 4],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-space-before-closing": 0, // <FIcon /> 空格
        // allow debugger during development
        "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
        "jsx-a11y/label-has-for": 0
    }
}


