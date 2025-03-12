import pluginJs from "@eslint/js";

export default [
    pluginJs.configs.recommended,

    {
        rules: {
            "quotes": [2, "double"],
            "no-unused-vars": 0,
            "no-undef": 0
        }
    }
];
